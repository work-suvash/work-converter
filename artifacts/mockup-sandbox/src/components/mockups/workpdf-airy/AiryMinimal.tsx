import React, { useState } from 'react';
import './_group.css';
import { 
  Cloud, Search, Moon, ChevronDown, ArrowRight,
  FileImage, FileAudio, FileVideo, FileText, Download, Trash2, CheckCircle2, AlertCircle, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AiryMinimal() {
  const [files] = useState([
    { name: 'travel-photos.zip', size: '14.2 MB', icon: FileImage, from: 'ZIP', to: 'JPG', status: 'done', progress: 100 },
    { name: 'keynote-slides.pdf', size: '2.4 MB', icon: FileText, from: 'PDF', to: 'PPTX', status: 'converting', progress: 72 },
    { name: 'podcast-episode.mp3', size: '48.1 MB', icon: FileAudio, from: 'MP3', to: 'WAV', status: 'queued', progress: 0 },
    { name: 'financial-model.xlsx', size: '1.1 MB', icon: FileText, from: 'XLSX', to: 'CSV', status: 'done', progress: 100 },
    { name: 'promo-clip.mp4', size: '124.5 MB', icon: FileVideo, from: 'MP4', to: 'GIF', status: 'error', progress: 0 },
  ]);

  const [hoveredFile, setHoveredFile] = useState<number | null>(null);

  return (
    <div 
      className="min-h-screen font-['Inter'] flex flex-col items-center" 
      style={{ backgroundColor: 'hsl(220, 33%, 97%)', color: 'hsl(224, 28%, 10%)' }}
    >
      {/* Top Navbar */}
      <nav className="w-full max-w-[800px] flex items-center justify-between py-6 px-8">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(239, 84%, 67%)' }} />
          <span className="font-bold text-lg tracking-tight">work-converter</span>
        </div>
        
        <div className="flex items-center gap-6 text-sm font-medium" style={{ color: 'hsla(224, 20%, 10%, 0.48)' }}>
          <a href="#" className="hover:text-[hsl(224,28%,10%)] transition-colors">Convert</a>
          <a href="#" className="hover:text-[hsl(224,28%,10%)] transition-colors">Formats</a>
          <a href="#" className="hover:text-[hsl(224,28%,10%)] transition-colors">About</a>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-[hsla(220,20%,10%,0.04)] transition-colors" style={{ color: 'hsla(224, 20%, 10%, 0.48)' }}>
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-[hsla(220,20%,10%,0.04)] transition-colors" style={{ color: 'hsla(224, 20%, 10%, 0.48)' }}>
            <Moon className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="w-full max-w-[800px] flex-1 flex flex-col items-center px-8 pb-20">
        
        {/* Hero */}
        <div className="mt-12 mb-10 text-center">
          <h1 className="text-[36px] font-bold tracking-tight mb-3">Convert any file, instantly.</h1>
          <p className="text-lg" style={{ color: 'hsla(224, 20%, 10%, 0.48)' }}>
            Drag and drop files below — we'll handle the rest.
          </p>
        </div>

        {/* Drop Zone */}
        <div className="w-full h-[220px] airy-dropzone flex flex-col items-center justify-center cursor-pointer mb-8 relative group">
          <div className="p-4 rounded-full mb-3" style={{ backgroundColor: 'hsl(0, 0%, 100%)', boxShadow: '0 2px 8px hsla(239,84%,67%,0.15)' }}>
            <Cloud className="w-8 h-8" style={{ color: 'hsl(239, 84%, 67%)' }} />
          </div>
          <span className="font-medium text-base" style={{ color: 'hsl(239, 84%, 67%)' }}>Click or drag files here</span>
        </div>

        {/* Format Selector Row */}
        <div className="flex items-center gap-4 mb-12 bg-white rounded-full py-2 px-4 shadow-sm" style={{ border: '1px solid hsla(220, 20%, 10%, 0.08)' }}>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-[hsl(220,33%,97%)] transition-colors font-medium text-sm">
            <span>Any format</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>
          <ArrowRight className="w-5 h-5 text-muted-foreground opacity-50" />
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-[hsl(220,33%,97%)] transition-colors font-medium text-sm">
            <span>PDF</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="w-px h-6 bg-[hsla(220,20%,10%,0.08)] mx-2" />
          <div className="flex items-center gap-1 p-1 rounded-full bg-[hsl(220,33%,97%)] text-xs font-medium">
            <button className="px-3 py-1 rounded-full text-muted-foreground hover:text-primary transition-colors">Low</button>
            <button className="px-3 py-1 rounded-full bg-white shadow-sm text-primary">Med</button>
            <button className="px-3 py-1 rounded-full text-muted-foreground hover:text-primary transition-colors">High</button>
          </div>
        </div>

        {/* File List */}
        <div className="w-full flex flex-col gap-4 mb-10">
          {files.map((file, i) => (
            <div 
              key={i} 
              className="airy-card flex items-center p-4 transition-colors"
              onMouseEnter={() => setHoveredFile(i)}
              onMouseLeave={() => setHoveredFile(null)}
              style={{
                backgroundColor: hoveredFile === i ? 'hsl(220, 33%, 97%)' : 'hsl(0, 0%, 100%)'
              }}
            >
              <div className="p-3 rounded-xl mr-4" style={{ backgroundColor: 'hsla(239, 84%, 67%, 0.1)', color: 'hsl(239, 84%, 67%)' }}>
                <file.icon className="w-6 h-6" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-[15px] truncate">{file.name}</div>
                <div className="text-sm" style={{ color: 'hsla(224, 20%, 10%, 0.48)' }}>{file.size}</div>
              </div>

              <div className="hidden sm:flex items-center gap-2 mx-6 px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'hsl(220, 33%, 97%)' }}>
                <span style={{ color: 'hsla(224, 20%, 10%, 0.48)' }}>{file.from}</span>
                <ArrowRight className="w-3 h-3 opacity-40" />
                <span>{file.to}</span>
              </div>

              <div className="w-32 mr-6">
                {file.status === 'done' && (
                  <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" /> Done
                  </div>
                )}
                {file.status === 'error' && (
                  <div className="flex items-center gap-1.5 text-sm font-medium text-red-500">
                    <AlertCircle className="w-4 h-4" /> Error
                  </div>
                )}
                {file.status === 'queued' && (
                  <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color: 'hsla(224, 20%, 10%, 0.48)' }}>
                    Queued
                  </div>
                )}
                {file.status === 'converting' && (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs font-medium" style={{ color: 'hsl(239, 84%, 67%)' }}>
                      <span className="flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Converting</span>
                      <span>{file.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[hsla(239,84%,67%,0.15)] overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-300" style={{ width: `${file.progress}%`, backgroundColor: 'hsl(239, 84%, 67%)' }} />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {file.status === 'done' ? (
                  <button className="p-2.5 rounded-xl hover:bg-black/5 transition-colors" style={{ color: 'hsl(239, 84%, 67%)' }}>
                    <Download className="w-5 h-5" />
                  </button>
                ) : (
                  <button className="p-2.5 rounded-xl hover:bg-black/5 transition-colors" style={{ color: 'hsla(224, 20%, 10%, 0.48)' }}>
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Area */}
        <div className="flex flex-col items-center gap-3 mt-4">
          <button 
            className="flex items-center justify-center gap-2 px-8 h-[52px] rounded-full text-white font-medium text-[15px] transition-all hover:-translate-y-0.5"
            style={{ 
              backgroundColor: 'hsl(239, 84%, 67%)',
              boxShadow: '0 4px 14px hsla(239,84%,67%,0.3)'
            }}
          >
            <span>Convert 5 files</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium" style={{ color: 'hsla(224, 20%, 10%, 0.48)' }}>
            or <a href="#" className="hover:underline text-[hsl(224,28%,10%)]">Download all (3 ready)</a>
          </span>
        </div>

      </main>

      {/* Footer Strip */}
      <footer className="w-full py-8 text-center text-xs font-medium" style={{ color: 'hsla(224, 20%, 10%, 0.48)' }}>
        work-converter — free, private, runs in your browser
      </footer>
    </div>
  );
}
