"use client";

import { useState } from "react";
import { Download, ExternalLink, FileText, ChevronDown, ChevronUp } from "lucide-react";

/**
 * Inline PDF resume viewer.
 *
 * Drop your resume PDF into /public/resume.pdf.
 * The viewer embeds it via <iframe> with a fallback download link
 * for browsers that block inline PDFs.
 */
export default function ResumeViewer() {
  const [expanded, setExpanded] = useState(false);
  const src = "/resume.pdf";

  return (
    <div className="mt-6 max-w-6xl">
      <div className="card overflow-hidden p-0">
        {/* Header bar */}
        <div className="flex items-center justify-between gap-4 border-b border-[color:var(--color-border)] px-5 py-3">
          <div className="flex items-center gap-2 text-sm font-medium text-[color:var(--color-fg)]">
            <FileText className="h-4 w-4 text-[color:var(--color-primary-600)]" />
            Resume
          </div>
          <div className="flex items-center gap-4">
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-s text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-primary-700)] transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Open
            </a>
            <a
              href={src}
              download
              className="inline-flex items-center gap-1 text-s text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-primary-700)] transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </a>
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              aria-expanded={expanded}
              className="inline-flex items-center gap-1 rounded-md bg-[color:var(--color-primary-50)] px-2.5 py-1 text-s font-medium text-[color:var(--color-primary-700)] hover:bg-[color:var(--color-primary-100)] transition-colors"
            >
              {expanded ? (
                <>Collapse <ChevronUp className="h-3.5 w-3.5" /></>
              ) : (
                <>View <ChevronDown className="h-3.5 w-3.5" /></>
              )}
            </button>
          </div>
        </div>

        {/* PDF embed — only rendered when expanded */}
        {expanded && (
          <div className="relative w-full" style={{ height: "75vh" }}>
            <iframe
              src={`${src}#toolbar=0&navpanes=0`}
              className="h-full w-full border-0"
              title="Resume PDF"
            >
              {/* Fallback for browsers that block inline PDFs */}
              <div className="flex flex-col items-center justify-center gap-3 p-10 text-center text-sm text-[color:var(--color-fg-muted)]">
                <p>Your browser can&apos;t display the PDF inline.</p>
                <a href={src} download className="btn-primary">
                  <Download className="h-4 w-4" />
                  Download Resume
                </a>
              </div>
            </iframe>
          </div>
        )}
      </div>
    </div>
  );
}
