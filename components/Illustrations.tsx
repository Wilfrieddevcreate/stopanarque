"use client";

import { motion } from "framer-motion";

/* ─── Hero — floating cards + shield ─── */
export function HeroIllustration() {
  return (
    <motion.div
      initial={{ x: 28 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.65, delay: 0.22, ease: "easeOut" }}
      className="relative w-full max-w-[460px] mx-auto select-none"
    >
      <svg viewBox="0 0 480 460" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
        <defs>
          {/* Atmosphere */}
          <radialGradient id="gAtm" cx="50%" cy="46%" r="52%">
            <stop offset="0%" stopColor="#E8112D" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#E8112D" stopOpacity="0" />
          </radialGradient>
          {/* Shield gradient */}
          <linearGradient id="gSh" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E8112D" />
            <stop offset="100%" stopColor="#9f1239" />
          </linearGradient>
          {/* Warning accent */}
          <linearGradient id="gWn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          {/* Success accent */}
          <linearGradient id="gOk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#16A34A" />
          </linearGradient>
          {/* Dark stats card */}
          <linearGradient id="gDk" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          {/* Card shadows — stdDeviation réduit pour perf GPU */}
          <filter id="fSh" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="5" stdDeviation="10" floodColor="#E8112D" floodOpacity="0.28" />
          </filter>
          <filter id="fCd" x="-18%" y="-18%" width="136%" height="136%">
            <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#1e293b" floodOpacity="0.10" />
          </filter>
          <filter id="fDk" x="-12%" y="-22%" width="124%" height="150%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#E8112D" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* ── Atmosphere ── */}
        <ellipse cx="240" cy="224" rx="218" ry="200" fill="url(#gAtm)" />
        <ellipse cx="380" cy="140" rx="88" ry="78" fill="#22C55E" fillOpacity="0.04" />
        <ellipse cx="82" cy="310" rx="74" ry="66" fill="#F59E0B" fillOpacity="0.04" />

        {/* ── Shield badge (top center, floating) ── */}
        {/* Glow rings */}
        <circle cx="240" cy="58" r="46" fill="#E8112D" fillOpacity="0.07" />
        <circle cx="240" cy="58" r="34" fill="#E8112D" fillOpacity="0.08" />
        {/* Shield shape */}
        <g filter="url(#fSh)">
          <path d="M240 26 L268 40 L268 66 Q268 86 240 98 Q212 86 212 66 L212 40 Z"
            fill="url(#gSh)" />
          <path d="M229 59 L236 67 L252 49" stroke="white" strokeWidth="3.5"
            strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Dotted connector lines — shield to cards */}
        <path d="M226 96 Q180 110 148 138" stroke="#E8112D" strokeWidth="1.2"
          strokeOpacity="0.18" strokeDasharray="5 4" fill="none" />
        <path d="M254 96 Q300 110 334 144" stroke="#E8112D" strokeWidth="1.2"
          strokeOpacity="0.18" strokeDasharray="5 4" fill="none" />

        {/* ── Warning card (left, tilted -5°) ── */}
        <g filter="url(#fCd)" transform="rotate(-5, 125, 192)">
          {/* Card */}
          <rect x="18" y="116" width="214" height="152" rx="22" fill="white" />
          {/* Accent bar */}
          <rect x="18" y="116" width="6" height="152" rx="3" fill="url(#gWn)" />

          {/* Icon circle */}
          <circle cx="58" cy="158" r="22" fill="#FEF3C7" />
          {/* Warning triangle */}
          <path d="M58 144 L73 170 H43 Z" fill="#F59E0B" />
          <rect x="56.5" y="150" width="3" height="11" rx="1.5" fill="white" />
          <circle cx="58" cy="165" r="2" fill="white" />

          {/* Title */}
          <text x="90" y="146" fill="#0f172a" fontSize="13" fontWeight="800"
            fontFamily="'Space Grotesk', sans-serif">Arnaque détectée</text>
          {/* Sub */}
          <text x="90" y="163" fill="#64748b" fontSize="10.5"
            fontFamily="'Space Grotesk', sans-serif">Faux Mobile Money</text>

          {/* Badge */}
          <rect x="90" y="173" width="86" height="20" rx="10" fill="#FEF3C7" />
          <text x="133" y="187" textAnchor="middle" fill="#D97706" fontSize="9.5" fontWeight="700"
            fontFamily="'Space Grotesk', sans-serif">× 3 signalements</text>

          {/* Divider */}
          <line x1="30" y1="207" x2="220" y2="207" stroke="#f1f5f9" strokeWidth="1.2" />

          {/* Footer */}
          <circle cx="36" cy="226" r="4.5" fill="#F59E0B" fillOpacity="0.45" />
          <circle cx="36" cy="226" r="2.5" fill="#F59E0B" />
          <text x="48" y="230" fill="#94a3b8" fontSize="9.5"
            fontFamily="'Space Grotesk', sans-serif">il y a 2 min · Cotonou</text>
        </g>

        {/* ── Success card (right, tilted +4°) ── */}
        <g filter="url(#fCd)" transform="rotate(4, 355, 224)">
          {/* Card */}
          <rect x="248" y="148" width="214" height="152" rx="22" fill="white" />
          {/* Accent bar */}
          <rect x="248" y="148" width="6" height="152" rx="3" fill="url(#gOk)" />

          {/* Icon circle */}
          <circle cx="288" cy="192" r="22" fill="#DCFCE7" />
          <path d="M279 192 L285 198 L298 182" stroke="#16A34A" strokeWidth="3"
            strokeLinecap="round" strokeLinejoin="round" />

          {/* Title */}
          <text x="320" y="178" fill="#0f172a" fontSize="13" fontWeight="800"
            fontFamily="'Space Grotesk', sans-serif">Numéro vérifié</text>
          {/* Sub — masked phone */}
          <text x="320" y="196" fill="#64748b" fontSize="10.5"
            fontFamily="'Space Grotesk', sans-serif">+229 97 ●● ●● ●●</text>

          {/* Badge */}
          <rect x="320" y="206" width="72" height="20" rx="10" fill="#DCFCE7" />
          <text x="356" y="220" textAnchor="middle" fill="#16A34A" fontSize="9.5" fontWeight="700"
            fontFamily="'Space Grotesk', sans-serif">Confirmé</text>

          {/* Divider */}
          <line x1="260" y1="240" x2="450" y2="240" stroke="#f1f5f9" strokeWidth="1.2" />

          {/* Footer */}
          <circle cx="266" cy="259" r="4.5" fill="#DCFCE7" />
          <path d="M263 259 L265.5 261.5 L270 257" stroke="#16A34A" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" />
          <text x="278" y="263" fill="#94a3b8" fontSize="9.5"
            fontFamily="'Space Grotesk', sans-serif">Vérifié par l'équipe admin</text>
        </g>

        {/* ── Dark stats strip (bottom) ── */}
        <g filter="url(#fDk)">
          <rect x="40" y="364" width="400" height="74" rx="22" fill="url(#gDk)" />

          {/* Live dot */}
          <circle cx="66" cy="382" r="7" fill="#22C55E" fillOpacity="0.22" />
          <circle cx="66" cy="382" r="4" fill="#22C55E" />
          <text x="79" y="386" fill="#64748b" fontSize="9" fontWeight="700" letterSpacing="0.08em"
            fontFamily="'Space Grotesk', sans-serif">EN DIRECT</text>

          {/* Rule */}
          <line x1="40" y1="398" x2="440" y2="398" stroke="white" strokeOpacity="0.06" strokeWidth="1" />

          {/* Stat 1 */}
          <text x="66" y="422" fill="white" fontSize="18" fontWeight="800"
            fontFamily="'Space Grotesk', sans-serif">47</text>
          <text x="90" y="422" fill="#64748b" fontSize="10"
            fontFamily="'Space Grotesk', sans-serif">arnaques signalées</text>

          {/* Separator */}
          <line x1="198" y1="408" x2="198" y2="428" stroke="white" strokeOpacity="0.08" strokeWidth="1" />

          {/* Stat 2 */}
          <text x="210" y="422" fill="#22C55E" fontSize="18" fontWeight="800"
            fontFamily="'Space Grotesk', sans-serif">12</text>
          <text x="234" y="422" fill="#64748b" fontSize="10"
            fontFamily="'Space Grotesk', sans-serif">bloquées</text>

          {/* Separator */}
          <line x1="312" y1="408" x2="312" y2="428" stroke="white" strokeOpacity="0.08" strokeWidth="1" />

          {/* Stat 3 */}
          <text x="324" y="422" fill="#FCD20F" fontSize="18" fontWeight="800"
            fontFamily="'Space Grotesk', sans-serif">3k+</text>
          <text x="368" y="422" fill="#64748b" fontSize="10"
            fontFamily="'Space Grotesk', sans-serif">recherches</text>
        </g>

        {/* Benin flag accent */}
        <rect x="196" y="450" width="28" height="4" rx="2" fill="#008751" />
        <rect x="228" y="450" width="28" height="4" rx="2" fill="#FCD20F" />
        <rect x="260" y="450" width="28" height="4" rx="2" fill="#E8112D" />

        {/* Decorative dots */}
        <circle cx="36" cy="82" r="9" fill="#E8112D" fillOpacity="0.09" />
        <circle cx="36" cy="82" r="4.5" fill="#E8112D" fillOpacity="0.17" />
        <circle cx="448" cy="116" r="8" fill="#22C55E" fillOpacity="0.20" />
        <circle cx="14" cy="318" r="7" fill="#F59E0B" fillOpacity="0.25" />
        <circle cx="462" cy="360" r="10" fill="#E8112D" fillOpacity="0.06" />
        <circle cx="406" cy="50" r="5" fill="#F59E0B" fillOpacity="0.18" />
        <circle cx="52" cy="448" r="5" fill="#22C55E" fillOpacity="0.15" />
      </svg>

      {/* Floating ambient dots */}
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ willChange: "transform" }}
        className="absolute top-12 right-4 w-4 h-4 rounded-full bg-primary/12"
      />
      <motion.div
        animate={{ y: [0, 11, 0] }}
        transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
        style={{ willChange: "transform" }}
        className="absolute bottom-28 right-2 w-3 h-3 rounded-full bg-success/18"
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
