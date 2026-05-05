<script lang="ts">
        import Panel from "$lib/components/visual/Panel.svelte";
        import {
                theme,
                effects,
                setEffects,
                setTheme,
                updateLocale,
                availableLocales,
        } from "$lib/store/index.svelte";
        import { MoonIcon, PaletteIcon, SunIcon } from "lucide-svelte";
        import { onMount, onDestroy } from "svelte";
        import { m } from "$lib/paraglide/messages";
        import { getLocale } from "$lib/paraglide/runtime";
        import Dropdown from "$lib/components/functional/Dropdown.svelte";

        let currentLocale = $state("en");

        const getLanguageDisplayName = (locale: string) => {
                try {
                        return availableLocales[locale as keyof typeof availableLocales];
                } catch {
                        return locale.toUpperCase();
                }
        };

        const languageOptions = Object.keys(availableLocales).map((locale) =>
                getLanguageDisplayName(locale),
        );

        function handleLanguageChange(selectedLanguage: string) {
                const selectedLocale = Object.keys(availableLocales).find(
                        (locale) => getLanguageDisplayName(locale) === selectedLanguage,
                );
                if (selectedLocale && selectedLocale !== currentLocale) {
                        currentLocale = selectedLocale;
                        updateLocale(selectedLocale);
                }
        }

        onMount(() => {
                currentLocale = localStorage.getItem("locale") || getLocale();
        });
</script>

<Panel class="flex flex-col gap-0 p-0 overflow-hidden">
        <!-- Header -->
        <div class="flex items-center gap-3 px-6 pt-5 pb-4">
                <div class="flex items-center justify-center w-9 h-9 rounded-full bg-accent-purple/15">
                        <PaletteIcon size="18" class="text-accent-purple-alt" />
                </div>
                <h2 class="text-lg font-bold text-fg">{m["settings.appearance.title"]()}</h2>
        </div>

        <div class="flex flex-col gap-5 px-6 pb-5">
                <!-- Theme mode -->
                <div class="flex flex-col gap-2">
                        <span class="text-sm font-semibold text-fg">
                                {m["settings.appearance.brightness_theme"]()}
                        </span>
                        <div class="grid grid-cols-2 gap-3">
                                <button
                                        onclick={() => setTheme("light")}
                                        class="flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all duration-200 cursor-pointer
                                               {$theme === 'light'
                                                 ? 'border-accent bg-accent/5 text-accent-alt'
                                                 : 'border-separator bg-panel text-muted hover:bg-panel-highlight'}"
                                >
                                        <SunIcon size="22" />
                                        <span class="text-sm font-semibold">{m["settings.appearance.light"]()}</span>
                                </button>
                                <button
                                        onclick={() => setTheme("dark")}
                                        class="flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all duration-200 cursor-pointer
                                               {$theme === 'dark'
                                                 ? 'border-accent bg-accent/5 text-accent-alt dynadark:text-accent'
                                                 : 'border-separator bg-panel text-muted hover:bg-panel-highlight'}"
                                >
                                        <MoonIcon size="22" />
                                        <span class="text-sm font-semibold">{m["settings.appearance.dark"]()}</span>
                                </button>
                        </div>
                </div>

                <!-- Effect settings — toggle switch -->
                <div class="flex items-center justify-between py-3 border-t border-separator">
                        <div class="flex items-center gap-3">
                                <div class="grid grid-cols-2 gap-[3px] w-5 h-5 opacity-60">
                                        {#each Array(4) as _}
                                                <div class="rounded-[2px] bg-current"></div>
                                        {/each}
                                </div>
                                <span class="text-sm font-semibold text-fg">
                                        {m["settings.appearance.effect_settings"]()}
                                </span>
                        </div>
                        <!-- Toggle switch -->
                        <button
                                role="switch"
                                aria-label={m["settings.appearance.effect_settings"]()}
                                aria-checked={$effects}
                                onclick={() => setEffects(!$effects)}
                                class="relative w-12 h-6 rounded-full transition-colors duration-200 cursor-pointer flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50
                                       {$effects ? 'bg-accent' : 'bg-separator'}"
                        >
                                <span
                                        class="absolute top-[3px] w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-all duration-200
                                               {$effects ? 'left-[26px]' : 'left-[3px]'}"
                                ></span>
                        </button>
                </div>

                <!-- Language -->
                <div class="flex flex-col gap-2 border-t border-separator pt-4">
                        <span class="text-sm font-semibold text-fg">
                                {m["settings.language.title"]()}{#if currentLocale !== "en"} (Language){/if}
                        </span>
                        <Dropdown
                                options={languageOptions}
                                settingsStyle
                                selected={getLanguageDisplayName(currentLocale)}
                                onselect={handleLanguageChange}
                        />
                </div>
        </div>
</Panel>
