import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Avatar, Badge, Button, Chip, Container, EmptyState, Page, Skeleton, unsplash, useToast, ShareIcon } from "../../components/ui";
import { blogCategories, blogPosts, type BlogPost } from "../../data/content";
import { Hero } from "./bits";

function PostCard({ p }: { p: BlogPost }) {
  return (
    <li><Link to={`/blog/${p.id}`} className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-pop focus-visible:outline-2 focus-visible:outline-navy">
      <div className="aspect-[3/2] overflow-hidden"><img src={unsplash(p.photo, 600)} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></div>
      <div className="flex flex-1 flex-col p-5"><Badge tone="ocean">{p.category}</Badge><h3 className="mt-3 text-base font-extrabold leading-snug">{p.title}</h3><p className="mt-1.5 flex-1 text-sm text-navy/60">{p.excerpt}</p><p className="mt-4 text-xs text-navy/50">{p.date} · {p.read} read</p></div>
    </Link></li>
  );
}

export function Blog() {
  const [cat, setCat] = useState("All");
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 450); return () => clearTimeout(t); }, []);
  const [feat, ...rest] = blogPosts;
  const list = (cat === "All" ? rest : blogPosts.filter((p) => p.category === cat));
  return (
    <Page loggedIn={false}>
      <Hero eyebrow="The Travel Plan blog" title="Stories, tips and ideas" />
      <Container className="space-y-10 py-12">
        {cat === "All" && (loading ? (
          <div className="grid overflow-hidden rounded-3xl bg-white shadow-card md:grid-cols-2" role="status" aria-label="Loading"><Skeleton className="aspect-[3/2] !rounded-none md:aspect-auto md:min-h-72" /><div className="space-y-4 p-8"><Skeleton className="h-5 w-20" /><Skeleton className="h-8 w-4/5" /><Skeleton className="h-4 w-full" /></div></div>
        ) : (
          <Link to={`/blog/${feat.id}`} className="group grid overflow-hidden rounded-3xl bg-white shadow-card transition hover:shadow-pop focus-visible:outline-2 focus-visible:outline-navy md:grid-cols-2">
            <div className="aspect-[3/2] overflow-hidden md:aspect-auto"><img src={unsplash(feat.photo, 1000)} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></div>
            <div className="flex flex-col justify-center p-6 sm:p-10"><Badge tone="navy">Featured</Badge><h2 className="mt-4 font-display text-4xl font-bold uppercase leading-tight md:text-5xl">{feat.title}</h2><p className="mt-3 text-sm text-navy/65">{feat.excerpt}</p>
              <p className="mt-5 flex items-center gap-2 text-xs text-navy/60"><Avatar name={feat.author} size="sm" />{feat.author} · {feat.date}</p></div>
          </Link>))}
        <div role="group" aria-label="Categories" className="flex flex-wrap gap-2">{blogCategories.map((c) => <Chip key={c} selected={cat === c} onClick={() => setCat(c)}>{c}</Chip>)}</div>
        {loading ? <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map((i) => <li key={i} className="overflow-hidden rounded-3xl bg-white shadow-card" role="status" aria-label="Loading"><Skeleton className="aspect-[3/2] !rounded-none" /><div className="space-y-3 p-5"><Skeleton className="h-4 w-16" /><Skeleton className="h-4 w-4/5" /><Skeleton className="h-3 w-1/2" /></div></li>)}</ul>
          : list.length ? <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((p) => <PostCard key={p.id} p={p} />)}</ul>
          : <EmptyState title="No posts in this category yet" action={<Button variant="secondary" onClick={() => setCat("All")}>Show all posts</Button>} />}
      </Container>
    </Page>
  );
}

function ShareButton() {
  const { show } = useToast();
  return <Button variant="secondary" size="sm" icon={<ShareIcon size={14} />} onClick={() => { void navigator.clipboard?.writeText(location.href); show({ title: "Link copied", tone: "success" }); }}>Share</Button>;
}

export function BlogPostPage() {
  const { id } = useParams();
  const p = blogPosts.find((x) => x.id === id);
  if (!p) return <Page loggedIn={false}><Container className="max-w-3xl py-16"><EmptyState title="Post not found" action={<Button href="#/blog">All posts</Button>} /></Container></Page>;
  const more = blogPosts.filter((x) => x.id !== p.id).slice(0, 3);
  return (
    <Page loggedIn={false}>
      <article>
        <Container className="max-w-3xl pt-10 text-center">
          <Badge tone="ocean">{p.category}</Badge>
          <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.05] md:text-6xl">{p.title}</h1>
          <p className="mt-3 text-base text-navy/65">{p.excerpt}</p>
          <p className="mt-5 flex items-center justify-center gap-2 text-xs text-navy/60"><Avatar name={p.author} size="sm" />{p.author} · {p.date} · {p.read} read</p>
        </Container>
        <Container className="mt-8"><img src={unsplash(p.photo, 1400)} alt="" className="aspect-[2/1] w-full rounded-3xl object-cover" /></Container>
        <Container className="max-w-2xl py-10">
          <div className="space-y-5 text-[15px] leading-[1.8] text-navy/85">{p.body.map((t, i) => <p key={i} className={i === 0 ? "text-lg font-medium text-navy first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.85]" : ""}>{t}</p>)}</div>
          <div className="mt-10 flex items-center justify-between border-t border-navy/10 pt-6">
            <ShareButton />
            <Button href="#/blog" variant="ghost" size="sm">All posts</Button>
          </div>
        </Container>
      </article>
      <section className="mx-3 mb-3 rounded-2xl bg-white py-12 md:mx-6"><Container><h2 className="font-display text-3xl uppercase tracking-wide">Keep reading</h2><ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{more.map((m) => <PostCard key={m.id} p={m} />)}</ul></Container></section>
    </Page>
  );
}
