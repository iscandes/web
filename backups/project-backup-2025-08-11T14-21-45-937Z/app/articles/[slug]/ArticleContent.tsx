
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  author: string;
  status: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  category: string;
  read_time: number;
  meta_description: string;
  featured: boolean;
  views_count: number;
}

interface ArticleContentProps {
  slug: string;
}

export default function ArticleContent({ slug }: ArticleContentProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/articles/${slug}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('Article not found');
          } else {
            throw new Error('Failed to fetch article');
          }
          return;
        }
        const data = await response.json();
        setArticle(data.article);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-ocean mx-auto mb-4"></div>
          <p className="text-gray-300">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    // No fallback data - only show real database content
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-black text-white">
        <div className="text-center">
          <div className="w-16 h-16 bg-luxury-black-light rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-article-line text-2xl text-green-ocean"></i>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Article Not Found</h2>
          <p className="text-gray-400 mb-6">The article you&apos;re looking for doesn&apos;t exist or has been moved.</p>
          <Link
            href="/articles"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-ocean to-green-ocean-light text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
          >
            <i className="ri-arrow-left-line"></i>
            <span>Back to Articles</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-6 py-12 bg-luxury-black text-white min-h-screen">
      {/* Article Header */}
      <div className="mb-8 pt-20">
        <Link
          href="/articles"
          className="inline-flex items-center space-x-2 text-green-ocean hover:text-green-ocean-light transition-colors mb-6"
        >
          <i className="ri-arrow-left-line"></i>
          <span>Back to Articles</span>
        </Link>

        <div className="mb-6">
          <span className="bg-gradient-to-r from-green-ocean to-green-ocean-light text-white px-4 py-2 rounded-full text-sm font-medium">
            {article.category}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-playfair leading-tight">
          {article.title}
        </h1>

        <div className="flex items-center space-x-6 text-gray-300 mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-ocean to-green-ocean-light rounded-full flex items-center justify-center">
              <i className="ri-user-line text-white"></i>
            </div>
            <span className="font-medium">{article.author}</span>
          </div>
          <div className="flex items-center space-x-2">
            <i className="ri-calendar-line"></i>
            <span>{new Date(article.published_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <i className="ri-time-line"></i>
            <span>{article.read_time} min read</span>
          </div>
        </div>

        <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
          {article.featured_image && article.featured_image.trim() !== '' ? (
            <Image
              src={article.featured_image}
              alt={article.title}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-luxury-black-light flex items-center justify-center text-gray-400">
              No Image Available
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      </div>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none mb-12 prose-invert">
        <div 
          className="text-gray-300 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-luxury-black-light text-green-ocean px-3 py-1 rounded-full text-sm hover:bg-green-ocean hover:text-white transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Social Sharing */}
      <div className="border-t border-luxury-black-light pt-8">
        <h3 className="text-lg font-semibold text-white mb-4">Share this article</h3>
        <div className="flex space-x-4">
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <i className="ri-facebook-fill"></i>
            <span>Facebook</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors">
            <i className="ri-twitter-fill"></i>
            <span>Twitter</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
            <i className="ri-linkedin-fill"></i>
            <span>LinkedIn</span>
          </button>
          <button className="flex items-center space-x-2 bg-green-ocean text-white px-4 py-2 rounded-lg hover:bg-green-ocean-light transition-colors">
            <i className="ri-link"></i>
            <span>Copy Link</span>
          </button>
        </div>
      </div>
    </article>
  );
}
