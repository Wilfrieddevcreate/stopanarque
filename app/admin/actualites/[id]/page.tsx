import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArticleForm } from "../ArticleForm";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) notFound();

  return (
    <ArticleForm
      articleId={article.id}
      initial={{
        title: article.title,
        titleEn: article.titleEn,
        titleFon: article.titleFon,
        titleYo: article.titleYo,
        excerpt: article.excerpt,
        excerptEn: article.excerptEn,
        excerptFon: article.excerptFon,
        excerptYo: article.excerptYo,
        content: article.content,
        contentEn: article.contentEn,
        contentFon: article.contentFon,
        contentYo: article.contentYo,
        coverImage: article.coverImage,
        category: article.category,
        published: article.published,
      }}
    />
  );
}
