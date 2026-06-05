import { useRef, useState } from "react"
import type { Ref } from "react"

import { cn } from "#/lib/utils.ts"

// Visual examples for the Forms section. The `*Demo` components with a `good`
// prop sit inside a `<Do>` / `<Dont>` `preview` slot; `WizardDemo` is
// interactive and stands alone in the page.

const EMAIL = /.+@.+\..+/

const primaryButton =
  "self-start rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"

const secondaryButton =
  "self-start rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"

// A minimal labelled input shared by the demos. `reserveError` always renders
// the error line (so its presence/absence can't shift the layout); without it,
// the error node is inserted on demand — the layout-jump being illustrated.
function DemoField({
  error,
  inputRef,
  label,
  onBlur,
  onChange,
  placeholder,
  readOnly = false,
  reserveError = false,
  type = "text",
  value,
}: {
  error?: string
  inputRef?: Ref<HTMLInputElement>
  label: string
  onBlur?: () => void
  onChange?: (value: string) => void
  placeholder?: string
  readOnly?: boolean
  reserveError?: boolean
  type?: string
  value: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[0.7rem] font-medium text-foreground">
        {label}
      </label>
      <input
        className={cn(
          "rounded-md border bg-background px-2 py-1 text-xs text-foreground outline-none",
          error ? "border-destructive" : "border-border focus:border-primary"
        )}
        onBlur={onBlur}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        ref={inputRef}
        type={type}
        value={value}
      />
      {reserveError ? (
        <p
          className="min-h-[0.95rem] text-[0.7rem] text-destructive"
          role="alert"
        >
          {error ?? ""}
        </p>
      ) : error ? (
        <p className="text-[0.7rem] text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

// Toggle an error on a static field. With a reserved slot (good) the password
// field below stays put; without one (don't) it jumps down as the error
// appears — the layout-jitter the guidance warns about.
export function ErrorSlotDemo({ good = false }: { good?: boolean }) {
  const [errored, setErrored] = useState(false)
  return (
    <div className="flex flex-col gap-2">
      <button
        className={secondaryButton}
        onClick={() => setErrored((e) => !e)}
        type="button"
      >
        {errored ? "Clear error" : "Show error"}
      </button>
      <DemoField
        error={errored ? "Enter a valid email" : undefined}
        label="Email"
        readOnly
        reserveError={good}
        value="not-an-email"
      />
      <DemoField label="Password" readOnly type="password" value="" />
    </div>
  )
}

// Type an invalid email and watch when the error fires. Good: nothing until
// blur, then live as you fix it. Don't: an error on the first character.
export function ValidationTimingDemo({ good = false }: { good?: boolean }) {
  const [touched, setTouched] = useState(false)
  const [value, setValue] = useState("")
  const valid = EMAIL.test(value)
  const showError = value.length > 0 && !valid && (good ? touched : true)
  return (
    <div className="flex flex-col gap-1">
      <DemoField
        error={showError ? "Enter an email like name@example.com" : undefined}
        label="Email"
        onBlur={good ? () => setTouched(true) : undefined}
        onChange={setValue}
        placeholder="you@example.com"
        reserveError
        type="email"
        value={value}
      />
      <p className="text-[0.65rem] text-muted-foreground">
        {good
          ? "Errors on blur, then live-clears as you fix it."
          : "Errors on every keystroke from the first character."}
      </p>
    </div>
  )
}

// Good: submit is always pressable; pressing it while invalid surfaces the
// error and focuses the field. Don't: submit is disabled until valid, dead and
// unexplained.
export function SubmitButtonDemo({ good = false }: { good?: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string>()
  const [value, setValue] = useState("")
  const valid = value.trim().length > 0

  function submit() {
    if (!valid) {
      setError("Enter your name to continue")
      inputRef.current?.focus()
      return
    }
    setError(undefined)
    setDone(true)
  }

  return (
    <div className="flex flex-col gap-2">
      <DemoField
        error={error}
        inputRef={inputRef}
        label="Name"
        onChange={(v) => {
          setValue(v)
          setDone(false)
        }}
        placeholder="Ada Lovelace"
        reserveError
        value={value}
      />
      {good ? (
        <button className={primaryButton} onClick={submit} type="button">
          Submit
        </button>
      ) : (
        <button
          className={cn(
            primaryButton,
            "disabled:cursor-not-allowed disabled:opacity-40"
          )}
          disabled={!valid}
          type="button"
        >
          Submit
        </button>
      )}
      {done ? (
        <p className="text-[0.7rem] text-emerald-500">Submitted ✓</p>
      ) : null}
      {good ? null : (
        <p className="text-[0.65rem] text-muted-foreground">
          Disabled until valid — no reason given, and not focusable.
        </p>
      )}
    </div>
  )
}

const wizardSteps = ["Account", "Review"] as const

// A working two-step wizard: Next validates only the current step, Back is
// always available and preserves everything entered, and progress is honest.
export function WizardDemo() {
  const [done, setDone] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; name?: string }>({})
  const [step, setStep] = useState(0)
  const [values, setValues] = useState({ email: "", name: "" })

  function set(key: "email" | "name", value: string) {
    setValues((v) => ({ ...v, [key]: value }))
  }

  function next() {
    const e: { email?: string; name?: string } = {}
    if (!values.name.trim()) e.name = "Required"
    if (!EMAIL.test(values.email)) e.email = "Enter a valid email"
    setErrors(e)
    if (Object.keys(e).length === 0) setStep(1)
  }

  function reset() {
    setDone(false)
    setErrors({})
    setStep(0)
    setValues({ email: "", name: "" })
  }

  return (
    <div className="not-prose my-8 overflow-hidden rounded-xl border border-border bg-card text-sm shadow-sm">
      <div className="border-b border-border bg-muted/35 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="font-medium text-foreground">
            {done ? "Done" : wizardSteps[step]}
          </div>
          <div aria-live="polite" className="text-xs text-muted-foreground">
            {done ? "Submitted" : `Step ${step + 1} of ${wizardSteps.length}`}
          </div>
        </div>
        <div className="mt-2 flex gap-1">
          {wizardSteps.map((label, i) => (
            <div
              className={cn(
                "h-1 flex-1 rounded-full",
                done || i <= step ? "bg-primary" : "bg-border"
              )}
              key={label}
            />
          ))}
        </div>
      </div>

      <div className="p-4">
        {done ? (
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm text-foreground">
              Thanks, {values.name} — a confirmation is on its way to{" "}
              {values.email}.
            </p>
            <button className={secondaryButton} onClick={reset} type="button">
              Start over
            </button>
          </div>
        ) : step === 0 ? (
          <div className="flex flex-col gap-3">
            <DemoField
              error={errors.name}
              label="Name"
              onChange={(v) => set("name", v)}
              placeholder="Ada Lovelace"
              reserveError
              value={values.name}
            />
            <DemoField
              error={errors.email}
              label="Email"
              onChange={(v) => set("email", v)}
              placeholder="you@example.com"
              reserveError
              type="email"
              value={values.email}
            />
            <button className={primaryButton} onClick={next} type="button">
              Next
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">
              <dt className="text-muted-foreground">Name</dt>
              <dd className="text-foreground">{values.name}</dd>
              <dt className="text-muted-foreground">Email</dt>
              <dd className="text-foreground">{values.email}</dd>
            </dl>
            <div className="flex gap-2">
              <button
                className={secondaryButton}
                onClick={() => setStep(0)}
                type="button"
              >
                Back
              </button>
              <button
                className={primaryButton}
                onClick={() => setDone(true)}
                type="button"
              >
                Submit
              </button>
            </div>
            <p className="text-[0.65rem] text-muted-foreground">
              Back keeps everything you entered — try it.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
