
'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/articles');
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const mockArticles = [
    {
      id: 1,
      title: "Dubai Real Estate Market Trends 2024",
      excerpt: "Discover the latest trends shaping Dubai's luxury real estate market and what investors can expect in 2024.",
      author: "Ahmed Al Mansouri",
      published_at: "January 15, 2024",
      read_time: 5,
      featured_image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop",
      slug: "dubai-real-estate-market-trends-2024"
    },
    {
      id: 2,
      title: "Investing in Palm Jumeirah: A Complete Guide",
      excerpt: "Everything you need to know about investing in one of Dubai's most iconic developments.",
      author: "Sarah Johnson",
      published_at: "January 10, 2024",
      read_time: 8,
      featured_image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=400&fit=crop",
      slug: "investing-in-palm-jumeirah-complete-guide"
    },
    {
      id: 3,
      title: "Top 10 Luxury Amenities in Dubai Properties",
      excerpt: "Explore the most sought-after amenities that define luxury living in Dubai's premium properties.",
      author: "Mohammed Al Rashid",
      published_at: "January 5, 2024",
      read_time: 6,
      featured_image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=400&fit=crop",
      slug: "top-10-luxury-amenities-dubai-properties"
    }
  ];

  const displayArticles = articles.length > 0 ? articles : mockArticles;

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black text-white">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-ocean mx-auto mb-4"></div>
            <p className="text-gray-300">Loading articles...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-luxury-black text-white">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-400 mb-4">Error loading articles: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-green-ocean hover:bg-green-ocean-light text-white px-6 py-2 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black text-white">
      <Header />
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-luxury-black via-luxury-black-light to-luxury-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Real Estate
            <span className="bg-gradient-to-r from-green-ocean to-green-ocean-light bg-clip-text text-transparent"> Insights</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Stay informed with the latest insights, trends, and expert analysis on Dubai&apos;s luxury real estate market
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayArticles.map((article, index) => (
              <Link key={article.id} href={`/articles/${article.slug}`}>
                <div className="bg-luxury-black-light rounded-xl overflow-hidden hover:bg-luxury-black-light/80 transition-colors cursor-pointer">
                  <div className="aspect-video bg-luxury-black overflow-hidden relative">
                    <Image 
                      src={article.featured_image} 
                      alt={article.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-400 mb-3">
                      <span>{article.author}</span>
                      <span className="mx-2">•</span>
                      <span>{article.published_at}</span>
                      <span className="mx-2">•</span>
                      <span>{article.read_time} min read</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">{article.title}</h3>
                    <p className="text-gray-300 line-clamp-3">{article.excerpt}</p>
                    <div className="mt-4">
                      <span className="text-green-ocean font-semibold hover:text-green-ocean-light transition-colors">
                        Read More →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
