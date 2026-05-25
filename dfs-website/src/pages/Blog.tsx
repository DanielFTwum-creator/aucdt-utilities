import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const posts = [
  {
    id: 1,
    title: "The Science of Rhythm and Regulation",
    excerpt: "How drumming helps students find their center and regulate their emotions in the classroom.",
    date: "March 15, 2026",
    category: "Research",
    image: "https://picsum.photos/seed/blog1/800/400",
  },
  {
    id: 2,
    title: "5 Drumming Games for Your SEL Morning Meeting",
    excerpt: "Simple, effective rhythm games you can start using with your students today.",
    date: "February 28, 2026",
    category: "Teaching Tips",
    image: "https://picsum.photos/seed/blog2/800/400",
  },
  {
    id: 3,
    title: "Success Story: Brattleboro Middle School",
    excerpt: "A look back at our recent residency and the impact it had on school culture.",
    date: "January 10, 2026",
    category: "Success Stories",
    image: "https://picsum.photos/seed/blog3/800/400",
  },
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-accent/5 py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-serif">News & Insights</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Stay updated on the latest research, training tips, and success stories 
               from the world of Drumming for SEL Success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.id} to={`/blog/${post.id}`} className="group">
                <Card className="rounded-[32px] overflow-hidden border-none shadow-lg hover:shadow-xl transition-all h-full flex flex-col">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <CardContent className="p-8 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="rounded-full">{post.category}</Badge>
                        <span className="text-xs text-muted-foreground">{post.date}</span>
                      </div>
                      <h3 className="text-xl font-serif font-bold group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>
                    <div className="mt-6 pt-6 border-t flex items-center text-primary font-bold text-sm">
                      Read Full Article
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
