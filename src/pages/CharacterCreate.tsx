import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore, Character } from "../lib/state/CharacterStore";
import { CharacterEngineClient } from "../lib/engine/CharacterEngineClient";
import { ImageEngineClient } from "../lib/engine/ImageEngineClient";
import { ImagePromptOrchestrator } from "@nova-x-ai/image/Domain/Services/ImageEngineServices";

type Step = 1 | 2 | 3 | 4 | 5;

const SKIN_TONES = [
    { value: "fair", label: "Fair", color: "#fde8d0" },
    { value: "light", label: "Light", color: "#f5d0b5" },
    { value: "medium", label: "Medium", color: "#d4a574" },
    { value: "olive", label: "Olive", color: "#c68642" },
    { value: "tan", label: "Tan", color: "#b5651d" },
    { value: "brown", label: "Brown", color: "#8d5524" },
    { value: "dark", label: "Dark", color: "#5c3317" },
    { value: "ebony", label: "Ebony", color: "#3b271e" }
];

const BODY_TYPES = ["Slim", "Athletic", "Average", "Curvy", "Muscular", "Petite", "Tall", "Stocky"];
const HAIR_STYLES = ["Straight", "Wavy", "Curly", "Coily", "Pixie", "Bob", "Long", "Ponytail", "Braided", "Bun", "Messy", "Slicked Back"];
const HAIR_LENGTHS = ["Buzz Cut", "Short", "Medium", "Long", "Very Long"];
const CLOTHING_STYLES = ["Casual", "Formal", "Sporty", "Gothic", "Cyberpunk", "Fantasy", "Sci-Fi", "Streetwear", "Business", "Bohemian", "Minimalist", "Vintage"];

const EYE_COLORS = [
    { value: "brown", label: "Brown", color: "#5c3317" },
    { value: "blue", label: "Blue", color: "#4a90e2" },
    { value: "green", label: "Green", color: "#2ecc71" },
    { value: "hazel", label: "Hazel", color: "#b5651d" },
    { value: "gray", label: "Gray", color: "#9e9e9e" },
    { value: "amber", label: "Amber", color: "#ffbf00" },
    { value: "violet", label: "Violet", color: "#8a2be2" },
    { value: "red", label: "Red", color: "#dc143c" }
];

const TRAIT_OPTIONS = [
    "Adventurous", "Ambitious", "Assertive", "Calm", "Cheerful", "Clever",
    "Confident", "Creative", "Curious", "Determined", "Diplomatic", "Empathetic",
    "Energetic", "Enthusiastic", "Gentle", "Hardworking", "Honest", "Humorous",
    "Imaginative", "Independent", "Intellectual", "Intuitive", "Loyal", "Optimistic",
    "Passionate", "Patient", "Protective", "Romantic", "Sarcastic", "Sensual",
    "Shy", "Spontaneous", "Stealthy", "Strong-willed", "Witty", "Mysterious"
];

const MORAL_ALIGNMENTS = ["Lawful Good", "Neutral Good", "Chaotic Good", "Lawful Neutral", "True Neutral", "Chaotic Neutral", "Lawful Evil", "Neutral Evil", "Chaotic Evil"];

