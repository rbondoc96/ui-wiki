import { Link } from "@tanstack/react-router"
import { CheckIcon, CopyIcon, LinkSimpleIcon } from "@phosphor-icons/react"
import { useRef, useState } from "react"
import type { MDXComponents } from "mdx/types"
import type { ComponentPropsWithoutRef, ReactNode } from "react"

import { cn } from "#/lib/utils.ts"

function AnchoredHeading({
  as: Tag,
  className,
  id,
  children,
  ...props
}: {
  as: "h2" | "h3"
  children: ReactNode
} & ComponentPropsWithoutRef<"h2">) {
  return (
    <Tag id={id} className={cn("group scroll-mt-24", className)} {...props}>
      {id ? (
        <a
          href={`#${id}`}
          className="absolute -ml-6 flex h-full items-center text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
          aria-label="Link to this section"
        >
          <LinkSimpleIcon className="size-4" />
        </a>
      ) : null}
      {children}
    </Tag>
  )
}

function SmartLink({
  href = "",
  children,
  ...props
}: ComponentPropsWithoutRef<"a">) {
  const isInternal = href.startsWith("/")
  if (isInternal) {
    return (
      <Link to={href} {...props}>
        {children}
      </Link>
    )
  }
  return (
    <a
      href={href}
      target={href.startsWith("#") ? undefined : "_blank"}
      rel="noreferrer"
      {...props}
    >
      {children}
    </a>
  )
}

type CalloutVariant = "info" | "tip" | "warning"

const calloutStyles: Record<CalloutVariant, string> = {
  info: "border-chart-3/40 bg-chart-3/10 text-foreground",
  tip: "border-primary/30 bg-primary/5 text-foreground",
  warning: "border-destructive/40 bg-destructive/10 text-foreground",
}

export function Callout({
  children,
  title,
  variant = "info",
}: {
  children: ReactNode
  title?: string
  variant?: CalloutVariant
}) {
  return (
    <aside
      className={cn(
        "my-6 rounded-lg border px-4 py-3 text-sm leading-relaxed [&>p]:my-0",
        calloutStyles[variant]
      )}
    >
      {title ? <p className="mb-1 font-semibold">{title}</p> : null}
      {children}
    </aside>
  )
}

// Wraps Shiki's `<pre>` with a hover-reveal copy button. The code text is read
// straight from the rendered DOM so we don't have to thread the raw source
// through the MDX pipeline.
function CodeBlock({ children, ...props }: ComponentPropsWithoutRef<"pre">) {
  const preRef = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)

  function copy() {
    const text = preRef.current?.textContent ?? ""
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="group relative my-6">
      <button
        aria-label="Copy code"
        className="absolute top-2.5 right-2.5 z-10 rounded-md border bg-muted/80 p-1.5 text-muted-foreground opacity-0 backdrop-blur transition-all group-hover:opacity-100 hover:bg-muted hover:text-foreground focus-visible:opacity-100"
        onClick={copy}
        type="button"
      >
        {copied ? (
          <CheckIcon className="size-3.5 text-emerald-500" />
        ) : (
          <CopyIcon className="size-3.5" />
        )}
      </button>
      <pre ref={preRef} {...props}>
        {children}
      </pre>
    </div>
  )
}

export const mdxComponents: MDXComponents = {
  a: SmartLink,
  h2: (props) => <AnchoredHeading as="h2" {...props} />,
  h3: (props) => <AnchoredHeading as="h3" {...props} />,
  pre: CodeBlock,
  Callout,
}
