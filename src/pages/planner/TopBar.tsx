import type { ReactNode } from "react";
import { Button, ChevronLeftIcon, DownloadIcon, CheckIcon, RedoIcon, SettingsIcon, ShareIcon, Tooltip, UndoIcon } from "../../components/ui";

type Props = {
  title: string; canUndo: boolean; canRedo: boolean; onUndo: () => void; onRedo: () => void;
  offline: "idle" | "loading" | "ready"; onOffline: () => void; onSettings: () => void; onShare: () => void; presence?: ReactNode;
};

const Icon = ({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: ReactNode }) => (
  <Tooltip content={label} side="bottom">
    <button type="button" aria-label={label} disabled={disabled} onClick={onClick}
      className="grid h-9 w-9 place-items-center rounded-full text-navy transition hover:bg-navy/5 focus-visible:outline-2 focus-visible:outline-navy disabled:pointer-events-none disabled:opacity-35">{children}</button>
  </Tooltip>
);

export default function TopBar({ title, canUndo, canRedo, onUndo, onRedo, offline, onOffline, onSettings, onShare, presence }: Props) {
  return (
    <header className="z-30 flex h-14 shrink-0 items-center gap-1 border-b border-navy/10 bg-white px-2 sm:gap-2 sm:px-4">
      <a href="#/trips" aria-label="Back to trips" className="inline-flex h-9 items-center gap-1 rounded-full px-2 text-sm font-semibold text-navy hover:bg-navy/5 sm:px-3">
        <ChevronLeftIcon size={18} /><span className="hidden sm:inline">Back</span>
      </a>
      <h1 className="min-w-0 flex-1 truncate px-1 text-sm font-bold text-navy sm:text-base">{title}</h1>
      {presence}
      <Icon label="Undo" onClick={onUndo} disabled={!canUndo}><UndoIcon size={18} /></Icon>
      <Icon label="Redo" onClick={onRedo} disabled={!canRedo}><RedoIcon size={18} /></Icon>
      <span className="mx-1 hidden h-5 w-px bg-navy/10 sm:block" />
      <Icon label={offline === "ready" ? "Available offline" : offline === "loading" ? "Downloading…" : "Download for offline"} onClick={onOffline} disabled={offline === "loading"}>
        {offline === "ready" ? <span className="text-ocean-500"><CheckIcon size={18} /></span> : <DownloadIcon size={18} />}
      </Icon>
      <Icon label="Trip settings" onClick={onSettings}><SettingsIcon size={18} /></Icon>
      <Button size="sm" icon={<ShareIcon size={14} />} onClick={onShare} className="ml-1">Share</Button>
    </header>
  );
}
