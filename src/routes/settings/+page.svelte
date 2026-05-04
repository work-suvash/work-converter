<script lang="ts">
        import { browser } from "$app/environment";
        import { log } from "$lib/util/logger";
        import * as Settings from "$lib/sections/settings/index.svelte";
        import { PUB_PLAUSIBLE_URL } from "$env/static/public";
        import { onMount } from "svelte";
        import { m } from "$lib/paraglide/messages";
        import { ToastManager } from "$lib/util/toast.svelte";
        import { DISABLE_ALL_EXTERNAL_REQUESTS } from "$lib/util/consts";
        import { inview } from "$lib/actions/inview";

        let settings = $state(Settings.Settings.instance.settings);

        let isInitial = $state(true);

        $effect(() => {
                if (!browser) return;
                if (isInitial) {
                        isInitial = false;
                        return;
                }

                const savedSettings = localStorage.getItem("settings");
                if (savedSettings) {
                        const parsedSettings = JSON.parse(savedSettings);
                        if (JSON.stringify(parsedSettings) === JSON.stringify(settings))
                                return;
                }

                try {
                        Settings.Settings.instance.settings = settings;
                        Settings.Settings.instance.save();
                        log(["settings"], "saving settings");
                } catch (error) {
                        log(["settings", "error"], `failed to save settings: ${error}`);
                        ToastManager.add({
                                type: "error",
                                message: m["settings.errors.save_failed"](),
                        });
                }
        });

        onMount(() => {
                const savedSettings = localStorage.getItem("settings");
                if (savedSettings) {
                        const parsedSettings = JSON.parse(savedSettings);
                        Settings.Settings.instance.settings = {
                                ...Settings.Settings.instance.settings,
                                ...parsedSettings,
                        };
                        settings = Settings.Settings.instance.settings;
                }
        });
</script>

<div class="flex flex-col w-full">
        <!-- Page header -->
        <div class="px-6 md:px-8 pt-8 pb-6" use:inview>
                <h1 class="text-3xl font-bold tracking-tight text-fg">
                        {m["settings.title"]()}
                </h1>
                <p class="text-sm text-muted mt-1">Configure your professional conversion environment.</p>
        </div>

        <!-- Two-column layout -->
        <div class="w-full max-w-[1280px] flex flex-col md:flex-row gap-4 px-4 md:px-6 pb-8">
                <div class="flex flex-col gap-4 flex-1">
                        <div use:inview={{ delay: 40 }}>
                                <Settings.Conversion bind:settings />
                        </div>
                        {#if !DISABLE_ALL_EXTERNAL_REQUESTS}
                                <div use:inview={{ delay: 100 }}>
                                        <Settings.Vertd bind:settings />
                                </div>
                        {:else if PUB_PLAUSIBLE_URL}
                                <div use:inview={{ delay: 100 }}>
                                        <Settings.Privacy bind:settings />
                                </div>
                        {/if}
                </div>

                <div class="flex flex-col gap-4 flex-1">
                        <div use:inview={{ delay: 70 }}>
                                <Settings.Appearance />
                        </div>
                        {#if PUB_PLAUSIBLE_URL && !DISABLE_ALL_EXTERNAL_REQUESTS}
                                <div use:inview={{ delay: 130 }}>
                                        <Settings.Privacy bind:settings />
                                </div>
                        {/if}
                        <!-- Support card -->
                        <div use:inview={{ delay: 160 }}
                                class="rounded-2xl p-6 flex flex-col gap-4 overflow-hidden relative"
                                style="background: linear-gradient(135deg, hsl(239,84%,52%) 0%, hsl(239,84%,40%) 100%); box-shadow: var(--shadow-elevated);"
                        >
                                <!-- Decorative circle -->
                                <div
                                        class="absolute -right-6 -bottom-6 w-32 h-32 rounded-full opacity-20"
                                        style="background: white;"
                                ></div>
                                <div class="relative">
                                        <h3 class="text-lg font-bold text-white">Need Assistance?</h3>
                                        <p class="text-sm text-white/75 mt-1 leading-relaxed">
                                                Our enterprise support team is available 24/7 for conversion assistance.
                                        </p>
                                </div>
                                <div class="relative">
                                        <a
                                                href="mailto:worksuvash@gmail.com?subject=Work-Converter%20Support%20Request&body=Hi%20Work-Converter%20Team%2C%0A%0APlease%20describe%20your%20issue%20here%3A%0A%0A"
                                                class="inline-flex items-center px-5 py-2.5 bg-white rounded-xl text-sm font-semibold hover:bg-white/90 transition-colors"
                                                style="color: hsl(239,84%,48%);"
                                        >
                                                Contact Support
                                        </a>
                                </div>
                        </div>
                </div>
        </div>
</div>
