<script lang="ts">
	import { page } from "$app/state";
	import { beforeNavigate } from "$app/navigation";
	import { setTheme, files, goingLeft } from "$lib/store/index.svelte";
	import { duration, fade } from "$lib/util/animation";
	import {
		MoonIcon,
		RefreshCw,
		SettingsIcon,
		SunIcon,
		UploadIcon,
		type Icon as IconType,
	} from "lucide-svelte";
	import { quintOut } from "svelte/easing";
	import clsx from "clsx";
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

<header class="hidden md:block sticky top-0 z-50">
	<div class="border-b border-separator backdrop-blur-md" style="background: var(--bg-header);">
		<div class="max-w-7xl mx-auto px-6 h-14 flex items-center gap-8">

			<!-- Logo: plain text -->
			<a href="/" class="logo-link flex-shrink-0" draggable={false}>
				Work-PDF
			</a>

			<!-- Nav items -->
			<nav class="flex items-center gap-1 flex-1">
				{#each items as item}
					{@const Icon = item.icon}
					{@const isActive = item.activeMatch(page.url.pathname)}
					<a
						href={item.url}
						class={clsx("nav-link flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium",
							isActive ? "active text-foreground" : "text-muted"
						)}
						draggable={false}
					>
						<div class="relative flex-shrink-0">
							<Icon size={16} />
							{#if item.badge}
								<div
									class="absolute -top-1.5 -right-1.5 min-w-[14px] h-3.5 px-0.5 rounded-full bg-accent text-on-accent flex items-center justify-center font-medium"
									style="font-size: 0.55rem;"
									in:fade={{ duration, easing: quintOut }}
									out:fade={{ duration, easing: quintOut }}
								>
									{item.badge}
								</div>
							{/if}
						</div>
						<span>{item.name}</span>
					</a>
				{/each}
			</nav>

			<!-- Theme toggle -->
			<button
				onclick={() => {
					const isDark = document.documentElement.classList.contains("dark");
					setTheme(isDark ? "light" : "dark");
				}}
				class="theme-btn w-8 h-8 flex items-center justify-center rounded-lg text-muted flex-shrink-0"
				aria-label="Toggle theme"
			>
				<SunIcon class="dynadark:hidden block" size={16} />
				<MoonIcon class="dynadark:block hidden" size={16} />
			</button>
		</div>
	</div>
</header>

<style lang="postcss">
	.logo-link {
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--fg);
		letter-spacing: -0.02em;
		transition: opacity 0.2s ease;
	}
	.logo-link:hover {
		opacity: 0.65;
	}

	.nav-link {
		transition: color 0.18s ease, background-color 0.18s ease;
	}
	.nav-link:hover {
		color: var(--fg);
		background-color: var(--bg-panel-highlight);
	}
	.nav-link.active {
		color: var(--fg-accent);
		background-color: transparent;
	}

	.theme-btn {
		transition: color 0.18s ease, background-color 0.18s ease;
	}
	.theme-btn:hover {
		color: var(--fg);
		background-color: var(--bg-panel-highlight);
	}
</style>
