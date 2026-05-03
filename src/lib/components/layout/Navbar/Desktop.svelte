<script lang="ts">
	import { page } from "$app/state";
	import { beforeNavigate } from "$app/navigation";
	import { setTheme, files, goingLeft } from "$lib/store/index.svelte";
	import { duration, fade } from "$lib/util/animation";
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
	import clsx from "clsx";
	import Logo from "$lib/components/visual/svg/Logo.svelte";
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
	<div
		class="border-b border-separator backdrop-blur-xl"
		style="background: var(--bg-header);"
	>
		<div
			class="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between"
		>
			<!-- Logo -->
			<a
				href="/"
				class="flex items-center bg-accent text-on-accent rounded-xl px-4 h-10 gap-2 flex-shrink-0 nav-logo"
				draggable={false}
			>
				<div class="h-4 w-24 flex items-center">
					<Logo />
				</div>
			</a>

			<!-- Nav items -->
			<nav class="flex items-center gap-1">
				{#each items as item}
					{@const Icon = item.icon}
					{@const isActive = item.activeMatch(page.url.pathname)}
					<a
						href={item.url}
						class={clsx(
							"relative flex items-center gap-2 px-4 py-2 rounded-xl font-medium nav-link",
							isActive
								? "bg-panel-highlight text-foreground active"
								: "text-muted hover:text-foreground hover:bg-panel-highlight/60",
						)}
						draggable={false}
					>
						<div class="relative flex-shrink-0">
							<Icon size={18} />
							{#if item.badge}
								<div
									class="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-badge text-on-badge flex items-center justify-center font-display font-medium"
									style="font-size: 0.6rem;"
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
					const isDark =
						document.documentElement.classList.contains("dark");
					setTheme(isDark ? "light" : "dark");
				}}
				class="w-10 h-10 flex items-center justify-center rounded-xl text-muted hover:text-foreground hover:bg-panel-highlight transition-all duration-300 flex-shrink-0"
				aria-label="Toggle theme"
			>
				<SunIcon class="dynadark:hidden block" size={20} />
				<MoonIcon class="dynadark:block hidden" size={20} />
			</button>
		</div>
	</div>
</header>

<style lang="postcss">
	.nav-logo {
		transition: opacity 0.25s ease, transform 0.25s ease;
	}
	.nav-logo:hover {
		opacity: 0.88;
		transform: scale(1.02);
	}

	.nav-link {
		transition: color 0.25s ease, background-color 0.25s ease, transform 0.2s ease;
	}
	.nav-link:hover {
		transform: translateY(-1px);
	}
	.nav-link.active {
		transition: color 0.25s ease, background-color 0.25s ease;
	}
</style>
