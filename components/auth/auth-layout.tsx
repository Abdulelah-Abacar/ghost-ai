interface AuthLayoutProps {
  children: React.ReactNode;
}

const features = [
  "Turn plain language into system architecture.",
  "Collaborate on a shared technical canvas.",
  "Generate implementation-ready specifications.",
];

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-dvh bg-base lg:grid lg:grid-cols-2">
      <section className="hidden border-r border-surface-border bg-surface px-12 py-10 lg:flex lg:flex-col">
        <div className="flex items-center gap-3 text-copy-primary">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-surface-border bg-elevated font-semibold text-brand">
            G
          </div>
          <span className="text-sm font-semibold tracking-tight">Ghost AI</span>
        </div>

        <div className="my-auto max-w-sm">
          <p className="text-sm font-medium text-brand">System design, together.</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-copy-primary">
            Make complex systems clear.
          </h1>
          <ul className="mt-8 space-y-4 text-sm leading-6 text-copy-secondary">
            {features.map((feature) => (
              <li className="flex gap-3" key={feature}>
                <span aria-hidden="true" className="text-brand">
                  —
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-copy-faint">Ghost AI workspace</p>
      </section>

      <section className="flex min-h-dvh items-center justify-center px-5 py-10 sm:px-8">
        {children}
      </section>
    </main>
  );
}
