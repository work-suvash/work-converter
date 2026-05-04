<script lang="ts">
        import ConversionPanel from "$lib/components/functional/ConversionPanel.svelte";
        import FormatDropdown from "$lib/components/functional/FormatDropdown.svelte";
        import Uploader from "$lib/components/functional/Uploader.svelte";
        import Panel from "$lib/components/visual/Panel.svelte";
        import ProgressBar from "$lib/components/visual/ProgressBar.svelte";
        import Tooltip from "$lib/components/visual/Tooltip.svelte";
        import { categories, converters } from "$lib/converters";
        import {
                effects,
                files,
                gradientColor,
                showGradient,
                vertdLoaded,
                dropdownStates,
        } from "$lib/store/index.svelte";
        import { VertFile } from "$lib/types";
        import {
                AlertTriangleIcon,
                AudioLines,
                BookText,
                CheckCircle2Icon,
                DownloadIcon,
                FileMusicIcon,
                FileQuestionIcon,
                FileVideo2,
                FilmIcon,
                ImageIcon,
                ImageOffIcon,
                RotateCwIcon,
                XIcon,
        } from "lucide-svelte";
        import { m } from "$lib/paraglide/messages";
        import { Settings } from "$lib/sections/settings/index.svelte";
        import { MAX_ARRAY_BUFFER_SIZE } from "$lib/store/index.svelte";
        import { GB } from "$lib/util/consts";
        import { log } from "$lib/util/logger";
        import { inview } from "$lib/actions/inview";

        let processedFileIds = $state(new Set<string>());

        $effect(() => {
                if (!Settings.instance.settings || files.files.length === 0) return;

                files.files.forEach((file) => {
                        const settings = Settings.instance.settings;
                        if (processedFileIds.has(file.id)) return;

                        const converter = file.findConverter();
                        if (!converter) return;

                        let category: string | undefined;
                        const isImage = converter.name === "imagemagick";
                        const isAudio = converter.name === "ffmpeg";
                        const isVideo = converter.name === "vertd";
                        const isDocument = converter.name === "pandoc";

                        if (isImage) category = "image";
                        else if (isAudio) category = "audio";
                        else if (isVideo) category = "video";
                        else if (isDocument) category = "doc";
                        if (!category) return;

                        let targetFormat: string | undefined;

                        const savedFormat = $dropdownStates[file.name];
                        if (
                                savedFormat &&
                                savedFormat !== file.from &&
                                categories[category]?.formats.includes(savedFormat)
                        ) {
                                targetFormat = savedFormat;
                        } else if (settings.useDefaultFormat) {
                                let defaultFormat: string | undefined;
                                const df = settings.defaultFormat;
                                if (category === "image") defaultFormat = df.image;
                                else if (category === "audio") defaultFormat = df.audio;
                                else if (category === "video") defaultFormat = df.video;
                                else if (category === "doc") defaultFormat = df.document;

                                if (
                                        defaultFormat &&
                                        defaultFormat !== file.from &&
                                        categories[category]?.formats.includes(defaultFormat)
                                ) {
                                        targetFormat = defaultFormat;
                                }
                        }

                        if (!targetFormat) {
                                const firstDiff = categories[category]?.formats.find(
                                        (f) => f !== file.from,
                                );
                                targetFormat = firstDiff || categories[category]?.formats[0] || "";
                        }

                        file.to = targetFormat;
                        processedFileIds.add(file.id);
                });
        });

        const handleSelect = (option: string, file: VertFile) => {
                file.result = null;
        };

        $effect(() => {
                let type = "";
                if (files.files.length) {
                        const converterNames = files.files.map(
                                (file) => file.findConverter()?.name,
                        );
                        const uniqueTypes = new Set(converterNames);

                        if (uniqueTypes.size === 1) {
                                const onlyType = converterNames[0];
                                if (onlyType === "imagemagick") type = "blue";
                                else if (onlyType === "ffmpeg") type = "purple";
                                else if (onlyType === "vertd") type = "red";
                                else if (onlyType === "pandoc") type = "green";
                        }
                }

                if (files.files.length === 0 || !type) {
                        showGradient.set(false);
                } else showGradient.set(true);

                gradientColor.set(type);
        });

        function formatSize(bytes: number): string {
                if (bytes < 1024) return `${bytes} B`;
                if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
                return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
        }

        function getFileError(file: VertFile): string | null {
                const currentConverter = file.findConverter();
                if (!currentConverter) {
                        if (file.name.startsWith("vertd")) return m["convert.errors.vertd_server"]();
                        return m["convert.errors.unsupported_format"]();
                }
                const formatInfo = currentConverter.supportedFormats.find(
                        (f) => f.name === file.from,
                );
                if (formatInfo && !formatInfo.fromSupported) return m["convert.errors.format_output_only"]();
                if (file.isLarge() && !file.supportsStreaming()) {
                        return m["workers.errors.file_too_large"]({
                                limit: (MAX_ARRAY_BUFFER_SIZE / GB).toFixed(2),
                        });
                }
                if (currentConverter.status === "downloading")
                        return m["convert.errors.worker_downloading"]({ type: "worker" });
                if (currentConverter.status === "error")
                        return m["convert.errors.worker_error"]({ type: "worker" });
                if (currentConverter.status === "not-ready")
                        return m["convert.errors.worker_timeout"]({ type: "worker" });
                const isVideo = currentConverter.name === "vertd";
                const isAudio = currentConverter.name === "ffmpeg";
                const isImage = currentConverter.name === "imagemagick";
                const isDocument = currentConverter.name === "pandoc";
                if (isVideo && !$vertdLoaded && !isAudio && !isImage && !isDocument)
                        return m["convert.errors.vertd_not_found"]();
                return null;
        }
