<script lang="ts">
	import { effects, files } from "$lib/store/index.svelte";
	import { DownloadIcon, PlayIcon, Trash2Icon } from "lucide-svelte";
	import Panel from "../visual/Panel.svelte";
	import Dropdown from "./Dropdown.svelte";
	import Tooltip from "../visual/Tooltip.svelte";
	import FormatDropdown from "./FormatDropdown.svelte";
	import { categories } from "$lib/converters";
	import { m } from "$lib/paraglide/messages";

	const length = $derived(files.files.length);
	const progress = $derived(files.files.filter((f) => f.result).length);
</script>

<Panel class="flex flex-row items-center justify-between gap-4 flex-wrap">
	<!-- Left: workspace title -->
	<div class="flex items-center gap-4">
		<div>
			<p class="text-[10px] font-bold tracking-[0.15em] uppercase text-muted leading-none mb-1">
				Queue Management
			</p>
			<h1 class="text-xl font-bold text-fg leading-tight">
				Conversion Workspace
			</h1>
		</div>
		{#if length > 0}
			<Tooltip text={m["convert.panel.remove_all"]()} position="bottom">
				<button
					class="btn p-2.5 {$effects ? '' : '!scale-100'} text-muted hover:text-failure transition-colors"
					disabled={length === 0}
					onclick={() => (files.files = [])}
				>
					<Trash2Icon size="16" />
				</button>
			</Tooltip>
		{/if}
	</div>

	<!-- Middle: Set all to -->
	<div class="flex items-center gap-2.5">
		<span class="text-sm font-medium text-muted whitespace-nowrap">
			{m["convert.panel.set_all_to"]()}
		</span>
		<div class="w-32">
			{#if length > 0 && files.files.every((f) => f.converters.length) && files.files.every((f) => JSON.stringify(f.converters) === JSON.stringify(files.files[0].converters))}
				<FormatDropdown
					onselect={(r) =>
						files.files.forEach((f) => {
							f.to = r;
							f.result = null;
						})}
					{categories}
					dropdownSize="large"
				/>
			{:else}
				<Dropdown options={[m["convert.panel.na"]()]} disabled />
			{/if}
		</div>
	</div>

	<!-- Right: action buttons -->
	<div class="flex items-center gap-2.5">
		<button
			class="btn {$effects ? '' : '!scale-100'} flex gap-2 border border-separator"
			disabled={!files.ready || !files.results}
			onclick={() => files.downloadAll()}
		>
			<DownloadIcon size="16" />
			<span>{m["convert.panel.download_all"]()}</span>
		</button>
		<button
			onclick={() => files.convertAll()}
			class="btn {$effects ? '' : '!scale-100'} highlight flex gap-2"
			disabled={!files.ready}
		>
			<PlayIcon size="16" />
			<span>{m["convert.panel.convert_all"]()}</span>
		</button>
	</div>
</Panel>
