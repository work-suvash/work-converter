<script lang="ts">
	import { fade, fly } from "$lib/util/animation";
	import {
		BanIcon,
		CheckIcon,
		InfoIcon,
		TriangleAlert,
		XIcon,
	} from "lucide-svelte";
	import { quintOut } from "svelte/easing";
	import { ToastManager } from "$lib/util/toast.svelte";
	import type { ToastProps } from "$lib/util/toast.svelte";
	import type { SvelteComponent } from "svelte";
	import clsx from "clsx";
	import type { Toast as ToastType } from "$lib/util/toast.svelte";

	const { toast }: { toast: ToastType<unknown> } = $props();

	const id = $derived(toast.id);
	const type = $derived(toast.type);
	const message = $derived(toast.message);
	const durations = $derived(toast.durations);
	const additional = $derived("additional" in toast ? toast.additional : {});

	const colors = {
		success: "purple",
		error: "red",
		info: "blue",
		warning: "pink",
	};

	const Icons = {
		success: CheckIcon,
		error: BanIcon,
		info: InfoIcon,
		warning: TriangleAlert,
	};

	let color = $derived(colors[type]);
	let Icon = $derived(Icons[type]);

	let msg = $state<SvelteComponent<ToastProps>>();
	const title = $derived(((msg as any)?.title as string) ?? "");

	// intentionally unused — keeps tailwind from purging these classes
	const colourVariants = [
		"border-accent-pink-alt",
		"border-accent-red-alt",
		"border-accent-purple-alt",
		"border-accent-blue-alt",
	];
</script>

<div
	class="toast-wrap flex flex-col max-w-[100%] md:max-w-md p-4 gap-2 bg-accent-{color} rounded-xl"
	style="border-left: 4px solid var(--accent-{color}-alt, var(--accent));"
	in:fly={{ duration: durations.enter, easing: quintOut, x: 0, y: 80 }}
	out:fade={{ duration: durations.exit, easing: quintOut }}
>
	<div class="flex flex-row items-center justify-between w-full gap-4">
		<div class="flex items-center gap-2">
			<Icon class="w-5 h-5 text-black flex-shrink-0" size="20" stroke="2" fill="none" />
			<p class={clsx("text-black text-sm whitespace-pre-wrap", { "font-normal": !title })}>
				{title || message}
			</p>
		</div>
		<button
			class="text-black/60 hover:text-black flex-shrink-0 transition-colors duration-150"
			onclick={() => ToastManager.remove(id)}
		>
			<XIcon size="14" />
		</button>
	</div>
	{#if typeof message !== "string"}
		{@const MessageComponent = message}
		<div class="font-normal text-sm">
			<MessageComponent
				bind:this={msg}
				{durations}
				{id}
				{message}
				{type}
				{additional}
			/>
		</div>
	{/if}
</div>

<style lang="postcss">
	.toast-wrap {
		box-shadow: var(--shadow-elevated);
	}
</style>
