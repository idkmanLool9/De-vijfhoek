import Link from "next/link";
import { Store } from "lucide-react";

export function Brand() {
  return <Link href="/" className="brand" aria-label="De Vijfhoek Oldenzaal — home">
    <Store size={34} strokeWidth={1.35} aria-hidden="true" />
    <span><strong>DE VIJFHOEK</strong><small>OLDENZAAL</small></span>
  </Link>;
}
