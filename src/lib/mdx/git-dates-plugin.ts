import { execFileSync } from "node:child_process"
import { readdirSync } from "node:fs"
import path from "node:path"
import type { Plugin } from "vite"

/**
 * Exposes a `virtual:git-dates` module mapping each content doc's slug to the
 * ISO date of its last git commit — the source of truth for "Last updated".
 * Files not yet committed simply have no entry (the UI omits the line).
 *
 * Computed once when the module is first loaded; restart the dev server to
 * pick up new commits.
 */
const VIRTUAL_ID = "virtual:git-dates"
const RESOLVED_ID = "\0" + VIRTUAL_ID

export function gitDates(): Plugin {
  return {
    name: "git-dates",
    resolveId(id) {
      if (id === VIRTUAL_ID) {
        return RESOLVED_ID
      }
    },
    load(id) {
      if (id !== RESOLVED_ID) {
        return
      }

      const contentDir = path.resolve(process.cwd(), "src/content")
      const dates: Record<string, string> = {}

      const entries = readdirSync(contentDir, {
        recursive: true,
      }) as Array<string>
      for (const rel of entries) {
        if (!rel.endsWith(".mdx")) {
          continue
        }
        const full = path.join(contentDir, rel)
        const slug = rel
          .replaceAll(path.sep, "/")
          .replace(/\.mdx$/, "")
          .replace(/\/index$/, "")

        try {
          const iso = execFileSync(
            "git",
            ["log", "-1", "--format=%cI", "--", full],
            { encoding: "utf8" }
          ).trim()
          if (iso) {
            dates[slug] = iso
          }
        } catch {
          // not a git repo / git unavailable — skip
        }
      }

      return `export const docDates = ${JSON.stringify(dates)}`
    },
  }
}
