import { defineConfig } from "vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import mdx from "@mdx-js/rollup"
import rehypeShiki from "@shikijs/rehype"
import type { ShikiTransformer } from "shiki"
import remarkFrontmatter from "remark-frontmatter"
import remarkGfm from "remark-gfm"
import remarkMdxFrontmatter from "remark-mdx-frontmatter"

import { gitDates } from "./src/lib/mdx/git-dates-plugin.ts"
import { remarkTocSlugs } from "./src/lib/mdx/remark-toc-slugs.ts"

// Surface the fence language on the <pre> so the UI can label code blocks.
const dataLanguageTransformer: ShikiTransformer = {
  name: "data-language",
  pre(node) {
    const lang = this.options.lang
    if (lang && lang !== "text" && lang !== "plaintext") {
      node.properties["data-language"] = lang
    }
  },
}

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    gitDates(),
    tailwindcss(),
    {
      enforce: "pre",
      ...mdx({
        providerImportSource: "@mdx-js/react",
        remarkPlugins: [
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: "frontmatter" }],
          remarkGfm,
          remarkTocSlugs,
        ],
        rehypePlugins: [
          [
            rehypeShiki,
            {
              themes: { dark: "github-dark", light: "github-light" },
              defaultColor: false,
              transformers: [dataLanguageTransformer],
            },
          ],
        ],
      }),
    },
    tanstackStart(),
    viteReact({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
  ],
})

export default config
