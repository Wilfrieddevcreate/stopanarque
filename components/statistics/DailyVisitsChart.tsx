"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface Props {
  data: { day: string; count: number }[];
  title: string;
  subtitle: string;
  barLabel: string;
  noDataText: string;
}

export function DailyVisitsChart({ data, title, subtitle, barLabel, noDataText }: Props) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-border p-6 flex items-center justify-center h-85 text-muted text-sm">
        {noDataText}
      </div>
    );
  }

  const formatted = data.map((d) => ({
    name: d.day.slice(5), // "03-27" from "2026-03-27"
    [barLabel]: d.count,
  }));

  return (
    <div className="bg-white rounded-2xl border border-border p-6">
      <h3 className="font-bold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted mb-6">{subtitle}</p>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={formatted}>
          <defs>
            <linearGradient id="visitGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#008751" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#008751" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} allowDecimals={false} />
          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
          <Area type="monotone" dataKey={barLabel} stroke="#008751" strokeWidth={2} fill="url(#visitGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
