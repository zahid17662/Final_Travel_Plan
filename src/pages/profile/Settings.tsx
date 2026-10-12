import { useRef, useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Avatar, Badge, Button, Container, Input, Modal, Page, Select, SidebarLayout, Sidebar, Textarea, Toggle, useToast } from "../../components/ui";
import type { SidebarItem } from "../../components/ui";
import { plans } from "../../data";
import { coverSrc } from "../../data/guidesStore";
import { loadProfile, loadSettings, saveProfile, saveSettings } from "../../data/profile";
import type { Profile, Settings } from "../../data/profile";

const sections: [string, string][] = [["account", "Account"], ["profile", "Profile"], ["notifications", "Notifications"], ["privacy", "Privacy"], ["locale", "Language and currency"], ["units", "Units"], ["connected", "Connected accounts"], ["subscription", "Subscription"], ["delete", "Delete account"]];
const items: SidebarItem[] = sections.map(([id, label]) => ({ label, to: `/settings/${id}` }));

const Card = ({ title, desc, children, danger }: { title: string; desc?: string; children: ReactNode; danger?: boolean }) => (
  <section className={`rounded-3xl bg-white p-5 shadow-card sm:p-6 ${danger ? "ring-1 ring-red-200" : ""}`}><h2 className="text-lg font-extrabold">{title}</h2>{desc && <p className="mt-1 text-sm text-navy/60">{desc}</p>}<div className="mt-5 space-y-5">{children}</div></section>
);
const sel = (o: [string, string][]) => o.map(([value, label]) => ({ value, label }));

