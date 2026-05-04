<script lang="ts">
	import FancyTextInput from "$lib/components/functional/FancyInput.svelte";
	import Panel from "$lib/components/visual/Panel.svelte";
	import { Settings2Icon, ChevronDownIcon } from "lucide-svelte";
	import type { ISettings } from "./index.svelte";
	import {
		CONVERSION_BITRATES,
		type ConversionBitrate,
		SAMPLE_RATES,
		type SampleRate,
	} from "$lib/converters/ffmpeg.svelte";
	import { m } from "$lib/paraglide/messages";
	import Dropdown from "$lib/components/functional/Dropdown.svelte";
	import FancyInput from "$lib/components/functional/FancyInput.svelte";
	import { effects, sanitize } from "$lib/store/index.svelte";
	import FormatDropdown from "$lib/components/functional/FormatDropdown.svelte";
	import { categories } from "$lib/converters";
	import clsx from "clsx";

	const { settings = $bindable() }: { settings: ISettings } = $props();
	let showAdvanced = $state(false);

	const tokens = ["%name%", "%extension%", "%date%"];

	function insertToken(token: string) {
		settings.filenameFormat = (settings.filenameFormat ?? "") + token;
	}
</script>

<Panel class="flex flex-col gap-0 p-0 overflow-hidden">
	<!-- Header -->
	<div class="flex items-center gap-3 px-6 pt-5 pb-4">
		<div class="flex items-center justify-center w-9 h-9 rounded-full bg-accent/15">
			<Settings2Icon size="18" class="text-accent-alt" />
		</div>
		<h2 class="text-lg font-bold text-fg">{m["settings.conversion.title"]()}</h2>
	</div>

	<div class="flex flex-col gap-4 px-6 pb-5">
		<!-- File name format -->
		<div class="flex flex-col gap-2">
			<label class="text-sm font-semibold text-fg" for="filename-format">
				{m["settings.conversion.filename_format"]()}
			</label>
			<FancyTextInput
				placeholder="WorkPDF_%name%"
				bind:value={settings.filenameFormat}
				extension={".ext"}
				type="text"
			/>
		</div>

		<!-- Token chips -->
		<div class="flex flex-wrap gap-2">
			{#each tokens as token}
				<button
					onclick={() => insertToken(token)}
					class="px-3 py-1 text-xs font-medium rounded-md border border-separator bg-button text-fg hover:bg-panel-highlight transition-colors cursor-pointer"
				>
					{token}
				</button>
			{/each}
		</div>

		<!-- Advanced settings toggle -->
		<div class="border-t border-separator pt-4">
			<button
				onclick={() => (showAdvanced = !showAdvanced)}
				class="flex items-center justify-between w-full group"
			>
				<span class="text-sm font-semibold text-accent-alt">
					{m["settings.conversion.advanced_settings"]()}
				</span>
				<ChevronDownIcon
					size="16"
					class={clsx("text-accent-alt transition-transform duration-300", {
						"rotate-180": showAdvanced,
					})}
				/>
			</button>

			<div
				class={clsx(
					"flex flex-col gap-6 transition-all duration-300 ease-in-out",
					{ "max-h-[2000px] opacity-100 overflow-visible mt-5": showAdvanced },
					{ "max-h-0 opacity-0 overflow-hidden": !showAdvanced },
				)}
			>
				<!-- Default format -->
				<div class="flex flex-col gap-3">
					<div class="flex flex-col gap-1">
						<p class="text-sm font-semibold text-fg">
							{m["settings.conversion.default_format"]()}
						</p>
						<p class="text-xs text-muted">
							{m["settings.conversion.default_format_description"]()}
						</p>
					</div>
					<div class="flex gap-2 w-full">
						<button
							onclick={() => (settings.useDefaultFormat = true)}
							class="btn {$effects ? '' : '!scale-100'} {settings.useDefaultFormat ? 'selected' : ''} flex-1 py-3 rounded-lg text-fg flex items-center justify-center text-sm font-medium"
						>
							{m["settings.conversion.default_format_enable"]()}
						</button>
						<button
							onclick={() => (settings.useDefaultFormat = false)}
							class="btn {$effects ? '' : '!scale-100'} {settings.useDefaultFormat ? '' : 'selected'} flex-1 py-3 rounded-lg text-fg flex items-center justify-center text-sm font-medium"
						>
							{m["settings.conversion.default_format_disable"]()}
						</button>
					</div>
					<div
						class="grid gap-3 grid-cols-2"
						class:opacity-40={!settings.useDefaultFormat}
					>
						{#each [
							{ label: m["settings.conversion.default_format_image"](), cats: { image: categories.image }, from: ".png", key: "image" as const },
							{ label: m["settings.conversion.default_format_audio"](), cats: { audio: categories.audio }, from: ".mp3", key: "audio" as const },
							{ label: m["settings.conversion.default_format_video"](), cats: { video: categories.video }, from: ".mp4", key: "video" as const },
							{ label: m["settings.conversion.default_format_document"](), cats: { doc: categories.doc }, from: ".docx", key: "document" as const },
						] as fmt}
							<div class="flex flex-col gap-1">
								<p class="text-xs font-semibold text-muted">{fmt.label}</p>
								<FormatDropdown
									categories={fmt.cats}
									from={fmt.from}
									bind:selected={settings.defaultFormat[fmt.key]}
									disabled={!settings.useDefaultFormat}
								/>
							</div>
						{/each}
					</div>
				</div>

				<!-- Metadata -->
				<div class="flex flex-col gap-3">
					<div class="flex flex-col gap-1">
						<p class="text-sm font-semibold text-fg">{m["settings.conversion.metadata"]()}</p>
						<p class="text-xs text-muted">{m["settings.conversion.metadata_description"]()}</p>
					</div>
					<div class="flex gap-2 w-full">
						<button
							onclick={() => (settings.metadata = true)}
							class="btn {$effects ? '' : '!scale-100'} {settings.metadata ? 'selected' : ''} flex-1 py-3 rounded-lg text-fg flex items-center justify-center text-sm font-medium"
						>
							{m["settings.conversion.keep"]()}
						</button>
						<button
							onclick={() => (settings.metadata = false)}
							class="btn {$effects ? '' : '!scale-100'} {settings.metadata ? '' : 'selected'} flex-1 py-3 rounded-lg text-fg flex items-center justify-center text-sm font-medium"
						>
							{m["settings.conversion.remove"]()}
						</button>
					</div>
				</div>

				<!-- Quality -->
				<div class="flex flex-col gap-3">
					<div class="flex flex-col gap-1">
						<p class="text-sm font-semibold text-fg">{m["settings.conversion.quality"]()}</p>
						<p class="text-xs text-muted">{m["settings.conversion.quality_description"]()}</p>
					</div>
					<div class="grid grid-cols-2 gap-3">
						<div class="flex flex-col gap-1">
							<p class="text-xs font-semibold text-muted">{m["settings.conversion.quality_images"]()}</p>
							<FancyInput
								bind:value={settings.magickQuality as unknown as string}
								type="number"
								min={1}
								max={100}
								placeholder={"100"}
								extension={"%"}
							/>
						</div>
						<div class="flex flex-col gap-1">
							<p class="text-xs font-semibold text-muted">{m["settings.conversion.quality_audio"]()}</p>
							<Dropdown
								options={CONVERSION_BITRATES.map((b) => b.toString())}
								selected={settings.ffmpegQuality.toString()}
								onselect={(option: string) => (settings.ffmpegQuality = option as ConversionBitrate)}
								settingsStyle
							/>
						</div>
					</div>
					<div class="grid grid-cols-2 gap-3">
						<div class="flex flex-col gap-1">
							<p class="text-xs font-semibold text-muted">{m["settings.conversion.rate"]()}</p>
							<Dropdown
								options={SAMPLE_RATES.map((r) => r.toString())}
								selected={settings.ffmpegSampleRate.toString()}
								onselect={(option: string) => { settings.ffmpegSampleRate = option as SampleRate; }}
								settingsStyle
							/>
						</div>
						{#if settings.ffmpegSampleRate === "custom"}
							<div class="flex flex-col gap-1">
								<p class="text-xs font-semibold text-muted">&nbsp;</p>
								<FancyInput
									bind:value={settings.ffmpegCustomSampleRate as unknown as string}
									type="number"
									min={1}
									placeholder={"44100"}
									extension={"Hz"}
								/>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</Panel>
