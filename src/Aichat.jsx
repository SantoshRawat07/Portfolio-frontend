import React, { useState, useRef, useEffect } from "react";

// Fallback to localhost if the env var is not set
const API_URL = import.meta.env.VITE_BACKEND_API_URL || "https://portfolio-chatbot-backend-1-p2qp.onrender.com";

const Avatar = ({ letter = "S", size = 32 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: size * 0.42,
      fontWeight: 700,
      color: "#fff",
      flexShrink: 0,
      letterSpacing: "-0.5px",
      boxShadow: "0 2px 8px rgba(99,102,241,0.35)",
    }}
  >
    {letter}
  </div>
);

const TypingDots = () => (
  <div style={{ display: "flex", gap: 4, padding: "4px 0" }}>
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#a5b4fc",
          display: "inline-block",
          animation: `typingBounce 1.2s ${i * 0.2}s infinite ease-in-out`,
        }}
      />
    ))}
  </div>
);

const FloatingChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hey there 👋 How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const newMessages = [...messages, { role: "user", text: trimmed }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // FIX: Increased timeout from 15s to 60s to handle cold-start FAISS loading
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      // FIX: Send conversation history alongside the current message so the
      // backend has full context even if its memory file is lost or empty.
      const history = newMessages
        .slice(0, -1) // exclude the message we just appended
        .map((m) => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text }));

      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // FIX: Treat non-2xx responses as errors so error messages don't appear
      // as normal AI replies
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      // FIX: Check for an explicit error field returned by the backend
      if (data.error) throw new Error(data.error);

      setMessages((prev) => [...prev, { role: "ai", text: data.answer }]);
    } catch (err) {
      const isTimeout = err.name === "AbortError";
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          isError: true, // FIX: tag error messages so they can be styled differently
          text: isTimeout
            ? "⏱ The server is taking a while — it may be loading for the first time. Please try again in a moment."
            : `⚠️ Couldn't reach the server: ${err.message}. Please try again.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        @keyframes typingBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%            { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes popIn {
          from { transform: scale(0.7); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.55); }
          50%       { box-shadow: 0 0 0 10px rgba(99,102,241,0); }
        }

        .fcb-input:focus { outline: none; }
        .fcb-input::placeholder { color: #9ca3af; }
        .fcb-scrollbar::-webkit-scrollbar { width: 4px; }
        .fcb-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .fcb-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 99px; }

        .fcb-send-btn:hover { background: #4f46e5 !important; }
        .fcb-send-btn:active { transform: scale(0.95); }
        .fcb-toggle:hover { transform: scale(1.08); }
      `}</style>

      <div
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 2147483647,
          isolation: "isolate",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {open && (
          <div
            style={{
              width: 360,
              height: 520,
              borderRadius: 20,
              background: "#fff",
              boxShadow: "0 24px 60px rgba(0,0,0,0.14), 0 4px 16px rgba(99,102,241,0.10)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              marginBottom: 16,
              animation: "chatSlideUp 0.28s cubic-bezier(0.34,1.56,0.64,1) both",
              border: "1px solid rgba(99,102,241,0.10)",
            }}
          >
            {/* Header */}
            <div
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Avatar letter="S" size={38} />
              <div style={{ flex: 1 }}>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, lineHeight: 1 }}>
                  Santosh's Assistant
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.75)",
                    fontSize: 11,
                    marginTop: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#4ade80",
                      display: "inline-block",
                    }}
                  />
                  Online · AI Powered
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  borderRadius: 8,
                  width: 28,
                  height: 28,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 14,
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div
              className="fcb-scrollbar"
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "14px 14px 6px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                background: "#f9fafb",
              }}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                    alignItems: "flex-end",
                    gap: 7,
                  }}
                >
                  {msg.role === "ai" && <Avatar letter="S" size={26} />}
                  <div
                    style={{
                      maxWidth: "75%",
                      padding: "9px 13px",
                      borderRadius:
                        msg.role === "user"
                          ? "16px 16px 4px 16px"
                          : "16px 16px 16px 4px",
                      // FIX: Error messages get a distinct red tint so users
                      // know it's a system error, not an AI answer
                      background: msg.isError
                        ? "#fff1f0"
                        : msg.role === "user"
                        ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
                        : "#fff",
                      color: msg.isError
                        ? "#c0392b"
                        : msg.role === "user"
                        ? "#fff"
                        : "#1f2937",
                      fontSize: 13,
                      lineHeight: 1.55,
                      boxShadow:
                        msg.role === "user"
                          ? "0 2px 8px rgba(99,102,241,0.3)"
                          : "0 1px 4px rgba(0,0,0,0.07)",
                      fontWeight: 400,
                      wordBreak: "break-word",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div style={{ display: "flex", alignItems: "flex-end", gap: 7 }}>
                  <Avatar letter="S" size={26} />
                  <div
                    style={{
                      background: "#fff",
                      padding: "9px 14px",
                      borderRadius: "16px 16px 16px 4px",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                    }}
                  >
                    <TypingDots />
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div
              style={{
                padding: "10px 12px",
                borderTop: "1px solid #f3f4f6",
                background: "#fff",
                display: "flex",
                gap: 8,
                alignItems: "center",
              }}
            >
              <input
                ref={inputRef}
                className="fcb-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type a message…"
                style={{
                  flex: 1,
                  border: "1.5px solid #e5e7eb",
                  borderRadius: 12,
                  padding: "9px 13px",
                  fontSize: 13,
                  color: "#1f2937",
                  background: "#f9fafb",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                disabled={loading}
              />
              <button
                className="fcb-send-btn"
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 11,
                  border: "none",
                  background: input.trim() && !loading ? "#6366f1" : "#d1d5db",
                  color: "#fff",
                  cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "background 0.15s, transform 0.1s",
                  fontSize: 15,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Toggle button */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            className="fcb-toggle"
            onClick={() => setOpen((o) => !o)}
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 20px rgba(99,102,241,0.45)",
              animation: open ? "popIn 0.2s ease" : "pulse 2.5s infinite",
              transition: "transform 0.2s",
              color: "#fff",
            }}
            aria-label={open ? "Close chat" : "Open chat"}
          >
            {open ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default FloatingChatbot;