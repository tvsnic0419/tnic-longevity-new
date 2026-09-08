'use client';

export function BiohackCheckout({
  href,
  price,
  className = '',
}: {
  href: string;
  price: number;
  className?: string;
}) {
  if (!href) {
    return (
      <a
        href="mailto:hello@tnic.help?subject=Bio%20Bible%20access"
        className={`focus-ring btn-gradient inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold ${className}`}
      >
        Request Bio Bible access
      </a>
    );
  }

  return (
    <a
      href={href}
      className={`focus-ring btn-gradient inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold ${className}`}
    >
      Unlock the Bio Bible — ${price}
    </a>
  );
}
