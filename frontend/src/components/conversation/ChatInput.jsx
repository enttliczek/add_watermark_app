import { useState } from "react";

export function ChatInput({ onSend, loading }) {
  const [value, setValue] = useState("");

  function handleSend() {
    const msg = value.trim();
    if (!msg || loading) return;
    setValue("");
    onSend(msg);
  }

  return (
    <div className="flex gap-2 items-end border-t border-duo-border bg-white p-3">
      <textarea
        className="flex-1 rounded-2xl border-2 border-duo-border p-3 text-sm outline-none focus:border-duo-blue resize-none"
        rows={2}
        placeholder="Napisz coś po hiszpańsku..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        disabled={loading}
      />
      <button
        onClick={handleSend}
        disabled={!value.trim() || loading}
        className="bg-duo-green text-white rounded-2xl px-4 py-3 font-bold text-sm disabled:opacity-50 hover:bg-duo-green-dark transition-colors active:scale-95"
      >
        {loading ? "⏳" : "Wyślij"}
      </button>
    </div>
  );
}
