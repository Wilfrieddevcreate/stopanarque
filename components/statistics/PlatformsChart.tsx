"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useI18n } from "@/lib/i18n/context";
import { translatePlatform } from "@/lib/i18n/data-labels";

interface Props {
  data: { platform: string; count: number }[];
  title: string;
  subtitle: string;
  barLabel: string;
  noDataText: string;
}

export function PlatformsChart({ data, title, subtitle, barLabel, noDataText }: Props) {
  const { locale } = useI18n();

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-border p-6 flex items-center justify-center h-95 text-muted text-sm">
        {noDataText}
      </div>
    );
  }

  const formatted = data.map((d) => ({ name: translatePlatform(d.platform, locale), [barLabel]: d.count }));

  return (
    <div className="bg-white rounded-2xl border border-border p-6">
      <h3 className="font-bold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted mb-4">{subtitle}</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={formatted} layout="vertical" barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
          <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} allowDecimals={false} />
          <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} width={140} />
          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} cursor={{ fill: "rgba(0,135,81,0.05)" }} />
          <Bar dataKey={barLabel} fill="#008751" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
