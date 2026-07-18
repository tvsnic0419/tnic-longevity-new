'use client';

import { Search } from 'lucide-react';
import { COMMAND_PALETTE_EVENT } from '@/components/os/os-events';

export function NotFoundSearchButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(COMMAND_PALETTE_EVENT))}
      className="focus-ring press btn-gradient w-full justify-center text-sm !py-3.5"
    >
      <Search className="w-4 h-4" aria-hidden="true" />
      Search the library
    </button>
  );
}
