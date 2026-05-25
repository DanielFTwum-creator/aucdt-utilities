import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { motion } from "motion/react";

const posts = [
  {
    id: 1,
    title: "The Science of Rhythm and Regulation",
    content: `
      <p>Social-Emotional Learning (SEL) is often thought of as a purely cognitive exercise—learning to identify feelings, practicing empathy, and developing problem-solving skills. However, research increasingly shows that the body plays a critical role in emotional regulation.</p>
      <p>Rhythm is a fundamental biological principle. Our hearts beat in rhythm, our lungs breathe in rhythm, and our brains communicate through rhythmic electrical impulses. When students engage in group drumming, they are participating in a process called entrainment—the synchronization of biological rhythms to an external beat.</p>
      <h3>The Vagus Nerve and Regulation</h3>
      <p>Group drumming stimulates the vagus nerve, which is responsible for the body's "rest and digest" system. By participating in rhythmic activities, students can effectively lower their cortisol levels and move from a state of "fight or flight" to a state of calm alertness.</p>
      <p>This is why Drumming for SEL Success is so effective in the classroom. It provides a physical, non-verbal pathway to regulation that cognitive strategies alone often miss.</p>
    `,
    date: "March 15, 2026",
    author: "Steve Ferraris",
    category: "Research",
    image: "https://picsum.photos/seed/blog1/1200/600",
  },
  {
    id: 2,
    title: "5 Drumming Games for Your SEL Morning Meeting",
    content: `
      <p>Morning meetings are the perfect time to build community and set the tone for the day. Integrating rhythm into these meetings can increase engagement and help students transition into a learning mindset.</p>
      <h3>1. The Name Game</h3>
      <p>Each student says their name and plays the rhythm of the syllables on a drum or their lap. The whole group repeats the name and the rhythm together.</p>
      <h3>2. Pass the Pulse</h3>
      <p>Students sit in a circle. One person starts a simple pulse, and it travels around the circle. The goal is to keep the pulse steady and connected.</p>
      <h3>3. Rhythm Mirror</h3>
      <p>The leader plays a 4-beat pattern, and the group echoes it back exactly. This builds listening skills and impulse control.</p>
    `,
    date: "February 28, 2026",
    author: "Steve Ferraris",
    category: "Teaching Tips",
    image: "https://picsum.photos/seed/blog2/1200/600",
  },
  {
    id: 3,
    title: "Success Story: Brattleboro Middle School",
    content: `
      <p>Last month, we had the privilege of spending a week at Brattleboro Middle School for an intensive residency. The goal was to help the staff integrate rhythm-based SEL into their daily advisory periods.</p>
      <p>"I was skeptical at first," said one 7th-grade teacher. "But seeing my most disengaged students leading a rhythm circle with confidence was a turning point for me."</p>
      <p>By the end of the week, the school had established a "Rhythm Room" where students can go for self-regulation breaks, and the staff reported a noticeable decrease in classroom disruptions.</p>
    `,
    date: "January 10, 2026",
    author: "Steve Ferraris",
    category: "Success Stories",
    image: "https://picsum.photos/seed/blog3/1200/600",
  },
];

export default function BlogPost() {
  const { id } = useParams();
  const post = posts.find((p) => p.id === Number(id));

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-serif">Post Not Found</h1>
          <Button render={<Link to="/blog" />} variant="outline" nativeButton={false}>
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="h-[40vh] relative overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center text-white space-y-4"
            >
              <span className="inline-block px-3 py-1 rounded-full bg-primary text-xs font-bold uppercase tracking-widest">
                {post.category}
              </span>
              <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
                {post.title}
              </h1>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-12 relative z-10">
        <div className="max-w-3xl mx-auto bg-white rounded-[40px] p-8 md:p-16 shadow-2xl space-y-12">
          <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-bold">{post.author}</p>
                <p className="text-xs text-muted-foreground">Lead Trainer</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {post.date}
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                {post.category}
              </div>
            </div>
          </div>

          <div 
            className="prose prose-lg max-w-none prose-serif prose-headings:font-serif prose-primary"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="pt-12 border-t flex items-center justify-between">
            <Button render={<Link to="/blog" />} variant="ghost" className="gap-2" nativeButton={false}>
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Button>
            <Button render={<Link to="/contact" />} className="rounded-full px-8" nativeButton={false}>
              Discuss Training
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
