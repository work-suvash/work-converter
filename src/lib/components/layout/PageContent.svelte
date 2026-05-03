<script lang="ts">
	import { page } from "$app/state";
	import { duration } from "$lib/util/animation";
	import { goingLeft, isMobile } from "$lib/store/index.svelte";
	import { quintOut } from "svelte/easing";
	import { fade } from "$lib/util/animation";

	let { children } = $props();
</script>

<div class="grid grid-rows-1 grid-cols-1 h-full flex-grow">
	{#key page.url.pathname}
		<div
			class="row-start-1 col-start-1"
			in:fade={{
				duration: Math.round(duration * 0.6),
				easing: quintOut,
				delay: 20,
			}}
			out:fade={{
				duration: Math.round(duration * 0.4),
				easing: quintOut,
			}}
		>
			<div
				class="flex flex-col h-full pt-4 md:pt-8 pb-32"
			>
				{@render children()}
			</div>
		</div>
	{/key}
</div>
