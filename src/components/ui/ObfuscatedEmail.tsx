'use client';

import React, { useState, useEffect } from 'react';

interface ObfuscatedEmailProps {
  user?: string;
  domain?: string;
  subject?: string;
  label?: string;
  className?: string;
}

/**
 * ObfuscatedEmail protects email addresses from automated scraping bots.
 * In SSR / initial HTML payload, it renders an obfuscated format without `@` or `mailto:`.
 * On client hydration, it activates a full, accessible `mailto:` link for real visitors.
 */
export function ObfuscatedEmail({
  user = 'info',
  domain = 'healthghuru.com',
  subject,
  label,
  className = '',
}: ObfuscatedEmailProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const emailAddress = `${user}@${domain}`;
  const mailtoHref = `mailto:${emailAddress}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;

  if (!mounted) {
    // Initial server HTML: scrapers scanning static HTML see zero plaintext emails or mailto: links
    return (
      <span className={className} aria-label={`Email ${user} at ${domain}`}>
        {label || `${user} [at] ${domain}`}
      </span>
    );
  }

  return (
    <a
      href={mailtoHref}
      className={className}
      rel="nofollow noopener noreferrer"
      aria-label={`Email ${emailAddress}`}
    >
      {label || emailAddress}
    </a>
  );
}

export default ObfuscatedEmail;
