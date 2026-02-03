import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const Blog = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const categories = [...new Set(posts?.map(p => p.category).filter(Boolean))];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary/5 via-background to-secondary/30">
        <div className="container-custom px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-4 px-4 py-1">
              <BookOpen className="w-3 h-3 mr-2" />
              Dental Tips & Insights
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Our Blog
            </h1>
            <p className="text-lg text-muted-foreground">
              Expert advice, dental tips, and insights to help you maintain a healthy, beautiful smile.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20">
        <div className="container-custom px-4">
          {/* Categories */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mb-12">
              <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                All Posts
              </Badge>
              {categories.map((category) => (
                <Badge 
                  key={category} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {category}
                </Badge>
              ))}
            </div>
          )}

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Card key={post.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50">
                  {post.featured_image_url && (
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={post.featured_image_url} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {post.category && (
                        <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                          {post.category}
                        </Badge>
                      )}
                    </div>
                  )}
                  <CardHeader className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {post.published_at && format(new Date(post.published_at), "MMM dd, yyyy")}
                    </div>
                    <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </p>
                    <Link to={`/blog/${post.slug}`}>
                      <Button variant="ghost" className="group/btn p-0 h-auto font-medium text-primary">
                        Read More 
                        <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Blog Posts Yet</h3>
              <p className="text-muted-foreground">Check back soon for dental tips and insights!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container-custom px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              Have Questions About Your Dental Health?
            </h2>
            <p className="text-muted-foreground mb-6">
              Our team is here to help. Schedule a consultation and get personalized advice.
            </p>
            <Link to="/book-appointment">
              <Button size="lg" className="cta-gradient border-0">
                Book a Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
