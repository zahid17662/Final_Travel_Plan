export default function Skeleton({ className = "h-4 w-full", circle = false }: { className?: string; circle?: boolean }) {
  return <span aria-hidden="true" className={`block animate-pulse bg-navy/10 ${circle ? "rounded-full" : "rounded-lg"} ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-card bg-white shadow-card" role="status" aria-label="Loading">
      <Skeleton className="aspect-[3/2] w-full !rounded-none" />
      <div className="space-y-3 p-4"><Skeleton className="h-4 w-2/3" /><Skeleton className="h-3 w-1/2" /></div>
    </div>
  );
}
