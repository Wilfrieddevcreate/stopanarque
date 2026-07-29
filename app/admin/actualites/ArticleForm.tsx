"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";

const CATEGORIES = ["Alerte", "Conseil", "Actualité", "Communiqué"];

const LANGS = [
  { key: "fr", label: "Français", flag: "🇫🇷", required: true },
  { key: "en", label: "English", flag: "🇬🇧", required: false },
  { key: "fon", label: "Fon", flag: "🇧🇯", required: false },
  { key: "yo", label: "Yoruba", flag: "🇧🇯", required: false },
] as const;

type LangKey = "fr" | "en" | "fon" | "yo";

type FormData = {
  title: string; titleEn: string; titleFon: string; titleYo: string;
  excerpt: string; excerptEn: string; excerptFon: string; excerptYo: string;
  content: string; contentEn: string; contentFon: string; contentYo: string;
  coverImage: string;
  category: string;
  published: boolean;
};

const EMPTY: FormData = {
  title: "", titleEn: "", titleFon: "", titleYo: "",
  excerpt: "", excerptEn: "", excerptFon: "", excerptYo: "",
  content: "", contentEn: "", contentFon: "", contentYo: "",
  coverImage: "", category: "Alerte", published: false,
};

function fieldKey(base: string, lang: LangKey): keyof FormData {
  if (lang === "fr") return base as keyof FormData;
  if (lang === "en") return `${base}En` as keyof FormData;
  if (lang === "fon") return `${base}Fon` as keyof FormData;
  return `${base}Yo` as keyof FormData;
}

function langComplete(form: FormData, lang: LangKey): boolean {
  return !!(form[fieldKey("title", lang)] && form[fieldKey("excerpt", lang)] && form[fieldKey("content", lang)]);
}

