"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FloatingFooterAd } from "@/components/ads/FloatingFooterAd";
import { PopupAdModal } from "@/components/ads/PopupAdModal";
import { AuthModal } from "@/components/auth/AuthModal";

export default function ConditionalLayout({
  children,
  navbar,
  footer,
  isExcluded: serverIsExcluded = false,
}: {
  children: React.ReactNode;
  navbar: React.ReactNode;
  footer: React.ReactNode;
  isExcluded?: boolean;
}) {
  const pathname = usePathname();
  const [isAdminDomain, setIsAdminDomain] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hostname.startsWith("admin.")) {
      setIsAdminDomain(true);
    }
  }, []);

  // Hide site navbar/footer and ads within the Admin console, on admin subdomain, or on print routes
  const isExcluded = serverIsExcluded || isAdminDomain || pathname?.startsWith('/admin') || pathname?.includes('/print');

  return (
    <>
      {!isExcluded && navbar}
      <main className="flex-grow">
        {children}
      </main>
      {!isExcluded && <FloatingFooterAd />}
      {!isExcluded && <PopupAdModal />}
      <AuthModal />
      {!isExcluded && footer}
    </>
  );
}


