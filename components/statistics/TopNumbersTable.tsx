"use client";

import { motion } from "framer-motion";

interface Props {
  data: { phoneNumber: string; count: number }[];
  title: string;
  subtitle: string;
  noDataText: string;
}

export function TopNumbersTable({ data, title, subtitle, noDataText }: Props) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-border p-6 text-center text-muted text-sm">
        {noDataText}
      </div>
    );
  }

  const max = data[0]?.count || 1;

  return (
    <div className="bg-white rounded-2xl border border-border p-6">
      <h3 className="font-bold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted mb-6">{subtitle}</p>
      <div className="space-y-3">
        {data.map((item, i) => (
          <motion.div
            key={item.phoneNumber}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-4"
          >
            <span className="w-6 text-xs font-bold text-muted text-right shrink-0">
              {i + 1}.
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-sm font-semibold text-foreground">
                  {item.phoneNumber}
                </span>
                <span className="text-sm font-bold text-primary">
                  {item.count}
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.count / max) * 100}%` }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.05 }}
                  className="h-full bg-primary/80 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
