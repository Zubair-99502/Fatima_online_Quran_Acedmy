'use client';

import { useState } from 'react';

/** Safely switches to a bundled image when a remote image cannot be loaded. */
export default function FallbackImage({ src, fallback = '/images/hero-study.webp', alt = '', ...props }) {
  const [failed, setFailed] = useState(false);
  return (
    <img
      {...props}
      src={failed ? fallback : src}
      alt={alt}
      onError={() => setFailed(true)}
    />
  );
}
