import React from 'react';

export function StatCard({ title, value, subtext, icon: Icon, badgeText, badgeColor = "neutral" }) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-lg p-4 transition-colors">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500">{title}</span>
        {Icon && <Icon className="w-4 h-4 text-slate-400" />}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-slate-900">{value}</span>
        {badgeText && (
          <span className="text-xs font-medium text-slate-500">
            {badgeText}
          </span>
        )}
      </div>
      {subtext && (
        <p className="mt-1 text-xs text-slate-500 font-normal leading-relaxed">
          {subtext}
        </p>
      )}
    </div>
  );
}
