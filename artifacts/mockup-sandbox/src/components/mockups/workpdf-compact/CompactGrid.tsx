import { 
  Upload, Image as ImageIcon, Music, Video, FileText, 
  Download, Trash2, CheckCircle2, Loader2, 
  ChevronRight, Search, Moon, Grid3x3, Settings, Home, Clock, RefreshCw, File
} from 'lucide-react';

const MOCK_FILES = [
  { id: '1', name: 'presentation.pdf', size: '2.4 MB', source: 'PDF', target: 'DOCX', status: 'done', type: 'document', progress: 100 },
  { id: '2', name: 'vacation-photo.jpg', size: '4.1 MB', source: 'JPG', target: 'PNG', status: 'done', type: 'image', progress: 100 },
  { id: '3', name: 'podcast-intro.mp3', size: '8.2 MB', source: 'MP3', target: 'WAV', status: 'converting', type: 'audio', progress: 62 },
  { id: '4', name: 'report.docx', size: '1.1 MB', source: 'DOCX', target: 'PDF', status: 'queued', type: 'document', progress: 0 },
  { id: '5', name: 'promo-video.mp4', size: '124.5 MB', source: 'MP4', target: 'WEBM', status: 'error', type: 'video', progress: 12 },
  { id: '6', name: 'spreadsheet.xlsx', size: '3.8 MB', source: 'XLSX', target: 'CSV', status: 'uploading', type: 'document', progress: 34 },
];

const FILTERS = [
  { label: 'Image', icon: ImageIcon, color: '#3b82f6' },
  { label: 'PDF', icon: File, color: '#ef4444' },
  { label: 'Video', icon: Video, color: '#8b5cf6' },
  { label: 'Audio', icon: Music, color: '#f59e0b' },
  { label: 'Document', icon: FileText, color: '#10b981' },
];

function FileIcon({ type }: { type: string }) {
  if (type === 'image') return <ImageIcon style={{ width: 20, height: 20, color: '#3b82f6' }} />;
  if (type === 'audio') return <Music style={{ width: 20, height: 20, color: '#f59e0b' }} />;
  if (type === 'video') return <Video style={{ width: 20, height: 20, color: '#8b5cf6' }} />;
  return <FileText style={{ width: 20, height: 20, color: '#10b981' }} />;
}

const S = {
  accent: 'hsl(239,84%,67%)',
  accentDark: 'hsl(239,84%,56%)',
  bg: 'hsl(220,33%,97%)',
  panel: '#ffffff',
  panelHl: 'hsl(220,18%,92%)',
  border: 'hsla(220,20%,10%,0.08)',
  text: 'hsl(224,28%,10%)',
  muted: 'hsla(224,20%,10%,0.48)',
};