</script>

{#snippet fileItem(file: VertFile, index: number)}
        {@const currentConverter = file.findConverter()}
        {@const isImage = currentConverter?.name === "imagemagick"}
        {@const isAudio = currentConverter?.name === "ffmpeg"}
        {@const isVideo = currentConverter?.name === "vertd"}
        {@const isDocument = currentConverter?.name === "pandoc"}
        {@const fileError = getFileError(file)}
        {@const isDone = !!file.result && !file.processing}
        {@const isProcessing = file.processing}

        <Panel class="p-4 flex flex-col gap-3 h-full">
                <!-- Top row: thumbnail + info + status indicator -->
                <div class="flex items-start gap-3">
                        <!-- Thumbnail / type icon -->
                        <div
                                class="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center"
                                style="background: var({isAudio
                                        ? '--bg-gradient-purple-alt'
                                        : isVideo
                                                ? '--bg-gradient-red-alt'
                                                : isDocument
                                                        ? '--bg-gradient-green-alt'
                                                        : '--bg-gradient-blue-alt'})"
                        >
                                {#if file.blobUrl}
                                        <img
                                                class="object-cover w-full h-full"
                                                src={file.blobUrl}
                                                alt={file.name}
                                        />
                                {:else if !currentConverter}
                                        <FileQuestionIcon size="20" class="opacity-70" />
                                {:else if isAudio}
                                        <FileMusicIcon size="20" class="opacity-70" />
                                {:else if isVideo}
                                        <FileVideo2 size="20" class="opacity-70" />
                                {:else if isDocument}
                                        <BookText size="20" class="opacity-70" />
                                {:else}
                                        <ImageOffIcon size="20" class="opacity-70" />
                                {/if}
                        </div>

                        <!-- File info -->
                        <div class="flex-1 min-w-0">
                                {#if isProcessing}
                                        <p
                                                class="text-sm font-semibold truncate {fileError ? 'text-failure' : 'text-fg'}"
                                                title={file.name}
                                        >
                                                {file.name}
                                        </p>
                                        <ProgressBar
                                                min={0}
                                                max={100}
                                                progress={currentConverter?.reportsProgress || file.isZip()
                                                        ? file.progress
                                                        : null}
                                        />
                                {:else}
                                        <p
                                                class="text-sm font-semibold truncate {fileError ? 'text-failure' : 'text-fg'}"
                                                title={file.name}
                                        >
                                                {file.name}
                                        </p>
                                        <p class="text-xs text-muted mt-0.5">
                                                {formatSize(file.file.size)} • {file.from.replace(".", "").toUpperCase()}
                                        </p>
                                {/if}
                        </div>

                        <!-- Status dot / icon -->
                        <div class="flex items-center gap-1 flex-shrink-0 mt-0.5">
                                {#if fileError}
                                        <div class="w-2.5 h-2.5 rounded-full bg-failure"></div>
                                {:else if isProcessing}
                                        <div class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></div>
                                {:else if isDone}
                                        <CheckCircle2Icon size="16" class="text-green-500" />
                                {:else}
                                        <div class="w-2.5 h-2.5 rounded-full bg-separator border border-fg/10"></div>
                                {/if}
                                <!-- Delete button -->
                                <button
                                        class="w-7 h-7 rounded-lg hover:bg-panel-highlight flex items-center justify-center transition-colors ml-1"
                                        onclick={async () => {
                                                await file.cancel();
                                                files.files = files.files.filter((_, i) => i !== index);
                                        }}
                                        aria-label="Remove file"
                                >
                                        <XIcon size="14" class="text-muted" />
                                </button>
                        </div>
                </div>

                <!-- Body: error / success / idle -->
                {#if fileError}
                        <div class="flex items-start gap-2 py-1">
                                <AlertTriangleIcon size="14" class="text-failure flex-shrink-0 mt-0.5" />
                                <div>
                                        <p class="text-xs font-semibold text-failure">{m["convert.errors.cant_convert"]()}</p>
                                        <p class="text-xs text-failure/70 mt-0.5">{fileError}</p>
                                </div>
                        </div>
                {:else if isDone}
                        <div class="flex items-center gap-1.5">
                                <CheckCircle2Icon size="13" class="text-green-500 flex-shrink-0" />
                                <p class="text-xs font-semibold text-green-600 dynadark:text-green-400">
                                        Converted to {file.to.replace(".", "").toUpperCase()}
                                </p>
                        </div>
                {/if}

                <!-- Action row at bottom -->
                <div class="mt-auto flex items-center gap-2 pt-2 border-t border-separator">
                        {#if fileError}
                                <button
                                        class="btn {$effects ? '' : '!scale-100'} text-accent-alt border border-accent/30 bg-accent/5 flex gap-1.5 text-xs py-2 flex-1"
                                        onclick={() => file.convert()}
                                        disabled={!files.ready}
                                >
                                        <RotateCwIcon size="13" />
                                        Retry conversion
                                </button>
                        {:else if isDone}
                                <div class="flex-1"></div>
                                <Tooltip text={m["convert.tooltips.download_file"]()} position="top">
                                        <button
                                                class="btn {$effects ? '' : '!scale-100'} p-2.5"
                                                onclick={file.download}
                                                disabled={!file.result}
                                        >
                                                <DownloadIcon size="15" />
                                        </button>
                                </Tooltip>
                        {:else}
                                <div class="flex-1 min-w-0">
                                        <FormatDropdown
                                                {categories}
                                                from={file.from}
                                                bind:selected={file.to}
                                                onselect={(option) => handleSelect(option, file)}
                                                {file}
                                                dropdownSize="small"
                                        />
                                </div>
                                <Tooltip text={m["convert.tooltips.convert_file"]()} position="top">
                                        <button
                                                class="btn {$effects ? '' : '!scale-100'} p-2.5 {isAudio
                                                        ? 'bg-accent-purple text-black'
                                                        : isVideo
                                                                ? 'bg-accent-red text-black'
                                                                : isDocument
                                                                        ? 'bg-accent-green text-black'
                                                                        : 'bg-accent-blue text-black'} {isProcessing ? 'animate-spin' : ''}"
                                                disabled={!files.ready}
                                                onclick={() => file.convert()}
                                        >
                                                <RotateCwIcon size="15" />
                                        </button>
                                </Tooltip>
                                <Tooltip text={m["convert.tooltips.download_file"]()} position="top">
                                        <button
                                                class="btn {$effects ? '' : '!scale-100'} p-2.5"
                                                onclick={file.download}
                                                disabled={!file.result}
                                        >
                                                <DownloadIcon size="15" />
                                        </button>
                                </Tooltip>
                        {/if}
                </div>
        </Panel>
{/snippet}

<div class="flex flex-col justify-center items-center gap-5 -mt-4 px-4 md:p-0 pb-8">
        <div use:inview class="max-w-[960px] w-full">
                <ConversionPanel />
        </div>

        <div
                class="w-full max-w-[960px] grid grid-cols-1 md:grid-cols-3 auto-rows-[200px] gap-4 md:p-0"
        >
                {#each files.files as file, i (file.id)}
                        {#if files.files.length >= 2 && i === 1}
                                <Uploader
                                        class="w-full h-full col-start-1 row-start-1 md:col-start-3 md:row-start-1"
                                />
                        {/if}
                        <div use:inview={{ delay: i * 45 }} class="h-full">
                                {@render fileItem(file, i)}
                        </div>
                        {#if files.files.length < 2}
                                <Uploader class="w-full h-full" />
                        {/if}
                {/each}
                {#if files.files.length === 0}
                        <Uploader class="w-full h-full col-span-3" />
                {/if}
        </div>
</div>
