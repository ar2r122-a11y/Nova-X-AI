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
                                <p>{char.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
