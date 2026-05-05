<script lang="ts">
        import Panel from "$lib/components/visual/Panel.svelte";
        import { VideoIcon } from "lucide-svelte";
        import type { ISettings } from "./index.svelte";
        import Dropdown from "$lib/components/functional/Dropdown.svelte";
        import { vertdLoaded } from "$lib/store/index.svelte";
        import { m } from "$lib/paraglide/messages";
        import { VertdInstance, type VertdInner } from "./vertdSettings.svelte";

        let vertdCommit = $state<string | null>(null);
        let abortController: AbortController | null = null;

        const { settings = $bindable() }: { settings: ISettings } = $props();

        // Speed options mapped to range value (0–5)
        const speedKeys = ["verySlow", "slower", "slow", "medium", "fast", "ultraFast"] as const;
        const speedLabels = ["Very Slow", "Slower", "Slow", "Medium", "Fast", "Ultra Fast"];

        let speedIndex = $derived(
                Math.max(0, speedKeys.indexOf(settings.vertdSpeed as typeof speedKeys[number]))
        );

        function setSpeedFromIndex(idx: number) {
                settings.vertdSpeed = speedKeys[idx];
        }

        $effect(() => {
                if (abortController) abortController.abort();
                abortController = new AbortController();
                const { signal } = abortController;

                vertdCommit = "loading";
                VertdInstance.instance
                        .url()
                        .then((u) => fetch(`${u}/api/version`, { signal }))
                        .then((res) => {
                                if (!res.ok) throw new Error("bad response");
                                vertdLoaded.set(false);
                                return res.json();
                        })
                        .then((data) => {
                                vertdCommit = data.data;
                                vertdLoaded.set(true);
                        })
                        .catch((err) => {
                                if (err.name !== "AbortError") {
                                        vertdCommit = null;
                                        vertdLoaded.set(false);
                                }
                        });

                return () => {
                        if (abortController) abortController.abort();
                };
        });

        const instanceOptions = [
                m["settings.vertd.auto_instance"](),
                m["settings.vertd.eu_instance"](),
                m["settings.vertd.us_instance"](),
                m["settings.vertd.custom_instance"](),
        ];

        function getSelectedInstance() {
                switch (VertdInstance.instance.innerData().type) {
                        case "auto": return m["settings.vertd.auto_instance"]();
                        case "eu":   return m["settings.vertd.eu_instance"]();
                        case "us":   return m["settings.vertd.us_instance"]();
                        case "custom": return m["settings.vertd.custom_instance"]();
                }
        }

        function onSelectInstance(selected: string) {
                let inner: VertdInner;
                switch (selected) {
                        case m["settings.vertd.auto_instance"](): inner = { type: "auto" }; break;
                        case m["settings.vertd.eu_instance"]():  inner = { type: "eu" };   break;
                        case m["settings.vertd.us_instance"]():  inner = { type: "us" };   break;
                        default: inner = { type: "custom" };
                }
                VertdInstance.instance.set(inner);
        }
</script>

