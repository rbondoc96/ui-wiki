import { docDates } from "virtual:git-dates"
import type { ComponentType } from "react"
import type { MDXComponents } from "mdx/types"
import type { Frontmatter } from "*.mdx"
import type { TocEntry } from "#/lib/mdx/remark-toc-slugs.ts"

interface MdxModule {
  default: ComponentType<{ components?: MDXComponents }>
  frontmatter: Frontmatter
  tableOfContents: Array<TocEntry>
}

export interface Doc {
  Component: ComponentType<{ components?: MDXComponents }>
  description?: string
  order: number
  section: string
  slug: string
  title: string
  toc: Array<TocEntry>
  updated?: string
}

export interface NavSection {
  items: Array<Doc>
  title: string
}

// Eagerly bundled so the sidebar/search can be built synchronously on both
// server and client. Each `.mdx` becomes a `Doc` keyed by its slug.
const modules = import.meta.glob<MdxModule>("../content/**/*.mdx", {
  eager: true,
})

function pathToSlug(path: string): string {
  return path
    .replace(/^\.\.\/content\//, "")
    .replace(/\.mdx$/, "")
    .replace(/\/index$/, "")
}

const docs: Array<Doc> = Object.entries(modules).map(([path, mod]) => {
  const slug = pathToSlug(path)
  return {
    Component: mod.default,
    description: mod.frontmatter.description,
    order: mod.frontmatter.order ?? 0,
    section: mod.frontmatter.section,
    slug,
    title: mod.frontmatter.title,
    toc: mod.tableOfContents,
    updated: docDates[slug],
  }
})

const bySlug = new Map(docs.map((doc) => [doc.slug, doc]))

const sectionMap = new Map<string, Array<Doc>>()
for (const doc of docs) {
  if (!sectionMap.has(doc.section)) {
    sectionMap.set(doc.section, [])
  }
  sectionMap.get(doc.section)!.push(doc)
}

// Order sections by their lowest item `order`, then alphabetically; items
// within a section sort the same way.
export const navTree: Array<NavSection> = [...sectionMap.entries()]
  .map(([title, items]) => ({
    title,
    items: items
      .slice()
      .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title)),
  }))
  .sort(
    (a, b) =>
      Math.min(...a.items.map((d) => d.order)) -
        Math.min(...b.items.map((d) => d.order)) ||
      a.title.localeCompare(b.title)
  )

// Flattened reading order, used for prev/next navigation.
const flatDocs: Array<Doc> = navTree.flatMap((section) => section.items)

export function getDoc(slug: string): Doc | undefined {
  return bySlug.get(slug)
}

export function allDocs(): Array<Doc> {
  return flatDocs
}

export function prevNext(slug: string): {
  next?: Doc
  prev?: Doc
} {
  const index = flatDocs.findIndex((doc) => doc.slug === slug)
  if (index === -1) {
    return {}
  }
  return {
    next: flatDocs[index + 1],
    prev: flatDocs[index - 1],
  }
}
