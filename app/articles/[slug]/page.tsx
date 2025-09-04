
import React from 'react';
import ArticleContent from './ArticleContent';

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  
  return (
    <div className="bg-luxury-black">
      <ArticleContent slug={slug} />
    </div>
  );
}
