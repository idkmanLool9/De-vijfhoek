import type { Metadata } from "next";
import { VisitorInfoEditor } from "@/components/visitor-info-editor";

export const metadata: Metadata = { title: "Bezoekersinformatie bewerken", description: "Lokale bewerkmodus voor de praktische informatie van De Vijfhoek.", robots: { index: false, follow: false } };

export default function InformationEditorPage() { return <VisitorInfoEditor />; }
