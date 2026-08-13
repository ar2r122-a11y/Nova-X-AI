import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../lib/state/CharacterStore";

export default function CharacterCreate() {
    const navigate = useNavigate();
    const addCharacter = useAppStore((s) => s.addCharacter);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        const character = {
            id: "char-" + Date.now(),
            name: name.trim(),
            description: description.trim(),
            avatarImageId: null,
            createdAt: Date.now()
        };

        addCharacter(character);
        navigate(`/characters/${character.id}`);
    };

    return (
        <div className="page">
            <nav className="navbar">
                <button className="secondary" onClick={() => navigate("/home")}>
                    ← Back
                </button>
                <h1>Create Character</h1>
            </nav>

            <div className="content">
                <form onSubmit={handleSubmit} className="form">
                    <div className="form-group">
                        <label htmlFor="name">Character Name</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter character name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe your character"
                            rows={4}
                        />
                    </div>
                    <button type="submit" className="primary">
                        Create Character
                    </button>
                </form>
            </div>
        </div>
    );
}
