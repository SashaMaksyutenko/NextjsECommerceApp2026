import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 text-center px-4">
      <p className="text-7xl font-bold text-muted-foreground/20">404</p>
      <div>
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 text-muted-foreground text-sm">
          This page doesn&apos;t exist or you don&apos;t have access.
        </p>
      </div>
      <Link
        href="/"
        className="mt-2 px-6 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:opacity-90 transition-opacity"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
