import { Settings2, Video, Sun, Moon, ChevronDown, Globe, Headphones } from 'lucide-react';

const accent = '#4F46E5';
const accentLight = '#EEF2FF';
const bg = '#F9FAFB';
const panel = '#FFFFFF';
const border = '#E5E7EB';
const borderFocus = '#A5B4FC';
const text = '#111827';
const muted = '#6B7280';
const successDot = '#10B981';

function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: panel, borderRadius: 14, border: `1px solid ${border}`, padding: 24, ...style }}>
      {children}
    </div>
  );
}

function SectionHeader({ icon, title, badge }: { icon: React.ReactNode; title: string; badge?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ color: accent }}>{icon}</div>
        <span style={{ fontSize: 17, fontWeight: 700, color: text }}>{title}</span>
      </div>
      {badge}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 12, fontWeight: 600, color: muted, marginBottom: 8, letterSpacing: '0.01em' }}>{children}</div>;
}

function Select({ value, children }: { value: string; children?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, border: `1px solid ${border}`, fontSize: 14, color: text, background: panel, cursor: 'pointer' }}>
      <span>{value}</span>
      <ChevronDown style={{ width: 15, height: 15, color: muted }} />
    </div>
  );
}

function Toggle({ on = true }: { on?: boolean }) {
  return (
    <div style={{ width: 48, height: 26, borderRadius: 13, background: on ? accent : '#D1D5DB', position: 'relative', cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s' }}>
      <div style={{ position: 'absolute', top: 3, left: on ? 25 : 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.15)', transition: 'left 0.2s' }} />
    </div>
  );
}

function ConversionCard() {
  const tokens = ['%name%', '%extension%', '%date%'];
  return (
    <Card>
      <SectionHeader icon={<Settings2 style={{ width: 20, height: 20 }} />} title="Conversion" />

      <Label>File name format</Label>
      <div style={{ padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${borderFocus}`, fontSize: 14, color: text, background: '#FAFAFA', marginBottom: 12, fontFamily: 'monospace' }}>
        %name%_%date%
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {tokens.map(t => (
          <div key={t} style={{ padding: '4px 10px', borderRadius: 6, border: `1px solid ${border}`, fontSize: 12, fontWeight: 500, color: text, cursor: 'pointer', background: '#F3F4F6' }}>
            {t}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: `1px solid ${border}`, cursor: 'pointer' }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: accent }}>Advanced settings</span>
        <ChevronDown style={{ width: 16, height: 16, color: accent }} />
      </div>
    </Card>
  );
}

function VideoCard() {
  return (
    <Card>
      <SectionHeader
        icon={<Video style={{ width: 20, height: 20 }} />}
        title="Video Conversion"
        badge={
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: successDot }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: successDot }} />
            STATUS: AVAILABLE
          </div>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div>
          <Label>Instance selection</Label>
          <Select value="High Performance (GPU)" />
        </div>
        <div>
          <Label>Encoder profile</Label>
          <Select value="H.265 / HEVC" />
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <Label>Conversion speed</Label>
          <span style={{ fontSize: 13, fontWeight: 600, color: accent }}>Fast</span>
        </div>
        {/* Slider track */}
        <div style={{ position: 'relative', marginBottom: 8 }}>
          <div style={{ height: 4, borderRadius: 2, background: '#E5E7EB', position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, width: '72%', height: '100%', borderRadius: 2, background: accent }} />
          </div>
          <div style={{ position: 'absolute', top: '50%', left: '72%', transform: 'translate(-50%, -50%)', width: 18, height: 18, borderRadius: '50%', background: accent, border: '3px solid white', boxShadow: '0 1px 4px rgba(79,70,229,0.4)', cursor: 'pointer' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: muted, fontWeight: 500, letterSpacing: '0.04em' }}>
          <span>SLOW</span><span>STANDARD</span><span>FAST</span>
        </div>
      </div>
    </Card>
  );
}

function AppearanceCard() {
  return (
    <Card>
      <SectionHeader icon={<Sun style={{ width: 20, height: 20 }} />} title="Appearance" />

      <Label>Theme mode</Label>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        {/* Light - selected */}
        <div style={{ borderRadius: 12, border: `2px solid ${accent}`, padding: 18, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 8, cursor: 'pointer', background: '#FAFAFE' }}>
          <Sun style={{ width: 24, height: 24, color: accent }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: accent }}>Light</span>
        </div>
        {/* Dark */}
        <div style={{ borderRadius: 12, border: `1.5px solid ${border}`, padding: 18, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 8, cursor: 'pointer', background: '#F9FAFB' }}>
          <Moon style={{ width: 24, height: 24, color: muted }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: muted }}>Dark</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderTop: `1px solid ${border}`, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 20, height: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            {[...Array(4)].map((_, i) => <div key={i} style={{ borderRadius: 1.5, background: '#9CA3AF' }} />)}
          </div>
          <span style={{ fontSize: 14, fontWeight: 500, color: text }}>Effect settings</span>
        </div>
        <Toggle on={true} />
      </div>

      <Label>Language</Label>
      <Select value="English (US)" />
    </Card>
  );
}

function SupportCard() {
  return (
    <div style={{ borderRadius: 14, padding: 24, background: `linear-gradient(135deg, #4338CA 0%, #4F46E5 60%, #6366F1 100%)`, color: '#fff', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative circle */}
      <div style={{ position: 'absolute', right: -20, bottom: -30, width: 120, height: 120, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.15)' }} />
      <div style={{ position: 'absolute', right: 10, bottom: -10, width: 70, height: 70, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)' }} />
      <Headphones style={{ width: 28, height: 28, marginBottom: 10, opacity: 0.9 }} />
      <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>Need Assistance?</div>
      <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 20, lineHeight: 1.5 }}>
        Our enterprise support team is available 24/7 for conversion assistance.
      </div>
      <div style={{ display: 'inline-flex', alignItems: 'center', padding: '9px 20px', borderRadius: 9, background: '#fff', color: accent, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
        Contact Support
      </div>
    </div>
  );
}

export function SettingsPage() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', background: bg, minHeight: '100vh', color: text }}>
      {/* Page header */}
      <div style={{ padding: '32px 32px 24px' }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: text, letterSpacing: '-0.4px', marginBottom: 4 }}>Settings</div>
        <div style={{ fontSize: 14, color: muted }}>Configure your professional conversion environment.</div>
      </div>

      {/* Two-column layout */}
      <div style={{ padding: '0 32px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ConversionCard />
          <VideoCard />
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <AppearanceCard />
          <SupportCard />
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
