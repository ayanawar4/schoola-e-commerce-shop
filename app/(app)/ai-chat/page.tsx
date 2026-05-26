"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User } from "lucide-react";
import { useUiStore } from "@/lib/store/ui";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_CONTEXT = `You are Schoola's helpful AI assistant. Schoola is Egypt's #1 e-commerce platform for official school uniforms and supplies.
Help customers with: finding uniforms for their school, choosing the right sizes, understanding payment via InstaPay, tracking orders, adding students, and navigating the app.
Be friendly, concise, and helpful. Answer in the same language the user writes in (Arabic or English).`;

const SUGGESTIONS_AR = ["ما هي المدارس المتاحة؟", "كيف أختار المقاس الصحيح؟", "ما هي طرق الدفع؟", "كيف أتتبع طلبي؟"];
const SUGGESTIONS_EN = ["What schools are available?", "How do I choose the right size?", "What payment methods are available?", "How do I track my order?"];

export default function AiChatPage() {
  const { locale } = useUiStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: locale === "ar"
        ? "مرحباً! أنا مساعد سكولا الذكي. كيف يمكنني مساعدتك اليوم؟"
        : "Hello! I'm Schoola's AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      if (!GEMINI_API_KEY) {
        setMessages((prev) => [...prev, {
          id: Date.now().toString() + "e",
          role: "assistant",
          content: locale === "ar"
            ? "عذراً، المساعد الذكي غير مفعّل حالياً. يرجى التواصل مع الدعم."
            : "Sorry, the AI assistant is not configured yet. Please contact support.",
          timestamp: new Date(),
        }]);
        setLoading(false);
        return;
      }

      // Exclude the initial welcome message — Gemini requires contents to start with "user"
      const history = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.content }],
        }));

      const res = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_CONTEXT }] },
          contents: [
            ...history,
            { role: "user", parts: [{ text }] },
          ],
          generationConfig: { maxOutputTokens: 500, temperature: 0.7 },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message ?? "API error");
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? (locale === "ar" ? "عذراً، حدث خطأ" : "Sorry, something went wrong.");
      setMessages((prev) => [...prev, { id: Date.now().toString() + "r", role: "assistant", content: reply, timestamp: new Date() }]);
    } catch {
      setMessages((prev) => [...prev, {
        id: Date.now().toString() + "e",
        role: "assistant",
        content: locale === "ar" ? "عذراً، حدث خطأ في الاتصال. حاول مرة أخرى." : "Sorry, connection error. Please try again.",
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  }

  const suggestions = locale === "ar" ? SUGGESTIONS_AR : SUGGESTIONS_EN;

  return (
    <div className="flex flex-col" style={{ height: "calc(100dvh - 3.5rem - 4rem)" }}>
      <div className="max-w-2xl w-full mx-auto flex flex-col flex-1 min-h-0">

        {/* Header */}
        <div className="px-4 pt-3 pb-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #318B9B, #7C3AED)" }}>
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 dark:text-white text-sm">{locale === "ar" ? "المساعد الذكي" : "AI Assistant"}</h1>
            <p className="text-xs text-green-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              {locale === "ar" ? "متصل" : "Online"}
            </p>
          </div>
        </div>

        {/* Messages — scrollable area */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex gap-2", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
              <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                msg.role === "user" ? "bg-[#318B9B] text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
              )}>
                {msg.role === "user" ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
              </div>
              <div className={cn(
                "max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed break-words",
                msg.role === "user"
                  ? "bg-[#318B9B] text-white rounded-tr-sm"
                  : "bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm"
              )}>
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 justify-center pt-2">
              {suggestions.map((s) => (
                <button key={s} onClick={() => sendMessage(s)}
                  className="text-xs px-3 py-2 rounded-xl bg-[#318B9B]/10 text-[#318B9B] hover:bg-[#318B9B]/20 transition-colors font-medium">
                  {s}
                </button>
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input — always visible at bottom */}
        <div className="px-3 pb-3 pt-2 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
              placeholder={locale === "ar" ? "اكتب رسالتك..." : "Type your message..."}
              disabled={loading}
              className="flex-1 px-3 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#318B9B]/30 focus:border-[#318B9B] disabled:opacity-60"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-2xl bg-[#318B9B] text-white flex items-center justify-center hover:bg-[#1a5f6b] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
