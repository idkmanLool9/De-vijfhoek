import type { Metadata } from "next";
import { MediaEditor } from "@/components/media-editor";

export const metadata: Metadata = {
  title: "Foto’s bewerken",
  description: "Tijdelijke lokale bewerkmodus voor officiële foto’s en logo’s van De Vijfhoek.",
  robots: { index: false, follow: false },
};

export default function EditorPage() { return <MediaEditor />; }
