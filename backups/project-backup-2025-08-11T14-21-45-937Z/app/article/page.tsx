'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';

// Article interface
interface Article {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  read_time: string;
  tags: string[];
  featured: boolean;
}

// Article Card Component
const ArticleCard = ({ article, index }: { article: Article; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`glass-dark rounded-2xl overflow-hidden group hover:scale-105 transition-all duration-500 ${
        article.featured ? 'md:col-span-2 md:row-span-2' : ''
      }`}
    >
      {/* Article Image */}
      <div className="relative overflow-hidden">
        {article.image && article.image.trim() !== '' ? (
          <Image
            src={article.image}
            alt={article.title}
            width={800}
            height={256}
            className={`w-full h-64 object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
        ) : (
          <div className="w-full h-64 bg-gradient-to-br from-luxury-gold/20 to-luxury-gold/5 flex items-center justify-center">
            <div className="text-center text-white/60">
              <i className="ri-image-line text-4xl mb-2 block"></i>
              <span className="text-sm">No Image Available</span>
            </div>
          </div>
        )}
        
        {/* Featured Badge */}
        {article.featured && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-gradient-to-r from-luxury-gold to-luxury-gold-light text-luxury-black text-sm font-semibold rounded-full">
              Featured
            </span>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Article Content */}
      <div className="p-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {article.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-luxury-gold/20 text-luxury-gold text-xs rounded-full border border-luxury-gold/30"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className={`font-bold text-white mb-3 group-hover:text-luxury-gold transition-colors duration-300 ${
          article.featured ? 'text-2xl' : 'text-xl'
        }`}>
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-3">
          {article.excerpt}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-white/60">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-green-ocean" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {article.date}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-green-ocean" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {article.author}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-green-ocean" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {article.read_time}
            </span>
          </div>
        </div>

        {/* Read More Button */}
        <button className="mt-4 w-full py-3 bg-gradient-to-r from-luxury-gold/20 to-luxury-gold/10 hover:from-luxury-gold/30 hover:to-luxury-gold/20 text-white rounded-xl border border-white/10 hover:border-luxury-gold/30 transition-all duration-300">
          Read More
        </button>
      </div>
    </article>
  );
};

// Tag Filter Component
const TagFilter = ({ 
  tags, 
  selectedTag, 
  onTagSelect 
}: { 
  tags: string[]; 
  selectedTag: string; 
  onTagSelect: (tag: string) => void; 
}) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center mb-12">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagSelect(tag)}
          className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 ${
            selectedTag === tag
              ? 'bg-gradient-to-r from-luxury-gold to-luxury-gold-light text-luxury-black'
              : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

// Newsletter Subscription Component
const NewsletterBanner = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <div className="glass-dark rounded-2xl p-8 text-center border border-white/20">
      <h3 className="text-3xl font-bold text-white mb-4">
        Stay Updated
      </h3>
      
      <p className="text-white/70 mb-6 max-w-md mx-auto">
        Get the latest insights on Dubai real estate market trends, investment opportunities, and expert analysis.
      </p>

      <form
        onSubmit={handleSubscribe}
        className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
      >
        <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-6 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-green-ocean/50 focus:bg-white/10 transition-all duration-300"
            required
          />
        <button
          type="submit"
          className="px-8 py-3 bg-gradient-to-r from-luxury-gold to-luxury-gold-light text-luxury-black rounded-xl font-semibold hover:shadow-lg hover:shadow-luxury-gold/25 transition-all duration-300"
        >
          Subscribe
        </button>
      </form>

      {isSubscribed && (
        <p className="text-luxury-gold mt-4 font-semibold">
          Thank you for subscribing!
        </p>
      )}
    </div>
  );
};

export default function ArticlePage() {
  const [selectedTag, setSelectedTag] = useState('All');
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch articles from database
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/articles');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            // Transform database articles to match the Article interface
            const transformedArticles = data.data.map((article: any) => ({
              id: article.id.toString(),
              title: article.title,
              excerpt: article.excerpt || article.content?.substring(0, 200) + '...',
              image: article.featured_image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
              author: article.author || 'Premium Choice Team',
              date: new Date(article.created_at).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              }),
              read_time: `${Math.ceil((article.content?.length || 0) / 200)} min read`,
              tags: article.tags ? article.tags.split(',').map((tag: string) => tag.trim()) : ['General'],
              featured: article.featured || false
            }));
            setArticles(transformedArticles);
          } else {
            setArticles([]);
          }
        } else {
          setArticles([]);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // All available tags
  const allTags = ['All', ...Array.from(new Set(articles.flatMap(article => article.tags)))];

  // Filter articles based on selected tag
  useEffect(() => {
    if (selectedTag === 'All') {
      setFilteredArticles(articles);
    } else {
      setFilteredArticles(articles.filter(article => article.tags.includes(selectedTag)));
    }
  }, [selectedTag, articles]);

  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/10 via-black to-luxury-black/90" />
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-luxury-gold/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Header Section */}
      <div className="relative z-10 pt-20 pb-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-inter">
            Real Estate
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-luxury-gold to-luxury-gold-light">
              Insights
            </span>
          </h1>
          
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed mb-12">
            Stay informed with the latest trends, market analysis, and expert insights from Dubai&apos;s dynamic real estate landscape
          </p>

          {/* Tag Filters */}
          <div>
            <TagFilter
              tags={allTags}
              selectedTag={selectedTag}
              onTagSelect={setSelectedTag}
            />
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="relative z-10 px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-gold"></div>
              <p className="text-white/70 mt-4">Loading articles...</p>
            </div>
          ) : filteredArticles.length > 0 ? (
            <>
              <div
                key={selectedTag}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-auto transition-opacity duration-500"
              >
                {filteredArticles.map((article, index) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    index={index}
                  />
                ))}
              </div>

              {/* Load More Button */}
              <div className="text-center mt-16">
                <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl border border-white/20 hover:border-luxury-gold/30 transition-all duration-300 font-semibold hover:scale-105">
                  Load More Articles
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="glass-dark rounded-2xl p-12 border border-white/20 max-w-md mx-auto">
                <div className="text-6xl mb-6">📰</div>
                <h3 className="text-2xl font-bold text-white mb-4">No Articles Found</h3>
                <p className="text-white/70">
                  {selectedTag === 'All' 
                    ? 'No articles are currently available. Check back soon for the latest insights!'
                    : `No articles found for "${selectedTag}". Try selecting a different category.`
                  }
                </p>
              </div>
            </div>
          )}

          {/* Newsletter Subscription */}
          <div className="mt-20">
            <NewsletterBanner />
          </div>
        </div>
      </div>
    </main>
  );
}