import {
  Upload, RefreshCw, Download, Trash2, CheckCircle2,
  AlertTriangle, ChevronDown, Film, FileText, Image as ImageIcon,
  Archive, Loader2
} from 'lucide-react';

const accent = '#4F46E5';
const accentLight = '#EEF2FF';
const bg = '#F9FAFB';
const panel = '#FFFFFF';
const border = '#E5E7EB';
const text = '#111827';
const muted = '#6B7280';
const dangerBg = '#FEF2F2';
const dangerBorder = '#FCA5A5';
const dangerText = '#DC2626';
const successText = '#059669';

type FileStatus = 'uploading' | 'converting' | 'done' | 'error' | 'ready';

interface MockFile {
  id: string;
  name: string;
  size: string;
  format: string;
  targetFormat: string;
  status: FileStatus;
  progress?: number;
  thumb?: string;
  error?: string;
}

const FILES: MockFile[] = [
  { id: '1', name: 'vacation_photo_01.png', size: '4.2 MB', format: 'PNG', targetFormat: '.JPG', status: 'converting', progress: 68, thumb: 'photo' },
  { id: '2', name: 'Project_Specs_V2.pdf', size: '1.8 MB', format: 'PDF', targetFormat: '.JPG', status: 'done' },
  { id: '3', name: 'Annual_Report_2023.docx', size: '12.4 MB', format: 'DOCX', targetFormat: '.PDF', status: 'ready' },
  { id: '4', name: 'product_hero_final.jpg', size: '8.1 MB', format: 'JPG', targetFormat: '.WEBP', status: 'ready', thumb: 'product' },
  { id: '5', name: 'corrupt_archive.zip', size: '—', format: 'ZIP', targetFormat: '.ZIP', status: 'error', error: 'Invalid Format' },
];

function FileIcon({ format }: { format: string }) {
  const s = { width: 28, height: 28 };
  if (['JPG', 'PNG', 'WEBP', 'GIF'].includes(format)) return <ImageIcon {...s} style={{ color: '#3B82F6' }} />;
  if (['MP4', 'WEBM', 'MOV'].includes(format)) return <Film {...s} style={{ color: '#8B5CF6' }} />;
  if (['ZIP', 'RAR'].includes(format)) return <Archive {...s} style={{ color: '#F59E0B' }} />;
  return <FileText {...s} style={{ color: '#6366F1' }} />;
}

function PhotoThumb({ type }: { type: string }) {
  const colors = type === 'photo'
    ? ['#93C5FD', '#BFDBFE', '#60A5FA']
    : ['#FCA5A5', '#FEE2E2', '#F87171'];
  return (
    <div style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {type === 'product'
        ? <div style={{ width: 24, height: 16, background: colors[2], borderRadius: 3 }} />
        : <div style={{ width: 22, height: 18, background: colors[2], borderRadius: 3, position: 'relative' }}>
            <div style={{ position: 'absolute', bottom: 4, left: 4, width: 6, height: 6, borderRadius: '50%', background: '#fff', opacity: 0.7 }} />
          </div>
      }
    </div>
  );
}

function FormatSelect({ value }: { value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 8, border: `1px solid ${border}`, fontSize: 13, fontWeight: 500, color: text, background: panel, cursor: 'pointer', userSelect: 'none' as const }}>
      to {value}
      <ChevronDown style={{ width: 13, height: 13, color: muted }} />
    </div>
  );
}

function StatusBadge({ file }: { file: MockFile }) {
  if (file.status === 'done') {
    return (
      <span style={{ fontSize: 13, fontWeight: 500, color: successText }}>
        Converted to {file.targetFormat}
      </span>
    );
  }
  if (file.status === 'converting') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Loader2 style={{ width: 13, height: 13, color: accent, animation: 'spin 1s linear infinite' }} />
        <span style={{ fontSize: 12, color: accent, fontWeight: 500 }}>Converting…</span>
      </div>
    );
  }
  return null;
}

