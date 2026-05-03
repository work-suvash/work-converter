<script lang="ts">
        import { browser } from "$app/environment";
        import { page } from "$app/state";
        import { duration, fade } from "$lib/util/animation";
        import {
                effects,
                files,
                goingLeft,
                setTheme,
        } from "$lib/store/index.svelte";
        import clsx from "clsx";
        import {
                InfoIcon,
                MoonIcon,
                RefreshCw,
                SettingsIcon,
                SunIcon,
                UploadIcon,
                type Icon as IconType,
        } from "lucide-svelte";
        import { quintOut } from "svelte/easing";
        import { beforeNavigate } from "$app/navigation";
        import Tooltip from "$lib/components/visual/Tooltip.svelte";
        import { m } from "$lib/paraglide/messages";

        const items = $derived<
                {
                        name: string;
                        url: string;
                        activeMatch: (pathname: string) => boolean;
                        icon: typeof IconType;
                        badge?: number;
                }[]
        >([
                {
                        name: m["navbar.upload"](),
                        url: "/",
                        activeMatch: (pathname) => pathname === "/",
                        icon: UploadIcon,
                },
                {
                        name: m["navbar.convert"](),
                        url: "/convert/",
                        activeMatch: (pathname) =>
                                pathname === "/convert/" || pathname === "/convert",
                        icon: RefreshCw,
                        badge: files.files.length,
                },
                {
                        name: m["navbar.settings"](),
                        url: "/settings/",
                        activeMatch: (pathname) => pathname.startsWith("/settings"),
                        icon: SettingsIcon,
                },
                {
                        name: m["navbar.about"](),
                        url: "/about/",
                        activeMatch: (pathname) => pathname.startsWith("/about"),
                        icon: InfoIcon,
                },
        ]);

        let links = $state<HTMLAnchorElement[]>([]);
        let container = $state<HTMLDivElement>();
        let containerRect = $derived(container?.getBoundingClientRect());
        let isInitialized = $state(false);

        const linkRects = $derived(links.map((l) => l.getBoundingClientRect()));

        const selectedIndex = $derived(
                items.findIndex((i) => i.activeMatch(page.url.pathname)),
        );

        const isSecretPage = $derived(selectedIndex === -1);

        const linkRect = $derived(linkRects.at(selectedIndex) || linkRects[0]);

        $effect(() => {
                if (containerRect && linkRects.length > 0 && links.length > 0) {
                        setTimeout(() => {
                                isInitialized = true;
                        }, 10);
                } else {
                        isInitialized = false;
                }
        });

        beforeNavigate((e) => {
                const oldIndex = items.findIndex((i) =>
                        i.activeMatch(e.from?.url.pathname || ""),
                );
                const newIndex = items.findIndex((i) =>
                        i.activeMatch(e.to?.url.pathname || ""),
                );
                if (newIndex < oldIndex) {
                        goingLeft.set(true);
                } else {
                        goingLeft.set(false);
                }
        });
</script>

{#snippet link(item: (typeof items)[0], index: number)}
        {@const Icon = item.icon}
        <a
                bind:this={links[index]}
                href={item.url}
                aria-label={item.name}
                class={clsx(
                        "min-w-14 h-full relative z-10 rounded-xl flex flex-1 items-center justify-center gap-2 overflow-hidden mobile-nav-link",
                        {
                                "bg-panel-highlight":
                                        item.activeMatch(page.url.pathname) && !browser,
                        },
                )}
                draggable={false}
        >
                <div class="grid grid-rows-1 grid-cols-1">
                        {#key item.name}
                                <div
                                        class="w-full row-start-1 col-start-1 h-full flex items-center justify-center gap-2"
                                        in:fade={{
                                                duration,
                                                easing: quintOut,
                                        }}
                                        out:fade={{
                                                duration,
                                                easing: quintOut,
                                        }}
                                >
                                        <div class="relative">
                                                <Icon size={20} />
                                                {#if item.badge}
                                                        <div
                                                                class="absolute overflow-hidden grid grid-rows-1 grid-cols-1 -top-1 font-display -right-1 w-fit px-1.5 h-4 rounded-full bg-badge text-on-badge font-medium"
                                                                style="font-size: 0.65rem;"
                                                                transition:fade={{
                                                                        duration,
                                                                        easing: quintOut,
                                                                }}
                                                        >
                                                                {#key item.badge}
                                                                        <div
                                                                                class="flex items-center justify-center w-full h-full col-start-1 row-start-1"
                                                                                in:fade={{
                                                                                        duration,
                                                                                        easing: quintOut,
                                                                                }}
                                                                                out:fade={{
                                                                                        duration,
                                                                                        easing: quintOut,
                                                                                }}
                                                                        >
                                                                                {item.badge}
                                                                        </div>
                                                                {/key}
                                                        </div>
                                                {/if}
                                        </div>
                                </div>
                        {/key}
                </div>
        </a>
{/snippet}

<div bind:this={container} class="w-full">
        <div
                class="mobile-pill max-w-sm mx-auto w-full h-16 flex items-center gap-2 relative px-2"
                style="background: var(--bg-header); border: 1px solid var(--bg-separator);"
        >
                {#if linkRect && isInitialized}
                        <div
                                class="absolute bg-panel-highlight rounded-xl"
                                style="width: {linkRect.width}px; height: {linkRect.height - 8}px; top: {linkRect.top -
                                        (containerRect?.top || 0) + 4}px; left: {linkRect.left -
                                        (containerRect?.left || 0)}px; opacity: {isSecretPage
                                        ? 0
                                        : 1}; {$effects
                                        ? `transition: left var(--transition) ${duration}ms, top var(--transition) ${duration}ms, opacity var(--transition) ${duration}ms;`
                                        : ''}"
                        ></div>
                {/if}
                {#each items as item, i (item.url)}
                        {@render link(item, i)}
                {/each}
                <div class="w-px bg-separator h-8 flex-shrink-0"></div>
                <Tooltip text={m["navbar.toggle_theme"]()} position="right">
                        <button
                                onclick={() => {
                                        const isDark =
                                                document.documentElement.classList.contains("dark");
                                        setTheme(isDark ? "light" : "dark");
                                }}
                                class="w-12 h-full flex items-center justify-center text-muted hover:text-foreground transition-colors duration-200 flex-shrink-0"
                        >
                                <SunIcon class="dynadark:hidden block" size={20} />
                                <MoonIcon class="dynadark:block hidden" size={20} />
                        </button>
                </Tooltip>
        </div>
</div>

<style lang="postcss">
        .mobile-pill {
                @apply rounded-2xl backdrop-blur-xl shadow-panel;
        }

        .mobile-nav-link {
                transition: color 0.25s ease;
        }
</style>
