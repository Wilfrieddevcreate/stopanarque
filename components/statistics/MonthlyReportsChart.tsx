"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const MONTH_NAMES: Record<string, string> = {
  "01": "Jan", "02": "Fév", "03": "Mar", "04": "Avr", "05": "Mai", "06": "Juin",
  "07": "Juil", "08": "Aoû", "09": "Sep", "10": "Oct", "11": "Nov", "12": "Déc",
};

interface Props {
  data: { month: string; count: number }[];
  title: string;
  subtitle: string;
  barLabel: string;
  noDataText: string;
}

export function MonthlyReportsChart({ data, title, subtitle, barLabel, noDataText }: Props) {
  const formatted = data.map((d) => ({
    name: MONTH_NAMES[d.month.split("-")[1]] || d.month,
    [barLabel]: d.count,
  }));

  if (formatted.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-border p-6 flex items-center justify-center h-85 text-muted text-sm">
        {noDataText}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-border p-6">
      <h3 className="font-bold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted mb-6">{subtitle}</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={formatted} barCategoryGap="25%">
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} allowDecimals={false} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
            cursor={{ fill: "rgba(232,17,45,0.05)" }}
          />
          <Bar dataKey={barLabel} fill="#E8112D" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
