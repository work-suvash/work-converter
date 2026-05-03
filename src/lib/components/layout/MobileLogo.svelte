<script>
	import Logo from "$lib/components/visual/svg/Logo.svelte";
</script>

<div class="flex md:hidden justify-center items-center pb-6 pt-5">
	<a
		class="flex items-center justify-center"
		href="/"
	>
		<div
			class="h-12 bg-accent rounded-xl flex items-center justify-center px-5 mobile-logo"
		>
			<div class="w-24 h-4">
				<Logo />
			</div>
		</div>
	</a>
</div>

<style lang="postcss">
	.mobile-logo {
		box-shadow: 0 4px 16px hsla(239, 84%, 56%, 0.3);
		transition: transform 0.25s ease, box-shadow 0.25s ease;
	}
	.mobile-logo:hover {
		transform: scale(1.03);
		box-shadow: 0 6px 24px hsla(239, 84%, 56%, 0.4);
	}
</style>
