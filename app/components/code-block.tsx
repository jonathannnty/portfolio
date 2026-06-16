import { createHighlighter } from "shiki";

type HighlighterInstance = Awaited<ReturnType<typeof createHighlighter>>;

// Persist singleton on globalThis so dev-mode hot reloads don't create new instances.
const g = globalThis as typeof globalThis & {
  __shiki?: Promise<HighlighterInstance>;
};

function getHighlighter() {
  if (!g.__shiki) {
    g.__shiki = createHighlighter({
      themes: ["github-dark-dimmed"],
      langs: ["python", "typescript", "javascript", "bash", "json"],
    });
  }
  return g.__shiki;
}

const SUPPORTED = ["python", "typescript", "javascript", "bash", "json"];

type Props = { code: string; language: string };

export async function CodeBlock({ code, language }: Props) {
  const highlighter = await getHighlighter();
  const lang = SUPPORTED.includes(language.toLowerCase())
    ? language.toLowerCase()
    : "text";

  const html = highlighter.codeToHtml(code, {
    lang,
    theme: "github-dark-dimmed",
  });

  return (
    <div
      className="[&>pre]:m-0 [&>pre]:overflow-hidden [&>pre]:whitespace-pre-wrap [&>pre]:break-words [&>pre]:p-5 [&>pre]:text-sm [&>pre]:font-mono [&>pre]:leading-6"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
