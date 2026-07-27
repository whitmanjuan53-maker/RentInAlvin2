'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Property {
  id: string;
  slug: string;
  name: string;
  addr: string;
  tag: string;
  units: string;
  price: string;
  note: string;
  gallery: string[];
  amenities: string[];
  availability: string;
  featured: boolean;
  published: boolean;
}

const AVAILABILITY_OPTIONS = ['Available now', 'Coming soon', 'Waitlist', 'Not listed'];

const c = {
  bg: '#FBF7F0', card: '#fff', line: '#e5e0d8', ink: '#1A1815', soft: '#5C5750',
  green: '#1F3A2E', accent: '#B5703D', field: '#faf8f4',
};

const label: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 600, color: c.soft,
  textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6,
};
const input: React.CSSProperties = {
  width: '100%', padding: '10px 12px', fontSize: 15, border: `1px solid ${c.line}`,
  borderRadius: 6, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  background: c.field, color: c.ink,
};

export default function ManagerDashboard({
  properties, blobConfigured,
}: { properties: Property[]; blobConfigured: boolean }) {
  const router = useRouter();

  async function logout() {
    await fetch('/api/manager/login', { method: 'DELETE' });
    router.refresh();
  }

  return (
    <div style={{ minHeight: '100vh', background: c.bg, color: c.ink, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '28px 16px 80px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: c.accent, fontWeight: 700 }}>
              Yellowstone Management
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 600, margin: '2px 0 0', color: c.green }}>Property Manager</h1>
            <p style={{ fontSize: 14, color: c.soft, margin: '6px 0 0' }}>
              Edit your properties below. Changes go live on the website as soon as you press <strong>Save</strong>.
            </p>
          </div>
          <button onClick={logout} style={{ padding: '8px 14px', fontSize: 13, fontWeight: 600, background: 'transparent', color: c.soft, border: `1px solid ${c.line}`, borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit' }}>
            Log out
          </button>
        </header>

        {!blobConfigured && (
          <div style={{ background: '#fff7ec', border: `1px solid ${c.accent}`, borderRadius: 8, padding: '12px 14px', fontSize: 13, color: '#7a4a1e', margin: '16px 0' }}>
            Photo uploads aren&apos;t turned on yet. You can still reorder and remove existing photos and edit everything else. To enable uploading new photos, a Blob store needs to be created in Vercel.
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 18 }}>
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} blobConfigured={blobConfigured} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PropertyCard({ property, blobConfigured }: { property: Property; blobConfigured: boolean }) {
  const [form, setForm] = useState<Property>(property);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [newAmenity, setNewAmenity] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof Property>(key: K, value: Property[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setMsg(null);
  }

  function movePhoto(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= form.gallery.length) return;
    const g = [...form.gallery];
    [g[i], g[j]] = [g[j], g[i]];
    set('gallery', g);
  }

  function removePhoto(i: number) {
    set('gallery', form.gallery.filter((_, idx) => idx !== i));
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setMsg(null);
    try {
      const added: string[] = [];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('slug', form.slug);
        const res = await fetch('/api/manager/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (!res.ok) { setMsg({ text: data.error || 'Upload failed.', ok: false }); break; }
        added.push(data.url);
      }
      if (added.length) set('gallery', [...form.gallery, ...added]);
    } catch {
      setMsg({ text: 'Upload failed. Please try again.', ok: false });
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  function addAmenity() {
    const a = newAmenity.trim();
    if (!a) return;
    set('amenities', [...form.amenities, a]);
    setNewAmenity('');
  }

  async function save() {
    if (saving) return;
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch('/api/manager/property', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: form.id, name: form.name, addr: form.addr, tag: form.tag, units: form.units,
          price: form.price, description: form.note, availability: form.availability,
          featured: form.featured, published: form.published, amenities: form.amenities, gallery: form.gallery,
        }),
      });
      const data = await res.json();
      if (!res.ok) setMsg({ text: data.error || 'Save failed.', ok: false });
      else setMsg({ text: 'Saved — live on the website.', ok: true });
    } catch {
      setMsg({ text: 'Network error. Please try again.', ok: false });
    }
    setSaving(false);
  }

  return (
    <div style={{ background: c.card, border: `1px solid ${c.line}`, borderRadius: 10, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}
      >
        <div style={{ width: 56, height: 56, borderRadius: 8, background: '#eee', flexShrink: 0, overflow: 'hidden', border: `1px solid ${c.line}` }}>
          {form.gallery[0] && <img src={form.gallery[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: c.ink }}>{form.name || 'Untitled property'}</div>
          <div style={{ fontSize: 13, color: c.soft }}>{form.addr} · {form.price || 'no price'}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20, background: form.published ? '#e7f0ea' : '#f0e7e7', color: form.published ? c.green : '#a33' }}>
            {form.published ? form.availability : 'Hidden'}
          </span>
          <span style={{ fontSize: 20, color: c.soft }}>{open ? '−' : '+'}</span>
        </div>
      </button>

      {open && (
        <div style={{ padding: '4px 18px 20px', borderTop: `1px solid ${c.line}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginTop: 16 }}>
            <div>
              <label style={label}>Property name</label>
              <input style={input} value={form.name} onChange={(e) => set('name', e.target.value)} />
            </div>
            <div>
              <label style={label}>Address</label>
              <input style={input} value={form.addr} onChange={(e) => set('addr', e.target.value)} />
            </div>
            <div>
              <label style={label}>Starting price</label>
              <input style={input} value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="from $890" />
            </div>
            <div>
              <label style={label}>Availability</label>
              <select style={input} value={form.availability} onChange={(e) => set('availability', e.target.value)}>
                {AVAILABILITY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label style={label}>Type label</label>
              <input style={input} value={form.tag} onChange={(e) => set('tag', e.target.value)} placeholder="Townhome" />
            </div>
            <div>
              <label style={label}>Unit details</label>
              <input style={input} value={form.units} onChange={(e) => set('units', e.target.value)} placeholder="2BR · 1BA · 850 sq ft" />
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <label style={label}>Description</label>
            <textarea style={{ ...input, minHeight: 80, resize: 'vertical' }} value={form.note} onChange={(e) => set('note', e.target.value)} />
          </div>

          {/* Amenities */}
          <div style={{ marginTop: 16 }}>
            <label style={label}>Amenities</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
              {form.amenities.length === 0 && <span style={{ fontSize: 13, color: c.soft }}>None added yet.</span>}
              {form.amenities.map((a, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: c.field, border: `1px solid ${c.line}`, borderRadius: 20, padding: '5px 6px 5px 12px', fontSize: 13 }}>
                  {a}
                  <button onClick={() => set('amenities', form.amenities.filter((_, idx) => idx !== i))} style={{ border: 'none', background: '#e5ddd2', color: c.soft, borderRadius: '50%', width: 18, height: 18, cursor: 'pointer', lineHeight: 1, fontSize: 12 }}>×</button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                style={{ ...input, flex: 1 }}
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addAmenity(); } }}
                placeholder="Add an amenity (e.g. In-unit laundry)"
              />
              <button onClick={addAmenity} style={{ padding: '0 16px', fontSize: 14, fontWeight: 600, background: c.field, color: c.green, border: `1px solid ${c.line}`, borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit' }}>Add</button>
            </div>
          </div>

          {/* Photos */}
          <div style={{ marginTop: 18 }}>
            <label style={label}>Photos</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10 }}>
              {form.gallery.map((url, i) => (
                <div key={i} style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: `1px solid ${c.line}`, aspectRatio: '4/3', background: '#eee' }}>
                  <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {i === 0 && <span style={{ position: 'absolute', top: 6, left: 6, fontSize: 10, fontWeight: 700, background: c.green, color: '#fff', padding: '2px 6px', borderRadius: 4 }}>MAIN</span>}
                  <div style={{ position: 'absolute', bottom: 4, left: 4, right: 4, display: 'flex', justifyContent: 'space-between', gap: 4 }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => movePhoto(i, -1)} disabled={i === 0} style={photoBtn(i === 0)}>◀</button>
                      <button onClick={() => movePhoto(i, 1)} disabled={i === form.gallery.length - 1} style={photoBtn(i === form.gallery.length - 1)}>▶</button>
                    </div>
                    <button onClick={() => removePhoto(i)} style={{ ...photoBtn(false), background: 'rgba(160,40,40,0.85)' }}>×</button>
                  </div>
                </div>
              ))}
              <label style={{ display: 'grid', placeItems: 'center', aspectRatio: '4/3', border: `2px dashed ${c.line}`, borderRadius: 8, cursor: blobConfigured ? 'pointer' : 'not-allowed', color: c.soft, fontSize: 13, textAlign: 'center', padding: 8, background: c.field, opacity: blobConfigured ? 1 : 0.5 }}>
                {uploading ? 'Uploading…' : blobConfigured ? '+ Add photos' : 'Upload off'}
                <input ref={fileRef} type="file" accept="image/*" multiple disabled={!blobConfigured || uploading} onChange={handleUpload} style={{ display: 'none' }} />
              </label>
            </div>
            <p style={{ fontSize: 12, color: c.soft, margin: '8px 0 0' }}>The first photo (MAIN) is the one shown on the website listing. Use ◀ ▶ to reorder.</p>
          </div>

          {/* Toggles + Save */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 18, marginTop: 20, paddingTop: 16, borderTop: `1px solid ${c.line}` }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.published} onChange={(e) => set('published', e.target.checked)} />
              Visible on website
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} />
              Featured
            </label>
            <div style={{ flex: 1 }} />
            {msg && <span style={{ fontSize: 13, fontWeight: 500, color: msg.ok ? c.green : '#a33' }}>{msg.text}</span>}
            <button onClick={save} disabled={saving} style={{ padding: '11px 22px', fontSize: 15, fontWeight: 600, background: c.green, color: '#fff', border: 'none', borderRadius: 6, cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.6 : 1, fontFamily: 'inherit' }}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function photoBtn(disabled: boolean): React.CSSProperties {
  return {
    border: 'none', background: 'rgba(31,58,46,0.85)', color: '#fff', width: 26, height: 24,
    borderRadius: 4, cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.4 : 1,
    fontSize: 11, lineHeight: 1, fontFamily: 'inherit',
  };
}
