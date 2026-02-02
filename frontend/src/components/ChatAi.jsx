import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send } from "lucide-react";

function ChatAi({ problem }) {
  const [messages, setMessages] = useState([
    { role: "model", parts: [{ text: "Hi, How are you" }] },
    { role: "user", parts: [{ text: "I am Good" }] },
  ]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSubmit = async (data) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", parts: [{ text: data.message }] },
    ]);
    reset();

    try {
      const response = await axiosClient.post("/ai/chat", {
        messages: messages,
        title: problem.title,
        description: problem.description,
        testCases: problem.visibleTestCases,
        startCode: problem.startCode,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: [{ text: response.data.message }],
        },
      ]);
    } catch (error) {
      console.error("API Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: [{ text: "Error from AI Chatbot" }],
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[80vh] min-h-[500px] bg-base-100 rounded-xl border border-base-300">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat ${
              msg.role === "user" ? "chat-end" : "chat-start"
            }`}
          >
            <div
              className={`chat-bubble text-sm leading-relaxed max-w-[85%] ${
                msg.role === "user"
                  ? "bg-primary text-primary-content"
                  : "bg-base-200 text-base-content"
              }`}
            >
              {msg.parts[0].text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="sticky bottom-0 border-t border-base-300 bg-base-100 px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <input
            placeholder="Ask about the problem, edge cases, or approach…"
            className="input input-bordered flex-1 h-11 focus:outline-none focus:ring-2 focus:ring-primary"
            {...register("message", { required: true, minLength: 2 })}
          />
          <button
            type="submit"
            className="btn btn-primary btn-square"
            disabled={errors.message}
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatAi;
