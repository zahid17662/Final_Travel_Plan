import { useState } from "react";
import { Button, CopyIcon, GlobeIcon, Input, LockIcon, Modal, Select, Toggle, TrashIcon, useToast } from "../../components/ui";
import { pushNotif } from "../../data/notifications";
import { shareUrl } from "./collab";
import type { Role, Share } from "./collab";
import { Dot } from "./comments";

const roles = [{ value: "edit", label: "Can edit" }, { value: "view", label: "Can view" }];
const emailOk = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export default function ShareModal({ share, setShare, tripId, tripTitle, focusInvite, onClose }: { share: Share; setShare: (fn: (s: Share) => Share) => void; tripId: string; tripTitle: string; focusInvite?: boolean; onClose: () => void }) {
  const { show } = useToast();
  const [email, setEmail] = useState(""); const [role, setRole] = useState<Role>("edit"); const [err, setErr] = useState("");
  const url = shareUrl(tripId);

  const invite = () => {
    const e = email.trim().toLowerCase();
    if (!emailOk(e)) { setErr("Enter a valid email address"); return; }
    if (share.members.some((m) => m.email.toLowerCase() === e)) { setErr("That person already has access"); return; }
    setShare((s) => ({ ...s, members: [...s.members, { name: e.split("@")[0].replace(/^./, (c) => c.toUpperCase()), email: e, role }] }));
    pushNotif({ kind: "invite", title: `You invited ${e} to ${tripTitle}`, body: role === "edit" ? "They can edit this trip." : "They can view this trip.", href: `#/trip/${tripId}` });
    show({ title: "Invite sent", description: e, tone: "success" }); setEmail(""); setErr("");
  };
  const copy = async () => { try { await navigator.clipboard.writeText(url); show({ title: "Link copied", tone: "success" }); } catch { show({ title: "Couldn't copy", description: url, tone: "error" }); } };

  return (
    <Modal open onClose={onClose} title="Share trip" footer={<Button onClick={onClose}>Done</Button>}>
      <div className="space-y-6">
        <section aria-label="Invite by email">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
            <Input autoFocus={focusInvite} className="flex-1" label="Invite by email" type="email" placeholder="friend@example.com" value={email} error={err} onChange={(e) => { setEmail(e.target.value); setErr(""); }} onKeyDown={(e) => { if (e.key === "Enter") invite(); }} />
            <Select aria-label="Role for invite" className="sm:mt-6 sm:w-32" value={role} onChange={(e) => setRole(e.target.value as Role)} options={roles} />
            <Button onClick={invite} className="h-fit !py-3 sm:mt-6">Invite</Button>
          </div>
        </section>

        <section aria-label="Link sharing" className="space-y-3 rounded-2xl bg-surface p-4">
          <Toggle checked={share.link} onChange={(v) => setShare((s) => ({ ...s, link: v }))} label="Anyone with the link" description="Opens a read-only page of this trip." />
          <div className="flex gap-2"><Input className="flex-1" aria-label="Trip link" readOnly disabled={!share.link} value={url} onFocus={(e) => e.target.select()} /><Button onClick={copy} disabled={!share.link} icon={<CopyIcon size={14} />} className="h-fit !py-3">Copy link</Button></div>
          <Toggle checked={share.public} onChange={(v) => setShare((s) => ({ ...s, public: v }))} label={share.public ? "Public trip" : "Private trip"} description={share.public ? "Anyone can find and view this trip." : "Only you and the people below can open it."} />
          <p className="flex items-center gap-1.5 text-xs font-semibold text-navy/60">{share.public ? <GlobeIcon size={13} /> : <LockIcon size={13} />}{share.public ? "Visible to everyone" : share.link ? "Visible to people with the link" : "Visible to invited people only"}</p>
        </section>

        <section aria-label="People with access">
          <h3 className="mb-2 text-sm font-extrabold">People with access <span className="font-normal text-navy/55">· {share.members.length}</span></h3>
          <ul className="divide-y divide-navy/10">
            {share.members.map((m) => (
              <li key={m.email} className="flex items-center gap-3 py-3">
                <Dot name={m.name} size={36} />
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{m.name}{m.role === "owner" && <span className="ml-1 font-normal text-navy/55">(you)</span>}</p><p className="truncate text-xs text-navy/55">{m.email}</p></div>
                {m.role === "owner" ? <span className="text-xs font-bold text-navy/60">Owner</span> : (
                  <>
                    <Select aria-label={`Role for ${m.name}`} className="w-28" value={m.role} onChange={(e) => setShare((s) => ({ ...s, members: s.members.map((x) => (x.email === m.email ? { ...x, role: e.target.value as Role } : x)) }))} options={roles} />
                    <button type="button" aria-label={`Remove ${m.name}`} onClick={() => { setShare((s) => ({ ...s, members: s.members.filter((x) => x.email !== m.email) })); show({ title: `Removed ${m.name}` }); }} className="grid h-9 w-9 place-items-center rounded-full text-navy/60 hover:bg-red-50 hover:text-red-600"><TrashIcon size={15} /></button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Modal>
  );
}
