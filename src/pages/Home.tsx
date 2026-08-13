import { useNavigate } from "react-router-dom";
import { useAppStore } from "../lib/state/CharacterStore";

export default function Home() {
    const navigate = useNavigate();
    const characters = useAppStore((s) => s.characters);
    const setCurrentCharacterId = useAppStore((s) => s.setCurrentCharacterId);

    const handleContinue = (id: string) => {
        setCurrentCharacterId(id);
        navigate(`/characters/${id}`);
    };

    return (
        <div className="page">
            <nav className="navbar">
                <h1>Nova X AI</h1>
                <div className="nav-buttons">
                    <button className="primary" onClick={() => navigate("/characters/create")}>
                        + New Character
                    </button>
                    <button className="secondary" onClick={() => navigate("/gallery")}>
                        Gallery
                    </button>
                </div>
            </nav>

            <div className="content">
                <h2>Your Characters</h2>
                {characters.length === 0 ? (
                    <div className="empty-state">
                        <p>No characters yet. Create your first character to get started.</p>
                        <button className="primary" onClick={() => navigate("/characters/create")}>
                            Create Character
                        </button>
                    </div>
                ) : (
                    <div className="character-grid">
                        {characters.map((char) => (
                            <div key={char.id} className="character-card" onClick={() => handleContinue(char.id)}>
                                <div className="character-avatar">
                                    {char.avatarImageId ? (
                                        <img src={char.avatarImageId} alt={char.name} />
                                    ) : (
                                        <div className="avatar-placeholder">?</div>
                                    )}
                                </div>
                                <h3>{char.name}</h3>
                                {char.title && <p className="character-title">{char.title}</p>}
                                <p>{char.description}</p>
                                <div className="character-meta">
                                    {char.role && <span className="meta-badge">{char.role}</span>}
                                    {char.age && <span className="meta-badge">Age: {char.age}</span>}
                                </div>
                                {char.tags.length > 0 && (
                                    <div className="character-tags">
                                        {char.tags.slice(0, 3).map((tag) => (
                                            <span key={tag} className="tag-small">{tag}</span>
                                        ))}
                                    </div>
                                )}
                                <div className="character-card-actions">
                                    <button className="primary" onClick={(e) => { e.stopPropagation(); navigate(`/chat?characterId=${char.id}`); }}>
                                        Chat
                                    </button>
                                    <button className="secondary" onClick={(e) => { e.stopPropagation(); handleContinue(char.id); }}>
                                        View
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
