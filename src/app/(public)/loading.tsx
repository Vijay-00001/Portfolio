// src/app/loading.tsx
export default function Loading() {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-muted" />
          <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-t-accent animate-spin" />
        </div>
        <p className="text-sm text-muted-foreground font-medium animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}