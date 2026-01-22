"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { ChatMessage, Chat } from "@/types/api";

const initialChats: Chat[] = [
  {
    id: "chat-1",
    name: "Design Studio",
    handle: "@design.studio",
    status: "online",
    avatarUrl: "/avatars/1.png",
    lastActive: "Now",
    unread: 2,
    messages: [
      { id: "m-1", from: "them", text: "Pushed the latest layout to Figma.", time: "10:12" },
      { id: "m-2", from: "you", text: "Looks great. Let's try a bolder CTA.", time: "10:18" },
      { id: "m-3", from: "them", text: "On it. Also added a glow on hover.", time: "10:22" },
    ],
  },
  {
    id: "chat-2",
    name: "Dev Daily",
    handle: "@dev.daily",
    status: "online",
    avatarUrl: "/avatars/2.png",
    lastActive: "5m ago",
    unread: 0,
    messages: [
      { id: "m-4", from: "them", text: "API rate limits updated to 200rpm.", time: "09:40" },
      { id: "m-5", from: "you", text: "Noted. Will sync docs.", time: "09:44" },
    ],
  },
  {
    id: "chat-3",
    name: "Product Mindset",
    handle: "@productmind",
    status: "offline",
    avatarUrl: "/avatars/3.png",
    lastActive: "1h ago",
    unread: 1,
    messages: [
      { id: "m-6", from: "them", text: "Need a hero copy variation for the launch.", time: "08:55" },
    ],
  },
];

const Messages = () => {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [selectedId, setSelectedId] = useState<string>(initialChats[0]?.id || "");
  const [messageInput, setMessageInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!selectedId) return;
    setChats((current) => current.map((chat) => (chat.id === selectedId ? { ...chat, unread: 0 } : chat)));
  }, [selectedId]);

  const filteredChats = useMemo(() => {
    if (!search.trim()) return chats;
    return chats.filter((chat) => chat.name.toLowerCase().includes(search.toLowerCase()) || chat.handle.toLowerCase().includes(search.toLowerCase()));
  }, [chats, search]);

  const selectedChat = useMemo(() => chats.find((chat) => chat.id === selectedId) || filteredChats[0] || null, [chats, filteredChats, selectedId]);

  const sendMessage = () => {
    if (!selectedChat || !messageInput.trim()) return;
    const nextMessage: ChatMessage = {
      id: `local-${Date.now()}`,
      from: "you",
      text: messageInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChats((current) =>
      current.map((chat) =>
        chat.id === selectedChat.id
          ? {
              ...chat,
              unread: 0,
              lastActive: "Now",
              messages: [...chat.messages, nextMessage],
            }
          : chat
      )
    );
    setMessageInput("");
  };

  return (
    <div className="min-h-screen px-3 py-4 text-slate-900 transition-colors dark:text-white sm:px-4 sm:py-6 md:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl gap-4 lg:gap-6">
        <aside className="hidden w-80 shrink-0 flex-col rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm shadow-slate-200 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none sm:flex">
          <div className="mb-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Inbox</p>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Messages</h2>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <span className="text-lg">🔍</span>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search people or handles" className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" />
          </div>
          <div className="mt-3 flex flex-1 flex-col gap-2 overflow-y-auto">
            {filteredChats.map((chat) => {
              const active = selectedChat?.id === chat.id;
              return (
                <button
                  key={chat.id}
                  type="button"
                  onClick={() => setSelectedId(chat.id)}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${
                    active ? "border-blue-200 bg-blue-50 text-blue-700 shadow-sm dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-100" : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-800">
                    <Image src={chat.avatarUrl} alt={chat.name} fill className="object-cover" />
                    <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${chat.status === "online" ? "bg-emerald-400" : "bg-slate-400"} dark:border-slate-900`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{chat.name}</p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">{chat.handle} · {chat.lastActive}</p>
                  </div>
                  {chat.unread > 0 && <span className="rounded-full bg-rose-500 px-2 py-1 text-[11px] font-semibold text-white shadow-sm">{chat.unread}</span>}
                </button>
              );
            })}
            {filteredChats.length === 0 && <p className="p-3 text-xs text-slate-500 dark:text-slate-400">No conversations found.</p>}
          </div>
          <button type="button" className="mt-3 w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-[1px] hover:bg-slate-800 dark:bg-white dark:text-slate-900">
            + New message
          </button>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col rounded-2xl border border-slate-200 bg-white/90 shadow-sm shadow-slate-200 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none">
          {selectedChat ? (
            <>
              <header className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 text-sm dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-800">
                    <Image src={selectedChat.avatarUrl} alt={selectedChat.name} fill className="object-cover" />
                    <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${selectedChat.status === "online" ? "bg-emerald-400" : "bg-slate-400"} dark:border-slate-900`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{selectedChat.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{selectedChat.handle} · {selectedChat.lastActive}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                    Call
                  </button>
                  <button type="button" className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                    Share
                  </button>
                </div>
              </header>

              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-6">
                {selectedChat.messages.map((message) => {
                  const mine = message.from === "you";
                  return (
                    <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                        mine ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                      }`}>
                        <p>{message.text}</p>
                        <p className={`mt-1 text-[11px] font-semibold ${mine ? "text-white/80" : "text-slate-500 dark:text-slate-400"}`}>{message.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <footer className="border-t border-slate-200 p-3 dark:border-slate-800 sm:p-4">
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm dark:border-slate-700 dark:bg-slate-950">
                  <button type="button" className="rounded-full px-3 py-2 text-lg transition hover:bg-slate-100 dark:hover:bg-slate-800">😊</button>
                  <input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Type a message"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                  />
                  <button type="button" onClick={sendMessage} className="rounded-full bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-[1px] hover:bg-blue-500">
                    Send
                  </button>
                </div>
              </footer>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center p-8 text-sm text-slate-500 dark:text-slate-400">Select a conversation to start chatting.</div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Messages;
