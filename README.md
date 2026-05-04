# VERT - Universal File Converter

A fast, lightweight, privacy-focused universal file converter that supports audio, video, images, and documents. Convert files instantly in your browser with zero-delay processing.

> **Note:** Previously named `work-pdf-converter`, now called `work-converter` (VERT)

## ✨ Features

- **🚀 Fast**: Lightning-fast conversions powered by WebAssembly (WASM)
- **🔒 Privacy-First**: All non-video files are converted completely on-device. Your files never leave your browser
- **📱 Browser-Based**: No software installation required. Works on any modern browser
- **🎨 Beautiful UI**: Clean, modern interface with zero ads
- **🌍 Multilingual**: Support for 15+ languages
- **⚙️ Customizable**: Configure default formats, conversion settings, and more in Settings
- **📊 Open Source**: Fully transparent and community-driven

## 📦 Supported Formats

### Audio Formats (30+)
MP3, WAV, FLAC, OGG, OPUS, AAC, ALAC, M4A, M4B, WMA, AMR, AC3, AIFF, AU, WEBA, MP2, and more

### Video Formats (20+)
MP4, MKV, WebM, AVI, MOV, TS, WMV, MPG, MPEG, FLV, 3GP, OGV, and more

### Image Formats (60+)
PNG, JPEG, WebP, GIF, SVG, JXOL, AVIF, ICO, BMP, TIFF, PSD, and camera raw formats (Canon, Nikon, Sony, etc.)

### Document Formats
PDF, DOCX, ODT, HTML, EPUB, Markdown, LaTeX, and more via Pandoc

## 🏗️ How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    VERT Architecture                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Client-Side (WASM - 95% of conversions)                    │
│  ├─ FFmpeg: Audio & Video                                   │
│  ├─ ImageMagick: Images                                     │
│  └─ Pandoc: Documents                                       │
│                                                               │
│  Optional Server (Vertd - Video only)                       │
│  └─ RTX 4000 Ada GPU for large video files                 │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Processing Flow

1. **Upload File**: Drag and drop or select file from your device
2. **Auto-Detection**: Format is automatically detected
3. **Select Output**: Choose target format from dropdown
4. **Convert**: Conversion happens instantly in your browser (no server upload)
5. **Download**: Get your converted file immediately

### Video Conversion Flow

For videos, files are:
- Uploaded to Vertd GPU server (optional)
- Kept for 1 hour or until download
- Automatically deleted after conversion or timeout
- Never stored permanently

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18+ (or Bun)
- **npm** or **bun** package manager
- Modern web browser with WebAssembly support

### Installation

```bash
# Clone the repository
git clone https://github.com/work-suvash/work-converter.git
cd work-converter

# Install dependencies
npm install
# or
bun install
```

### Running Locally

```bash
# Development mode
npm run dev
# or
bun dev
```

Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
# Build the project
npm run build
# or
bun run build
```

The built files will be in the `build/` folder. Serve with any web server:

```bash
# Using Node.js http-server
npx http-server build/

# Using Python
python -m http.server --directory build 8000

# Using nginx (see nginx/default.conf for config)
```

### Environment Variables

Create a `.env` file in the project root (see `.env.example`):

```env
# Enable/disable external requests
PUB_DISABLE_ALL_EXTERNAL_REQUESTS=false

# Vertd server URL for video conversion (optional)
PUBLIC_VERTD_URL=https://vertd-api.example.com
```

### Using Docker

```bash
# Build Docker image
docker build -t vert-converter .

# Run container
docker run -p 3000:80 vert-converter
```

See [Docker Documentation](./docs/DOCKER.md) for more details.

## 📖 Usage Examples

### Web Interface

1. Navigate to https://vert.sh (or your local instance)
2. Click the upload area or drag files
3. Select output format
4. Click "Convert"
5. Download the result

### Advanced Settings

Visit the **Settings** page to:
- Set default output formats per file type
- Configure conversion quality
- Enable/disable analytics
- Toggle Vertd video conversion
- Choose language

## 🔧 Configuration

### Default Formats

In Settings, you can set default output formats:
- **Images** → PNG, WebP, JPEG, etc.
- **Audio** → MP3, WAV, FLAC, etc.
- **Video** → MP4, WebM, etc.
- **Documents** → PDF, DOCX, etc.

### Disable External Requests

For maximum privacy, disable all external requests during build:

```bash
PUB_DISABLE_ALL_EXTERNAL_REQUESTS=true npm run build
```

This will:
- Disable video conversion (Vertd)
- Disable analytics (Plausible)
- Only allow FFmpeg.js CDN downloads
- Run 100% locally

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 15+
- Opera 76+

## 🛠️ Tech Stack

- **Framework**: SvelteKit 2
- **Styling**: TailwindCSS
- **Build Tool**: Vite
- **Converters**:
  - [FFmpeg.js](https://github.com/ffmpegwasm/ffmpeg.wasm) - Audio/Video
  - [ImageMagick WASM](https://github.com/KnicKnic/WASM-ImageMagick) - Images
  - [Pandoc WASM](https://github.com/jgm/pandoc) - Documents
- **i18n**: Paraglide
- **Analytics**: Plausible (privacy-focused)

## 🔐 Privacy

- **On-Device Processing**: Non-video files never leave your browser
- **No Tracking**: Using privacy-focused analytics by Plausible
- **No Personal Data**: We don't collect or store any personal information
- **Open Source**: All code is publicly available for audit
- **Optional Opt-Out**: Disable analytics in Settings

## 📚 Documentation

- [Getting Started](./docs/GETTING_STARTED.md)
- [Video Conversion Setup](./docs/VIDEO_CONVERSION.md)
- [Docker Deployment](./docs/DOCKER.md)
- [FAQ](./docs/FAQ.md)

## 🤝 Contributing

Contributions are welcome! Please check our issues and submit pull requests.

## 📄 License

See [LICENSE](./LICENSE) file for details.

## 🙏 Credits

VERT stands on the shoulders of giants:
- [FFmpeg](https://ffmpeg.org/) - Audio/Video encoding
- [ImageMagick](https://imagemagick.org/) - Image processing
- [Pandoc](https://pandoc.org/) - Document conversion

## 📞 Support

- 📖 [FAQ](./docs/FAQ.md)
- 🐛 [Issue Tracker](https://github.com/work-suvash/work-converter/issues)
- 💬 Discussions
