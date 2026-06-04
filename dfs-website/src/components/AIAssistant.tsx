import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, X, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import DOMPurify from "dompurify";
import { askDfsAssistant, type Audience } from "@/services/dfsAssistant";

type Message =
  | { role: "user"; content: string }
  | { role: "ai"; content: string; html?: boolean };

const WELCOME: Message = {
  role: "ai",
  content:
    "Hello! I'm your Drumming for SEL Success assistant. Ask me how to use rhythm and drumming to build focus, regulation, and collaboration in your classroom — no musical experience needed.",
};

const AUDIENCES: Audience[] = [
  "Classroom Teacher",
  "School Leader",
  "Instructional Coach",
  "Trainee / New Educator",
];

// Sanitise the model's rich HTML while ALLOWING inline SVG diagrams (the
// AI-for-GOOD contract requires them). DOMPurify supports SVG via profiles.
//
// The model sometimes emits inline `style`/`class` (e.g. hardcoded text/background
// colours that assume a white page), which causes low-contrast, unreadable text
// inside the themed message bubble. Strip style/class on HTML elements so the
// answer inherits the app's readable typography — but PRESERVE them on SVG nodes,
// where colours are needed for the diagrams.
function renderHtml(raw: string): string {
  DOMPurify.addHook("uponSanitizeElement", (node: any) => {
    if (node.nodeType === 1 && typeof node.tagName === "string") {
      const tag = node.tagName.toLowerCase();
      const isSvg = tag === "svg" || node.namespaceURI === "http://www.w3.org/2000/svg";
      if (!isSvg) {
        node.removeAttribute?.("style");
        node.removeAttribute?.("class");
        node.removeAttribute?.("bgcolor");
        node.removeAttribute?.("color");
      }
    }
  });
  const clean = DOMPurify.sanitize(raw, {
    USE_PROFILES: { html: true, svg: true, svgFilters: true },
    ADD_TAGS: ["use"],
  });
  DOMPurify.removeHook("uponSanitizeElement");
  return clean;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [audience, setAudience] = useState<Audience>("Classroom Teacher");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    const question = input.trim();
    if (!question || loading) return;

    setMessages((m) => [...m, { role: "user", content: question }]);
    setInput("");
    setLoading(true);

    try {
      const { text } = await askDfsAssistant(question, audience);
      setMessages((m) => [...m, { role: "ai", content: text, html: true }]);
    } catch (err) {
      console.error("DfS assistant error:", err);
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          content:
            "Sorry — I couldn't reach the assistant just now. Please try again, or use the Contact page to reach the DfS team.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-80 md:w-[28rem]"
          >
            <Card className="rounded-[24px] shadow-2xl border-none overflow-hidden">
              <CardHeader className="bg-primary text-primary-foreground p-4 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  <CardTitle className="text-sm font-serif">SEL Assistant</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/10"
                  aria-label="Close assistant"
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>

              {/* Audience selector — drives the AI-for-GOOD system instruction */}
              <div className="px-4 py-2 border-b bg-white flex items-center gap-2">
                <label htmlFor="dfs-audience" className="text-xs text-muted-foreground shrink-0">
                  I am a:
                </label>
                <select
                  id="dfs-audience"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value as Audience)}
                  className="text-xs rounded-full border px-2 py-1 flex-1 bg-white"
                >
                  {AUDIENCES.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <CardContent className="p-0 flex flex-col h-[28rem]">
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-accent/5">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[90%] p-3 rounded-2xl text-sm ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-white text-slate-800 shadow-sm"
                        }`}
                      >
                        {msg.role === "ai" && msg.html ? (
                          <div
                            className="dfs-ai-answer text-slate-800 leading-relaxed space-y-2 max-w-none
                              [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-slate-900 [&_h3]:mt-2
                              [&_h4]:font-semibold [&_h4]:text-slate-900
                              [&_strong]:text-slate-900 [&_strong]:font-semibold
                              [&_a]:text-primary [&_a]:underline
                              [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5
                              [&_li]:my-0.5
                              [&_aside]:bg-accent/10 [&_aside]:border-l-2 [&_aside]:border-primary [&_aside]:pl-3 [&_aside]:py-1.5 [&_aside]:my-2 [&_aside]:text-slate-700
                              [&_table]:w-full [&_table]:text-xs [&_th]:text-left [&_th]:font-semibold [&_th]:text-slate-900 [&_td]:border-t [&_td]:border-slate-200 [&_td]:py-1
                              [&_svg]:max-w-full [&_svg]:h-auto [&_svg]:my-2"
                            dangerouslySetInnerHTML={{ __html: renderHtml(msg.content) }}
                          />
                        ) : (
                          msg.content
                        )}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] p-3 rounded-2xl text-sm bg-white shadow-sm flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Composing a rhythm-based answer…
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 border-t bg-white flex gap-2">
                  <Input
                    placeholder="Ask about drumming for SEL…"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    disabled={loading}
                    className="rounded-full"
                  />
                  <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="rounded-full shrink-0"
                    aria-label="Send"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="icon"
        className="w-14 h-14 rounded-full shadow-xl hover:scale-110 transition-transform"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open SEL assistant"
      >
        <MessageSquare className="w-6 h-6" />
      </Button>
    </div>
  );
}
