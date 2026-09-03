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
  "dagre-layout-source": {
    access: "public",
    author: "@dagrejs/dagre",
    id: "dagre-layout-source",
    title: "dagre — lib/layout.ts",
    type: "code",
    url: "https://github.com/dagrejs/dagre/blob/master/lib/layout.ts",
  },
  "dagre-layout-test": {
    access: "public",
    author: "@dagrejs/dagre",
    id: "dagre-layout-test",
    title: "dagre — test/layout-test.ts",
    type: "code",
    url: "https://github.com/dagrejs/dagre/blob/master/test/layout-test.ts",
  },
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
  "tanstack-router-redirect": {
    access: "public",
    author: "TanStack",
    id: "tanstack-router-redirect",
    title: "redirect function",
    type: "docs",
    url: "https://tanstack.com/router/latest/docs/framework/react/api/router/redirectFunction",
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
  "react-use": {
    access: "public",
    author: "React",
    id: "react-use",
    title: "use",
    type: "docs",
    url: "https://react.dev/reference/react/use",
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
  "react-activity": {
    access: "public",
    author: "React",
    id: "react-activity",
    title: "<Activity>",
    type: "docs",
    url: "https://react.dev/reference/react/Activity",
  },
  "react-hydrate-root": {
    access: "public",
    author: "React",
    id: "react-hydrate-root",
    title: "hydrateRoot",
    type: "docs",
    url: "https://react.dev/reference/react-dom/client/hydrateRoot",
  },
  "react-lane-source": {
    access: "public",
    author: "React",
    id: "react-lane-source",
    title: "react — packages/react-reconciler/src/ReactFiberLane.js",
    type: "code",
    url: "https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberLane.js",
  },
  "react-server-components": {
    access: "public",
    author: "React",
    id: "react-server-components",
    title: "Server Components",
    type: "docs",
    url: "https://react.dev/reference/rsc/server-components",
  },
  "react-start-transition": {
    access: "public",
    author: "React",
    id: "react-start-transition",
    title: "startTransition",
    type: "docs",
    url: "https://react.dev/reference/react/startTransition",
  },
  "react-use-client": {
    access: "public",
    author: "React",
    id: "react-use-client",
    title: "'use client'",
    type: "docs",
    url: "https://react.dev/reference/rsc/use-client",
  },
  "react-use-deferred-value": {
    access: "public",
    author: "React",
    id: "react-use-deferred-value",
    title: "useDeferredValue",
    type: "docs",
    url: "https://react.dev/reference/react/useDeferredValue",
  },
  "react-use-id": {
    access: "public",
    author: "React",
    id: "react-use-id",
    title: "useId",
    type: "docs",
    url: "https://react.dev/reference/react/useId",
  },
  "react-use-sync-external-store": {
    access: "public",
    author: "React",
    id: "react-use-sync-external-store",
    title: "useSyncExternalStore",
    type: "docs",
    url: "https://react.dev/reference/react/useSyncExternalStore",
  },
  "xyflow-layouting-example": {
    access: "public",
    author: "xyflow",
    id: "xyflow-layouting-example",
    title: "xyflow — examples/react Layouting example",
    type: "code",
    url: "https://github.com/xyflow/xyflow/blob/main/examples/react/src/examples/Layouting/index.tsx",
  },
  "xyflow-nodes-data-example": {
    access: "public",
    author: "xyflow",
    id: "xyflow-nodes-data-example",
    title: "xyflow — examples/react UseNodesData example",
    type: "code",
    url: "https://github.com/xyflow/xyflow/tree/main/examples/react/src/examples/UseNodesData",
  },
  "xyflow-react-changelog": {
    access: "public",
    author: "xyflow",
    id: "xyflow-react-changelog",
    title: "@xyflow/react — CHANGELOG",
    type: "code",
    url: "https://github.com/xyflow/xyflow/blob/main/packages/react/CHANGELOG.md",
  },
  "xyflow-react-source": {
    access: "public",
    author: "@xyflow/react",
    id: "xyflow-react-source",
    title: "@xyflow/react — packages/react source",
    type: "code",
    url: "https://github.com/xyflow/xyflow/tree/main/packages/react/src",
  },
  "xyflow-system-constants": {
    access: "public",
    author: "@xyflow/system",
    id: "xyflow-system-constants",
    title: "@xyflow/system — src/constants.ts error message table",
    type: "code",
    url: "https://github.com/xyflow/xyflow/blob/main/packages/system/src/constants.ts",
  },
  "vue-suspense": {
    access: "public",
    author: "Vue",
    id: "vue-suspense",
    title: "Suspense",
    type: "docs",
    url: "https://vuejs.org/guide/built-ins/suspense.html",
  },
  "solid-suspense-docs": {
    access: "public",
    author: "SolidJS",
    id: "solid-suspense-docs",
    title: "<Suspense>",
    type: "docs",
    url: "https://docs.solidjs.com/reference/components/suspense",
  },
  "solid-suspense-source": {
    access: "public",
    author: "SolidJS",
    id: "solid-suspense-source",
    title: "solid/packages/solid/src/render/Suspense.ts (v1.9.14)",
    type: "code",
    url: "https://github.com/solidjs/solid/blob/main/packages/solid/src/render/Suspense.ts",
  },
  "mdn-document-default-view": {
    access: "public",
    author: "MDN",
    id: "mdn-document-default-view",
    title: "Document: defaultView property",
    type: "docs",
    url: "https://developer.mozilla.org/en-US/docs/Web/API/Document/defaultView",
  },
  "mdn-node-owner-document": {
    access: "public",
    author: "MDN",
    id: "mdn-node-owner-document",
    title: "Node: ownerDocument property",
    type: "docs",
    url: "https://developer.mozilla.org/en-US/docs/Web/API/Node/ownerDocument",
  },
  "web-dev-layout-thrashing": {
    access: "public",
    author: "web.dev",
    id: "web-dev-layout-thrashing",
    title: "Avoid large, complex layouts and layout thrashing",
    type: "article",
    url: "https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing",
  },
  "web-dev-long-tasks": {
    access: "public",
    author: "web.dev",
    id: "web-dev-long-tasks",
    title: "Optimize long tasks",
    type: "article",
    url: "https://web.dev/articles/optimize-long-tasks",
  },
  "bynens-shapes-and-inline-caches": {
    access: "public",
    author: "Mathias Bynens",
    id: "bynens-shapes-and-inline-caches",
    publishedAt: "2018-05-14",
    title: "JavaScript engine fundamentals: Shapes and Inline Caches",
    type: "article",
    url: "https://mathiasbynens.be/notes/shapes-ics",
  },
  "infinite-renders-bulletproof-components": {
    access: "public",
    author: "@infinterenders",
    id: "infinite-renders-bulletproof-components",
    title: "What makes you top-notch (bulletproof React components)",
    type: "post",
    url: "https://x.com/infinterenders/status/2087881946475216931",
  },
} as const satisfies Record<string, Source>

export function getSource(id: string): Source | undefined {
  return SOURCES[id as keyof typeof SOURCES]
}
