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
  library: string
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

export interface Library {
  label: string
  slug: string
}

// Top-level content libraries, in display order. Each doc belongs to one via
// its `library` frontmatter (defaulting to the first). The header switcher and
// homepage iterate this list; the sidebar and prev/next are scoped to one.
export const LIBRARIES: Array<Library> = [
  { label: "Building Blocks", slug: "building-blocks" },
  { label: "App & Screens", slug: "app-screens" },
]

const DEFAULT_LIBRARY = LIBRARIES[0].slug

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
    library: mod.frontmatter.library ?? DEFAULT_LIBRARY,
    order: mod.frontmatter.order ?? 0,
    section: mod.frontmatter.section,
    slug,
    title: mod.frontmatter.title,
    toc: mod.tableOfContents,
    updated: docDates[slug],
  }
})

const bySlug = new Map(docs.map((doc) => [doc.slug, doc]))

// Group docs into sections, ordering sections by their lowest item `order`
// then alphabetically; items within a section sort the same way.
function buildNavTree(items: Array<Doc>): Array<NavSection> {
  const sectionMap = new Map<string, Array<Doc>>()
  for (const doc of items) {
    if (!sectionMap.has(doc.section)) {
      sectionMap.set(doc.section, [])
    }
    sectionMap.get(doc.section)!.push(doc)
  }
  return [...sectionMap.entries()]
    .map(([title, sectionItems]) => ({
      title,
      items: sectionItems
        .slice()
        .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title)),
    }))
    .sort(
      (a, b) =>
        Math.min(...a.items.map((d) => d.order)) -
          Math.min(...b.items.map((d) => d.order)) ||
        a.title.localeCompare(b.title)
    )
}

const docsByLibrary = new Map<string, Array<Doc>>()
for (const doc of docs) {
  if (!docsByLibrary.has(doc.library)) {
    docsByLibrary.set(doc.library, [])
  }
  docsByLibrary.get(doc.library)!.push(doc)
}

const navTreeByLibrary = new Map<string, Array<NavSection>>()
for (const [library, items] of docsByLibrary) {
  navTreeByLibrary.set(library, buildNavTree(items))
}

// Flattened reading order across all libraries, used by search.
const flatDocs: Array<Doc> = LIBRARIES.flatMap((library) =>
  navTreeFor(library.slug).flatMap((section) => section.items)
)

export function navTreeFor(library: string): Array<NavSection> {
  return navTreeByLibrary.get(library) ?? []
}

// Libraries that actually contain docs, in display order.
export function librariesWithDocs(): Array<Library> {
  return LIBRARIES.filter((library) => docsByLibrary.has(library.slug))
}

// The library a slug belongs to, for deriving active state from the route.
export function libraryForSlug(slug: string): string {
  return bySlug.get(slug)?.library ?? DEFAULT_LIBRARY
}

// Display label for a library slug, falling back to the slug itself.
export function libraryLabel(library: string): string {
  return LIBRARIES.find((l) => l.slug === library)?.label ?? library
}

// First doc slug in a library — switcher links and the /docs redirect target.
export function firstDocSlug(library: string): string | undefined {
  return navTreeFor(library)[0]?.items[0]?.slug
}

export function getDoc(slug: string): Doc | undefined {
  return bySlug.get(slug)
}

export function allDocs(): Array<Doc> {
  return flatDocs
}

// Prev/next is scoped to the doc's own library so paging can't cross the
// boundary into another library's first/last page.
export function prevNext(slug: string): {
  next?: Doc
  prev?: Doc
} {
  const doc = bySlug.get(slug)
  if (!doc) {
    return {}
  }
  const flat = navTreeFor(doc.library).flatMap((section) => section.items)
  const index = flat.findIndex((d) => d.slug === slug)
  if (index === -1) {
    return {}
  }
  return {
    next: flat[index + 1],
    prev: flat[index - 1],
  }
}
