import Link from "next/link";
import Logo from "@/components/shared/Logo";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-warm-gray">
      <div className="mx-auto max-w-[480px] px-6 py-24 text-center">
        <Logo variant="vertical" theme="light" className="mx-auto mb-10" />
        <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.1em] text-forest mb-4">
          404
        </span>
        <h1 className="font-serif text-2xl md:text-[28px] tracking-[-0.4px] text-near-black">
          Page not found
        </h1>
        <p className="mt-3 text-sm text-stone max-w-[360px] mx-auto leading-relaxed">
          The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center min-h-11 mt-8 text-sm text-forest font-medium hover:text-deep-forest transition-colors"
        >
          &larr; Back home
        </Link>
      </div>
    </div>
  );
}