function Body() {
  const { section = "account" } = useParams();
  const { show } = useToast();
  const nav = useNavigate();
  const [saved, setSaved] = useState({ p: loadProfile(), s: loadSettings() });
  const [p, setP] = useState<Profile>(saved.p);
  const [s, setS] = useState<Settings>(saved.s);
  const [pw, setPw] = useState({ cur: "", next: "" });
  const [pwErr, setPwErr] = useState<string>();
  const [del, setDel] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [imgErr, setImgErr] = useState<string>();
  const avatar = useRef<HTMLInputElement>(null);
  const cover = useRef<HTMLInputElement>(null);

  const dirty = JSON.stringify([p, s]) !== JSON.stringify([saved.p, saved.s]);
  const up = <K extends keyof Settings>(k: K, v: Settings[K]) => setS((x) => ({ ...x, [k]: v }));
  const tog = (k: keyof Settings, label: string, description?: string) => <Toggle key={k} checked={s[k] as boolean} onChange={(v) => up(k, v as never)} label={label} description={description} />;
  const save = () => {
    if (!p.name.trim()) return show({ title: "Name can't be empty", tone: "error" });
    saveProfile(p); saveSettings(s); setSaved({ p, s }); show({ title: "Settings saved", tone: "success" });
  };
  const discard = () => { setP(saved.p); setS(saved.s); setPwErr(undefined); };
  const pick = (key: "avatar" | "cover") => (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; e.target.value = ""; if (!f) return;
    if (!f.type.startsWith("image/") || f.size > 1_500_000) return setImgErr("Choose an image under 1.5 MB.");
    setImgErr(undefined); const r = new FileReader(); r.onload = () => setP((x) => ({ ...x, [key]: String(r.result) })); r.readAsDataURL(f);
  };
  const changePw = () => {
    if (pw.next.length < 8) return setPwErr("New password must be at least 8 characters.");
    setPwErr(undefined); setPw({ cur: "", next: "" }); show({ title: "Password updated", tone: "success" });
  };
  const doDelete = () => { try { localStorage.clear(); } catch { /* ignore */ } nav("/"); };
  const toggleConn = (id: string, name: string) => { const on = s.connected.includes(id); up("connected", on ? s.connected.filter((x) => x !== id) : [...s.connected, id]); show({ title: on ? `${name} disconnected` : `${name} connected` }); };

  let body: ReactNode;
  switch (section) {
    case "account": body = <>
      <Card title="Account" desc="Your sign-in details."><Input label="Email" type="email" value={s.email} onChange={(e) => up("email", e.target.value)} />
        {tog("twoFactor", "Two-factor authentication", "Ask for a code when you sign in on a new device.")}</Card>
      <Card title="Change password"><div className="grid gap-4 sm:grid-cols-2"><Input label="Current password" type="password" autoComplete="current-password" value={pw.cur} onChange={(e) => setPw({ ...pw, cur: e.target.value })} /><Input label="New password" type="password" autoComplete="new-password" value={pw.next} error={pwErr} hint="At least 8 characters" onChange={(e) => setPw({ ...pw, next: e.target.value })} /></div>
        <Button variant="secondary" onClick={changePw} disabled={!pw.cur || !pw.next}>Update password</Button></Card></>; break;
    case "profile": body = <Card title="Profile" desc="This is how other travellers see you.">
      <div className="flex flex-wrap items-center gap-4"><Avatar name={p.name || "?"} src={p.avatar || undefined} size="lg" tone="solid" /><div className="flex gap-2"><Button size="sm" variant="secondary" onClick={() => avatar.current?.click()}>Upload photo</Button>{p.avatar && <Button size="sm" variant="ghost" onClick={() => setP({ ...p, avatar: "" })}>Remove</Button>}</div></div>
      <div><p className="mb-1.5 text-xs font-bold">Cover image</p><div className="relative aspect-[16/5] overflow-hidden rounded-2xl bg-navy">{p.cover && <img src={coverSrc(p.cover, 1200)} alt="Cover preview" className="h-full w-full object-cover" />}<div className="absolute right-3 top-3 flex gap-2"><Button size="sm" variant="secondary" onClick={() => cover.current?.click()}>{p.cover ? "Replace" : "Upload"}</Button>{p.cover && <Button size="sm" variant="secondary" onClick={() => setP({ ...p, cover: "" })}>Remove</Button>}</div></div></div>
      {imgErr && <p role="alert" className="text-xs text-red-600">{imgErr}</p>}
      <input ref={avatar} type="file" accept="image/*" className="sr-only" aria-label="Upload profile photo" onChange={pick("avatar")} /><input ref={cover} type="file" accept="image/*" className="sr-only" aria-label="Upload cover image" onChange={pick("cover")} />
      <div className="grid gap-4 sm:grid-cols-2"><Input label="Name" value={p.name} error={p.name.trim() ? undefined : "Name is required"} onChange={(e) => setP({ ...p, name: e.target.value })} /><Input label="Username" value={p.handle} onChange={(e) => setP({ ...p, handle: e.target.value.startsWith("@") ? e.target.value : `@${e.target.value}` })} />
        <Input label="Location" value={p.location} onChange={(e) => setP({ ...p, location: e.target.value })} /><Input label="Website" type="url" placeholder="https://" value={p.website} onChange={(e) => setP({ ...p, website: e.target.value })} /></div>
      <Textarea label={`Bio (${p.bio.length}/200)`} rows={3} maxLength={200} value={p.bio} onChange={(e) => setP({ ...p, bio: e.target.value })} /></Card>; break;
    case "notifications": body = <>
      <Card title="Email" desc="Choose what lands in your inbox.">{tog("nEmailReminders", "Trip reminders", "Upcoming departures and checklist nudges.")}{tog("nEmailComments", "Comments and replies")}{tog("nEmailInvites", "Invitations", "When someone invites you to a trip.")}{tog("nEmailNews", "Product news and tips")}</Card>
      <Card title="Push">{tog("nPushEdits", "Trip edits", "When collaborators change a shared trip.")}{tog("nPushComments", "Comments on my guides")}{tog("nPushDeals", "Price drops on saved hotels")}</Card>
      <Card title="Digest"><Select label="Summary email" value={s.digest} onChange={(e) => up("digest", e.target.value)} options={sel([["daily", "Daily"], ["weekly", "Weekly"], ["never", "Never"]])} /></Card></>; break;
    case "privacy": body = <>
      <Card title="Profile visibility"><Select label="Who can see your profile" value={s.visibility} onChange={(e) => up("visibility", e.target.value)} options={sel([["public", "Everyone"], ["friends", "Friends only"], ["private", "Only me"]])} />
        {tog("showMap", "Show my travel map")}{tog("showTrips", "Show my trips")}{tog("showGuides", "Show my guides")}</Card>
      <Card title="Discovery and data">{tog("findByEmail", "Let people find me by email")}{tog("analytics", "Share anonymous usage data", "Helps us improve Travel Plan.")}
        <Button variant="secondary" onClick={() => show({ title: "Export requested", description: "We'll email you a download link.", tone: "success" })}>Download my data</Button></Card></>; break;
    case "locale": body = <Card title="Language and currency"><div className="grid gap-4 sm:grid-cols-2">
      <Select label="Language" value={s.language} onChange={(e) => up("language", e.target.value)} options={sel([["en", "English"], ["fr", "Français"], ["pt", "Português"], ["es", "Español"], ["ja", "日本語"]])} />
      <Select label="Currency" value={s.currency} onChange={(e) => up("currency", e.target.value)} options={sel([["usd", "US dollar (USD)"], ["eur", "Euro (EUR)"], ["gbp", "Pound (GBP)"], ["jpy", "Yen (JPY)"], ["brl", "Real (BRL)"]])} />
      <Select label="Date format" value={s.dateFormat} onChange={(e) => up("dateFormat", e.target.value)} options={sel([["mdy", "MM/DD/YYYY"], ["dmy", "DD/MM/YYYY"], ["ymd", "YYYY-MM-DD"]])} />
      <Select label="Week starts on" value={s.weekStart} onChange={(e) => up("weekStart", e.target.value)} options={sel([["sun", "Sunday"], ["mon", "Monday"]])} /></div></Card>; break;
    case "units": body = <Card title="Units"><div className="grid gap-4 sm:grid-cols-3">
      <Select label="Distance" value={s.distance} onChange={(e) => up("distance", e.target.value)} options={sel([["km", "Kilometres"], ["mi", "Miles"]])} />
      <Select label="Temperature" value={s.temp} onChange={(e) => up("temp", e.target.value)} options={sel([["c", "Celsius (°C)"], ["f", "Fahrenheit (°F)"]])} />
      <Select label="Time" value={s.clock} onChange={(e) => up("clock", e.target.value)} options={sel([["24", "24-hour"], ["12", "12-hour"]])} /></div></Card>; break;
    case "connected": body = <Card title="Connected accounts" desc="Sign in faster and import bookings from your inbox.">
      <ul className="divide-y divide-navy/10">{[["google", "Google", "Sign in and import reservations from Gmail"], ["apple", "Apple", "Sign in with Apple"], ["facebook", "Facebook", "Find friends who travel"]].map(([id, name, d]) => (
        <li key={id} className="flex flex-wrap items-center gap-3 py-4"><span className="grid h-10 w-10 place-items-center rounded-full bg-ocean-100 text-sm font-bold">{name[0]}</span><span className="min-w-0 flex-1"><span className="block text-sm font-bold">{name}</span><span className="text-xs text-navy/60">{d}</span></span>
          {s.connected.includes(id) && <Badge tone="success">Connected</Badge>}<Button size="sm" variant="secondary" onClick={() => toggleConn(id, name)}>{s.connected.includes(id) ? "Disconnect" : "Connect"}</Button></li>))}</ul></Card>; break;
    case "subscription": body = <Card title="Subscription" desc="You are on the Free plan. Upgrade any time.">
      <div className="grid gap-4 md:grid-cols-3">{plans.map((pl) => { const cur = s.plan === pl.id; return (
        <div key={pl.id} className={`flex flex-col rounded-3xl border p-5 ${cur ? "border-navy bg-ocean-100/40" : "border-navy/10"}`}><div className="flex items-center justify-between"><h3 className="text-sm font-extrabold">{pl.name}</h3>{cur && <Badge tone="navy">Current</Badge>}</div>
          <p className="mt-2 font-display text-4xl font-bold">{pl.price}<span className="font-sans text-xs font-normal text-navy/55"> {pl.period}</span></p><ul className="mt-3 flex-1 space-y-1 text-xs text-navy/70">{pl.features.map((f) => <li key={f}>· {f}</li>)}</ul>
          <Button className="mt-4" size="sm" variant={cur ? "secondary" : "primary"} disabled={cur} onClick={() => up("plan", pl.id)}>{cur ? "Your plan" : s.plan === "free" || pl.id === "free" ? (pl.id === "free" ? "Downgrade" : "Upgrade") : "Switch"}</Button></div>); })}</div></Card>; break;
    case "delete": body = <Card danger title="Delete account" desc="This permanently removes your trips, guides and settings from this browser. It can't be undone."><Button variant="secondary" className="!border-red-300 !text-red-700" onClick={() => setDel(true)}>Delete my account</Button></Card>; break;
    default: return <Navigate to="/settings/account" replace />;
  }

  return (
    <>
      <div className="space-y-6 pb-28">
        <h1 className="font-display text-4xl font-bold uppercase leading-tight sm:text-5xl">{sections.find(([id]) => id === section)?.[1]}</h1>
        {body}
      </div>
      {dirty && (
        <div role="region" aria-label="Unsaved changes" className="fixed inset-x-0 bottom-0 z-30 border-t border-navy/10 bg-white/95 backdrop-blur">
          <Container className="flex flex-wrap items-center justify-between gap-3 py-3"><p className="text-sm font-semibold">You have unsaved changes</p><div className="flex gap-2"><Button variant="ghost" onClick={discard}>Discard</Button><Button onClick={save}>Save changes</Button></div></Container>
        </div>
      )}
      <Modal open={del} onClose={() => { setDel(false); setConfirm(""); }} title="Delete account?" footer={<><Button variant="secondary" onClick={() => { setDel(false); setConfirm(""); }}>Cancel</Button><Button disabled={confirm !== "DELETE"} onClick={doDelete} className="!bg-red-600">Delete forever</Button></>}>
        <p className="text-sm text-navy/70">All your trips, guides and settings will be erased. Type <strong>DELETE</strong> to confirm.</p><Input className="mt-4" aria-label="Type DELETE to confirm" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      </Modal>
    </>
  );
}

export default function SettingsPage() {
  return <Page><SidebarLayout sidebar={<Sidebar title="Settings" items={items} />}><Body /></SidebarLayout></Page>;
}
