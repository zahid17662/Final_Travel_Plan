import { useState } from "react";
import {
  Avatar, Badge, Button, Card, CardSkeleton, Chip, Select, Skeleton, Toggle, Tooltip, Container, Dropdown, GuideCard, Input, Modal, Navbar, Page, PageTitle, Panel,
  PlaceCard, PlusIcon, SearchBar, SectionTitle, Tabs, TripCard, unsplash, useToast,
} from "../components/ui";

function Demo() {
  const toast = useToast();
  const [tab, setTab] = useState("trips");
  const [pill, setPill] = useState("all");
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [on, setOn] = useState(true);
  const [chips, setChips] = useState(["Beach", "Food", "Museums"]);

  return (
    <Container className="space-y-14 py-14">
      <PageTitle eyebrow="Travel Plan" title="Component library" />

      <section className="space-y-4">
        <SectionTitle>Navbar</SectionTitle>
        <div className="overflow-hidden rounded-2xl bg-white shadow-card">
          <Navbar activeHref="#/home" />
          <Navbar loggedIn activeHref="#/home" />
          <div className="bg-navy"><Navbar loggedIn overlay /></div>
        </div>
      </section>

      <section className="space-y-4">
        <SectionTitle>Buttons</SectionTitle>
        <Panel className="flex flex-wrap items-center gap-3">
          <Button icon={<PlusIcon />}>Plan new trip</Button>
          <Button variant="secondary">Get the app</Button>
          <Button variant="ghost">See all</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button disabled>Disabled</Button>
          <span className="rounded-full bg-navy p-2"><Button variant="glass" size="sm">Signup</Button></span>
        </Panel>
      </section>

      <section className="space-y-4">
        <SectionTitle>Inputs, search, chips, avatars</SectionTitle>
        <Panel className="grid gap-6 md:grid-cols-2">
          <Input label="Where" placeholder="Search destinations" />
          <Input label="Email" defaultValue="hello@" error="Enter a valid email address" />
          <SearchBar className="md:col-span-1" />
          <div className="flex items-center gap-3"><Avatar name="Mia" size="sm" /><Avatar name="Mia" /><Avatar name="Mia" size="lg" tone="solid" /></div>
          <div className="flex flex-wrap gap-2 md:col-span-2">
            {["all", "beach", "city", "nature"].map((c) => <Chip key={c} selected={pill === c} onClick={() => setPill(c)}>{c[0].toUpperCase() + c.slice(1)}</Chip>)}
            {chips.map((c) => <Chip key={c} onRemove={() => setChips((l) => l.filter((x) => x !== c))}>{c}</Chip>)}
          </div>
        </Panel>
      </section>

      <section className="space-y-4">
        <SectionTitle>Tabs, dropdown, modal, toast</SectionTitle>
        <Panel className="space-y-6">
          <Tabs value={tab} onChange={setTab} items={[{ id: "trips", label: "Trips", count: 2 }, { id: "guides", label: "Guides", count: 1 }, { id: "saved", label: "Saved" }]} />
          <Tabs variant="pill" value={tab} onChange={setTab} items={[{ id: "trips", label: "Trips" }, { id: "guides", label: "Guides" }, { id: "saved", label: "Saved" }]} />
          <div className="flex flex-wrap items-center gap-3">
            <Dropdown label="Recently viewed" items={[{ label: "Recently viewed" }, { label: "Upcoming" }, { label: "Delete", danger: true }]} />
            <Button variant="secondary" onClick={() => setOpen(true)}>Open modal</Button>
            <Button variant="secondary" onClick={() => toast.show({ title: "Trip saved", description: "Trip to Paris was added to your trips.", tone: "success" })}>Show toast</Button>
          </div>
        </Panel>
        <Modal open={open} onClose={() => setOpen(false)} title="Plan a new trip"
          footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => { setOpen(false); toast.show({ title: "Trip created", tone: "success" }); }}>Create trip</Button></>}>
          <Input label="Where to?" placeholder="Paris, France" />
        </Modal>
      </section>

      <section className="space-y-4">
        <SectionTitle>Select, badge, toggle, tooltip, card, skeleton</SectionTitle>
        <Panel className="grid items-start gap-6 md:grid-cols-2">
          <Select label="Language" options={[{ value: "en", label: "English" }, { value: "fr", label: "Français" }]} />
          <div className="flex flex-wrap items-center gap-2"><Badge>Soft</Badge><Badge tone="navy">Navy</Badge><Badge tone="ocean">Ocean</Badge><Badge tone="success">Success</Badge><Badge tone="warning">Warning</Badge><Badge tone="danger">Danger</Badge></div>
          <Toggle checked={on} onChange={setOn} label="Email updates" description="Trip reminders and new guides." />
          <Tooltip content="Hello from Travel Plan"><Button variant="secondary" size="sm">Hover me</Button></Tooltip>
          <Card><p className="text-sm">A plain card.</p></Card>
          <div className="space-y-2"><Skeleton className="h-4 w-1/2" /><CardSkeleton /></div>
        </Panel>
      </section>

      <section className="space-y-4">
        <SectionTitle>Trip, guide and place cards</SectionTitle>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <TripCard image={unsplash("photo-1549483249-f0b359d1e289")} title="Trip to London" dates="Oct 2 – 7" places="4 places" />
          <GuideCard image={unsplash("photo-1637851058613-95f0d41c3c2f")} title="Paris Guide" blurb="Cafés, museums and the best views of the city." author="Jess Page" likes={4} views={877} />
          <PlaceCard image={unsplash("photo-1587648415693-4a5362b2ce41")} name="Louvre Museum" category="Museum" location="Paris, France" rating={4.8} saved={saved} onSave={() => setSaved((s) => !s)} />
        </div>
        <Panel className="divide-y divide-navy/10 !py-2">
          <TripCard variant="row" image={unsplash("photo-1549483249-f0b359d1e289", 200)} title="Trip to London" dates="Oct 2 – 7" places="4 places" />
          <TripCard variant="row" image={unsplash("photo-1585944285854-d06c019aaca3", 200)} title="Trip to Paris" dates="Sep 26 – 30" places="13 places" />
        </Panel>
      </section>
    </Container>
  );
}

export default function Components() {
  return <Page><Demo /></Page>;
}
