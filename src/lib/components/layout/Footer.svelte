<script lang="ts">
	import { GITHUB_URL_VERT, DISCORD_URL } from "$lib/util/consts";
	import { m } from "$lib/paraglide/messages";

	const commitHash =
		__COMMIT_HASH__ && __COMMIT_HASH__ !== "unknown"
			? __COMMIT_HASH__
			: null;

	const year = new Date().getFullYear();
</script>

<footer
	class="hidden md:flex w-full h-14 border-t border-separator fixed bottom-0 items-center justify-center backdrop-blur-xl"
	style="background: var(--bg-header);"
>
	<div
		class="w-full max-w-7xl mx-auto px-8 flex items-center gap-4 text-sm text-muted font-normal"
	>
		<span class="font-medium text-foreground/70">{m["footer.copyright"]({ year })}</span>
		<span class="opacity-30">•</span>
		<a
			class="footer-link"
			href={GITHUB_URL_VERT}
			target="_blank"
			rel="noopener noreferrer"
		>
			{m["footer.source_code"]()}
		</a>
		<span class="opacity-30">•</span>
		<a
			class="footer-link"
			href={DISCORD_URL}
			target="_blank"
			rel="noopener noreferrer"
		>
			{m["footer.discord_server"]()}
		</a>
		<span class="opacity-30">•</span>
		<a class="footer-link" href="/privacy/">
			{m["footer.privacy_policy"]()}
		</a>
		{#if commitHash}
			<span class="opacity-30">•</span>
			<a
				class="footer-link font-mono text-xs"
				href="{GITHUB_URL_VERT}/commit/{commitHash}"
				target="_blank"
				rel="noopener noreferrer"
			>
				{commitHash}
			</a>
		{/if}
	</div>
</footer>

<style lang="postcss">
	.footer-link {
		@apply text-muted transition-colors duration-200;
	}
	.footer-link:hover {
		@apply text-foreground;
	}
</style>
