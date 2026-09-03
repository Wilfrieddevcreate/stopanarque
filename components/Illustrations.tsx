"use client";

import { motion } from "framer-motion";

/* ─── Hero — phone + shield scene ─── */
export function HeroIllustration() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="relative w-full max-w-sm mx-auto select-none"
    >
      <svg viewBox="0 0 400 440" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
        {/* Background circles */}
        <circle cx="200" cy="230" r="190" fill="#E8112D" fillOpacity="0.04" />
        <circle cx="200" cy="230" r="130" fill="#E8112D" fillOpacity="0.04" />

        {/* Phone body */}
        <rect x="130" y="80" width="140" height="250" rx="24" fill="#0f172a" />
        {/* Camera notch */}
        <rect x="183" y="88" width="34" height="8" rx="4" fill="#1e293b" />
        {/* Screen */}
        <rect x="141" y="100" width="118" height="210" rx="14" fill="#f8fafc" />
        {/* Home bar */}
        <rect x="173" y="320" width="54" height="4" rx="2" fill="#334155" />

        {/* Screen content — form */}
        <rect x="155" y="116" width="90" height="7" rx="3.5" fill="#cbd5e1" />

        {/* Input fields */}
        <rect x="155" y="136" width="90" height="22" rx="7" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
        <rect x="162" y="143" width="55" height="7" rx="3.5" fill="#e2e8f0" />

        <rect x="155" y="165" width="90" height="22" rx="7" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
        <rect x="162" y="172" width="40" height="7" rx="3.5" fill="#e2e8f0" />

        <rect x="155" y="194" width="90" height="22" rx="7" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
        <rect x="162" y="201" width="65" height="7" rx="3.5" fill="#e2e8f0" />

        {/* Submit button */}
        <rect x="155" y="228" width="90" height="30" rx="10" fill="#E8112D" />
        <text x="200" y="248" textAnchor="middle" fill="white" fontSize="11" fontWeight="700" fontFamily="system-ui">Signaler</text>

        {/* Arrow icon on button */}
        <path d="M232 243 L236 247 L232 251" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Shield — overlapping phone top */}
        <path d="M200 55 L248 74 L248 138 Q248 178 200 198 Q152 178 152 138 L152 74 Z"
          fill="#E8112D" fillOpacity="0.08" stroke="#E8112D" strokeWidth="2.5" />
        {/* Shield checkmark */}
        <path d="M187 122 L197 134 L217 110" stroke="#E8112D" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* ── Floating left card — warning ── */}
        <g filter="url(#shadow1)">
          <rect x="10" y="130" width="126" height="58" rx="14" fill="white" />
          {/* amber icon */}
          <circle cx="34" cy="159" r="13" fill="#FEF3C7" />
          <path d="M34 153 L34 160" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
          <circle cx="34" cy="164" r="1.5" fill="#D97706" />
          <text x="53" y="154" fill="#0f172a" fontSize="9.5" fontWeight="700" fontFamily="system-ui">SMS suspect</text>
          <text x="53" y="167" fill="#64748b" fontSize="8.5" fontFamily="system-ui">Faux Mobile Money</text>
        </g>

        {/* ── Floating right card — confirmed ── */}
        <g filter="url(#shadow2)">
          <rect x="264" y="168" width="130" height="58" rx="14" fill="white" />
          {/* green icon */}
          <circle cx="287" cy="197" r="13" fill="#DCFCE7" />
          <path d="M281 197 L285 201 L293 192" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <text x="306" y="192" fill="#0f172a" fontSize="9.5" fontWeight="700" fontFamily="system-ui">Confirmé</text>
          <text x="306" y="205" fill="#64748b" fontSize="8.5" fontFamily="system-ui">Numéro blacklisté</text>
        </g>

        {/* ── Floating bottom card — count badge ── */}
        <g filter="url(#shadow3)">
          <rect x="60" y="360" width="280" height="54" rx="14" fill="white" />
          <circle cx="88" cy="387" r="14" fill="#FEE2E2" />
          <text x="88" y="392" textAnchor="middle" fill="#E8112D" fontSize="13" fontWeight="800" fontFamily="system-ui">12</text>
          <text x="110" y="383" fill="#0f172a" fontSize="9.5" fontWeight="700" fontFamily="system-ui">signalements cette semaine</text>
          <text x="110" y="396" fill="#64748b" fontSize="8.5" fontFamily="system-ui">au Bénin · mis à jour en temps réel</text>
          <circle cx="324" cy="387" r="5" fill="#22C55E" />
        </g>

        {/* Decorative dots */}
        <circle cx="50" cy="85" r="7" fill="#E8112D" fillOpacity="0.15" />
        <circle cx="370" cy="110" r="5" fill="#22C55E" fillOpacity="0.25" />
        <circle cx="20" cy="310" r="5" fill="#F59E0B" fillOpacity="0.25" />
        <circle cx="390" cy="340" r="8" fill="#E8112D" fillOpacity="0.1" />
        <circle cx="350" cy="60" r="4" fill="#E8112D" fillOpacity="0.2" />
        <circle cx="70" cy="250" r="4" fill="#22C55E" fillOpacity="0.2" />

        {/* Benin flag accent stripe */}
        <rect x="152" y="425" width="32" height="5" rx="2.5" fill="#008751" />
        <rect x="188" y="425" width="32" height="5" rx="2.5" fill="#FCD20F" />
        <rect x="224" y="425" width="32" height="5" rx="2.5" fill="#E8112D" />

        {/* SVG filters for shadows */}
        <defs>
          <filter id="shadow1" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.08" />
          </filter>
          <filter id="shadow2" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.08" />
          </filter>
          <filter id="shadow3" x="-10%" y="-20%" width="120%" height="160%">
            <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#0f172a" floodOpacity="0.1" />
          </filter>
        </defs>
      </svg>

      {/* Animated floating dots */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-8 right-4 w-4 h-4 rounded-full bg-primary/20"
      />
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-24 left-4 w-3 h-3 rounded-full bg-success/30"
      />
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute top-32 left-0 w-2 h-2 rounded-full bg-accent/40"
      />
    </motion.div>
  );
}

