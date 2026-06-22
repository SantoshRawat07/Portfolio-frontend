import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Rocket,
  Code2,
  Phone,
  CheckCircle,
  XCircle,
  Briefcase,
  Brain,
  Mail,
  Globe,
  Link,
  User,
  Lightbulb,
  Handshake,
  Smile,
  GraduationCap,
  Heart,
  Zap,
  MessageCircle,
} from "lucide-react";
import { profile, about, projects, skills, contact, projectIdeaSuggestions } from "./assets/Data/data";

// ─── AI Avatar — "S" letter circle, used inside the chat ──────────────────
const Avatar = ({ size = 32 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontWeight: 700,
      fontSize: size * 0.44,
      flexShrink: 0,
      letterSpacing: 0,
      userSelect: "none",
    }}
  >
    S
  </div>
);

// ─── Typing indicator ───────────────────────────────────────────────────────
const TypingIndicator = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
    <Avatar size={26} />
    <div
      style={{
        background: "#fff",
        borderRadius: "16px 16px 16px 4px",
        padding: "10px 16px",
        display: "flex",
        gap: 5,
        alignItems: "center",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#a5b4fc",
            display: "inline-block",
            animation: "bounce 1.2s ease-in-out infinite",
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  </div>
);

// ─── Helpers ────────────────────────────────────────────────────────────────
const extractName = (text) => {
  const t = text.trim();
  const patterns = [
    /my name is\s+(\w+)/i,
    /i(?:'m| am)\s+(\w+)/i,
    /call me\s+(\w+)/i,
  ];
  for (const p of patterns) {
    const m = t.match(p);
    if (m) return m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase();
  }
  const first = t.split(/\s+/)[0];
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
};

// Heuristic check — not perfect, but catches most non-name junk
// (random keys, numbers, "idk", "test", repeated letters, etc.)
const isLikelyName = (candidate) => {
  if (!candidate) return false;
  // letters, apostrophes, hyphens only, reasonable length
  if (!/^[A-Za-z'-]{2,20}$/.test(candidate)) return false;
  // real names virtually always contain a vowel
  if (!/[aeiouAEIOU]/.test(candidate)) return false;
  // reject 3+ repeated identical letters in a row (e.g. "aaaa", "xxxxx")
  if (/(.)\1{2,}/.test(candidate)) return false;
  // reject common placeholder / junk words
  const blacklist = [
    "test", "testing", "asdf", "asdfgh", "qwerty", "unknown", "none",
    "idk", "hi", "hello", "hey", "na", "abc", "xyz", "random", "name",
    "anonymous", "user", "guest", "nobody",
  ];
  if (blacklist.includes(candidate.toLowerCase())) return false;
  return true;
};

const detectIntent = (text) => {
  const t = text.toLowerCase();
  return {
    yes: /\b(yes|yeah|yep|sure|ok|okay|absolutely|definitely|yup|of course)\b/.test(t),
    no: /\b(no|nope|nah|not really|nothing|none|skip|dont|don't)\b/.test(t),
  };
};
const projectsListText = projects.map((p) => `• ${p.title}`).join("\n");
const skillsListText = skills.map((s) => `• ${s}`).join("\n");
const projectIdeaSuggestionsText = projectIdeaSuggestions.map((s) => `• ${s}`).join("\n");
const aboutText = `👤 About Me\n\n${about.summary}\n\n${about.traits.map((t) => `• ${t}`).join("\n")}`;

const contactBlock = `📧 Email\n${contact.email}\n\n💬 WhatsApp\n${contact.whatsapp || "+977 9864926196"}\n\n💼 LinkedIn\n${contact.linkedin}\n\n💻 GitHub\n${contact.github}`;

// ─── Icon row helper ────────────────────────────────────────────────────────
const IconRow = ({ icon: Icon, color = "#6366f1", children, bold = false, mb = 2 }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 7, marginBottom: mb, fontWeight: bold ? 700 : 400 }}>
    <Icon size={14} color={color} style={{ marginTop: 2, flexShrink: 0 }} />
    <span>{children}</span>
  </div>
);

// ─── AI message renderer ────────────────────────────────────────────────────
const AiMessageContent = ({ text }) => {
  const lines = text.split("\n");
  return (
    <div style={{ fontSize: 14, lineHeight: 1.6, color: "#111827" }}>
      {lines.map((line, i) => {
        const t = line.trim();

        if (t === "") return <div key={i} style={{ height: 6 }} />;

        if (t.startsWith("🚀") || t === "My Projects")
          return <IconRow key={i} icon={Rocket} color="#6366f1" bold mb={6}>{t.replace(/^🚀\s*/, "")}</IconRow>;
        if (t.startsWith("💻 My Skills") || t === "My Skills")
          return <IconRow key={i} icon={Code2} color="#6366f1" bold mb={6}>{t.replace(/^💻\s*/, "")}</IconRow>;
        if (t.startsWith("👤"))
          return <IconRow key={i} icon={GraduationCap} color="#6366f1" bold mb={6}>{t.replace(/^👤\s*/, "")}</IconRow>;

        if (t.startsWith("📧"))
          return <IconRow key={i} icon={Mail} color="#6366f1">{t.replace(/^📧\s*/, "")}</IconRow>;
        if (t.startsWith("💬"))
          return <IconRow key={i} icon={MessageCircle} color="#25D366">{t.replace(/^💬\s*/, "")}</IconRow>;
        if (t.startsWith("💼"))
          return <IconRow key={i} icon={Link} color="#0a66c2">{t.replace(/^💼\s*/, "")}</IconRow>;
        if (t.startsWith("💻 GitHub") || t.startsWith("💻 github"))
          return <IconRow key={i} icon={Globe} color="#333">{t.replace(/^💻\s*/, "")}</IconRow>;

        if (t.startsWith("👋"))
          return <IconRow key={i} icon={Smile} color="#f59e0b" mb={6}>{t.replace(/^👋\s*/, "")}</IconRow>;
        if (t.includes("That's okay") || t.includes("already have my contact"))
          return <IconRow key={i} icon={Smile} color="#f59e0b">{t.replace(/^😊\s*/, "")}</IconRow>;
        if (t.includes("Nice to meet you"))
          return <IconRow key={i} icon={User} color="#6366f1">{t}</IconRow>;
        if (t.includes("Awesome") || t.includes("interesting idea"))
          return <IconRow key={i} icon={Rocket} color="#6366f1" bold>{t.replace(/^🚀\s*/, "")}</IconRow>;

        if (t === "Project Idea:")
          return <IconRow key={i} icon={Lightbulb} color="#6366f1" bold mb={4}>Project Idea:</IconRow>;

        if (t.startsWith('"') || t.startsWith("\u201c"))
          return (
            <div key={i} style={{ background: "#f5f3ff", borderLeft: "3px solid #6366f1", borderRadius: 6, padding: "6px 10px", margin: "4px 0", fontStyle: "italic", color: "#4f46e5" }}>
              {t}
            </div>
          );

        if (t.startsWith("If you") || t.startsWith("feel free"))
          return <IconRow key={i} icon={Handshake} color="#6366f1">{t}</IconRow>;

        if (t.startsWith("•")) {
          const label = t.replace(/^•\s*/, "");
          const isProjAI = /personal ai|portfolio chatbot/i.test(label);
          const isProjDoc = /ocr|loan/i.test(label);
          const isCode = /python|fastapi|react|next\.js|postgresql|langchain|rag|ai agents/i.test(label);
          const isAI = /ai development|ocr systems/i.test(label);
          const isHardworking = /hardworking/i.test(label);
          const isPassionate = /passionate/i.test(label);
          const isLearner = /learn|student/i.test(label);
          const Icon =
            isProjAI || isAI ? Brain :
            isProjDoc ? Briefcase :
            isHardworking ? Zap :
            isPassionate ? Heart :
            isLearner ? GraduationCap :
            isCode ? Code2 :
            Lightbulb;
          return <IconRow key={i} icon={Icon} color="#8b5cf6">{label}</IconRow>;
        }

        return <div key={i} style={{ marginBottom: 2 }}>{line}</div>;
      })}
    </div>
  );
};

// ─── Chip button ────────────────────────────────────────────────────────────
const ChipBtn = ({ icon: Icon, label, color = "#4f46e5", onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: "9px 16px",
      borderRadius: 20,
      border: "1px solid #e0e7ff",
      background: "#f5f3ff",
      color,
      fontWeight: 600,
      fontSize: 13,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 7,
      transition: "background 0.15s",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.background = "#ede9fe")}
    onMouseLeave={(e) => (e.currentTarget.style.background = "#f5f3ff")}
  >
    {Icon && <Icon size={14} />}
    {label}
  </button>
);

// ─── Main component ─────────────────────────────────────────────────────────
function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState("name");
  const [visitorName, setVisitorName] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [initialized, setInitialized] = useState(false);
  // Tracks whether the full contact card has already been shown once,
  // so clicking "Contact" again doesn't repeat the whole block.
  const [contactShown, setContactShown] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (open && !initialized) {
      setInitialized(true);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages([{ role: "ai", text: profile.greeting }]);
      }, 1000);
    }
  }, [open, initialized]);

  const addMessage = (role, text) =>
    setMessages((prev) => [...prev, { role, text }]);

  const aiReply = (text, delay = 700) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMessage("ai", text);
    }, delay);
  };

  const sendMessage = () => {
    const text = input.trim();
    if (!text || isTyping) return;
    addMessage("user", text);
    setInput("");

    if (step === "name") {
      const name = extractName(text);
      if (!isLikelyName(name)) {
        aiReply(`It seems like that's not a real name 🤔\n\nCould you please tell me your real name?`);
        return;
      }
      setVisitorName(name);
      setStep("menu");
      aiReply(`Nice to meet you, ${name}!\n\nWhat would you like to know about me?`);
      return;
    }

    if (step === "projectIdea") {
      const { yes, no } = detectIntent(text);
      if (no) {
        aiReply(`That's okay!\n\nIf you ever have an idea in the future, feel free to reach out:\n\n${contactBlock}`);
        setStep("done");
        return;
      }
      if (yes) {
        aiReply(`Awesome, ${visitorName}!\n\nPlease describe your project idea in a few sentences.\n\n${projectIdeaSuggestionsText}`);
        setStep("ideaDescription");
        return;
      }
    }

    if (step === "ideaDescription") {
      aiReply(`That's an interesting idea, ${visitorName}!\n\nProject Idea:\n"${text}"\n\nIf you'd like to discuss this or build it with me, feel free to reach out:\n\n${contactBlock}\n\nThank you for visiting my portfolio.`);
      setStep("done");
      return;
    }
  };

  const showAbout = () => {
    addMessage("user", "About");
    addMessage("ai", aboutText);
  };

  const showProjects = () => {
    addMessage("user", "Projects");
    addMessage("ai", `🚀 My Projects\n\n${projectsListText}\n\nDo you have a project idea you'd like to build?\n\nPlease describe it below — or say No if not.`);
    setStep("projectIdea");
  };

  const showSkills = () => {
    addMessage("user", "Skills");
    addMessage("ai", `💻 My Skills\n\n${skillsListText}\n\nDo you have a project idea you'd like to build?\n\nPlease describe it below — or say No if not.`);
    setStep("projectIdea");
  };

  const showContact = () => {
    addMessage("user", "Contact");
    if (!contactShown) {
      addMessage("ai", `${contactBlock}\n\nThank you for visiting my portfolio.`);
      setContactShown(true);
    } else {
      addMessage("ai", `You already have my contact info above 👆 Feel free to reach out anytime!`);
    }
    setStep("done");
  };

  return (
    <>
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .chat-bubble {
          max-width: 75%;
        }
        /* Widen the AI reply bubble by 5px (extends further right) on md+ screens */
        @media (min-width: 768px) {
          .chat-bubble-ai { max-width: calc(75% + 5px); }
        }
        @media (min-width: 1024px) {
          .chat-bubble-ai { max-width: calc(75% + 5px); }
        }
      `}</style>

      <div style={{ position: "fixed", right: 24, bottom: 24, zIndex: 9999, fontFamily: "Inter, sans-serif" }}>
        {open && (
          <div style={{ width: 360, height: 520, background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,.15)", display: "flex", flexDirection: "column", marginBottom: 12 }}>

            {/* Header — uses "S" Avatar */}
            <div style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", padding: 14, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ position: "relative" }}>
                <Avatar size={38} />
                <span style={{ position: "absolute", bottom: 1, right: 1, width: 10, height: 10, borderRadius: "50%", background: "#4ade80", border: "2px solid #8b5cf6", animation: "pulse-dot 2s ease-in-out infinite" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#fff", fontWeight: 700 }}>{profile.name}'s Assistant</div>
                <div style={{ color: "#ddd6fe", fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
                  AI Assistant Online
                </div>
              </div>
              <button onClick={() => setOpen(false)} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", cursor: "pointer", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={16} />
              </button>
            </div>

            {/* Messages — each AI bubble uses "S" Avatar */}
            <div style={{ flex: 1, overflowY: "auto", padding: 14, background: "#f9fafb" }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: 10, gap: 8 }}>
                  {msg.role === "ai" && <Avatar size={26} />}
                  <div className={msg.role === "ai" ? "chat-bubble chat-bubble-ai" : "chat-bubble chat-bubble-user"} style={{ padding: "10px 14px", borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: msg.role === "user" ? "#6366f1" : "#fff", color: msg.role === "user" ? "#fff" : "#111827", fontSize: 14, lineHeight: 1.55, boxShadow: msg.role === "ai" ? "0 1px 4px rgba(0,0,0,0.06)" : "none" }}>
                    {msg.role === "ai" ? <AiMessageContent text={msg.text} /> : msg.text}
                  </div>
                </div>
              ))}

              {isTyping && <TypingIndicator />}

              {step === "menu" && !isTyping && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
                  <ChipBtn icon={GraduationCap} label="About" onClick={showAbout} />
                  <ChipBtn icon={Rocket} label="Projects" onClick={showProjects} />
                  <ChipBtn icon={Code2} label="Skills" onClick={showSkills} />
                  <ChipBtn icon={Phone} label="Contact" onClick={showContact} />
                </div>
              )}

              {step === "projectIdea" && !isTyping && (
                <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                  <ChipBtn
                    icon={CheckCircle}
                    label="Yes, I have an idea!"
                    color="#059669"
                    onClick={() => {
                      addMessage("user", "Yes, I have an idea!");
                      aiReply(`Awesome, ${visitorName}!\n\nPlease describe your project idea in a few sentences.\n\n${projectIdeaSuggestionsText}`);
                      setStep("ideaDescription");
                    }}
                  />
                  <ChipBtn
                    icon={XCircle}
                    label="No, not right now"
                    color="#dc2626"
                    onClick={() => {
                      addMessage("user", "No, not right now");
                      aiReply(`That's okay!\n\nIf you ever have an idea in the future, feel free to reach out:\n\n${contactBlock}`);
                      setStep("done");
                    }}
                  />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            {step !== "done" && (
              <div style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px solid #eee", alignItems: "center" }}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
                  placeholder={
                    step === "name" ? "Enter your name..." :
                    step === "projectIdea" ? "Type Yes or No..." :
                    step === "ideaDescription" ? "Describe your project idea..." :
                    "Type here..."
                  }
                  style={{ flex: 1, padding: 10, borderRadius: 10, border: "1px solid #ddd", fontSize: 14, outline: "none" }}
                />
                <button onClick={sendMessage} style={{ background: "#6366f1", color: "#fff", border: "none", borderRadius: 10, padding: "0 14px", cursor: "pointer", height: 40, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <Send size={15} />
                </button>
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => setOpen(!open)}
          style={{ width: 58, height: 58, borderRadius: "50%", border: "none", cursor: "pointer", color: "#fff", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", boxShadow: "0 6px 20px rgba(99,102,241,.4)", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          {open ? <X size={24} /> : <MessageSquare size={24} />}
        </button>
      </div>
    </>
  );
}

export default FloatingChatbot;