import { cn } from "#/lib/utils.ts"

// Side-by-side structural comparison for the web-vs-native navigation page: the
// same small app expressed as a web route tree and as a native navigator tree,
// so the mapping (and the places it doesn't map) is visible. Static on purpose —
// it's a structure diagram, not a working app.

interface TreeNode {
  children?: Array<TreeNode>
  label: string
}

const WEB: TreeNode = {
  label: "/ root layout",
  children: [
    { label: "/login" },
    {
      label: "/app — shell layout",
      children: [
        { label: "/app/projects" },
        { label: "/app/projects/:id" },
        { label: "/app/settings" },
      ],
    },
  ],
}

const NATIVE: TreeNode = {
  label: "Root Stack",
  children: [
    { label: "Login (screen)" },
    {
      label: "App — Tab navigator",
      children: [
        {
          label: "Projects — Stack",
          children: [{ label: "List (screen)" }, { label: "Detail (screen)" }],
        },
        {
          label: "Settings — Stack",
          children: [{ label: "Settings (screen)" }],
        },
      ],
    },
  ],
}

function Branch({ depth = 0, node }: { depth?: number; node: TreeNode }) {
  return (
    <li>
      <span
        className="block py-0.5"
        style={{ paddingLeft: `${depth * 0.85}rem` }}
      >
        {depth > 0 ? (
          <span className="text-muted-foreground/40">— </span>
        ) : null}
        {node.label}
      </span>
      {node.children ? (
        <ul>
          {node.children.map((c) => (
            <Branch depth={depth + 1} key={c.label} node={c} />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

function Panel({
  root,
  subtitle,
  title,
}: {
  root: TreeNode
  subtitle: string
  title: string
}) {
  return (
    <div className="overflow-x-auto p-4">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mb-3 text-xs text-muted-foreground">{subtitle}</p>
      <ul className="font-mono text-[0.72rem] leading-relaxed text-foreground">
        <Branch node={root} />
      </ul>
    </div>
  )
}

export function NavModelMap() {
  return (
    <figure className="not-prose my-8">
      <div
        className={cn(
          "grid divide-y divide-border overflow-hidden rounded-xl border border-border bg-card",
          "sm:grid-cols-2 sm:divide-x sm:divide-y-0"
        )}
      >
        <Panel
          root={WEB}
          subtitle="Layouts nest under URL segments. The URL is the address."
          title="Web · route tree"
        />
        <Panel
          root={NATIVE}
          subtitle="Screens nest under navigators. There is no URL by default."
          title="Native · navigator tree"
        />
      </div>
      <figcaption className="mt-2 text-center text-xs text-muted-foreground">
        The same app, two structures: web nests layouts under URLs, native nests
        screens under navigators.
      </figcaption>
    </figure>
  )
}
