import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useChatStore } from "../lib/state/ChatStore";
import { ConversationEngineClient } from "../lib/engine/ConversationEngineClient";
import { ImageEngineClient } from "../lib/engine/ImageEngineClient";
import { VoiceEngineClient } from "../lib/engine/VoiceEngineClient";
import { StoryEngineClient } from "../lib/engine/StoryEngineClient";
import { CharacterEngineClient } from "../lib/engine/CharacterEngineClient";
import clsx from "clsx";

export default function Chat() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const characterId = searchParams.get("characterId") || "";

    const messages = useChatStore((s) => s.messages);
    const conversationId = useChatStore((s) => s.conversationId);
    const sessionId = useChatStore((s) => s.sessionId);
    const isLoading = useChatStore((s) => s.isLoading);
    const isStreaming = useChatStore((s) => s.isStreaming);
    const isGeneratingImage = useChatStore((s) => s.isGeneratingImage);
    const isSpeaking = useChatStore((s) => s.isSpeaking);
    const error = useChatStore((s) => s.error);
    const streamingMessageId = useChatStore((s) => s.streamingMessageId);
    const storyScene = useChatStore((s) => s.storyScene);
    const worldContext = useChatStore((s) => s.worldContext);
    const storeCharacterId = useChatStore((s) => s.characterId);
    const characterName = useChatStore((s) => s.characterName);
    const characterAvatarUri = useChatStore((s) => s.characterAvatarUri);

    const setMessages = useChatStore((s) => s.setMessages);
    const addMessage = useChatStore((s) => s.addMessage);
    const updateMessage = useChatStore((s) => s.updateMessage);
    const removeMessage = useChatStore((s) => s.removeMessage);
    const setConversationId = useChatStore((s) => s.setConversationId);
    const setSessionId = useChatStore((s) => s.setSessionId);
    const setLoading = useChatStore((s) => s.setLoading);
    const setStreaming = useChatStore((s) => s.setStreaming);
    const setStreamingMessageId = useChatStore((s) => s.setStreamingMessageId);
    const setGeneratingImage = useChatStore((s) => s.setGeneratingImage);
    const setSpeaking = useChatStore((s) => s.setSpeaking);
    const setError = useChatStore((s) => s.setError);
    const setStoryScene = useChatStore((s) => s.setStoryScene);
    const setWorldContext = useChatStore((s) => s.setWorldContext);
    const setCharacterContext = useChatStore((s) => s.setCharacterContext);
    const clearChat = useChatStore((s) => s.clearChat);

    const [input, setInput] = useState("");
    const [showActions, setShowActions] = useState<string | null>(null);
    const [imagePrompt, setImagePrompt] = useState("");
    const [showImageInput, setShowImageInput] = useState(false);
    const [showStoryPanel, setShowStoryPanel] = useState(false);
    const [showWorldPanel, setShowWorldPanel] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const streamAbortRef = useRef<boolean>(false);

    useEffect(() => {
        if (!characterId && !storeCharacterId) {
            navigate("/home");
            return;
        }
        const targetCharacterId = characterId || storeCharacterId;
        if (targetCharacterId && targetCharacterId !== storeCharacterId) {
            clearChat();
            setCharacterContext({ characterId: targetCharacterId, name: "", avatarUri: null });
            loadCharacterAndStartConversation(targetCharacterId);
        } else if (targetCharacterId && !conversationId) {
            loadCharacterAndStartConversation(targetCharacterId);
        }
    }, [characterId, storeCharacterId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isStreaming]);

    const loadCharacterAndStartConversation = async (targetCharacterId: string) => {
        setLoading(true);
        setError(null);
        try {
            const [charEngine, convEngine] = await Promise.all([
                CharacterEngineClient.getEngine(),
                ConversationEngineClient.getEngine(),
            ]);

            if (charEngine && targetCharacterId) {
                try {
                    const profile = await charEngine.getCharacterById({ characterId: targetCharacterId, requesterId: targetCharacterId });
                    const identity = (profile as any).identity || {};
                    const appearance = (profile as any).appearance || {};
                    setCharacterContext({
                        characterId: targetCharacterId,
                        name: identity.name || targetCharacterId,
                        avatarUri: appearance.avatarUri || null,
                    });
                } catch {
                    setCharacterContext({ characterId: targetCharacterId, name: targetCharacterId, avatarUri: null });
                }
            }

            const result = await convEngine.startSession({
                conversationId: `conv-${targetCharacterId}-${Date.now()}`,
                ownerId: targetCharacterId,
                participantIds: [targetCharacterId],
                claims: { roles: ["user"], permissions: ["chat"] }
            });
            setConversationId(result.conversationId);
            setSessionId(result.sessionId);

            const history = await convEngine.getMessageHistory({
                conversationId: result.conversationId,
                requesterId: targetCharacterId,
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
                    timestamp: m.timestamp,
                }))
            );

            loadStoryContext(targetCharacterId, result.conversationId);
            loadWorldContext(targetCharacterId);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to start conversation");
        } finally {
            setLoading(false);
        }
    };

    const loadStoryContext = async (charId: string, convId: string) => {
        try {
            const storyEngine = await StoryEngineClient.getEngine();
            if (!storyEngine) return;
            const stories = await storyEngine.listStories({ requesterId: charId, status: "active" });
            if (stories.length > 0) {
                const activeStory = stories[0];
                const progress = await storyEngine.getStoryProgress({ storyId: activeStory.storyId, requesterId: charId });
                const storyData = await storyEngine.getStory({ storyId: activeStory.storyId, requesterId: charId });
                if (storyData) {
                    const currentScene = storyData.scenes.find((s: any) => s.sceneId === progress?.currentSceneId) || storyData.scenes[0];
                    setStoryScene({
                        storyId: activeStory.storyId,
                        currentSceneId: currentScene?.sceneId || null,
                        currentSceneTitle: currentScene?.title || null,
                        currentSceneDescription: currentScene?.description || null,
                        choices: currentScene?.choices || [],
                        quests: storyData.quests.map((q: any) => ({
                            questId: q.questId,
                            title: q.title,
                            description: q.description,
                            status: q.status,
                            progress: q.progress,
                            objectives: q.objectives || [],
                        })),
                        storyProgress: progress ? {
                            currentChapterId: progress.currentChapterId,
                            completedScenes: progress.completedScenes,
                            activeQuests: progress.activeQuests,
                            completedQuests: progress.completedQuests,
                        } : null,
                    });
                }
            }
        } catch {
            // story context unavailable
        }
    };

    const loadWorldContext = async (charId: string) => {
        try {
            const charEngine = await CharacterEngineClient.getEngine();
            if (!charEngine) return;
            const aggregate = await charEngine.getCharacter(charId);
            if (!aggregate) return;
            const state = aggregate.getState();
            setWorldContext({
                currentLocation: state.currentLocation.getValue(),
                participatingCharacters: [],
            });
        } catch {
            // world context unavailable
        }
    };

    const handleSend = async () => {
        if (!input.trim() || !conversationId || !sessionId || !storeCharacterId) return;
        const tempId = `msg-${Date.now()}`;
        const userMessage = {
            id: tempId,
            conversationId,
            sessionId,
            authorId: storeCharacterId,
            role: "user",
            content: input.trim(),
            timestamp: Date.now(),
        };
        addMessage(userMessage);
        setInput("");
        setStreaming(true);
        setStreamingMessageId(tempId);
        setError(null);

        try {
            const engine = await ConversationEngineClient.getEngine();
            await engine.postMessage({
                conversationId,
                sessionId,
                authorId: storeCharacterId,
                content: userMessage.content,
                role: "user",
                claims: { roles: ["user"], permissions: ["chat"] }
            });

            streamAbortRef.current = false;
            await engine.executeTurn({
                conversationId,
                sessionId,
                requesterId: storeCharacterId,
                claims: { roles: ["user"], permissions: ["chat"] }
            });

            if (!streamAbortRef.current) {
                const history = await engine.getMessageHistory({
                    conversationId,
                    requesterId: storeCharacterId,
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
                        timestamp: m.timestamp,
                        images: (m.metadata?.images as any) || undefined,
                    }))
                );
            }
        } catch (err) {
            if (!streamAbortRef.current) {
                setError(err instanceof Error ? err.message : "Failed to send message");
                updateMessage(tempId, { isError: true });
            }
        } finally {
            if (!streamAbortRef.current) {
                setStreaming(false);
                setStreamingMessageId(null);
            }
        }
    };

    const handleRegenerate = async (messageId: string) => {
        if (!conversationId || !sessionId || !storeCharacterId) return;
        updateMessage(messageId, { isRegenerating: true });
        setLoading(true);
        setError(null);
        try {
            const engine = await ConversationEngineClient.getEngine();
            await engine.retryTurn({
                conversationId,
                sessionId,
                requesterId: storeCharacterId,
                claims: { roles: ["user"], permissions: ["chat"] }
            });
            const history = await engine.getMessageHistory({
                conversationId,
                requesterId: storeCharacterId,
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
                    timestamp: m.timestamp,
                    images: (m.metadata?.images as any) || undefined,
                }))
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to regenerate");
        } finally {
            setLoading(false);
            updateMessage(messageId, { isRegenerating: false });
        }
    };

    const handleRetry = async () => {
        if (!conversationId || !sessionId || !storeCharacterId) return;
        setLoading(true);
        setError(null);
        try {
            const engine = await ConversationEngineClient.getEngine();
            await engine.retryTurn({
                conversationId,
                sessionId,
                requesterId: storeCharacterId,
                claims: { roles: ["user"], permissions: ["chat"] }
            });
            const history = await engine.getMessageHistory({
                conversationId,
                requesterId: storeCharacterId,
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
                    timestamp: m.timestamp,
                    images: (m.metadata?.images as any) || undefined,
                }))
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to retry");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async (text: string) => {
        await navigator.clipboard.writeText(text);
    };

    const handleDelete = (messageId: string) => {
        removeMessage(messageId);
        setShowActions(null);
    };

    const handleGenerateImage = async () => {
        if (!imagePrompt.trim() || !storeCharacterId) return;
        setGeneratingImage(true);
        setShowImageInput(false);
        setImagePrompt("");
        try {
            const engine = await ImageEngineClient.getEngine();
            const result = await engine.generateImage({
                sessionId: storeCharacterId,
                ownerId: storeCharacterId,
                prompt: imagePrompt.trim(),
                negativePrompt: "",
                mode: "textToImage",
                aspectRatio: "1:1",
                width: 512,
                height: 512,
                candidateCount: 4,
                claims: { roles: ["user"], permissions: ["generate"] }
            });
            const asset = result.assets.find((a) => a.isPrimary) || result.assets[0];
            if (asset) {
                const imageMessage = {
                    id: `img-${Date.now()}`,
                    conversationId: conversationId || "",
                    sessionId: sessionId || "",
                    authorId: "system",
                    role: "assistant",
                    content: `Generated image: ${result.prompt}`,
                    timestamp: Date.now(),
                    images: [{
                        uri: asset.uri,
                        width: asset.width,
                        height: asset.height,
                        mimeType: asset.mimeType,
                    }],
                };
                addMessage(imageMessage);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate image");
        } finally {
            setGeneratingImage(false);
        }
    };

    const handleSpeak = async (text: string) => {
        if (!storeCharacterId) return;
        setSpeaking(true);
        try {
            const engine = await VoiceEngineClient.getEngine();
            if (!engine) return;
            await engine.synthesizeSpeech({
                voiceId: storeCharacterId,
                text,
                voiceProfileId: storeCharacterId,
                correlationId: `synth-${Date.now()}`,
                causationId: "",
                claims: { roles: ["user"], permissions: ["voice"] }
            });
        } catch (err) {
            console.error("Voice synthesis failed:", err);
        } finally {
            setSpeaking(false);
        }
    };

    const handleChoice = async (choiceId: string, targetSceneId: string) => {
        if (!storeCharacterId || !storyScene.storyId) return;
        try {
            const engine = await StoryEngineClient.getEngine();
            if (!engine) return;
            await engine.selectChoice({
                storyId: storyScene.storyId,
                sceneId: storyScene.currentSceneId || "",
                choiceId,
                branchId: "",
                claims: { roles: ["user"] }
            });
            await loadStoryContext(storeCharacterId, conversationId || "");
        } catch {
            // choice failed
        }
    };

    const handleStopStreaming = () => {
        streamAbortRef.current = true;
        setStreaming(false);
        setStreamingMessageId(null);
        ConversationEngineClient.getEngine().then((engine) => {
            if (engine && conversationId && sessionId) {
                engine.cancelStream({
                    conversationId,
                    sessionId,
                    requesterId: storeCharacterId || "",
                    claims: { roles: ["user"], permissions: ["chat"] }
                }).catch(() => {});
            }
        });
    };

    const isLastMessageUser = messages.length > 0 && messages[messages.length - 1].role === "user";
    const showTypingIndicator = isStreaming || (isLoading && isLastMessageUser);

    return (
        <div className="chat-page">
            <div className="chat-header">
                <div className="chat-header-left">
                    <button className="icon-btn" onClick={() => navigate("/home")} aria-label="Back">
                        ←
                    </button>
                    <div className="chat-character-presence">
                        <div className="chat-avatar">
                            {characterAvatarUri ? (
                                <img src={characterAvatarUri} alt={characterName || "Character"} />
                            ) : (
                                <span className="chat-avatar-placeholder">
                                    {(characterName || "?").charAt(0).toUpperCase()}
                                </span>
                            )}
                            <span className="chat-status-dot" />
                        </div>
                        <div className="chat-character-info">
                            <h2 className="chat-character-name">{characterName || "Chat"}</h2>
                            <span className="chat-character-status">
                                {isStreaming ? "Typing..." : isSpeaking ? "Speaking..." : "Online"}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="chat-header-actions">
                    <button
                        className={clsx("icon-btn", { active: showStoryPanel })}
                        onClick={() => { setShowStoryPanel(!showStoryPanel); setShowWorldPanel(false); }}
                        aria-label="Story"
                        title="Story"
                    >
                        📖
                    </button>
                    <button
                        className={clsx("icon-btn", { active: showWorldPanel })}
                        onClick={() => { setShowWorldPanel(!showWorldPanel); setShowStoryPanel(false); }}
                        aria-label="World"
                        title="World"
                    >
                        🌍
                    </button>
                    <button className="icon-btn" onClick={() => navigate("/gallery")} aria-label="Gallery" title="Gallery">
                        🖼️
                    </button>
                </div>
            </div>

            <div className="chat-body">
                {(showStoryPanel || showWorldPanel) && (
                    <div className="chat-side-panel">
                        {showStoryPanel && (
                            <div className="story-panel">
                                <h3 className="panel-title">Story</h3>
                                {storyScene.currentSceneTitle && (
                                    <div className="story-scene">
                                        <h4 className="scene-title">{storyScene.currentSceneTitle}</h4>
                                        {storyScene.currentSceneDescription && (
                                            <p className="scene-description">{storyScene.currentSceneDescription}</p>
                                        )}
                                    </div>
                                )}
                                {storyScene.quests.length > 0 && (
                                    <div className="quests-list">
                                        <h4 className="panel-subtitle">Quests</h4>
                                        {storyScene.quests.map((q) => (
                                            <div key={q.questId} className="quest-item">
                                                <div className="quest-header">
                                                    <span className="quest-title">{q.title}</span>
                                                    <span className={clsx("quest-status", q.status)}>{q.status}</span>
                                                </div>
                                                <p className="quest-description">{q.description}</p>
                                                <div className="quest-progress-bar">
                                                    <div className="quest-progress-fill" style={{ width: `${q.progress}%` }} />
                                                </div>
                                                {q.objectives.length > 0 && (
                                                    <div className="objectives-list">
                                                        {q.objectives.map((o) => (
                                                            <div key={o.objectiveId} className="objective-item">
                                                                <span className={clsx("objective-status", o.status)}>●</span>
                                                                <span className="objective-text">{o.description}</span>
                                                                <span className="objective-progress">{o.progress}%</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {storyScene.storyProgress && (
                                    <div className="story-progress">
                                        <h4 className="panel-subtitle">Progress</h4>
                                        <div className="progress-meta">
                                            <span>Chapter: {storyScene.storyProgress.currentChapterId || "—"}</span>
                                            <span>Scenes: {storyScene.storyProgress.completedScenes.length}</span>
                                        </div>
                                    </div>
                                )}
                                {storyScene.choices.length > 0 && (
                                    <div className="choices-list">
                                        <h4 className="panel-subtitle">Choices</h4>
                                        {storyScene.choices.map((c) => (
                                            <button
                                                key={c.choiceId}
                                                className="choice-btn"
                                                onClick={() => handleChoice(c.choiceId, c.targetSceneId)}
                                            >
                                                {c.text}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {storyScene.choices.length === 0 && storyScene.quests.length === 0 && !storyScene.currentSceneTitle && (
                                    <p className="panel-empty">No active story. Start one to see scenes and choices here.</p>
                                )}
                            </div>
                        )}
                        {showWorldPanel && (
                            <div className="world-panel">
                                <h3 className="panel-title">World</h3>
                                {worldContext.currentLocation && (
                                    <div className="world-item">
                                        <span className="world-label">Location</span>
                                        <span className="world-value">{worldContext.currentLocation}</span>
                                    </div>
                                )}
                                {worldContext.timeOfDay && (
                                    <div className="world-item">
                                        <span className="world-label">Time</span>
                                        <span className="world-value">{worldContext.timeOfDay}</span>
                                    </div>
                                )}
                                {worldContext.weather && (
                                    <div className="world-item">
                                        <span className="world-label">Weather</span>
                                        <span className="world-value">{worldContext.weather}</span>
                                    </div>
                                )}
                                {worldContext.environment && (
                                    <div className="world-item">
                                        <span className="world-label">Environment</span>
                                        <span className="world-value">{worldContext.environment}</span>
                                    </div>
                                )}
                                {worldContext.participatingCharacters.length > 0 && (
                                    <div className="participants-list">
                                        <h4 className="panel-subtitle">Present</h4>
                                        {worldContext.participatingCharacters.map((c) => (
                                            <div key={c.characterId} className="participant-item">
                                                <div className="participant-avatar">
                                                    {c.avatarUri ? (
                                                        <img src={c.avatarUri} alt={c.name} />
                                                    ) : (
                                                        <span>{c.name.charAt(0).toUpperCase()}</span>
                                                    )}
                                                </div>
                                                <div className="participant-info">
                                                    <span className="participant-name">{c.name}</span>
                                                    <span className="participant-status">{c.status}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {!worldContext.currentLocation && worldContext.participatingCharacters.length === 0 && (
                                    <p className="panel-empty">World context will appear here as the story unfolds.</p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                <div className="chat-messages" ref={chatContainerRef}>
                    {messages.length === 0 && !isLoading && !isStreaming && (
                        <div className="chat-empty">
                            <div className="chat-empty-icon">💬</div>
                            <p>Start a conversation with {characterName || "your character"}.</p>
                        </div>
                    )}
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={clsx("chat-message", msg.role, {
                                streaming: msg.id === streamingMessageId,
                                error: msg.isError,
                                regenerating: msg.isRegenerating,
                            })}
                        >
                            <div className="message-content">
                                {msg.role === "assistant" && (
                                    <div className="message-avatar">
                                        {characterAvatarUri ? (
                                            <img src={characterAvatarUri} alt={characterName || ""} />
                                        ) : (
                                            <span>{(characterName || "?").charAt(0).toUpperCase()}</span>
                                        )}
                                    </div>
                                )}
                                <div className="message-bubble">
                                    <p className="message-text">{msg.content}</p>
                                    {msg.images && msg.images.length > 0 && (
                                        <div className="message-images">
                                            {msg.images.map((img, idx) => (
                                                <img
                                                    key={idx}
                                                    src={img.uri}
                                                    alt=""
                                                    className="message-image"
                                                    onClick={() => window.open(img.uri, "_blank")}
                                                />
                                            ))}
                                        </div>
                                    )}
                                    <div className="message-meta">
                                        <span className="message-time">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </span>
                                    </div>
                                </div>
                                {msg.role === "user" && (
                                    <div className="message-avatar user">
                                        <span>U</span>
                                    </div>
                                )}
                            </div>
                            <div className={clsx("message-actions", { visible: showActions === msg.id })}>
                                <button className="action-btn" onClick={() => handleCopy(msg.content)} title="Copy">📋</button>
                                {msg.role === "assistant" && (
                                    <>
                                        <button className="action-btn" onClick={() => handleSpeak(msg.content)} disabled={isSpeaking} title="Speak">🔊</button>
                                        <button className="action-btn" onClick={() => handleRegenerate(msg.id)} disabled={msg.isRegenerating} title="Regenerate">🔄</button>
                                    </>
                                )}
                                <button className="action-btn" onClick={() => handleDelete(msg.id)} title="Delete">🗑️</button>
                            </div>
                            <button
                                className="message-actions-toggle"
                                onClick={() => setShowActions(showActions === msg.id ? null : msg.id)}
                            >
                                ⋮
                            </button>
                        </div>
                    ))}
                    {showTypingIndicator && (
                        <div className="chat-message assistant">
                            <div className="message-content">
                                <div className="message-avatar">
                                    {characterAvatarUri ? (
                                        <img src={characterAvatarUri} alt={characterName || ""} />
                                    ) : (
                                        <span>{(characterName || "?").charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <div className="message-bubble">
                                    <div className="typing-indicator">
                                        <span /><span /><span />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {isStreaming && (
                        <div className="chat-message assistant streaming-edge">
                            <div className="message-content">
                                <div className="message-avatar">
                                    {characterAvatarUri ? (
                                        <img src={characterAvatarUri} alt={characterName || ""} />
                                    ) : (
                                        <span>{(characterName || "?").charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <div className="message-bubble streaming-bubble">
                                    <div className="typing-indicator">
                                        <span /><span /><span />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {error && (
                    <div className="chat-error-bar">
                        <span>{error}</span>
                        <button className="error-retry" onClick={handleRetry}>Retry</button>
                        <button className="error-dismiss" onClick={() => setError(null)}>×</button>
                    </div>
                )}

                {showImageInput && (
                    <div className="chat-image-input">
                        <input
                            type="text"
                            value={imagePrompt}
                            onChange={(e) => setImagePrompt(e.target.value)}
                            placeholder="Describe the image to generate..."
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleGenerateImage();
                                if (e.key === "Escape") { setShowImageInput(false); setImagePrompt(""); }
                            }}
                        />
                        <button className="primary" onClick={handleGenerateImage} disabled={isGeneratingImage || !imagePrompt.trim()}>
                            {isGeneratingImage ? "..." : "Generate"}
                        </button>
                        <button className="secondary" onClick={() => { setShowImageInput(false); setImagePrompt(""); }}>
                            Cancel
                        </button>
                    </div>
                )}

                <div className="chat-input-area">
                    <div className="chat-input-bar">
                        <button
                            className={clsx("input-action", { active: showImageInput })}
                            onClick={() => setShowImageInput(!showImageInput)}
                            title="Generate image"
                            disabled={isGeneratingImage}
                        >
                            🎨
                        </button>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={isStreaming ? "Waiting for response..." : "Type a message..."}
                            disabled={isLoading || isStreaming || !conversationId}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                        />
                        {isStreaming ? (
                            <button className="stop-btn" onClick={handleStopStreaming} title="Stop">
                                ⏹️
                            </button>
                        ) : (
                            <button
                                className="send-btn"
                                onClick={handleSend}
                                disabled={isLoading || !input.trim() || !conversationId}
                            >
                                ➤
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