export function ArticleForm({ initial, articleId }: { initial?: Partial<FormData> & { id?: string }; articleId?: string }) {
  const router = useRouter();
  const isEdit = !!articleId;
  const [form, setForm] = useState<FormData>({ ...EMPTY, ...initial });
  const [lang, setLang] = useState<LangKey>("fr");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function set(key: keyof FormData, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function uploadFile(file: File) {
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      await Swal.fire({ icon: "error", title: "Format invalide", text: "JPG, PNG, WebP ou GIF uniquement.", confirmButtonColor: "#E8112D" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      await Swal.fire({ icon: "error", title: "Fichier trop lourd", text: "Taille maximale : 5 Mo.", confirmButtonColor: "#E8112D" });
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur upload");
      set("coverImage", data.url);
    } catch (e: unknown) {
      await Swal.fire({ icon: "error", title: "Erreur", text: e instanceof Error ? e.message : "Upload échoué", confirmButtonColor: "#E8112D" });
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(publish?: boolean) {
    if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim()) {
      await Swal.fire({ icon: "warning", title: "Champs requis", text: "Le titre, le résumé et le contenu en Français sont obligatoires.", confirmButtonColor: "#E8112D" });
      setLang("fr");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, published: publish !== undefined ? publish : form.published };
      const res = await fetch(
        isEdit ? `/api/admin/articles` : `/api/admin/articles`,
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(isEdit ? { id: articleId, ...payload } : payload),
        }
      );
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Erreur serveur");
      }
      await Swal.fire({ icon: "success", title: isEdit ? "Article mis à jour" : "Article créé", timer: 1500, showConfirmButton: false });
      router.push("/admin/actualites");
      router.refresh();
    } catch (e: unknown) {
      await Swal.fire({ icon: "error", title: "Erreur", text: e instanceof Error ? e.message : "Erreur inconnue", confirmButtonColor: "#E8112D" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isEdit ? "Modifier l'article" : "Nouvel article"}
          </h1>
          <p className="text-sm text-muted mt-0.5">
            Le Français est obligatoire. Les autres langues sont optionnelles.
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/actualites")}
          className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour à la liste
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-5">
          {/* Language tabs */}
          <div className="bg-white rounded-2xl border border-border p-1 flex gap-1 flex-wrap">
            {LANGS.map((l) => {
              const complete = langComplete(form, l.key);
              return (
                <button
                  key={l.key}
                  onClick={() => setLang(l.key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium flex-1 justify-center transition-all ${
                    lang === l.key
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span>{l.flag}</span>
                  <span>{l.label}</span>
                  {l.required ? (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${lang === l.key ? "bg-white/20 text-white" : "bg-primary/10 text-primary"}`}>
                      Requis
                    </span>
                  ) : complete ? (
                    <span className={`w-1.5 h-1.5 rounded-full ${lang === l.key ? "bg-white" : "bg-success"}`} />
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* Fields per language */}
          <div className="bg-white rounded-2xl border border-border p-5 sm:p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Titre{lang === "fr" && <span className="text-primary ml-1">*</span>}
              </label>
              <input
                type="text"
                value={form[fieldKey("title", lang)] as string}
                onChange={(e) => set(fieldKey("title", lang), e.target.value)}
                placeholder={lang === "fr" ? "Titre de l'article en Français" : `Title in ${LANGS.find(l => l.key === lang)?.label}`}
                className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Résumé (accroche){lang === "fr" && <span className="text-primary ml-1">*</span>}
              </label>
              <textarea
                rows={2}
                value={form[fieldKey("excerpt", lang)] as string}
                onChange={(e) => set(fieldKey("excerpt", lang), e.target.value)}
                placeholder="Une phrase courte visible dans la liste des articles..."
                className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Contenu{lang === "fr" && <span className="text-primary ml-1">*</span>}
              </label>
              <textarea
                rows={14}
                value={form[fieldKey("content", lang)] as string}
                onChange={(e) => set(fieldKey("content", lang), e.target.value)}
                placeholder="Contenu complet de l'article. Vous pouvez sauter des lignes pour créer des paragraphes."
                className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-y font-mono leading-relaxed"
              />
              <p className="text-xs text-muted mt-1.5">
                {(form[fieldKey("content", lang)] as string).length} caractères
              </p>
            </div>
          </div>

          {/* Translation progress */}
          <div className="bg-white rounded-2xl border border-border p-4 sm:p-5">
            <p className="text-sm font-medium text-foreground mb-3">Progression des traductions</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {LANGS.map((l) => {
                const complete = langComplete(form, l.key);
                const partial = !complete && (
                  !!(form[fieldKey("title", l.key)]) ||
                  !!(form[fieldKey("excerpt", l.key)]) ||
                  !!(form[fieldKey("content", l.key)])
                );
                return (
                  <button
                    key={l.key}
                    onClick={() => setLang(l.key)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                      complete
                        ? "border-success/30 bg-success/5 text-success"
                        : partial
                        ? "border-accent/40 bg-accent/5 text-amber-700"
                        : "border-border bg-gray-50 text-muted"
                    }`}
                  >
                    <span className="text-base">{l.flag}</span>
                    <div>
                      <div>{l.label}</div>
                      <div className="font-normal opacity-75">
                        {complete ? "Complet" : partial ? "Partiel" : "Vide"}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar: settings + actions */}
        <div className="space-y-4">
          {/* Cover image */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <p className="text-sm font-medium text-foreground mb-3">Image de couverture</p>

            {/* Preview */}
            {form.coverImage ? (
              <div className="relative rounded-xl overflow-hidden mb-3 group">
                <Image
                  src={form.coverImage}
                  alt="Couverture"
                  width={400}
                  height={200}
                  className="w-full h-40 object-cover"
                />
                <button
                  onClick={() => set("coverImage", "")}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                  title="Supprimer l'image"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              /* Drop zone */
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const file = e.dataTransfer.files[0];
                  if (file) uploadFile(file);
                }}
                className={`flex flex-col items-center justify-center gap-2 h-36 rounded-xl border-2 border-dashed cursor-pointer transition-all mb-3 ${
                  dragOver
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40 hover:bg-gray-50"
                }`}
              >
                {uploading ? (
                  <svg className="w-6 h-6 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <>
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs text-muted text-center px-2">
                      Glisser une image ici<br />
                      <span className="text-primary font-medium">ou cliquer pour parcourir</span>
                    </p>
                    <p className="text-[10px] text-gray-400">JPG, PNG, WebP · max 5 Mo</p>
                  </>
                )}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadFile(file);
                e.target.value = "";
              }}
            />

            {form.coverImage && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full text-xs text-muted hover:text-foreground py-1.5 border border-border rounded-lg hover:bg-gray-50 transition-colors"
              >
                Changer l&apos;image
              </button>
            )}
          </div>

          {/* Category */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <label className="block text-sm font-medium text-foreground mb-2">Catégorie</label>
            <div className="space-y-2">
              {CATEGORIES.map((cat) => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value={cat}
                    checked={form.category === cat}
                    onChange={() => set("category", cat)}
                    className="accent-primary"
                  />
                  <span className="text-sm text-foreground">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <p className="text-sm font-medium text-foreground mb-3">Statut</p>
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={form.published}
                  onChange={(e) => set("published", e.target.checked)}
                />
                <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-success transition-colors" />
                <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {form.published ? "Publié" : "Brouillon"}
                </p>
                <p className="text-xs text-muted">
                  {form.published ? "Visible sur le site" : "Non visible du public"}
                </p>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl border border-border p-5 space-y-3">
            <button
              onClick={() => handleSave()}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary-dark disabled:opacity-50 text-white text-sm font-semibold transition-colors"
            >
              {saving ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              )}
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>

            {!form.published && (
              <button
                onClick={() => handleSave(true)}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-success/10 hover:bg-success/20 disabled:opacity-50 text-success text-sm font-semibold transition-colors border border-success/20"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Enregistrer et publier
              </button>
            )}

            <button
              onClick={() => router.push("/admin/actualites")}
              className="w-full py-2.5 px-4 rounded-xl border border-border text-sm text-muted hover:bg-gray-50 transition-colors text-center"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
