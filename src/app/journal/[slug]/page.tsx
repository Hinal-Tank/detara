'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { createClient } from '@/lib/supabase/client';
import { useParams } from 'next/navigation';

interface JournalPost {
  id: string;
  title: string;
  slug: string | null;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  author: string;
  category: string;
  tags: string[];
  is_published: boolean;
  is_featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  created_at: string;
  reading_time: number | null;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
}

function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('newsletter_subscribers')
        .upsert({ email: email.trim(), source: 'journal' }, { onConflict: 'email' });
      if (error) throw error;
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="bg-[#211B18] px-8 py-10 text-center">
      <p className="label-caps text-[#B9924A] mb-3 tracking-[0.4em]" style={{ fontSize: '9px' }}>The DETARA Journal</p>
      <h3 className="font-serif text-xl font-light text-white mb-2">Private access to new collections</h3>
      <p className="text-sm text-white/50 font-light mb-6">Diamond education and selected releases.</p>
      {status === 'success' ? (
        <p className="text-sm text-[#B9924A] font-light">Thank you for subscribing.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-0 max-w-sm mx-auto">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="flex-1 bg-white/10 border border-white/20 px-4 py-3 text-sm font-light text-white placeholder:text-white/40 focus:outline-none focus:border-[#B9924A] transition-colors"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-5 py-3 bg-[#B9924A] text-[#211B18] text-[10px] font-medium tracking-[0.2em] uppercase hover:bg-[#B8965A] transition-colors disabled:opacity-60 whitespace-nowrap"
          >
            {status === 'loading' ? '...' : 'Subscribe'}
          </button>
        </form>
      )}
      {status === 'error' && (
        <p className="text-xs text-red-400 mt-2">Something went wrong. Please try again.</p>
      )}
    </div>
  );
}

