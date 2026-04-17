import { SpeakButton } from "../ui/SpeakButton";

export function ChatBubble({ message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-duo-green flex items-center justify-center text-white text-sm mr-2 flex-shrink-0 mt-1">
          🤖
        </div>
      )}
      <div className={`max-w-[80%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? "bg-duo-blue text-white rounded-tr-sm"
              : "bg-white border border-duo-border text-duo-text rounded-tl-sm shadow-sm"
          }`}
        >
          {message.content}
        </div>
        {!isUser && message.content && (
          <div className="ml-1">
            <SpeakButton text={message.content.split("```")[0].trim()} />
          </div>
        )}
      </div>
    </div>
  );
}