/* ─── Step 1 — Rédiger un signalement ─── */
export function StepIllustration1() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-16 h-16">
      <rect width="80" height="80" rx="20" fill="#FEE2E2" />
      {/* Document */}
      <rect x="20" y="14" width="40" height="52" rx="6" fill="white" stroke="#E8112D" strokeWidth="2" />
      {/* Lines */}
      <rect x="28" y="26" width="24" height="3" rx="1.5" fill="#fca5a5" />
      <rect x="28" y="34" width="18" height="3" rx="1.5" fill="#fca5a5" />
      <rect x="28" y="42" width="22" height="3" rx="1.5" fill="#fca5a5" />
      {/* Pen */}
      <rect x="46" y="50" width="6" height="18" rx="3" transform="rotate(-40 46 50)" fill="#E8112D" />
      <path d="M54 60 L58 64 L54 64 Z" fill="#1e293b" />
    </svg>
  );
}

/* ─── Step 2 — Vérification par l'équipe ─── */
export function StepIllustration2() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-16 h-16">
      <rect width="80" height="80" rx="20" fill="#DCFCE7" />
      {/* Shield */}
      <path d="M40 12 L60 20 L60 44 Q60 58 40 66 Q20 58 20 44 L20 20 Z"
        fill="white" stroke="#16A34A" strokeWidth="2.5" />
      {/* Magnifying glass */}
      <circle cx="38" cy="38" r="10" stroke="#16A34A" strokeWidth="2.5" fill="white" />
      <circle cx="38" cy="38" r="5" fill="#DCFCE7" />
      <path d="M45 45 L52 52" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
      {/* Check tick inside glass */}
      <path d="M35 38 L37 40 L41 36" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Step 3 — Résultat visible pour tous ─── */