export default function CharacterCreate() {
    const navigate = useNavigate();
    const addCharacter = useAppStore((s) => s.addCharacter);
    const [step, setStep] = useState<Step>(1);
    const [saving, setSaving] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [generatedCandidates, setGeneratedCandidates] = useState<Array<{ id: string; uri: string; score: number; width: number; height: number }>>([]);
    const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
    const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [identity, setIdentity] = useState({
        name: "", title: "", age: "", gender: "", role: "", origin: "", language: "", dialect: "", description: "", tags: "" as string
    });
    const [appearance, setAppearance] = useState({
        visualDescription: "",
        skinTone: "", faceCharacteristics: "", bodyType: "", bodySize: "", height: "",
        hairStyle: "", hairLength: "", hairColor: "", eyeCharacteristics: "", eyeColor: "",
        clothing: "", accessories: "" as string
    });
    const [personality, setPersonality] = useState({
        description: "", speakingStyle: "", tone: "neutral",
        traits: [] as Array<{ name: string; score: number }>,
        interests: "", likes: "", dislikes: "", background: "", relationshipStyle: "",
        goals: "", moralAlignment: "True Neutral", quirks: "", fears: "", desires: "",
        customInstructions: ""
    });

    const canNext = useMemo(() => {
        if (step === 1) return identity.name.trim().length > 0;
        if (step === 2) return appearance.hairColor.trim().length > 0 || appearance.bodyType.trim().length > 0;
        if (step === 3) return personality.traits.length > 0;
        return true;
    }, [step, identity, appearance, personality]);

    const toggleTrait = (name: string) => {
        setPersonality((p) => {
            const exists = p.traits.find((t) => t.name === name);
            if (exists) {
                return { ...p, traits: p.traits.filter((t) => t.name !== name) };
            }
            return { ...p, traits: [...p.traits, { name, score: 0.5 }] };
        });
    };

    const updateTraitScore = (name: string, score: number) => {
        setPersonality((p) => ({
            ...p,
            traits: p.traits.map((t) => (t.name === name ? { ...t, score } : t))
        }));
    };

    const handleNext = () => {
        if (step < 5) setStep((s) => (s + 1) as Step);
    };

    const handleBack = () => {
        if (step > 1) setStep((s) => (s - 1) as Step);
    };

    const buildPrompt = () => {
        const parts: string[] = [];
        if (appearance.visualDescription) parts.push(appearance.visualDescription);
        parts.push(`${appearance.skinTone} skin`);
        if (appearance.faceCharacteristics) parts.push(appearance.faceCharacteristics);
        parts.push(`${appearance.bodyType} body, ${appearance.bodySize} build, ${appearance.height} tall`);
        parts.push(`${appearance.hairLength} ${appearance.hairStyle} ${appearance.hairColor} hair`);
        if (appearance.eyeCharacteristics) parts.push(appearance.eyeCharacteristics);
        parts.push(`${appearance.eyeColor} eyes`);
        parts.push(`wearing ${appearance.clothing}`);
        if (appearance.accessories) parts.push(`with ${appearance.accessories}`);
        if (personality.tone) parts.push(`${personality.tone} expression`);
        return parts.join(", ");
    };

    const handleGenerateImages = async () => {
        setGenerating(true);
        setError(null);
        try {
            const engine = await ImageEngineClient.getEngine();
            const prompt = buildPrompt();
            const orchestrator = new ImagePromptOrchestrator();
            const compiled = orchestrator.compilePrompt(prompt);

            const result = await engine.generateImage({
                sessionId: `char-${Date.now()}`,
                ownerId: "temp",
                prompt: compiled.getCompiledPrompt(),
                negativePrompt: "",
                mode: "textToImage",
                aspectRatio: "1:1",
                width: 512,
                height: 512,
                candidateCount: 4,
                claims: { roles: ["user"], permissions: ["generate"] },
                visualTags: [
                    appearance.skinTone, appearance.hairStyle, appearance.hairColor,
                    appearance.eyeColor, appearance.bodyType, appearance.clothing
                ].filter(Boolean)
            });

            setGeneratedCandidates(result.candidates.map((c: any) => ({
                id: c.candidateId,
                uri: c.uri,
                score: c.score || 0,
                width: c.width,
                height: c.height
            })));
            setSelectedCandidateId(result.selectedCandidateId || result.candidates[0]?.candidateId || null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Image generation failed");
        } finally {
            setGenerating(false);
        }
    };

    const handleSaveCharacter = async () => {
        setSaving(true);
        setError(null);
        try {
            const charEngine = await CharacterEngineClient.getEngine();
            const tagsList = identity.tags.split(",").map((t) => t.trim()).filter(Boolean);
            const accessoriesList = appearance.accessories.split(",").map((t) => t.trim()).filter(Boolean);
            const interestsList = personality.interests.split(",").map((t) => t.trim()).filter(Boolean);
            const likesList = personality.likes.split(",").map((t) => t.trim()).filter(Boolean);
            const dislikesList = personality.dislikes.split(",").map((t) => t.trim()).filter(Boolean);
            const goalsList = personality.goals.split(",").map((t) => t.trim()).filter(Boolean);
            const quirksList = personality.quirks.split(",").map((t) => t.trim()).filter(Boolean);
            const fearsList = personality.fears.split(",").map((t) => t.trim()).filter(Boolean);
            const desiresList = personality.desires.split(",").map((t) => t.trim()).filter(Boolean);

            await charEngine.createCharacter({
                name: identity.name.trim(),
                title: identity.title.trim() || identity.name.trim(),
                biography: identity.description.trim(),
                tagline: "",
                occupation: identity.role.trim(),
                age: identity.age.trim(),
                origin: identity.origin.trim(),
                gender: identity.gender.trim(),
                role: identity.role.trim(),
                language: identity.language.trim(),
                dialectNotes: identity.dialect.split(",").map((t) => t.trim()).filter(Boolean),
                tags: tagsList,
                visualDescription: appearance.visualDescription.trim() || buildPrompt(),
                clothingStyle: appearance.clothing.toLowerCase().trim() || "casual",
                distinguishingMarks: appearance.faceCharacteristics.trim(),
                skinTone: appearance.skinTone,
                faceCharacteristics: appearance.faceCharacteristics,
                bodyType: appearance.bodyType,
                bodySize: appearance.bodySize,
                height: appearance.height,
                hairStyle: appearance.hairStyle,
                hairLength: appearance.hairLength,
                hairColor: appearance.hairColor,
                eyeCharacteristics: appearance.eyeCharacteristics,
                eyeColor: appearance.eyeColor,
                accessories: accessoriesList,
                personalityDescription: personality.description.trim(),
                speakingStyle: personality.speakingStyle.trim(),
                tone: personality.tone,
                interests: interestsList,
                likes: likesList,
                dislikes: dislikesList,
                background: personality.background.trim(),
                relationshipStyle: personality.relationshipStyle.trim(),
                goals: goalsList,
                customInstructions: personality.customInstructions.trim(),
                moralAlignment: personality.moralAlignment,
                quirks: quirksList,
                fears: fearsList,
                desires: desiresList,
                traits: personality.traits,
                ownerId: `owner-${Date.now()}`,
                claims: { roles: ["user"], permissions: ["create"] }
            });

            const characterId = `char-${Date.now()}`;
            const newCharacter: Character = {
                id: characterId,
                name: identity.name.trim(),
                title: identity.title.trim() || identity.name.trim(),
                description: identity.description.trim(),
                age: identity.age.trim(),
                gender: identity.gender.trim(),
                role: identity.role.trim(),
                origin: identity.origin.trim(),
                language: identity.language.trim(),
                tags: tagsList,
                createdAt: Date.now(),
                avatarImageId: selectedCandidateId ? generatedCandidates.find((c) => c.id === selectedCandidateId)?.uri || null : null,
                appearance: {
                    visualDescription: appearance.visualDescription.trim() || buildPrompt(),
                    skinTone: appearance.skinTone,
                    faceCharacteristics: appearance.faceCharacteristics,
                    bodyType: appearance.bodyType,
                    bodySize: appearance.bodySize,
                    height: appearance.height,
                    hairStyle: appearance.hairStyle,
                    hairLength: appearance.hairLength,
                    hairColor: appearance.hairColor,
                    eyeCharacteristics: appearance.eyeCharacteristics,
                    eyeColor: appearance.eyeColor,
                    clothing: appearance.clothing,
                    accessories: accessoriesList
                },
                personality: {
                    description: personality.description.trim(),
                    speakingStyle: personality.speakingStyle.trim(),
                    tone: personality.tone,
                    traits: personality.traits,
                    interests: interestsList,
                    likes: likesList,
                    dislikes: dislikesList,
                    background: personality.background.trim(),
                    relationshipStyle: personality.relationshipStyle.trim(),
                    goals: goalsList,
                    moralAlignment: personality.moralAlignment,
                    quirks: quirksList,
                    fears: fearsList,
                    desires: desiresList,
                    customInstructions: personality.customInstructions.trim()
                },
                voice: {
                    tone: personality.tone,
                    speechTempo: personality.speakingStyle || "normal",
                    vocabularyLevel: "normal",
                    dialectNotes: identity.dialect.split(",").map((t) => t.trim()).filter(Boolean)
                }
            };

            addCharacter(newCharacter);
            navigate(`/characters/${characterId}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save character");
        } finally {
            setSaving(false);
        }
    };

    const stepLabels = ["Identity", "Appearance", "Personality", "Review", "Generate"];

    return (
        <div className="page">
            <nav className="navbar">
                <button className="secondary" onClick={() => navigate("/home")}>
                    ← Back
                </button>
                <h1>Create Character</h1>
                <div className="nav-buttons">
                    {step > 1 && (
                        <button className="secondary" onClick={handleBack}>
                            ← Previous
                        </button>
                    )}
                    {step < 5 && (
                        <button className="primary" onClick={handleNext} disabled={!canNext}>
                            Next →
                        </button>
                    )}
                </div>
            </nav>

            <div className="content creator-layout">
                <div className="stepper">
                    {stepLabels.map((label, idx) => (
                        <div key={label} className={`step ${idx + 1 === step ? "active" : ""} ${idx + 1 < step ? "done" : ""}`}>
                            <div className="step-circle">{idx + 1}</div>
                            <div className="step-label">{label}</div>
                        </div>
                    ))}
                </div>

                {error && <div className="error-banner">{error}</div>}

                <div className="creator-main">
                    <div className="creator-form">
                        {step === 1 && (
                            <div className="step-content">
                                <h2>Identity</h2>
                                <p className="step-subtitle">Define who your character is.</p>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Character Name *</label>
                                        <input type="text" value={identity.name} onChange={(e) => setIdentity({ ...identity, name: e.target.value })} placeholder="e.g. Aria" />
                                    </div>
                                    <div className="form-group">
                                        <label>Title / Nickname</label>
                                        <input type="text" value={identity.title} onChange={(e) => setIdentity({ ...identity, title: e.target.value })} placeholder="e.g. The Shadow Dancer" />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Age</label>
                                        <input type="text" value={identity.age} onChange={(e) => setIdentity({ ...identity, age: e.target.value })} placeholder="e.g. 24" />
                                    </div>
                                    <div className="form-group">
                                        <label>Gender / Presentation</label>
                                        <input type="text" value={identity.gender} onChange={(e) => setIdentity({ ...identity, gender: e.target.value })} placeholder="e.g. Female, Non-binary" />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Role / Type</label>
                                        <input type="text" value={identity.role} onChange={(e) => setIdentity({ ...identity, role: e.target.value })} placeholder="e.g. Companion, Rival, Mentor" />
                                    </div>
                                    <div className="form-group">
                                        <label>Origin</label>
                                        <input type="text" value={identity.origin} onChange={(e) => setIdentity({ ...identity, origin: e.target.value })} placeholder="e.g. Neo-Tokyo" />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Language</label>
                                        <input type="text" value={identity.language} onChange={(e) => setIdentity({ ...identity, language: e.target.value })} placeholder="e.g. English" />
                                    </div>
                                    <div className="form-group">
                                        <label>Dialect</label>
                                        <input type="text" value={identity.dialect} onChange={(e) => setIdentity({ ...identity, dialect: e.target.value })} placeholder="e.g. Southern, British" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Short Description</label>
                                    <textarea value={identity.description} onChange={(e) => setIdentity({ ...identity, description: e.target.value })} placeholder="A brief summary of the character..." rows={3} />
                                </div>
                                <div className="form-group">
                                    <label>Tags (comma separated)</label>
                                    <input type="text" value={identity.tags} onChange={(e) => setIdentity({ ...identity, tags: e.target.value })} placeholder="e.g. fantasy, magic, companion" />
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="step-content">
                                <h2>Appearance</h2>
                                <p className="step-subtitle">Define the visual identity of your character.</p>

                                <div className="form-group">
                                    <label>Skin Tone</label>
                                    <div className="swatch-grid">
                                        {SKIN_TONES.map((tone) => (
                                            <button key={tone.value} type="button" className={`swatch ${appearance.skinTone === tone.value ? "selected" : ""}`} style={{ background: tone.color }} onClick={() => setAppearance({ ...appearance, skinTone: tone.value })} title={tone.label}>
                                                <span>{tone.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Body Type</label>
                                    <div className="card-grid">
                                        {BODY_TYPES.map((type) => (
                                            <button key={type} type="button" className={`select-card ${appearance.bodyType === type ? "selected" : ""}`} onClick={() => setAppearance({ ...appearance, bodyType: type })}>
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Height</label>
                                        <input type="text" value={appearance.height} onChange={(e) => setAppearance({ ...appearance, height: e.target.value })} placeholder="e.g. 5'9&quot;" />
                                    </div>
                                    <div className="form-group">
                                        <label>Body Size</label>
                                        <input type="text" value={appearance.bodySize} onChange={(e) => setAppearance({ ...appearance, bodySize: e.target.value })} placeholder="e.g. Slim, Average, Curvy" />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Face Characteristics</label>
                                    <input type="text" value={appearance.faceCharacteristics} onChange={(e) => setAppearance({ ...appearance, faceCharacteristics: e.target.value })} placeholder="e.g. sharp jawline, freckles, dimples" />
                                </div>

                                <div className="form-group">
                                    <label>Hair Style</label>
                                    <div className="card-grid">
                                        {HAIR_STYLES.map((style) => (
                                            <button key={style} type="button" className={`select-card ${appearance.hairStyle === style ? "selected" : ""}`} onClick={() => setAppearance({ ...appearance, hairStyle: style })}>
                                                {style}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Hair Length</label>
                                    <div className="card-grid">
                                        {HAIR_LENGTHS.map((len) => (
                                            <button key={len} type="button" className={`select-card ${appearance.hairLength === len ? "selected" : ""}`} onClick={() => setAppearance({ ...appearance, hairLength: len })}>
                                                {len}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Hair Color</label>
                                    <div className="swatch-grid">
                                        {[
                                            { value: "black", label: "Black", color: "#1a1a1a" },
                                            { value: "dark brown", label: "Dark Brown", color: "#3e2723" },
                                            { value: "brown", label: "Brown", color: "#5d4037" },
                                            { value: "light brown", label: "Light Brown", color: "#8d6e63" },
                                            { value: "blonde", label: "Blonde", color: "#fdd835" },
                                            { value: "platinum", label: "Platinum", color: "#f5f5f5" },
                                            { value: "red", label: "Red", color: "#b71c1c" },
                                            { value: "auburn", label: "Auburn", color: "#80461b" },
                                            { value: "gray", label: "Gray", color: "#9e9e9e" },
                                            { value: "white", label: "White", color: "#fafafa" },
                                            { value: "blue", label: "Blue", color: "#1565c0" },
                                            { value: "pink", label: "Pink", color: "#ec407a" }
                                        ].map((color) => (
                                            <button key={color.value} type="button" className={`swatch ${appearance.hairColor === color.value ? "selected" : ""}`} style={{ background: color.color }} onClick={() => setAppearance({ ...appearance, hairColor: color.value })} title={color.label}>
                                                <span>{color.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Eye Characteristics</label>
                                    <input type="text" value={appearance.eyeCharacteristics} onChange={(e) => setAppearance({ ...appearance, eyeCharacteristics: e.target.value })} placeholder="e.g. almond-shaped, heavy lashes" />
                                </div>

                                <div className="form-group">
                                    <label>Eye Color</label>
                                    <div className="swatch-grid">
                                        {EYE_COLORS.map((color) => (
                                            <button key={color.value} type="button" className={`swatch ${appearance.eyeColor === color.value ? "selected" : ""}`} style={{ background: color.color }} onClick={() => setAppearance({ ...appearance, eyeColor: color.value })} title={color.label}>
                                                <span>{color.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Clothing</label>
                                    <div className="card-grid">
                                        {CLOTHING_STYLES.map((style) => (
                                            <button key={style} type="button" className={`select-card ${appearance.clothing === style ? "selected" : ""}`} onClick={() => setAppearance({ ...appearance, clothing: style })}>
                                                {style}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Accessories (comma separated)</label>
                                    <input type="text" value={appearance.accessories} onChange={(e) => setAppearance({ ...appearance, accessories: e.target.value })} placeholder="e.g. silver necklace, leather gloves, cybernetic arm" />
                                </div>

                                <div className="form-group">
                                    <label>Visual Description</label>
                                    <textarea value={appearance.visualDescription} onChange={(e) => setAppearance({ ...appearance, visualDescription: e.target.value })} placeholder="Describe your character's overall look..." rows={3} />
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="step-content">
                                <h2>Personality</h2>
                                <p className="step-subtitle">Shape how your character thinks, feels, and speaks.</p>

                                <div className="form-group">
                                    <label>Personality Description</label>
                                    <textarea value={personality.description} onChange={(e) => setPersonality({ ...personality, description: e.target.value })} placeholder="A detailed description of their personality..." rows={3} />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Speaking Style</label>
                                        <input type="text" value={personality.speakingStyle} onChange={(e) => setPersonality({ ...personality, speakingStyle: e.target.value })} placeholder="e.g. formal, casual, poetic" />
                                    </div>
                                    <div className="form-group">
                                        <label>Tone</label>
                                        <input type="text" value={personality.tone} onChange={(e) => setPersonality({ ...personality, tone: e.target.value })} placeholder="e.g. warm, sarcastic, gentle" />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Personality Traits (select multiple)</label>
                                    <div className="trait-grid">
                                        {TRAIT_OPTIONS.map((trait) => {
                                            const selected = personality.traits.find((t) => t.name === trait);
                                            return (
                                                <div key={trait} className={`trait-item ${selected ? "selected" : ""}`}>
                                                    <button type="button" className="trait-name" onClick={() => toggleTrait(trait)}>
                                                        {trait}
                                                    </button>
                                                    {selected && (
                                                        <input type="range" min="0" max="1" step="0.1" value={selected.score} onChange={(e) => updateTraitScore(trait, parseFloat(e.target.value))} />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Interests (comma separated)</label>
                                        <input type="text" value={personality.interests} onChange={(e) => setPersonality({ ...personality, interests: e.target.value })} placeholder="e.g. astronomy, cooking" />
                                    </div>
                                    <div className="form-group">
                                        <label>Likes (comma separated)</label>
                                        <input type="text" value={personality.likes} onChange={(e) => setPersonality({ ...personality, likes: e.target.value })} placeholder="e.g. rain, old books" />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Dislikes (comma separated)</label>
                                        <input type="text" value={personality.dislikes} onChange={(e) => setPersonality({ ...personality, dislikes: e.target.value })} placeholder="e.g. loud noises, dishonesty" />
                                    </div>
                                    <div className="form-group">
                                        <label>Relationship Style</label>
                                        <input type="text" value={personality.relationshipStyle} onChange={(e) => setPersonality({ ...personality, relationshipStyle: e.target.value })} placeholder="e.g. loyal, teasing, distant" />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Goals (comma separated)</label>
                                    <input type="text" value={personality.goals} onChange={(e) => setPersonality({ ...personality, goals: e.target.value })} placeholder="e.g. find their lost sibling, master magic" />
                                </div>

                                <div className="form-group">
                                    <label>Background</label>
                                    <textarea value={personality.background} onChange={(e) => setPersonality({ ...personality, background: e.target.value })} placeholder="Their history and backstory..." rows={3} />
                                </div>

                                <div className="form-group">
                                    <label>Moral Alignment</label>
                                    <div className="card-grid">
                                        {MORAL_ALIGNMENTS.map((align) => (
                                            <button key={align} type="button" className={`select-card ${personality.moralAlignment === align ? "selected" : ""}`} onClick={() => setPersonality({ ...personality, moralAlignment: align })}>
                                                {align}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Quirks (comma separated)</label>
                                        <input type="text" value={personality.quirks} onChange={(e) => setPersonality({ ...personality, quirks: e.target.value })} placeholder="e.g. collects coins, hums when thinking" />
                                    </div>
                                    <div className="form-group">
                                        <label>Fears (comma separated)</label>
                                        <input type="text" value={personality.fears} onChange={(e) => setPersonality({ ...personality, fears: e.target.value })} placeholder="e.g. heights, betrayal" />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Desires (comma separated)</label>
                                        <input type="text" value={personality.desires} onChange={(e) => setPersonality({ ...personality, desires: e.target.value })} placeholder="e.g. freedom, recognition" />
                                    </div>
                                    <div className="form-group">
                                        <label>Custom Instructions</label>
                                        <textarea value={personality.customInstructions} onChange={(e) => setPersonality({ ...personality, customInstructions: e.target.value })} placeholder="Behavior rules for the character..." rows={2} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="step-content">
                                <h2>Review</h2>
                                <p className="step-subtitle">Review everything before generating images.</p>

                                <div className="review-section">
                                    <h3>Identity</h3>
                                    <div className="review-grid">
                                        <div><span className="review-label">Name</span><span>{identity.name}</span></div>
                                        <div><span className="review-label">Title</span><span>{identity.title || "—"}</span></div>
                                        <div><span className="review-label">Age</span><span>{identity.age || "—"}</span></div>
                                        <div><span className="review-label">Gender</span><span>{identity.gender || "—"}</span></div>
                                        <div><span className="review-label">Role</span><span>{identity.role || "—"}</span></div>
                                        <div><span className="review-label">Origin</span><span>{identity.origin || "—"}</span></div>
                                        <div><span className="review-label">Language</span><span>{identity.language || "—"}</span></div>
                                        <div><span className="review-label">Dialect</span><span>{identity.dialect || "—"}</span></div>
                                        <div className="review-full"><span className="review-label">Description</span><span>{identity.description || "—"}</span></div>
                                        <div className="review-full"><span className="review-label">Tags</span><span>{identity.tags || "—"}</span></div>
                                    </div>
                                </div>

                                <div className="review-section">
                                    <h3>Appearance</h3>
                                    <div className="review-grid">
                                        <div><span className="review-label">Skin Tone</span><span>{appearance.skinTone || "—"}</span></div>
                                        <div><span className="review-label">Body Type</span><span>{appearance.bodyType || "—"}</span></div>
                                        <div><span className="review-label">Height</span><span>{appearance.height || "—"}</span></div>
                                        <div><span className="review-label">Hair Style</span><span>{appearance.hairStyle || "—"}</span></div>
                                        <div><span className="review-label">Hair Length</span><span>{appearance.hairLength || "—"}</span></div>
                                        <div><span className="review-label">Hair Color</span><span>{appearance.hairColor || "—"}</span></div>
                                        <div><span className="review-label">Eye Color</span><span>{appearance.eyeColor || "—"}</span></div>
                                        <div><span className="review-label">Clothing</span><span>{appearance.clothing || "—"}</span></div>
                                        <div className="review-full"><span className="review-label">Accessories</span><span>{appearance.accessories || "—"}</span></div>
                                        <div className="review-full"><span className="review-label">Visual Description</span><span>{appearance.visualDescription || "—"}</span></div>
                                    </div>
                                </div>

                                <div className="review-section">
                                    <h3>Personality</h3>
                                    <div className="review-grid">
                                        <div className="review-full"><span className="review-label">Description</span><span>{personality.description || "—"}</span></div>
                                        <div><span className="review-label">Speaking Style</span><span>{personality.speakingStyle || "—"}</span></div>
                                        <div><span className="review-label">Tone</span><span>{personality.tone || "—"}</span></div>
                                        <div><span className="review-label">Alignment</span><span>{personality.moralAlignment}</span></div>
                                        <div className="review-full"><span className="review-label">Traits</span><span>{personality.traits.map((t) => `${t.name} (${t.score.toFixed(1)})`).join(", ") || "—"}</span></div>
                                        <div className="review-full"><span className="review-label">Interests</span><span>{personality.interests || "—"}</span></div>
                                        <div className="review-full"><span className="review-label">Likes</span><span>{personality.likes || "—"}</span></div>
                                        <div className="review-full"><span className="review-label">Dislikes</span><span>{personality.dislikes || "—"}</span></div>
                                        <div className="review-full"><span className="review-label">Background</span><span>{personality.background || "—"}</span></div>
                                        <div className="review-full"><span className="review-label">Goals</span><span>{personality.goals || "—"}</span></div>
                                        <div className="review-full"><span className="review-label">Quirks</span><span>{personality.quirks || "—"}</span></div>
                                        <div className="review-full"><span className="review-label">Fears</span><span>{personality.fears || "—"}</span></div>
                                        <div className="review-full"><span className="review-label">Desires</span><span>{personality.desires || "—"}</span></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 5 && (
                            <div className="step-content">
                                <h2>Generate Images</h2>
                                <p className="step-subtitle">Create avatar candidates using the Image Engine.</p>

                                {!generatedCandidates.length && !generating && (
                                    <div className="generation-prompt-preview">
                                        <h4>Prompt Preview</h4>
                                        <p>{buildPrompt()}</p>
                                    </div>
                                )}

                                {!generatedCandidates.length && !generating && (
                                    <button className="primary generate-btn" onClick={handleGenerateImages}>
                                        Generate Avatars
                                    </button>
                                )}

                                {generating && (
                                    <div className="loading-state">
                                        <div className="spinner"></div>
                                        <p>Generating candidates...</p>
                                    </div>
                                )}

                                {error && <div className="error-banner">{error}</div>}

                                {generatedCandidates.length > 0 && (
                                    <div className="candidate-gallery">
                                        <h4>Select an Avatar</h4>
                                        <div className="candidate-grid">
                                            {generatedCandidates.map((candidate) => (
                                                <div key={candidate.id} className={`candidate-card ${selectedCandidateId === candidate.id ? "selected" : ""}`} onClick={() => setSelectedCandidateId(candidate.id)}>
                                                    <img src={candidate.uri} alt="Candidate" />
                                                    <div className="candidate-score">Score: {candidate.score.toFixed(2)}</div>
                                                    {selectedCandidateId === candidate.id && <div className="selected-badge">Selected</div>}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="generation-actions">
                                            <button className="secondary" onClick={handleGenerateImages} disabled={generating}>
                                                Regenerate
                                            </button>
                                            <button className="primary" onClick={() => setSelectedAvatarId(selectedCandidateId)} disabled={!selectedCandidateId}>
                                                Confirm Selection
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {step < 5 && (
                        <div className="creator-preview">
                            <h3>Configuration Preview</h3>
                            <div className="preview-avatar">
                                <div className="avatar-placeholder-large">
                                    {appearance.hairColor ? (
                                        <div className="avatar-silhouette">
                                            <div className="silhouette-face" style={{ background: SKIN_TONES.find((t) => t.value === appearance.skinTone)?.color || "#fde8d0" }}></div>
                                            <div className="silhouette-hair" style={{ background: appearance.hairColor }}></div>
                                        </div>
                                    ) : (
                                        <span>?</span>
                                    )}
                                </div>
                                <h4>{identity.name || "Unnamed Character"}</h4>
                            </div>
                            <div className="preview-details">
                                <div className="preview-item">
                                    <span className="preview-label">Hair</span>
                                    <span>{appearance.hairStyle && appearance.hairLength ? `${appearance.hairLength} ${appearance.hairStyle}` : "—"}</span>
                                </div>
                                <div className="preview-item">
                                    <span className="preview-label">Color</span>
                                    <span>{appearance.hairColor || "—"}</span>
                                </div>
                                <div className="preview-item">
                                    <span className="preview-label">Eyes</span>
                                    <span>{appearance.eyeColor || "—"}</span>
                                </div>
                                <div className="preview-item">
                                    <span className="preview-label">Body</span>
                                    <span>{appearance.bodyType || "—"}</span>
                                </div>
                                <div className="preview-item">
                                    <span className="preview-label">Clothing</span>
                                    <span>{appearance.clothing || "—"}</span>
                                </div>
                                <div className="preview-item">
                                    <span className="preview-label">Traits</span>
                                    <span>{personality.traits.length} selected</span>
                                </div>
                                <div className="preview-item">
                                    <span className="preview-label">Tone</span>
                                    <span>{personality.tone || "—"}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {selectedAvatarId && (
                    <div className="preview-banner">
                        <div className="preview-banner-content">
                            <img src={generatedCandidates.find((c) => c.id === selectedAvatarId)?.uri || ""} alt="Selected Avatar" />
                            <div>
                                <h3>Avatar Selected</h3>
                                <p>Your character is ready to be saved.</p>
                            </div>
                        </div>
                        <div className="preview-banner-actions">
                            <button className="secondary" onClick={() => setSelectedAvatarId(null)}>Change Avatar</button>
                            <button className="primary" onClick={handleSaveCharacter} disabled={saving}>
                                {saving ? "Saving..." : "Save Character"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
