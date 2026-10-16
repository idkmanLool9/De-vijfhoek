import type { ReactNode } from "react";
import { EditorNavigation } from "@/components/editor-navigation";
import "./editor.css";

export default function EditorLayout({ children }: { children: ReactNode }) {
  return <><EditorNavigation />{children}</>;
}