function FileCard({ file }: { file: MockFile }) {
  const isError = file.status === 'error';
  return (
    <div style={{
      borderRadius: 12, border: `1.5px solid ${isError ? dangerBorder : border}`,
      background: isError ? dangerBg : panel,
      padding: '16px 16px 14px',
      display: 'flex', flexDirection: 'column', gap: 10,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Status dot */}
      <div style={{ position: 'absolute', top: 12, right: 12 }}>
        {file.status === 'done' && <CheckCircle2 style={{ width: 16, height: 16, color: '#10B981' }} />}
        {file.status === 'error' && <AlertTriangle style={{ width: 16, height: 16, color: dangerText }} />}
        {file.status === 'ready' && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#D1D5DB', marginTop: 4 }} />}
        {file.status === 'converting' && <div style={{ width: 8, height: 8, borderRadius: '50%', background: accent, marginTop: 4 }} />}
      </div>

      {/* File info row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, paddingRight: 20 }}>
        {file.thumb
          ? <PhotoThumb type={file.thumb} />
          : <div style={{ width: 44, height: 44, borderRadius: 8, background: accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FileIcon format={file.format} />
            </div>
        }
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: isError ? dangerText : text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180 }}>
            {file.name}
          </div>
          <div style={{ fontSize: 12, color: isError ? dangerText : muted, marginTop: 2 }}>
            {isError
              ? <span style={{ fontWeight: 600 }}>Failed · {file.error}</span>
              : `${file.size} · ${file.format}`
            }
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {file.status === 'converting' && (
        <div style={{ height: 3, borderRadius: 2, background: '#E5E7EB', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${file.progress}%`, background: accent, borderRadius: 2, transition: 'width 0.3s' }} />
        </div>
      )}

      {/* Bottom row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {file.status === 'error'
          ? <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: accent, cursor: 'pointer' }}>
              <RefreshCw style={{ width: 13, height: 13 }} /> Retry conversion
            </div>
          : file.status === 'done'
            ? <StatusBadge file={file} />
            : <FormatSelect value={file.targetFormat} />
        }
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {file.status === 'done' && (
            <div style={{ padding: 6, borderRadius: 7, cursor: 'pointer', color: muted }}>
              <Download style={{ width: 15, height: 15 }} />
            </div>
          )}
          <div style={{ padding: 6, borderRadius: 7, cursor: 'pointer', color: muted }}>
            <Trash2 style={{ width: 15, height: 15 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function DropZone() {
  return (
    <div style={{
      borderRadius: 12, border: `2px dashed #C7D2FE`,
      background: accentLight,
      padding: '24px 20px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 8, cursor: 'pointer', minHeight: 160,
    }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#E0E7FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Upload style={{ width: 20, height: 20, color: accent }} />
      </div>
      <div style={{ textAlign: 'center' as const }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: text }}>Drop or click to convert</div>
        <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>Max file size: 500MB</div>
      </div>
    </div>
  );
}

export function ConvertPage() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', background: bg, minHeight: '100vh', color: text }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Top bar */}
      <div style={{ background: panel, borderBottom: `1px solid ${border}`, padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: muted, marginBottom: 2 }}>Queue Management</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: text, letterSpacing: '-0.3px' }}>Conversion Workspace</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Set all to */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, color: muted, fontWeight: 500 }}>Set all to:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: 8, border: `1px solid ${border}`, fontSize: 13, fontWeight: 600, color: text, background: panel, cursor: 'pointer' }}>
              .PNG <ChevronDown style={{ width: 14, height: 14, color: muted }} />
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 28, background: border }} />

          {/* Download all */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: `1px solid ${border}`, fontSize: 13, fontWeight: 600, color: text, background: panel, cursor: 'pointer' }}>
            <Download style={{ width: 15, height: 15 }} />
            Download all (.zip)
          </div>

          {/* Convert all */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#fff', background: accent, cursor: 'pointer', boxShadow: '0 2px 8px rgba(79,70,229,0.3)' }}>
            <div style={{ width: 0, height: 0, borderLeft: '6px solid white', borderTop: '4px solid transparent', borderBottom: '4px solid transparent' }} />
            Convert all
          </div>
        </div>
      </div>

      {/* File grid */}
      <div style={{ padding: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          <DropZone />
          {FILES.map(f => <FileCard key={f.id} file={f} />)}
        </div>
      </div>
    </div>
  );
}

export default ConvertPage;
