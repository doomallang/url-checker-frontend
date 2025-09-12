"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useChatRoom } from "@/hooks/useChatRoom";
import { Loader2, Send, Smile, Wifi, WifiOff } from "lucide-react";

type Props = {
  roomId: string;
  me: string;
};

export default function ChatRoom({ roomId, me }: Props) {
  const { connected, messages, send } = useChatRoom(roomId, me);
  const [text, setText] = useState("");
  const [composing, setComposing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 새 메시지 오면 자동 스크롤
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // 자연스럽게 바닥으로
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const canSend = connected && text.trim().length > 0;

  const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    if (composing) return; // 한글 조합 중 Enter 무시
    e.preventDefault();
    if (!canSend) return;
    send(text);
    setText("");
  };

  const statusChip = connected ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-xs">
      <span className="size-1.5 rounded-full bg-emerald-500" />
      Live
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 text-gray-600 px-2 py-0.5 text-xs">
      <span className="size-1.5 rounded-full bg-gray-400" />
      Connecting…
    </span>
  );

  return (
    <div className="rounded-2xl border bg-white shadow-sm backdrop-blur">
      {/* Header */}
      <div className="relative border-b">
        <div className="absolute inset-x-0 -top-4 h-16 bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/15 blur-2xl -z-10" />
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-indigo-600 text-white shadow-sm">
              💬
            </div>
            <div>
              <div className="text-sm text-gray-500">Room</div>
              <h3 className="text-lg font-semibold tracking-tight">{roomId}</h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {statusChip}
            {connected ? (
              <Wifi className="size-4 text-emerald-600" />
            ) : (
              <WifiOff className="size-4 text-gray-500 animate-pulse" />
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="h-[320px] overflow-y-auto px-4 py-3 bg-gradient-to-b from-white to-slate-50"
      >
        {messages.length === 0 ? (
          <div className="grid h-full place-items-center text-sm text-gray-500">
            아직 메시지가 없어요. 첫 인사를 보내보세요! 👋
          </div>
        ) : (
          <ul className="space-y-3">
            {messages.map((m, idx) => {
              const mine = m.sender === me;
              const ts = new Date(m.timestamp);
              const time = ts.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              // 시스템 메시지 (JOIN/LEAVE 등)
              if (m.type !== "CHAT") {
                return (
                  <li key={idx} className="flex items-center justify-center">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="h-px w-8 bg-gray-200" />
                      <span className="italic">{m.content}</span>
                      <span className="h-px w-8 bg-gray-200" />
                    </div>
                  </li>
                );
              }

              // 일반 채팅 메시지
              return (
                <li
                  key={idx}
                  className={`flex items-end ${mine ? "justify-end" : "justify-start"}`}
                >
                  {!mine && <Avatar name={m.sender} className="mr-2" />}
                  <div className={`max-w-[70%]`}>
                    <div
                      className={`rounded-2xl px-3 py-2 text-sm shadow-sm
                        ${mine ? "bg-indigo-600 text-white rounded-br-sm" : "bg-white text-gray-900 border rounded-bl-sm"}
                      `}
                    >
                      {!mine && (
                        <div className="mb-0.5 text-[11px] text-gray-500">
                          {m.sender}
                        </div>
                      )}
                      <div className="break-words whitespace-pre-wrap">
                        {m.content}
                      </div>
                    </div>
                    <div
                      className={`mt-1 text-[11px] ${mine ? "text-indigo-500/80 text-right" : "text-gray-500"}`}
                    >
                      {time}
                    </div>
                  </div>
                  {mine && <div className="ml-2" />}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Input */}
      <div className="border-t px-3 py-2">
        <div className="flex items-center gap-2 rounded-full border bg-white px-3 py-2 shadow-sm">
          <button
            type="button"
            className="rounded-full p-1.5 hover:bg-gray-50 text-gray-500"
            title="Emoji"
            aria-label="Emoji"
          >
            <Smile className="size-5" />
          </button>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onEnter}
            onCompositionStart={() => setComposing(true)}
            onCompositionEnd={() => setComposing(false)}
            placeholder={connected ? "메시지를 입력하세요…" : "연결 중…"}
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-gray-400"
            disabled={!connected}
          />
          <button
            type="button"
            onClick={() => canSend && (setText(""), send(text))}
            disabled={!canSend}
            className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {connected ? (
              <Send className="size-4" />
            ) : (
              <Loader2 className="size-4 animate-spin" />
            )}
            보내기
          </button>
        </div>
        <p className="mt-1.5 text-[11px] text-gray-500">
          Enter로 전송 · Shift+Enter 줄바꿈 (모바일은 전송 버튼)
        </p>
      </div>
    </div>
  );
}

/** 아바타(이니셜) */
function Avatar({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  const initial = useMemo(() => {
    const n = (name || "?").trim();
    return n.slice(0, 1).toUpperCase();
  }, [name]);
  return (
    <div
      className={`grid size-8 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-sm shadow ${className}`}
      title={name}
      aria-label={name}
    >
      {initial}
    </div>
  );
}