export function StepIllustration3() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-16 h-16">
      <rect width="80" height="80" rx="20" fill="#EFF6FF" />
      {/* Search bar */}
      <rect x="12" y="22" width="56" height="18" rx="9" fill="white" stroke="#3B82F6" strokeWidth="2" />
      <circle cx="27" cy="31" r="5" stroke="#3B82F6" strokeWidth="2" fill="none" />
      <path d="M31 35 L34 38" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
      {/* Results list */}
      <rect x="12" y="46" width="56" height="10" rx="5" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
      <rect x="18" y="50" width="30" height="3" rx="1.5" fill="#bfdbfe" />
      <circle cx="60" cy="51" r="4" fill="#DCFCE7" />
      <path d="M58 51 L59.5 52.5 L62 50" stroke="#16A34A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />

      <rect x="12" y="60" width="56" height="10" rx="5" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
      <rect x="18" y="64" width="22" height="3" rx="1.5" fill="#fecaca" />
      <circle cx="60" cy="65" r="4" fill="#FEE2E2" />
      <text x="60" y="69" textAnchor="middle" fill="#E8112D" fontSize="7" fontWeight="800">!</text>
    </svg>
  );
}

/* ─── Community illustration for WhyReport ─── */
export function CommunityIllustration() {
  return (
    <svg viewBox="0 0 320 260" fill="none" className="w-full max-w-xs mx-auto">
      {/* Background blob */}
      <ellipse cx="160" cy="140" rx="140" ry="100" fill="#E8112D" fillOpacity="0.05" />

      {/* Central shield */}
      <path d="M160 40 L200 58 L200 110 Q200 140 160 158 Q120 140 120 110 L120 58 Z"
        fill="white" stroke="#E8112D" strokeWidth="3" />
      <path d="M147 98 L157 110 L175 88" stroke="#E8112D" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

      {/* Person left */}
      <circle cx="68" cy="100" r="18" fill="#FEE2E2" />
      <circle cx="68" cy="92" r="10" fill="#fca5a5" />
      <path d="M50 126 Q68 116 86 126" stroke="#fca5a5" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Person right */}
      <circle cx="252" cy="100" r="18" fill="#DCFCE7" />
      <circle cx="252" cy="92" r="10" fill="#86efac" />
      <path d="M234 126 Q252 116 270 126" stroke="#86efac" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Person bottom */}
      <circle cx="160" cy="200" r="18" fill="#FEF3C7" />
      <circle cx="160" cy="192" r="10" fill="#fde68a" />
      <path d="M142 226 Q160 216 178 226" stroke="#fde68a" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Connecting lines */}
      <path d="M86 100 L120 85" stroke="#E8112D" strokeWidth="1.5" strokeDasharray="4 3" strokeOpacity="0.4" />
      <path d="M200 85 L234 100" stroke="#E8112D" strokeWidth="1.5" strokeDasharray="4 3" strokeOpacity="0.4" />
      <path d="M160 158 L160 182" stroke="#E8112D" strokeWidth="1.5" strokeDasharray="4 3" strokeOpacity="0.4" />

      {/* Floating plus badges */}
      <circle cx="40" cy="160" r="12" fill="#E8112D" />
      <text x="40" y="165" textAnchor="middle" fill="white" fontSize="14" fontWeight="800">+</text>

      <circle cx="280" cy="60" r="12" fill="#22C55E" />
      <path d="M275 60 L278 63 L285 57" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Benin flag dots */}
      <circle cx="100" cy="240" r="5" fill="#008751" />
      <circle cx="160" cy="248" r="5" fill="#FCD20F" />
      <circle cx="220" cy="240" r="5" fill="#E8112D" />
    </svg>
  );
}
