import React from 'react';

type SectionShellProps = {
  children: React.ReactNode;
  className?: string;
};

export default function SectionShell({ children, className }: SectionShellProps) {
  return (
    <section
      className={[
        'bg-white border border-slate-200 p-8 rounded-2xl shadow-lg',
        className
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </section>
  );
}
