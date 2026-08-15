import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppStore } from "../lib/state/CharacterStore";
import { ImageEngineClient } from "../lib/engine/ImageEngineClient";
import { VoiceEngineClient } from "../lib/engine/VoiceEngineClient";
import { RelationshipEngineClient } from "../lib/engine/RelationshipEngineClient";
import { EmotionEngineClient } from "../lib/engine/EmotionEngineClient";
import { MemoryEngineClient } from "../lib/engine/MemoryEngineClient";
import clsx from "clsx";

export default function CharacterDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const characters = useAppStore((s) => s.characters);
    const images = useAppStore((s) => s.images);
    const addImage = useAppStore((s) => s.addImage);
    const updateCharacter = useAppStore((s) => s.updateCharacter);
    const toggleFavoriteCharacter = useAppStore((s) => s.toggleFavoriteCharacter);
    const addRecentCharacter = useAppStore((s) => s.addRecentCharacter);
    const isFavoriteCharacter = useAppStore((s) => s.isFavoriteCharacter);
    const setCurrentCharacterId = useAppStore((s) => s.setCurrentCharacterId);

    const [generating, setGenerating] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [speaking, setSpeaking] = useState(false);
    const [relationshipData, setRelationshipData] = useState<any>(null);
    const [emotionData, setEmotionData] = useState<any>(null);
    const [memoryData, setMemoryData] = useState<any>(null);
    const [voiceAvailable, setVoiceAvailable] = useState(false);
    const [loadingOptional, setLoadingOptional] = useState(true);

    const character = characters.find((c) => c.id === id);
    const characterImages = images.filter((img) => img.characterId === id);
    const isFavorite = character ? isFavoriteCharacter(character.id) : false;

    useEffect(() => {
        if (id) {
            addRecentCharacter(id);
            setCurrentCharacterId(id);
        }
    }, [id, addRecentCharacter, setCurrentCharacterId]);

    useEffect(() => {
        let mounted = true;
        setLoadingOptional(true);

        async function loadOptionalData() {
            try {
                const [voiceEngine, relationshipEngine, emotionEngine, memoryEngine] = await Promise.all([
                    VoiceEngineClient.getEngine(),
                    RelationshipEngineClient.getEngine(),
                    EmotionEngineClient.getEngine(),
                    MemoryEngineClient.getEngine(),
                ]);

                if (!mounted) return;

                setVoiceAvailable(!!voiceEngine);

                if (relationshipEngine && character) {
                    try {
                        const graph = await relationshipEngine.getSocialGraph(character.id);
                        const characterRelationships = graph.relationships.filter(
                            (r: any) => r.targetId === character.id || r.sourceId === character.id
                        );
                        if (characterRelationships.length > 0) {
                            setRelationshipData(characterRelationships[0]);
                        }
                    } catch {
                        // no relationship data
                    }
                }

                if (emotionEngine && character) {
                    try {
                        const state = await emotionEngine.getEmotionalState(character.id);
                        setEmotionData(state);
                    } catch {
                        // no emotion data
                    }
                }

                if (memoryEngine && character) {
                    try {
                        const memories = await memoryEngine.getMemoriesForCharacter({
                            ownerId: character.id,
                            requesterId: character.id,
                            limit: 10,
                            minSalience: 0,
                        });
                        if (memories.length > 0) {
                            setMemoryData(memories);
                        }
                    } catch {
                        // no memory data
                    }
                }
            } catch {
                // optional engines unavailable
            } finally {
                if (mounted) {
                    setLoadingOptional(false);
                }
            }
        }

        if (character) {
            loadOptionalData();
        }

        return () => {
            mounted = false;
        };
    }, [character?.id]);

    const handleGenerate = async () => {
        if (!character || !prompt.trim()) return;
        setGenerating(true);
        try {
            const engine = await ImageEngineClient.getEngine();
            const result = await engine.generateImage({
                sessionId: character.id,
                ownerId: character.id,
                prompt: prompt.trim(),
                negativePrompt: "",
                mode: "textToImage",
                aspectRatio: "1:1",
                width: 512,
                height: 512,
                candidateCount: 4,
                claims: { roles: ["user"], permissions: ["generate"] }
            });

            const imageRecord = {
                id: result.imageId,
                characterId: character.id,
                prompt: result.prompt,
                candidates: result.candidates.map((c: any) => ({
                    id: c.candidateId || c.assetId,
                    uri: c.uri,
                    score: c.score || 0,
                    width: c.width,
                    height: c.height
                })),
                selectedCandidateId: result.selectedCandidateId,
                status: result.status,
                createdAt: Date.now()
            };
            addImage(imageRecord);
            setPrompt("");
        } catch (err) {
            console.error("Generation failed:", err);
        } finally {
            setGenerating(false);
        }
    };

    const handleSetPrimaryAvatar = async (imageId: string) => {
        if (!character) return;
        const imageRecord = characterImages.find((img) => img.id === imageId);
        const selectedCandidate = imageRecord?.candidates.find((c) => c.id === imageRecord.selectedCandidateId);
        const avatarUri = selectedCandidate?.uri || imageRecord?.candidates[0]?.uri || "";
        updateCharacter(character.id, { avatarImageId: avatarUri });
    };

    const handleVoiceAction = async () => {
        if (!character || !voiceAvailable) return;
        setSpeaking(true);
        try {
            const engine = await VoiceEngineClient.getEngine();
            if (!engine) return;
            await engine.synthesizeSpeech({
                voiceId: character.id,
                text: character.personality.description || `Hello, I am ${character.name}.`,
                voiceProfileId: character.id,
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

    if (!character) {
        return (
            <div className="profile-page">
                <div className="profile-content">
                    <p>Character not found.</p>
                    <button className="primary" onClick={() => navigate("/home")}>
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    const primaryImage = characterImages.find((img) => img.selectedCandidateId) || characterImages[0];
    const primaryImageUri = primaryImage?.candidates.find((c) => c.id === primaryImage.selectedCandidateId)?.uri || primaryImage?.candidates[0]?.uri || character.avatarImageId;

    return (
        <div className="profile-page">
            <div className="profile-hero">
                <div className="profile-hero-bg">
                    {primaryImageUri ? (
                        <img src={primaryImageUri} alt={character.name} />
                    ) : (
                        <div className="profile-hero-placeholder">
                            <span>{character.name.charAt(0).toUpperCase()}</span>
                        </div>
                    )}
                    <div className="profile-hero-gradient" />
                </div>
                <div className="profile-hero-actions">
                    <button className="secondary" onClick={() => navigate("/home")}>
                        ← Back
                    </button>
                    <div className="profile-hero-buttons">
                        <button
                            className={clsx("icon-btn", { active: isFavorite })}
                            onClick={() => toggleFavoriteCharacter(character.id)}
                            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                        >
                            {isFavorite ? "♥" : "♡"}
                        </button>
                        {voiceAvailable && (
                            <button
                                className="icon-btn"
                                onClick={handleVoiceAction}
                                disabled={speaking}
                                aria-label="Play voice"
                            >
                                {speaking ? "🔊..." : "🔊"}
                            </button>
                        )}
                        <button className="secondary" onClick={() => navigate("/gallery")}>
                            Gallery
                        </button>
                        <button className="primary" onClick={() => navigate("/characters/create")}>
                            + New
                        </button>
                        <button className="primary" onClick={() => navigate(`/chat?characterId=${character.id}`)}>
                            Start Chat
                        </button>
                    </div>
                </div>
            </div>

            <div className="profile-content">
                <div className="profile-header">
                    <div className="profile-avatar-section">
                        <div className="profile-avatar-large">
                            {character.avatarImageId ? (
                                <img src={character.avatarImageId} alt={character.name} />
                            ) : (
                                <div className="avatar-placeholder-large">
                                    <span>{character.name.charAt(0).toUpperCase()}</span>
                                </div>
                            )}
                        </div>
                        <div className="profile-primary-info">
                            <h1 className="profile-name">{character.name}</h1>
                            {character.title && <p className="profile-title">{character.title}</p>}
                            <p className="profile-description">{character.description}</p>
                            <div className="profile-meta">
                                {character.age && <span className="meta-chip">Age: {character.age}</span>}
                                {character.gender && <span className="meta-chip">Gender: {character.gender}</span>}
                                {character.role && <span className="meta-chip">Role: {character.role}</span>}
                                {character.origin && <span className="meta-chip">Origin: {character.origin}</span>}
                                {character.language && <span className="meta-chip">Language: {character.language}</span>}
                            </div>
                            <div className="profile-tags">
                                {character.tags.map((tag) => (
                                    <span key={tag} className="tag">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="profile-sections">
                    {character.personality.traits.length > 0 && (
                        <div className="profile-section">
                            <h3 className="section-label">Personality</h3>
                            <div className="trait-list">
                                {character.personality.traits.map((t) => (
                                    <span key={t.name} className="trait-chip">{t.name}</span>
                                ))}
                            </div>
                            {character.personality.description && (
                                <p className="section-text">{character.personality.description}</p>
                            )}
                            {character.personality.speakingStyle && (
                                <p className="section-text"><strong>Speaking Style:</strong> {character.personality.speakingStyle}</p>
                            )}
                        </div>
                    )}

                    {character.personality.interests.length > 0 && (
                        <div className="profile-section">
                            <h3 className="section-label">Interests</h3>
                            <div className="trait-list">
                                {character.personality.interests.map((interest) => (
                                    <span key={interest} className="tag">{interest}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {relationshipData && !loadingOptional && (
                        <div className="profile-section">
                            <h3 className="section-label">Relationship</h3>
                            <div className="relationship-grid">
                                <div className="metric">
                                    <span className="metric-label">Trust</span>
                                    <div className="metric-bar">
                                        <div className="metric-fill" style={{ width: `${Math.round(relationshipData.metrics?.trust * 100 || 0)}%` }} />
                                    </div>
                                </div>
                                <div className="metric">
                                    <span className="metric-label">Affinity</span>
                                    <div className="metric-bar">
                                        <div className="metric-fill" style={{ width: `${Math.round(relationshipData.metrics?.affinity * 100 || 0)}%` }} />
                                    </div>
                                </div>
                                <div className="metric">
                                    <span className="metric-label">Respect</span>
                                    <div className="metric-bar">
                                        <div className="metric-fill" style={{ width: `${Math.round(relationshipData.metrics?.respect * 100 || 0)}%` }} />
                                    </div>
                                </div>
                                <div className="metric">
                                    <span className="metric-label">Loyalty</span>
                                    <div className="metric-bar">
                                        <div className="metric-fill" style={{ width: `${Math.round(relationshipData.metrics?.loyalty * 100 || 0)}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {emotionData && !loadingOptional && (
                        <div className="profile-section">
                            <h3 className="section-label">Mood</h3>
                            <div className="mood-display">
                                <span className="mood-emoji">
                                    {emotionData.pleasure && emotionData.arousal
                                        ? emotionData.pleasure > 0.5 ? "😊" : emotionData.arousal > 0.5 ? "😤" : "😔"
                                        : "😐"}
                                </span>
                                <span className="mood-text">
                                    {emotionData.pleasure !== undefined ? `Pleasure: ${(emotionData.pleasure * 100).toFixed(0)}%` : ""}
                                    {emotionData.arousal !== undefined ? ` · Arousal: ${(emotionData.arousal * 100).toFixed(0)}%` : ""}
                                </span>
                            </div>
                        </div>
                    )}

                    {memoryData && !loadingOptional && memoryData.length > 0 && (
                        <div className="profile-section">
                            <h3 className="section-label">Memories</h3>
                            <div className="memory-list">
                                {memoryData.slice(0, 5).map((mem: any) => (
                                    <div key={mem.memoryId} className="memory-item">
                                        <p className="memory-content">{mem.content}</p>
                                        <span className="memory-type">{mem.memoryType}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="profile-section">
                    <h3 className="section-label">Gallery</h3>
                    {characterImages.length === 0 ? (
                        <p className="section-text">No images generated yet.</p>
                    ) : (
                        <div className="gallery-grid">
                            {characterImages.map((img) => (
                                <div key={img.id} className="gallery-card">
                                    <img
                                        src={img.candidates.find((c) => c.id === img.selectedCandidateId)?.uri || img.candidates[0]?.uri}
                                        alt={img.prompt}
                                    />
                                    <div className="gallery-card-actions">
                                        {img.selectedCandidateId && (
                                            <button
                                                className="primary small"
                                                onClick={() => handleSetPrimaryAvatar(img.id)}
                                            >
                                                Set Avatar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="profile-section">
                    <h3 className="section-label">Generate Image</h3>
                    <div className="generation-form">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe the image you want to generate..."
                            disabled={generating}
                        />
                        <button
                            className="primary"
                            onClick={handleGenerate}
                            disabled={generating || !prompt.trim()}
                        >
                            {generating ? "Generating..." : "Generate"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
