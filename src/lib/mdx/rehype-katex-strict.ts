import type { VFile } from "vfile"

/**
 * Turns a malformed formula into a build failure.
 *
 * `rehype-katex` never throws: it records a warning on the vfile and renders
 * KaTeX's red error text in place of the math. On a docs site that ships a
 * broken formula silently, so this runs straight after it and escalates those
 * warnings, the same way `SOURCES` rejects an unknown source id.
 *
 * Must be registered *after* `rehype-katex` in `rehypePlugins`.
 */
export function rehypeKatexStrict() {
  return (_tree: unknown, file: VFile) => {
    const failures = file.messages.filter(
      (message) => message.source === "rehype-katex"
    )
    if (failures.length === 0) {
      return
    }

    const details = failures
      .map((message) => {
        const line = message.place
          ? `:${"start" in message.place ? message.place.start.line : message.place.line}`
          : ""
        // `cause` carries KaTeX's own diagnostic, which names the bad command.
        const reason =
          message.cause instanceof Error
            ? message.cause.message
            : message.reason
        return `  ${file.path}${line} — ${reason}`
      })
      .join("\n")

    throw new Error(
      `KaTeX could not render ${failures.length} formula(s):\n${details}`
    )
  }
}
