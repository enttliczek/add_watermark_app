import { useEffect, useRef, useState } from "react";
import { fetchHistory, sendMessage, clearHistory } from "../api/conversation";
import { useAppStore } from "../store/appStore";
import { ChatBubble } from "../components/conversation/ChatBubble";
import { CorrectionCard } from "../components/conversation/CorrectionCard";
import { ChatInput } from "../components/conversation/ChatInput";

export function ConversationPage() {
  const { messages, setMessages, addMessage, clearConversation } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [corrections, setCorrections] = useState({});
  const bottomRef = useRef(null);

  useEffect(() => {
    fetchHistory().then((history) => {
      setMessages(history);
      const corrMap = {};
      history.forEach((m) => {
        if (m.correction_json) {
          try { corrMap[m.id] = JSON.parse(m.correction_json); } catch (_) {}
        }
      });
      setCorrections(corrMap);
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(text) {
    const tempUser = { id: Date.now(), role: "user", content: text };
    addMessage(tempUser);
    setLoading(true);
    try {
      const data = await sendMessage(text);
      const tempAssistant = { id: Date.now() + 1, role: "assistant", content: data.reply };
      addMessage(tempAssistant);
      if (data.correction) {
        setCorrections((c) => ({ ...c, [tempAssistant.id]: data.correction }));
      }
    } catch {
      addMessage({ id: Date.now() + 1, role: "assistant", content: "⚠️ Błąd połączenia z API. Sprawdź klucz ANTHROPIC_API_KEY w pliku backend/.env" });
    } finally {
      setLoading(false);
    }
  }

  async function handleClear() {
    await clearHistory();
    clearConversation();
    setCorrections({});
  }

  return (
    <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-duo-border">
        <div>
          <h2 className="font-extrabold text-base text-duo-text">💬 Rozmowa po hiszpańsku</h2>
          <p className="text-xs text-duo-muted">AI poprawi twoje błędy</p>
        </div>
        <button
          onClick={handleClear}
          className="text-xs text-duo-muted hover:text-duo-red transition-colors px-2 py-1 rounded"
        >
          Wyczyść
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {messages.length === 0 && (
          <div className="text-center text-duo-muted text-sm py-12">
            <p className="text-4xl mb-3">🇪🇸</p>
            <p className="font-semibold mb-1">Zacznij rozmowę!</p>
            <p>Napisz coś po hiszpańsku, a AI odpowie</p>
            <p className="mt-2 text-xs">np. <em>„Hola, me llamo Juan"</em></p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id}>
            <ChatBubble message={msg} />
            {msg.role === "assistant" && corrections[msg.id] && (
              <CorrectionCard correction={corrections[msg.id]} />
            )}
          </div>
        ))}
        {loading && (
          <div className="flex justify-start mb-2">
            <div className="bg-white border border-duo-border rounded-2xl px-4 py-3 text-sm text-duo-muted animate-pulse">
              Nauczyciel pisze...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={handleSend} loading={loading} />
    </div>
  );
}
