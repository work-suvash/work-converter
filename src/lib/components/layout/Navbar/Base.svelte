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
		MoonIcon,
		RefreshCw,
		SettingsIcon,
		SunIcon,
		UploadIcon,
		type Icon as IconType,
	} from "lucide-svelte";
	import { quintOut } from "svelte/easing";
	import { beforeNavigate } from "$app/navigation";
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
			setTimeout(() => { isInitialized = true; }, 10);
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
		goingLeft.set(newIndex < oldIndex);
	});
</script>

{#snippet link(item: (typeof items)[0], index: number)}
	{@const Icon = item.icon}
	{@const isActive = item.activeMatch(page.url.pathname)}
	<a
		bind:this={links[index]}
		href={item.url}
		aria-label={item.name}
		class={clsx(
			"min-w-12 h-full relative z-10 rounded-xl flex flex-1 items-center justify-center mobile-nav-link",
			{ "bg-panel-highlight": isActive && !browser },
		)}
		draggable={false}
	>
		<div class="relative">
			<Icon size={20} class={isActive ? "text-accent" : "text-muted"} />
			{#if item.badge}
				<div
					class="absolute overflow-hidden -top-1 -right-1 w-fit px-1 h-3.5 rounded-full bg-accent text-on-accent font-medium flex items-center justify-center"
					style="font-size: 0.55rem;"
					transition:fade={{ duration, easing: quintOut }}
				>
					{item.badge}
				</div>
			{/if}
		</div>
	</a>
{/snippet}

<div bind:this={container} class="w-full">
	<div
		class="mobile-pill max-w-xs mx-auto w-full h-14 flex items-center gap-1 relative px-1.5"
		style="background: var(--bg-header); border: 1px solid var(--bg-separator);"
	>
		{#if linkRect && isInitialized}
			<div
				class="absolute bg-panel-highlight rounded-xl"
				style="width: {linkRect.width}px; height: {linkRect.height - 6}px;
					top: {linkRect.top - (containerRect?.top || 0) + 3}px;
					left: {linkRect.left - (containerRect?.left || 0)}px;
					opacity: {isSecretPage ? 0 : 1};
					{$effects ? `transition: left 220ms ease, opacity 180ms ease;` : ''}"
			></div>
		{/if}

		{#each items as item, i (item.url)}
			{@render link(item, i)}
		{/each}

		<div class="w-px bg-separator h-6 flex-shrink-0 mx-1"></div>

		<button
			onclick={() => {
				const isDark = document.documentElement.classList.contains("dark");
				setTheme(isDark ? "light" : "dark");
			}}
			class="w-10 h-full flex items-center justify-center text-muted flex-shrink-0 theme-toggle"
		>
			<SunIcon class="dynadark:hidden block" size={18} />
			<MoonIcon class="dynadark:block hidden" size={18} />
		</button>
	</div>
</div>

<style lang="postcss">
	.mobile-pill {
		@apply rounded-2xl backdrop-blur-md;
		box-shadow: 0 2px 12px 0 hsla(220, 40%, 20%, 0.08);
	}

	.mobile-nav-link {
		transition: color 0.18s ease;
	}

	.theme-toggle {
		transition: color 0.18s ease;
	}
	.theme-toggle:hover {
		color: var(--fg);
	}
</style>
