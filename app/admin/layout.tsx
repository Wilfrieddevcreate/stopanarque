import type { Metadata } from "next";
import { AdminLayout } from "@/components/AdminLayout";

export const metadata: Metadata = {
  title: { absolute: "Administration — StopArnaque Bénin" },
  robots: { index: false, follow: false },
  // Sans cela, les pages admin héritent du canonical "/" du layout racine.
  alternates: { canonical: null },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
