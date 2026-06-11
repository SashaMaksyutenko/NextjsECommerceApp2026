import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 text-center px-4">
      <p className="text-7xl font-bold text-gray-200">404</p>
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Page not found</h1>
        <p className="mt-2 text-gray-500 text-sm">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <Link
        href="/"
        className="mt-2 px-6 py-2 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
