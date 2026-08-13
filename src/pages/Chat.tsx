import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useChatStore } from "../lib/state/ChatStore";
import { ConversationEngineClient } from "../lib/engine/ConversationEngineClient";

export default function Chat() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const characterId = searchParams.get("characterId") || "";

    const messages = useChatStore((s) => s.messages);
    const conversationId = useChatStore((s) => s.conversationId);
    const sessionId = useChatStore((s) => s.sessionId);
    const isLoading = useChatStore((s) => s.isLoading);
    const error = useChatStore((s) => s.error);
    const setMessages = useChatStore((s) => s.setMessages);
    const addMessage = useChatStore((s) => s.addMessage);
    const setConversationId = useChatStore((s) => s.setConversationId);
    const setSessionId = useChatStore((s) => s.setSessionId);
    const setLoading = useChatStore((s) => s.setLoading);
    const setError = useChatStore((s) => s.setError);

    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!characterId) {
            navigate("/home");
            return;
        }
        startConversation();
    }, [characterId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const startConversation = async () => {
        setLoading(true);
        setError(null);
        try {
            const engine = await ConversationEngineClient.getEngine();
            const result = await engine.startSession({
                conversationId: `conv-${characterId}-${Date.now()}`,
                ownerId: characterId,
                participantIds: [characterId],
                claims: { roles: ["user"], permissions: ["chat"] }
            });
            setConversationId(result.conversationId);
            setSessionId(result.sessionId);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to start conversation");
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || !conversationId || !sessionId) return;
        const userMessage = {
            id: `msg-${Date.now()}`,
            conversationId,
            sessionId,
            authorId: characterId,
            role: "user",
            content: input.trim(),
            timestamp: Date.now()
        };
        addMessage(userMessage);
        setInput("");
        setLoading(true);
        setError(null);

        try {
            const engine = await ConversationEngineClient.getEngine();
            await engine.postMessage({
                conversationId,
                sessionId,
                authorId: characterId,
                content: userMessage.content,
                role: "user",
                claims: { roles: ["user"], permissions: ["chat"] }
            });

            const history = await engine.getMessageHistory({
                conversationId,
                requesterId: characterId,
                limit: 50
            });
            setMessages(
                history.map((m) => ({
                    id: m.messageId,
                    conversationId: m.conversationId,
                    sessionId: m.sessionId,
                    authorId: m.authorId,
                    role: m.role,
                    content: m.content,
                    timestamp: m.timestamp
                }))
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to send message");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <nav className="navbar">
                <button className="secondary" onClick={() => navigate("/home")}>
                    ← Home
                </button>
                <h1>Chat</h1>
            </nav>

            <div className="chat-container">
                <div className="chat-messages">
                    {messages.length === 0 && !isLoading && (
                        <div className="empty-state">
                            <p>No messages yet. Start the conversation!</p>
                        </div>
                    )}
                    {messages.map((msg) => (
                        <div key={msg.id} className={`chat-message ${msg.role === "user" ? "user" : "assistant"}`}>
                            <div className="message-bubble">
                                <p>{msg.content}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="chat-message assistant">
                            <div className="message-bubble">
                                <p>...</p>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {error && <div className="chat-error">{error}</div>}

                <div className="chat-input-bar">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        disabled={isLoading || !conversationId}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSend();
                        }}
                    />
                    <button
                        className="primary"
                        onClick={handleSend}
                        disabled={isLoading || !input.trim() || !conversationId}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
