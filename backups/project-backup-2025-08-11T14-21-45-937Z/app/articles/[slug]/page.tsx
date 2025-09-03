
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleContent from './ArticleContent';

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  
  return (
    <div className="min-h-screen bg-luxury-black">
      <Header />
      <ArticleContent slug={slug} />
      <Footer />
    </div>
  );
}
