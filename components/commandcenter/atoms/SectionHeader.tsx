import React from 'react';

type IconLike = React.ComponentType<{ className?: string }>;

type SectionHeaderProps = {
  icon: IconLike;
  title: string;
  className?: string;
};

export default function SectionHeader({ icon: Icon, title, className }: SectionHeaderProps) {
  return (
    <div
      className={['flex items-center gap-2 text-sm font-semibold text-slate-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      <Icon className="w-4 h-4 text-slate-900" />
      <h2 className="text-lg sm:text-xl font-bold">{title}</h2>
    </div>
  );
}
