import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowLeft, User, Clock, Share2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: relatedPosts } = useQuery({
    queryKey: ["related-posts", post?.category],
    queryFn: async () => {
      if (!post?.category) return [];
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .eq("category", post.category)
        .neq("id", post.id)
        .limit(3);
      
      if (error) throw error;
      return data;
    },
    enabled: !!post?.category,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="pt-32 pb-20">
          <div className="container-custom px-4 max-w-4xl">
            <Skeleton className="h-8 w-32 mb-4" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <Skeleton className="h-64 w-full mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="pt-32 pb-20">
          <div className="container-custom px-4 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist.</p>
            <Link to="/blog">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Parse markdown-like content to HTML
  const formatContent = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-bold text-foreground mt-8 mb-4">{line.slice(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-semibold text-foreground mt-6 mb-3">{line.slice(4)}</h3>;
        }
        if (line.startsWith('- ')) {
          return <li key={index} className="ml-6 text-muted-foreground list-disc">{line.slice(2)}</li>;
        }
        if (line.match(/^\d+\./)) {
          return <li key={index} className="ml-6 text-muted-foreground list-decimal">{line.slice(line.indexOf('.') + 2)}</li>;
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return <p key={index} className="text-muted-foreground mb-4 leading-relaxed">{line}</p>;
      });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-primary/5 via-background to-secondary/30">
        <div className="container-custom px-4 max-w-4xl">
          <Link to="/blog" className="inline-flex items-center text-primary hover:underline mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
          
          {post.category && (
            <Badge className="mb-4 bg-primary text-primary-foreground">
              {post.category}
            </Badge>
          )}
          
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.author_name}</span>
            </div>
            {post.published_at && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(post.published_at), "MMMM dd, yyyy")}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{Math.ceil(post.content.split(' ').length / 200)} min read</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="py-12">
        <div className="container-custom px-4 max-w-4xl">
          {post.featured_image_url && (
            <img 
              src={post.featured_image_url} 
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-2xl mb-10 shadow-lg"
            />
          )}
          
          <div className="prose prose-lg max-w-none">
            {formatContent(post.content)}
          </div>

          {/* Share */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">Found this helpful? Share it!</p>
              <Button variant="outline" size="sm" onClick={() => navigator.share?.({ title: post.title, url: window.location.href })}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="py-16 bg-secondary/30">
          <div className="container-custom px-4">
            <h2 className="font-display text-2xl font-bold text-foreground mb-8 text-center">
              Related Articles
            </h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {relatedPosts.map((related) => (
                <Link 
                  key={related.id} 
                  to={`/blog/${related.slug}`}
                  className="group bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-all"
                >
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                    {related.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{related.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16">
        <div className="container-custom px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">
              Ready to Transform Your Smile?
            </h2>
            <p className="text-muted-foreground mb-6">
              Schedule your consultation today and take the first step towards optimal dental health.
            </p>
            <Link to="/book-appointment">
              <Button size="lg" className="cta-gradient border-0">
                Book Your Appointment
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BlogPost;
