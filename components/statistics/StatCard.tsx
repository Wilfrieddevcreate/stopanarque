"use client";

import { motion } from "framer-motion";

export function StatCard({
  label,
  value,
  icon,
  color = "text-foreground",
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="bg-white rounded-2xl border border-border p-6 flex items-center gap-4"
    >
      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className={`text-2xl sm:text-3xl font-bold font-heading ${color}`}>{value}</p>
        <p className="text-sm text-muted">{label}</p>
      </div>
    </motion.div>
  );
}
