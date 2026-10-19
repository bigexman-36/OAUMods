'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquareText } from 'lucide-react';

export default function FeedbackShortcut() {
  const pathname = usePathname();

  if (pathname === '/feedback') return null;

  return (
    <Link
      href="/feedback"
      aria-label="Share feedback about OAUMods"
      className="fixed bottom-20 right-4 z-[60] inline-flex min-h-12 items-center gap-2 rounded-full border border-amber-500 bg-amber-400 px-4 py-3 text-sm font-bold text-oau-navy shadow-lg transition hover:-translate-y-0.5 hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oau-navy md:bottom-6 md:right-6"
    >
      <MessageSquareText className="h-4 w-4" aria-hidden="true" />
      <span>Feedback</span>
    </Link>
  );
}
