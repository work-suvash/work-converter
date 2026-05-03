<script lang="ts">
	import type { Snippet } from "svelte";

	type Props = {
		class?: string;
		children: Snippet<[]>;
	};

	const { class: classList, children }: Props = $props();
</script>

<div class="bg-panel border border-separator {classList} p-3 rounded-2xl shadow-panel">
	{@render children?.()}
</div>