<Panel class="flex flex-col gap-0 p-0 overflow-hidden">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 pt-5 pb-4">
                <div class="flex items-center gap-3">
                        <div class="flex items-center justify-center w-9 h-9 rounded-full bg-accent-blue/20">
                                <VideoIcon size="18" class="text-accent-blue-alt" />
                        </div>
                        <h2 class="text-lg font-bold text-fg">{m["settings.vertd.title"]()}</h2>
                </div>
                <!-- Status badge -->
                <div class="flex items-center gap-1.5 text-xs font-bold tracking-wide">
                        {#if vertdCommit === "loading"}
                                <span class="w-2 h-2 rounded-full bg-muted animate-pulse"></span>
                                <span class="text-muted">CHECKING…</span>
                        {:else if vertdCommit}
                                <span class="w-2 h-2 rounded-full bg-green-500"></span>
                                <span class="text-green-600 dynadark:text-green-400">STATUS: AVAILABLE</span>
                        {:else}
                                <span class="w-2 h-2 rounded-full bg-failure"></span>
                                <span class="text-failure">STATUS: UNAVAILABLE</span>
                        {/if}
                </div>
        </div>

        <div class="flex flex-col gap-4 px-6 pb-5">
                <!-- Two dropdowns side by side -->
                <div class="grid grid-cols-2 gap-4">
                        <div class="flex flex-col gap-2">
                                <span class="text-xs font-semibold text-muted uppercase tracking-wide">
                                        {m["settings.vertd.instance"]()}
                                </span>
                                <Dropdown
                                        options={instanceOptions}
                                        selected={getSelectedInstance()}
                                        onselect={onSelectInstance}
                                        settingsStyle
                                />
                                {#if VertdInstance.instance.innerData().type === "custom"}
                                        <input
                                                type="text"
                                                placeholder={m["settings.vertd.url_placeholder"]()}
                                                bind:value={settings.vertdURL}
                                                class="px-3 py-2 text-sm rounded-lg border border-separator bg-input text-fg placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30"
                                        />
                                {/if}
                        </div>
                        <div class="flex flex-col gap-2">
                                <span class="text-xs font-semibold text-muted uppercase tracking-wide">
                                        Encoder profile
                                </span>
                                <Dropdown
                                        options={[
                                                m["settings.vertd.speeds.very_slow"](),
                                                m["settings.vertd.speeds.slower"](),
                                                m["settings.vertd.speeds.slow"](),
                                                m["settings.vertd.speeds.medium"](),
                                                m["settings.vertd.speeds.fast"](),
                                                m["settings.vertd.speeds.ultra_fast"](),
                                        ]}
                                        selected={(() => {
                                                switch (settings.vertdSpeed) {
                                                        case "verySlow":  return m["settings.vertd.speeds.very_slow"]();
                                                        case "slower":    return m["settings.vertd.speeds.slower"]();
                                                        case "slow":      return m["settings.vertd.speeds.slow"]();
                                                        case "medium":    return m["settings.vertd.speeds.medium"]();
                                                        case "fast":      return m["settings.vertd.speeds.fast"]();
                                                        case "ultraFast": return m["settings.vertd.speeds.ultra_fast"]();
                                                }
                                        })()}
                                        onselect={(selected) => {
                                                switch (selected) {
                                                        case m["settings.vertd.speeds.very_slow"](): settings.vertdSpeed = "verySlow"; break;
                                                        case m["settings.vertd.speeds.slower"]():    settings.vertdSpeed = "slower";   break;
                                                        case m["settings.vertd.speeds.slow"]():      settings.vertdSpeed = "slow";     break;
                                                        case m["settings.vertd.speeds.medium"]():    settings.vertdSpeed = "medium";   break;
                                                        case m["settings.vertd.speeds.fast"]():      settings.vertdSpeed = "fast";     break;
                                                        case m["settings.vertd.speeds.ultra_fast"](): settings.vertdSpeed = "ultraFast"; break;
                                                }
                                        }}
                                        settingsStyle
                                />
                        </div>
                </div>

                <!-- Conversion speed slider -->
                <div class="flex flex-col gap-3 border-t border-separator pt-4">
                        <div class="flex items-center justify-between">
                                <span class="text-sm font-semibold text-fg">
                                        {m["settings.vertd.conversion_speed"]()}
                                </span>
                                <span class="text-sm font-semibold text-accent-alt">
                                        {speedLabels[speedIndex]}
                                </span>
                        </div>
                        <div class="relative py-1">
                                <input
                                        type="range"
                                        min="0"
                                        max="5"
                                        step="1"
                                        value={speedIndex}
                                        oninput={(e) => setSpeedFromIndex(parseInt((e.target as HTMLInputElement).value))}
                                        class="w-full h-1 appearance-none bg-separator rounded-full cursor-pointer
                                               [&::-webkit-slider-thumb]:appearance-none
                                               [&::-webkit-slider-thumb]:w-[18px]
                                               [&::-webkit-slider-thumb]:h-[18px]
                                               [&::-webkit-slider-thumb]:rounded-full
                                               [&::-webkit-slider-thumb]:bg-accent
                                               [&::-webkit-slider-thumb]:shadow-md
                                               [&::-webkit-slider-thumb]:border-[3px]
                                               [&::-webkit-slider-thumb]:border-white
                                               [&::-moz-range-thumb]:w-[18px]
                                               [&::-moz-range-thumb]:h-[18px]
                                               [&::-moz-range-thumb]:rounded-full
                                               [&::-moz-range-thumb]:bg-accent
                                               [&::-moz-range-thumb]:border-[3px]
                                               [&::-moz-range-thumb]:border-white"
                                        style="background: linear-gradient(to right, var(--accent-pink-alt) 0%, var(--accent-pink-alt) {speedIndex/5*100}%, var(--bg-separator) {speedIndex/5*100}%, var(--bg-separator) 100%)"
                                />
                        </div>
                        <div class="flex justify-between text-[10px] font-semibold text-muted uppercase tracking-wider">
                                <span>SLOW</span>
                                <span>STANDARD</span>
                                <span>FAST</span>
                        </div>
                </div>
        </div>
</Panel>
