export default function ShopLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 lg:px-8">
      <div className="mb-10 h-9 w-40 animate-pulse bg-muted" />
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="aspect-square w-full animate-pulse bg-muted" />
            <div className="h-4 w-3/4 animate-pulse bg-muted" />
            <div className="h-4 w-1/3 animate-pulse bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
