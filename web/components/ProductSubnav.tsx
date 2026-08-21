"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PRODUCT_SUBNAV } from "@/lib/nav";

export function ProductSubnav() {
  const pathname = usePathname();
  return (
    <div className="subnav">
      {PRODUCT_SUBNAV.map((item) => (
        <Link
          key={item.href}
          className={`chip${pathname === item.href ? " on" : ""}`}
          href={item.href}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
