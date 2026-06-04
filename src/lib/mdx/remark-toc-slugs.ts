import GithubSlugger from "github-slugger"
import { toString as mdastToString } from "mdast-util-to-string"

/**
 * Single-pass remark plugin that:
 *  - assigns a stable, GitHub-style `id` to every `<h2>`/`<h3>`
 *  - exports a `tableOfContents` array from the MDX module
 *
 * Headings are always direct children of the mdast root (markdown can't nest
 * them), so we can collect them with a flat iteration — no tree walk needed.
 * Using one shared slugger keeps the exported ids identical to the rendered
 * DOM ids, including de-duplication counters.
 */
export interface TocEntry {
  depth: number
  id: string
  title: string
}

export function remarkTocSlugs() {
  return (tree: any) => {
    const slugger = new GithubSlugger()
    const toc: Array<TocEntry> = []

    for (const node of tree.children) {
      if (node.type !== "heading" || node.depth < 2 || node.depth > 3) {
        continue
      }

      const title = mdastToString(node)
      const id = slugger.slug(title)

      node.data ??= {}
      node.data.hProperties ??= {}
      node.data.hProperties.id = id

      toc.push({ depth: node.depth, id, title })
    }

    const tocExport = {
      type: "mdxjsEsm",
      value: "",
      data: {
        estree: {
          type: "Program",
          sourceType: "module",
          body: [
            {
              type: "ExportNamedDeclaration",
              specifiers: [],
              source: null,
              declaration: {
                type: "VariableDeclaration",
                kind: "const",
                declarations: [
                  {
                    type: "VariableDeclarator",
                    id: { type: "Identifier", name: "tableOfContents" },
                    init: valueToEstree(toc),
                  },
                ],
              },
            },
          ],
        },
      },
    }

    tree.children.unshift(tocExport)
  }
}

/** Minimal JSON-value -> ESTree literal converter (toc is plain JSON). */
function valueToEstree(value: unknown): any {
  if (Array.isArray(value)) {
    return {
      type: "ArrayExpression",
      elements: value.map((item) => valueToEstree(item)),
    }
  }

  if (value !== null && typeof value === "object") {
    return {
      type: "ObjectExpression",
      properties: Object.entries(value).map(([key, val]) => ({
        type: "Property",
        kind: "init",
        method: false,
        shorthand: false,
        computed: false,
        key: { type: "Literal", value: key },
        value: valueToEstree(val),
      })),
    }
  }

  return { type: "Literal", value }
}
