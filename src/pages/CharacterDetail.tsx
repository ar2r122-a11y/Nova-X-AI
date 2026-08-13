import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppStore } from "../lib/state/CharacterStore";
import { ImageEngineClient } from "../lib/engine/ImageEngineClient";

export default function CharacterDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const characters = useAppStore((s) => s.characters);
    const images = useAppStore((s) => s.images);
    const addImage = useAppStore((s) => s.addImage);
    const updateImage = useAppStore((s) => s.updateImage);
    const updateCharacter = useAppStore((s) => s.updateCharacter);
    const setCurrentCharacterId = useAppStore((s) => s.setCurrentCharacterId);
    const [generating, setGenerating] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [editing, setEditing] = useState(false);

    const character = characters.find((c) => c.id === id);
    const characterImages = images.filter((img) => img.characterId === id);

    useEffect(() => {
        if (id) setCurrentCharacterId(id);
    }, [id, setCurrentCharacterId]);

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

    const handleSelectCandidate = async (imageId: string, candidateId: string) => {
        try {
            const engine = await ImageEngineClient.getEngine();
            await engine.selectCandidate({
                imageId,
                candidateId,
                requesterId: character!.id,
                claims: { roles: ["user"], permissions: ["generate"] }
            });
            updateImage(imageId, { selectedCandidateId: candidateId });
        } catch (err) {
            console.error("Selection failed:", err);
        }
    };

    const handleSetPrimaryAvatar = async (imageId: string) => {
        if (!character) return;
        const imageRecord = characterImages.find((img) => img.id === imageId);
        const selectedCandidate = imageRecord?.candidates.find((c) => c.id === imageRecord.selectedCandidateId);
        const avatarUri = selectedCandidate?.uri || imageRecord?.candidates[0]?.uri || "";
        updateCharacter(character.id, { avatarImageId: avatarUri });
    };

    if (!character) {
        return (
            <div className="page">
                <div className="content">
                    <p>Character not found.</p>
                    <button className="primary" onClick={() => navigate("/home")}>
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <nav className="navbar">
                <button className="secondary" onClick={() => navigate("/home")}>
                    ← Back
                </button>
                <h1>{character.name}</h1>
                <div className="nav-buttons">
                    <button className="secondary" onClick={() => setEditing(!editing)}>
                        {editing ? "Done Editing" : "Edit"}
                    </button>
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
            </nav>

            <div className="content">
                <div className="character-profile">
                    <div className="profile-avatar">
                        {character.avatarImageId ? (
                            <img src={character.avatarImageId} alt={character.name} />
                        ) : (
                            <div className="avatar-placeholder-large">?</div>
                        )}
                    </div>
                    <div className="profile-info">
                        <h2>{character.name}</h2>
                        {character.title && <p className="profile-title">{character.title}</p>}
                        {character.description && <p className="profile-bio">{character.description}</p>}
                        <div className="profile-meta">
                            {character.age && <span>Age: {character.age}</span>}
                            {character.gender && <span>Gender: {character.gender}</span>}
                            {character.role && <span>Role: {character.role}</span>}
                            {character.language && <span>Language: {character.language}</span>}
                        </div>
                        {character.tags.length > 0 && (
                            <div className="profile-tags">
                                {character.tags.map((tag) => (
                                    <span key={tag} className="tag">{tag}</span>
                                ))}
                            </div>
                        )}
                        {character.personality.traits.length > 0 && (
                            <div className="profile-traits">
                                <h4>Personality</h4>
                                <div className="trait-list">
                                    {character.personality.traits.map((t) => (
                                        <span key={t.name} className="trait-chip">{t.name}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {character.appearance.clothing && (
                            <div className="profile-appearance">
                                <h4>Appearance</h4>
                                <p>{character.appearance.bodyType} {character.appearance.bodySize} build, {character.appearance.height} tall</p>
                                <p>{character.appearance.hairLength} {character.appearance.hairStyle} {character.appearance.hairColor} hair, {character.appearance.eyeColor} eyes</p>
                                <p>Wearing {character.appearance.clothing.toLowerCase()}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="image-generation">
                    <h3>Generate Images</h3>
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

                {characterImages.length > 0 && (
                    <div className="candidate-grid">
                        <h3>Generated Images</h3>
                        <div className="grid">
                            {characterImages.map((img) => (
                                <div key={img.id} className="image-card">
                                    <div className="image-preview">
                                        {img.candidates.map((candidate) => (
                                            <div
                                                key={candidate.id}
                                                className={`candidate ${img.selectedCandidateId === candidate.id ? "selected" : ""}`}
                                            >
                                                 <img src={candidate.uri} alt="Candidate" />
                                                <span className="score">Score: {candidate.score.toFixed(2)}</span>
                                                {img.status === "Completed" && (
                                                    <button
                                                        className="select-btn"
                                                        onClick={() => handleSelectCandidate(img.id, candidate.id)}
                                                    >
                                                        {img.selectedCandidateId === candidate.id ? "Selected" : "Select"}
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="image-actions">
                                        {img.selectedCandidateId && (
                                            <button
                                                className="primary"
                                                onClick={() => handleSetPrimaryAvatar(img.id)}
                                            >
                                                Set as Avatar
                                            </button>
                                        )}
                                        <button className="secondary" onClick={() => navigate(`/gallery?image=${img.id}`)}>
                                            View
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