export function CompactGrid() {
  return (
    <div style={{ display: 'flex', fontFamily: 'Inter, system-ui, sans-serif', background: S.bg, color: S.text, minHeight: '100vh', width: '100%' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Sidebar */}
      <aside style={{ width: 200, flexShrink: 0, background: S.panel, borderRight: `1px solid ${S.border}`, display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: 56, display: 'flex', alignItems: 'center', padding: '0 16px', fontWeight: 700, fontSize: 17, letterSpacing: '-0.3px', gap: 8 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: S.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <File style={{ width: 14, height: 14, color: '#fff' }} />
          </div>
          Work-Converter
        </div>

        <nav style={{ flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[
            { label: 'Convert', icon: Grid3x3, active: true },
            { label: 'Home', icon: Home },
            { label: 'History', icon: Clock },
            { label: 'Settings', icon: Settings },
          ].map(({ label, icon: Icon, active }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 12, fontSize: 13, fontWeight: 500, cursor: 'pointer', background: active ? S.panelHl : 'transparent', color: active ? S.accentDark : S.muted }}>
              <Icon style={{ width: 15, height: 15 }} />
              {label}
            </div>
          ))}

          <div style={{ marginTop: 20, marginBottom: 8, padding: '0 12px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: S.muted }}>
            Formats
          </div>
          {FILTERS.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer', color: S.muted }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <f.icon style={{ width: 13, height: 13 }} /> {f.label}
              </span>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: f.color, flexShrink: 0 }} />
            </div>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <header style={{ height: 56, flexShrink: 0, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${S.border}`, background: S.panel }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500 }}>
            <span style={{ color: S.muted }}>Home</span>
            <ChevronRight style={{ width: 14, height: 14, opacity: 0.4 }} />
            <span>Convert Files</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <Search style={{ width: 14, height: 14, position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: S.muted }} />
              <input readOnly placeholder="Search files..." style={{ paddingLeft: 32, paddingRight: 14, paddingTop: 6, paddingBottom: 6, fontSize: 13, borderRadius: 12, border: `1px solid ${S.border}`, background: S.bg, outline: 'none', width: 220, color: S.text }} />
            </div>
            <div style={{ padding: 6, borderRadius: 10, cursor: 'pointer' }}>
              <Moon style={{ width: 15, height: 15, color: S.muted }} />
            </div>
          </div>
        </header>

        {/* Content */}
        <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 8 }}>
            {MOCK_FILES.map((file) => (
              <div key={file.id} style={{ position: 'relative', display: 'flex', alignItems: 'center', padding: 10, borderRadius: 14, background: S.panel, border: `1px solid ${S.border}`, boxShadow: '0 1px 4px hsla(220,40%,20%,0.05)', cursor: 'pointer', overflow: 'hidden' }}>
                {(file.status === 'converting' || file.status === 'uploading') && (
                  <div style={{ position: 'absolute', bottom: 0, left: 0, height: 2, background: S.accent, width: `${file.progress}%` }} />
                )}
                <div style={{ width: 44, height: 44, flexShrink: 0, borderRadius: 12, background: S.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                  <FileIcon type={file.type} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 4 }}>{file.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                    <span style={{ fontFamily: 'monospace', background: S.panelHl, padding: '1px 5px', borderRadius: 4 }}>{file.source}</span>
                    <ChevronRight style={{ width: 10, height: 10, opacity: 0.35 }} />
                    <span style={{ fontFamily: 'monospace', background: 'hsla(239,84%,67%,0.1)', color: S.accentDark, padding: '1px 5px', borderRadius: 4 }}>{file.target}</span>
                    <span style={{ color: S.muted, marginLeft: 'auto' }}>{file.size}</span>
                  </div>
                </div>
                <div style={{ width: 76, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                  {file.status === 'done' && <>
                    <div style={{ padding: 6, borderRadius: 8, cursor: 'pointer', color: '#16a34a' }}><Download style={{ width: 14, height: 14 }} /></div>
                    <CheckCircle2 style={{ width: 15, height: 15, color: '#22c55e' }} />
                  </>}
                  {(file.status === 'converting' || file.status === 'uploading') && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600, color: S.accentDark, background: 'hsla(239,84%,67%,0.08)' }}>
                      <Loader2 style={{ width: 10, height: 10, animation: 'spin 1s linear infinite' }} />
                      {file.progress}%
                    </div>
                  )}
                  {file.status === 'queued' && <span style={{ fontSize: 10, fontWeight: 500, padding: '3px 8px', borderRadius: 20, background: S.panelHl, color: S.muted }}>Queued</span>}
                  {file.status === 'error' && <div style={{ padding: 6, borderRadius: 8, cursor: 'pointer', color: '#ef4444' }}><RefreshCw style={{ width: 13, height: 13 }} /></div>}
                  <div style={{ padding: 6, borderRadius: 8, cursor: 'pointer', color: '#f87171' }}><Trash2 style={{ width: 13, height: 13 }} /></div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ border: `1.5px dashed ${S.border}`, borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', background: S.panel }}>
            <Upload style={{ width: 20, height: 20, color: S.muted, opacity: 0.5 }} />
            <p style={{ fontSize: 13, fontWeight: 500, color: S.muted, margin: 0 }}>Drop files here or click to browse</p>
          </div>
        </div>

        {/* Bottom bar */}
        <footer style={{ height: 64, flexShrink: 0, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${S.border}`, background: S.panel, boxShadow: '0 -2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: S.muted }}>
            <span style={{ color: S.text }}>6 files</span> selected · 140.1 MB total
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ padding: '8px 18px', borderRadius: 12, fontSize: 13, fontWeight: 600, border: `1px solid ${S.border}`, background: S.panel, cursor: 'pointer', color: S.text }}>
              Download All
            </div>
            <div style={{ padding: '8px 20px', borderRadius: 24, fontSize: 13, fontWeight: 600, color: '#fff', border: 'none', cursor: 'pointer', background: S.accent, display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 2px 8px hsla(239,84%,67%,0.3)' }}>
              <Grid3x3 style={{ width: 14, height: 14 }} />
              Convert All
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default CompactGrid;
