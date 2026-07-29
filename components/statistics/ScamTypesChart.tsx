"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useI18n } from "@/lib/i18n/context";
import { translateScamType } from "@/lib/i18n/data-labels";

const COLORS = ["#E8112D", "#008751", "#FCD116", "#6366f1", "#f97316", "#06b6d4", "#ec4899", "#8b5cf6"];

interface Props {
  data: { type: string; count: number }[];
  title: string;
  subtitle: string;
  noDataText: string;
}

export function ScamTypesChart({ data, title, subtitle, noDataText }: Props) {
  const { locale } = useI18n();

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-border p-6 flex items-center justify-center h-95 text-muted text-sm">
        {noDataText}
      </div>
    );
  }

  const formatted = data.map((d) => ({ name: translateScamType(d.type, locale), value: d.count }));

  return (
    <div className="bg-white rounded-2xl border border-border p-6">
      <h3 className="font-bold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted mb-4">{subtitle}</p>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie data={formatted} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
            {formatted.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
          <Legend verticalAlign="bottom" iconType="circle" iconSize={8} formatter={(value: string) => <span className="text-xs text-gray-600">{value}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
