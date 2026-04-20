import { Rocket } from 'lucide-react';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 px-4">
      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <Rocket className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
          Startup OS
        </span>
      </div>
      {children}
    </div>
  );
}
