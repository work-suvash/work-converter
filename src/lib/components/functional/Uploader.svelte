<script lang="ts">
	import { UploadIcon } from "lucide-svelte";
	import clsx from "clsx";
	import { onMount } from "svelte";
	import { effects, files } from "$lib/store/index.svelte";
	import { goto } from "$app/navigation";
	import { m } from "$lib/paraglide/messages";

	type Props = {
		class?: string;
	};

	const { class: classList }: Props = $props();

	let uploaderButton = $state<HTMLButtonElement>();
	let fileInput = $state<HTMLInputElement>();

	const uploadFiles = async () => {
		if (!fileInput) return;
		fileInput.click();
	};

	const handleFileChange = () => {
		if (!fileInput) return;
		const oldLength = files.files.length;
		files.add(fileInput.files);
		if (oldLength !== files.files.length) goto("/convert");
	};

	onMount(() => {
		const handler = (e: Event) => {
			e.preventDefault();
			return false;
		};

		uploaderButton?.addEventListener("dragover", handler);
		uploaderButton?.addEventListener("dragenter", handler);
		uploaderButton?.addEventListener("dragleave", handler);
		uploaderButton?.addEventListener("drop", handler);

		return () => {
			uploaderButton?.removeEventListener("dragover", handler);
			uploaderButton?.removeEventListener("dragenter", handler);
			uploaderButton?.removeEventListener("dragleave", handler);
			uploaderButton?.removeEventListener("drop", handler);
		};
	});
</script>

<input
	bind:this={fileInput}
	type="file"
	multiple
	class="hidden"
	onchange={handleFileChange}
/>

<button
	onclick={uploadFiles}
	bind:this={uploaderButton}
	class={clsx(`uploader-btn ${$effects ? "" : "!scale-100"} ${classList}`)}
>
	<div class="uploader-inner flex justify-center items-center w-full h-full flex-col gap-3 pointer-events-none">
		<div class="upload-icon-wrap">
			<UploadIcon class="w-6 h-6 text-on-accent" />
		</div>
		<div class="text-center">
			<p class="text-base font-semibold">
				{m["upload.uploader.text"]({
					action: m["upload.uploader.convert"]()
				})}
			</p>
			<p class="text-xs font-normal text-muted mt-0.5">Max file size: 500MB</p>
		</div>
	</div>
</button>

<style lang="postcss">
	.uploader-btn {
		@apply rounded-2xl cursor-pointer w-full h-full;
		transition: transform 0.3s ease, box-shadow 0.3s ease;
		border: 2px dashed var(--bg-separator);
		background: var(--bg-panel);
		box-shadow: var(--shadow-panel);
	}

	.uploader-btn:hover {
		transform: scale(1.015);
		border-color: var(--accent);
		box-shadow: 0 0 0 4px hsla(239, 84%, 67%, 0.12), var(--shadow-elevated);
	}

	.uploader-btn:active {
		transform: scale(0.99);
	}

	.uploader-inner {
		border-radius: inherit;
	}

	.upload-icon-wrap {
		@apply w-14 h-14 rounded-xl flex items-center justify-center;
		background: var(--accent);
		box-shadow: 0 4px 20px hsla(239, 84%, 56%, 0.35);
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	.uploader-btn:hover .upload-icon-wrap {
		transform: translateY(-2px) scale(1.05);
		box-shadow: 0 8px 28px hsla(239, 84%, 56%, 0.45);
	}
</style>