export default function JournalArticlePage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [article, setArticle] = useState<JournalPost | null>(null);
  const [related, setRelated] = useState<JournalPost[]>([]);
  const [prevPost, setPrevPost] = useState<JournalPost | null>(null);
  const [nextPost, setNextPost] = useState<JournalPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    async function fetchArticle() {
      setLoading(true);
      const supabase = createClient();

      // Fetch the article by slug
      const { data, error } = await supabase
        .from('journal_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setArticle(data);

      // Fetch related articles (same category, excluding current)
      const { data: relatedData } = await supabase
        .from('journal_posts')
        .select('*')
        .eq('is_published', true)
        .eq('category', data.category)
        .neq('id', data.id)
        .limit(3)
        .order('published_at', { ascending: false });

      setRelated(relatedData || []);

      // Fetch prev/next articles
      const { data: allPosts } = await supabase
        .from('journal_posts')
        .select('id, title, slug, published_at')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (allPosts) {
        const idx = allPosts.findIndex((p) => p.id === data.id);
        if (idx > 0) setNextPost(allPosts[idx - 1] as JournalPost);
        if (idx < allPosts.length - 1) setPrevPost(allPosts[idx + 1] as JournalPost);
      }

      setLoading(false);
    }
    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-bg pt-44 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="font-serif text-lg font-light text-muted">Loading article...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (notFound || !article) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-bg pt-44 flex items-center justify-center">
          <div className="text-center">
            <p className="label-caps text-accent mb-4 tracking-[0.3em]">Journal</p>
            <p className="font-serif text-2xl font-light text-muted mb-6">Article not found.</p>
            <p className="text-sm text-muted font-light mb-8">This article may have been moved or is no longer available.</p>
            <Link href="/journal" className="btn-primary inline-block">Back to Journal</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const publishDate = article.published_at || article.created_at;

  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />
      <Header />
      <main className="bg-bg">
        {/* Article Hero */}
        <div className="pt-28 md:pt-36 lg:pt-44">
          {/* Breadcrumb */}
          <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-5 border-b border-[rgba(28,25,23,0.06)]">
            <nav aria-label="Breadcrumb" className="flex items-center gap-3 flex-wrap">
              <Link href="/homepage" className="label-caps text-muted hover:text-foreground transition-colors">Home</Link>
              <span className="text-muted/40 text-xs">—</span>
              <Link href="/journal" className="label-caps text-muted hover:text-foreground transition-colors">Journal</Link>
              <span className="text-muted/40 text-xs">—</span>
              <span className="label-caps text-accent">{article.category}</span>
            </nav>
          </div>

          {/* Article Header */}
          <div className="max-w-[860px] mx-auto px-5 md:px-8 pt-10 md:pt-14 pb-8 md:pb-12">
            <p className="label-caps text-accent mb-4 tracking-[0.35em]">{article.category}</p>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-foreground leading-tight mb-6">
              {article.title}
            </h1>
            {article.excerpt && (
              <p className="text-lg text-muted font-light leading-relaxed mb-6 max-w-[640px]">
                {article.excerpt}
              </p>
            )}
            <div className="flex items-center gap-5 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#211B18] flex items-center justify-center">
                  <span className="text-[#B9924A] text-[8px] font-medium">D</span>
                </div>
                <span className="text-sm text-muted font-light">{article.author}</span>
              </div>
              <span className="text-muted/30">·</span>
              <span className="text-sm text-muted font-light">{formatDate(publishDate)}</span>
              {article.reading_time && (
                <>
                  <span className="text-muted/30">·</span>
                  <span className="text-sm text-muted font-light">{article.reading_time} min read</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {article.cover_image && (
          <div className="max-w-[1280px] mx-auto px-5 md:px-8 mb-10 md:mb-14">
            <div className="relative aspect-[16/7] bg-[#F3EEE5] overflow-hidden">
              <Image
                src={article.cover_image}
                alt={article.title}
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 1280px"
              />
            </div>
          </div>
        )}

        {/* Article Content */}
        <div className="max-w-[760px] mx-auto px-5 md:px-8 pb-16 md:pb-24">
          {article.content ? (
            <div
              className="prose prose-lg max-w-none font-light text-muted leading-relaxed
                [&_h1]:font-serif [&_h1]:font-light [&_h1]:text-foreground [&_h1]:text-3xl [&_h1]:mt-10 [&_h1]:mb-4
                [&_h2]:font-serif [&_h2]:font-light [&_h2]:text-foreground [&_h2]:text-2xl [&_h2]:mt-10 [&_h2]:mb-4
                [&_h3]:font-serif [&_h3]:font-light [&_h3]:text-foreground [&_h3]:text-xl [&_h3]:mt-8 [&_h3]:mb-3
                [&_p]:text-muted [&_p]:font-light [&_p]:leading-relaxed [&_p]:mb-6
                [&_strong]:text-foreground [&_strong]:font-medium
                [&_em]:italic [&_em]:text-muted
                [&_ul]:space-y-2 [&_ul]:mb-6 [&_ul_li]:text-muted [&_ul_li]:font-light [&_ul_li]:flex [&_ul_li]:items-start [&_ul_li]:gap-2
                [&_ol]:space-y-2 [&_ol]:mb-6 [&_ol_li]:text-muted [&_ol_li]:font-light
                [&_blockquote]:border-l-2 [&_blockquote]:border-accent [&_blockquote]:pl-5 [&_blockquote]:my-8 [&_blockquote]:italic [&_blockquote]:text-foreground [&_blockquote]:font-light
                [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-foreground
                [&_img]:w-full [&_img]:my-8
                [&_hr]:border-[rgba(28,25,23,0.08)] [&_hr]:my-10"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          ) : (
            <p className="text-lg text-muted font-light leading-relaxed">
              This article is being prepared. Please check back soon.
            </p>
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-[rgba(28,25,23,0.08)]">
              {article.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 border border-[rgba(28,25,23,0.12)] text-xs text-muted font-light tracking-wide">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* CTA to products */}
          <div className="mt-12 pt-10 border-t border-[rgba(28,25,23,0.08)]">
            <p className="label-caps text-accent mb-3 tracking-[0.3em]">Explore DETARA</p>
            <p className="font-serif text-xl font-light text-foreground mb-2">Ready to find your perfect piece?</p>
            <p className="text-sm text-muted font-light mb-6">Precision-crafted diamond jewellery, certified and delivered worldwide.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/products" className="btn-primary inline-block">
                Shop Collection
              </Link>
              <Link href="/custom-jewelry" className="btn-outline inline-block">
                Design Your Jewellery
              </Link>
            </div>
          </div>
        </div>

        {/* Prev / Next Navigation */}
        {(prevPost || nextPost) && (
          <div className="border-t border-[rgba(28,25,23,0.08)] bg-[#F9F7F3]">
            <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-8 md:py-10">
              <div className="grid grid-cols-2 gap-6">
                {prevPost ? (
                  <Link href={`/journal/${prevPost.slug}`} className="group">
                    <p className="label-caps text-muted mb-2 tracking-[0.25em]" style={{ fontSize: '9px' }}>← Previous</p>
                    <p className="font-serif text-base font-light text-foreground group-hover:text-accent transition-colors leading-snug">
                      {prevPost.title}
                    </p>
                  </Link>
                ) : <div />}
                {nextPost ? (
                  <Link href={`/journal/${nextPost.slug}`} className="group text-right">
                    <p className="label-caps text-muted mb-2 tracking-[0.25em]" style={{ fontSize: '9px' }}>Next →</p>
                    <p className="font-serif text-base font-light text-foreground group-hover:text-accent transition-colors leading-snug">
                      {nextPost.title}
                    </p>
                  </Link>
                ) : <div />}
              </div>
            </div>
          </div>
        )}

        {/* Related Articles */}
        {related.length > 0 && (
          <div className="border-t border-[rgba(28,25,23,0.08)]">
            <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-12 md:py-16">
              <p className="label-caps text-accent mb-3 tracking-[0.35em]">Continue Reading</p>
              <h2 className="font-serif text-2xl font-light text-foreground mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {related.map((post) => (
                  <Link key={post.id} href={`/journal/${post.slug}`} className="group block">
                    {post.cover_image && (
                      <div className="relative aspect-[4/3] bg-[#F3EEE5] overflow-hidden mb-4">
                        <Image
                          src={post.cover_image}
                          alt={post.title}
                          fill
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <p className="label-caps text-accent mb-2" style={{ fontSize: '9px' }}>{post.category}</p>
                    <h3 className="font-serif text-base font-light text-foreground group-hover:text-accent transition-colors leading-snug mb-2">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm text-muted font-light line-clamp-2">{post.excerpt}</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Newsletter */}
        <div className="max-w-[760px] mx-auto px-5 md:px-8 pb-16 md:pb-24">
          <NewsletterSignup />
        </div>
      </main>
      <Footer />
    </>
  );
}
