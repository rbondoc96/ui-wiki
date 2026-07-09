declare module "virtual:git-dates" {
  /** Slug -> ISO date of the doc's last git commit. */
  export const docDates: Record<string, string | undefined>
}

declare module "*.mdx" {
  import type { ComponentType } from "react"
  import type { MDXComponents } from "mdx/types"
  import type { TocEntry } from "#/lib/mdx/remark-toc-slugs.ts"

  export interface Frontmatter {
    appliesTo?: string
    description?: string
    group?: string
    library?: string
    order?: number
    reviewed?: string
    section: string
    title: string
  }

  export const frontmatter: Frontmatter
  export const tableOfContents: Array<TocEntry>

  const MDXComponent: ComponentType<{ components?: MDXComponents }>
  export default MDXComponent
}
