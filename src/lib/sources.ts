// Central typed source registry. Source metadata lives here, deduped by id, so
// repeat citations across the wiki stay consistent. Block-level `<SourceTrail>`
// refs point at these entries by id and add the contextual meaning (role,
// locator, relevance note).

export type Source = {
  access: "public" | "paywalled" | "book" | "private-unavailable"
  archiveUrl?: string
  author?: string
  id: string
  publishedAt?: string
  title: string
  type:
    | "article"
    | "book"
    | "code"
    | "docs"
    | "paper"
    | "post"
    | "talk"
    | "video"
  url?: string
}

export type SourceTrailRef = {
  id: string
  locator?: string
  note: string
  role:
    | "adapted-from"
    | "contrasts-with"
    | "defines"
    | "further-reading"
    | "inspired-by"
    | "supports"
}

export const SOURCES = {
  "mdn-const": {
    access: "public",
    author: "MDN",
    id: "mdn-const",
    title: "const — JavaScript reference",
    type: "docs",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const",
  },
  "mdn-hoisting": {
    access: "public",
    author: "MDN",
    id: "mdn-hoisting",
    title: "Hoisting — MDN glossary",
    type: "docs",
    url: "https://developer.mozilla.org/en-US/docs/Glossary/Hoisting",
  },
  "react-typescript-cheatsheet-function-components": {
    access: "public",
    author: "React TypeScript Cheatsheet",
    id: "react-typescript-cheatsheet-function-components",
    title: "Function Components",
    type: "docs",
    url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components",
  },
  "tanstack-router-file-based-routing": {
    access: "public",
    author: "TanStack",
    id: "tanstack-router-file-based-routing",
    title: "File-Based Routing",
    type: "docs",
    url: "https://tanstack.com/router/latest/docs/framework/react/routing/file-based-routing",
  },
  "react-preserving-and-resetting-state": {
    access: "public",
    author: "React",
    id: "react-preserving-and-resetting-state",
    title: "Preserving and Resetting State",
    type: "docs",
    url: "https://react.dev/learn/preserving-and-resetting-state",
  },
  "react-reusing-logic-with-custom-hooks": {
    access: "public",
    author: "React",
    id: "react-reusing-logic-with-custom-hooks",
    title: "Reusing Logic with Custom Hooks",
    type: "docs",
    url: "https://react.dev/learn/reusing-logic-with-custom-hooks",
  },
  "react-rules-of-hooks": {
    access: "public",
    author: "React",
    id: "react-rules-of-hooks",
    title: "Rules of Hooks",
    type: "docs",
    url: "https://react.dev/reference/rules/rules-of-hooks",
  },
  "react-strict-mode": {
    access: "public",
    author: "React",
    id: "react-strict-mode",
    title: "<StrictMode>",
    type: "docs",
    url: "https://react.dev/reference/react/StrictMode",
  },
  "react-suspense": {
    access: "public",
    author: "React",
    id: "react-suspense",
    title: "<Suspense>",
    type: "docs",
    url: "https://react.dev/reference/react/Suspense",
  },
  "react-synchronizing-with-effects": {
    access: "public",
    author: "React",
    id: "react-synchronizing-with-effects",
    title: "Synchronizing with Effects",
    type: "docs",
    url: "https://react.dev/learn/synchronizing-with-effects",
  },
  "react-use-memo": {
    access: "public",
    author: "React",
    id: "react-use-memo",
    title: "useMemo",
    type: "docs",
    url: "https://react.dev/reference/react/useMemo",
  },
  "react-you-might-not-need-an-effect": {
    access: "public",
    author: "React",
    id: "react-you-might-not-need-an-effect",
    title: "You Might Not Need an Effect",
    type: "docs",
    url: "https://react.dev/learn/you-might-not-need-an-effect",
  },
} as const satisfies Record<string, Source>

export function getSource(id: string): Source | undefined {
  return SOURCES[id as keyof typeof SOURCES]
}
