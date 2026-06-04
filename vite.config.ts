import { defineConfig } from "vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import mdx from "@mdx-js/rollup"
import rehypeShiki from "@shikijs/rehype"
import remarkFrontmatter from "remark-frontmatter"
import remarkGfm from "remark-gfm"
import remarkMdxFrontmatter from "remark-mdx-frontmatter"

import { gitDates } from "./src/lib/mdx/git-dates-plugin.ts"
import { remarkTocSlugs } from "./src/lib/mdx/remark-toc-slugs.ts"

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
