export type InformationSection = { title: string; paragraphs: string[] };

// Recognise plain-text headings without interpreting HTML or changing content.
export function informationSections(text: string): InformationSection[] {
  const sections: InformationSection[] = [];
  const blocks = text.trim().split(/\n\s*\n/).filter(Boolean);
  for (let index = 0; index < blocks.length; index++) {
    const lines = blocks[index].split("\n");
    const first = lines[0].trim();
    const heading = first.length <= 85 && !/[.!?:;]$/.test(first) && !/^[•*-]\s/.test(first);
    if (heading && (lines.length > 1 || index < blocks.length - 1)) {
      sections.push({ title: first, paragraphs: lines.length > 1 ? [lines.slice(1).join("\n")] : [] });
    } else {
      if (!sections.length) sections.push({ title: "", paragraphs: [] });
      sections[sections.length - 1].paragraphs.push(blocks[index]);
    }
  }
  return sections;
}
