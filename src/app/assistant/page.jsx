

"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bot,
  Send,
  UserRound,
  Sparkles,
  Plus,
  MessageCircle,
  LoaderCircle,
} from "lucide-react";
import { askAssistant } from "@/lib/api";

const SUGGESTED_QUESTIONS = [
  "Satyanarayan Puja ki vidhi kya hai?",
  "Ganesh Puja ke liye kya samagri chahiye?",
  "Griha Pravesh ke liye kya karna chahiye?",
  "Rahu Kaal kya hota hai?",
  "Ekadashi vrat ke niyam kya hain?",
  "Rudrabhishek kaise kiya jata hai?",
];

const INITIAL_MESSAGE = {
  id: "welcome",
  role: "assistant",
  content:
    "Namaste! 🙏 Main MuhuratMitra Puja Assistant hoon. Aap mujhse puja vidhi, samagri, vrat, tithi aur Hindu parampara se jude sawal pooch sakte hain. Aaj main aapki kis tarah madad kar sakta hoon?",
};

const createId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;

export default function AssistantPage() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const [streamWords, setStreamWords] = useState([]);
  const [visibleWordCount, setVisibleWordCount] = useState(0);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll when messages or streaming content change.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, visibleWordCount, isReplying]);

  // Reveal assistant response word by word.
  useEffect(() => {
    if (!isReplying || streamWords.length === 0) return;

    const interval = setInterval(() => {
      setVisibleWordCount((current) => {
        const next = current + 1;

        if (next >= streamWords.length) {
          clearInterval(interval);

          const completedMessage = streamWords.join(" ");

          setMessages((previous) => [
            ...previous,
            {
              id: createId(),
              role: "assistant",
              content: completedMessage,
            },
          ]);

          setStreamWords([]);
          setIsReplying(false);

          return 0;
        }

        return next;
      });
    }, 65);

    return () => clearInterval(interval);
  }, [isReplying, streamWords]);

  const handleSend = async (question = input) => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || isReplying) return;

    setMessages((previous) => [
      ...previous,
      {
        id: createId(),
        role: "user",
        content: trimmedQuestion,
      },
    ]);

    setInput("");
    setIsReplying(true);
    setStreamWords([]);
    setVisibleWordCount(0);

    try {
      const response = await askAssistant(trimmedQuestion);
      const words = response.trim().split(/\s+/);

      setStreamWords(words);
    } catch (error) {
      console.error("Assistant error:", error);

      const fallback =
        "Sorry, abhi response generate nahi ho paya. Kripya dobara try karein.";

      setStreamWords(fallback.split(/\s+/));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSend();
  };

  const handleNewChat = () => {
    if (isReplying) return;

    setMessages([INITIAL_MESSAGE]);
    setInput("");
    setStreamWords([]);
    setVisibleWordCount(0);

    inputRef.current?.focus();
  };

  const hasUserMessages = messages.some(
    (message) => message.role === "user"
  );

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex items-center justify-between gap-4 border-b border-border py-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Bot size={23} />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold text-foreground">
                Puja Assistant
              </h1>

              <div className="mt-0.5 flex items-center gap-2">
                <span className="size-2 rounded-full bg-green-500" />
                <p className="text-xs text-muted-foreground">
                  Demo assistant · Ready to help
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleNewChat}
            disabled={isReplying}
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={17} />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </header>

        {/* Chat Content */}
        <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col">
          <div className="flex-1 py-6 sm:py-8">
            {/* Welcome Section */}
            {!hasUserMessages && (
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Sparkles size={30} />
                </div>

                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                  How can I help you today?
                </h2>

                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
                  Ask anything about Hindu puja rituals, samagri, festivals,
                  vrat and Panchang.
                </p>
              </div>
            )}

            {/* Messages */}
            <div className="space-y-6">
              {messages.map((message) => {
                const isUser = message.role === "user";

                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      isUser ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
                        isUser
                          ? "bg-muted text-foreground"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      {isUser ? (
                        <UserRound size={18} />
                      ) : (
                        <Bot size={19} />
                      )}
                    </div>

                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[75%] ${
                        isUser
                          ? "rounded-tr-sm bg-primary text-primary-foreground"
                          : "rounded-tl-sm border border-border bg-card text-card-foreground"
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-7">
                        {message.content}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Streaming Response */}
              {isReplying && (
                <div className="flex gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Bot size={19} />
                  </div>

                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3 text-card-foreground sm:max-w-[75%]">
                    {streamWords.length === 0 ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <LoaderCircle
                          size={16}
                          className="animate-spin"
                        />
                        Thinking...
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap text-sm leading-7">
                        {streamWords
                          .slice(0, visibleWordCount)
                          .join(" ")}
                        <span className="ml-1 inline-block h-4 w-1 animate-pulse rounded-full bg-primary align-middle" />
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div ref={bottomRef} />
          </div>

          {/* Suggested Questions */}
          {!hasUserMessages && (
            <div className="mb-6">
              <div className="mb-3 flex items-center gap-2">
                <MessageCircle
                  size={16}
                  className="text-primary"
                />
                <p className="text-sm font-semibold text-foreground">
                  Suggested questions
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.map((question) => (
                  <button
                    key={question}
                    type="button"
                    disabled={isReplying}
                    onClick={() => handleSend(question)}
                    className="rounded-full border border-border bg-card px-3.5 py-2 text-left text-xs font-medium text-foreground transition hover:border-primary hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="sticky bottom-0 bg-background pb-5 pt-2">
            <form
              onSubmit={handleSubmit}
              className="flex items-end gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm focus-within:border-primary"
            >
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey
                  ) {
                    event.preventDefault();
                    handleSubmit(event);
                  }
                }}
                disabled={isReplying}
                placeholder="Ask about puja, vrat, samagri..."
                aria-label="Ask a puja question"
                className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={!input.trim() || isReplying}
                aria-label="Send message"
                className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={18} />
              </button>
            </form>

            <p className="mt-3 text-center text-xs text-muted-foreground">
              MuhuratMitra Assistant provides general information.
              Verify important rituals and timings with a knowledgeable pandit.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

