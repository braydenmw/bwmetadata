import React from 'react';

type InfoWindowProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export default function InfoWindow({ title, children, className }: InfoWindowProps) {
  return (
    <div
      className={[
        'rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2',
        className
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {title ? <p className="text-sm font-semibold text-slate-900">{title}</p> : null}
      <div className="text-slate-700 text-sm">{children}</div>
    </div>
  );
}
