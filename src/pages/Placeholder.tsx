import type { ReactNode } from "react";
import { Container, Page, PageTitle, Panel, SidebarLayout, Sidebar } from "../components/ui";
import type { SidebarItem } from "../components/ui";

export const accountNav: SidebarItem[] = [
  { label: "Trips", to: "/trips" },
  { label: "Profile", to: "/profile" },
  { label: "Settings", to: "/settings" },
  { label: "Pricing", to: "/pricing" },
  { label: "Help", to: "/help" },
];

type Props = { eyebrow?: string; title: string; note?: string; loggedIn?: boolean; sidebar?: boolean; children?: ReactNode };

export default function Placeholder({ eyebrow = "Travel Plan", title, note, loggedIn = true, sidebar = false, children }: Props) {
  const body = (
    <div className="space-y-10">
      <PageTitle eyebrow={eyebrow} title={title} />
      {note && <p className="max-w-xl text-sm text-navy/60">{note}</p>}
      {children ?? <Panel className="text-sm text-navy/60">Placeholder page — content coming soon.</Panel>}
    </div>
  );
  return (
    <Page loggedIn={loggedIn}>
      {sidebar ? <SidebarLayout sidebar={<Sidebar title="Account" items={accountNav} />}>{body}</SidebarLayout> : <Container className="py-10 md:py-14">{body}</Container>}
    </Page>
  );
}
