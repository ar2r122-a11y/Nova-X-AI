import type { Character } from "../../lib/state/CharacterStore";
import { useState } from "react";
import clsx from "clsx";

export interface CharacterCardProps {
    character: Character;
    isFavorite: boolean;
    onClick: () => void;
    onToggleFavorite: (e: React.MouseEvent) => void;
    onStartChat: (e: React.MouseEvent) => void;
}

function isValidImageUrl(url: string | null): boolean {
    if (!url) return false;
    return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:image/");
}

export default function CharacterCard({
    character,
    isFavorite,
    onClick,
    onToggleFavorite,
    onStartChat
}: CharacterCardProps) {
    const [imgError, setImgError] = useState(false);
    const [imgLoaded, setImgLoaded] = useState(false);
    const avatar = character.avatarImageId;
    const hasValidImage = isValidImageUrl(avatar);

    return (
        <div className="character-card" onClick={onClick}>
            <div className="character-avatar">
                {hasValidImage && !imgError ? (
                    <>
                        {!imgLoaded && <div className="avatar-loading" aria-hidden="true" />}
                        <img
                            src={avatar!}
                            alt={character.name}
                            loading="lazy"
                            onError={() => setImgError(true)}
                            onLoad={() => setImgLoaded(true)}
                            className={imgLoaded ? "loaded" : ""}
                        />
                    </>
                ) : (
                    <div className="avatar-fallback">
                        <span className="avatar-fallback-icon" aria-hidden="true">✦</span>
                        <span className="avatar-fallback-initial">{character.name.charAt(0).toUpperCase()}</span>
                    </div>
                )}
                <div className="card-overlay">
                    <button
                        className={clsx("favorite-heart", { active: isFavorite })}
                        onClick={onToggleFavorite}
                        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                        {isFavorite ? "♥" : "♡"}
                    </button>
                </div>
            </div>
            <div className="card-body">
                <div className="card-header-row">
                    <h3 className="card-name" title={character.name}>{character.name}</h3>
                    {character.title && <span className="card-badge">{character.title}</span>}
                </div>
                {character.role && <p className="card-role">{character.role}</p>}
                {character.description ? (
                    <p
                        className="card-description"
                        title={character.description}
                    >
                        {character.description.slice(0, 120)}
                        {character.description.length > 120 ? "..." : ""}
                    </p>
                ) : (
                    <p className="card-description card-description-placeholder">No description yet.</p>
                )}
                {character.tags.length > 0 && (
                    <div className="card-tags">
                        {character.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="tag-small">{tag}</span>
                        ))}
                    </div>
                )}
                {character.personality.traits.length > 0 && (
                    <div className="card-traits">
                        {character.personality.traits.slice(0, 3).map((trait) => (
                            <span key={trait.name} className="trait-chip">
                                {trait.name} <span className="trait-score">{trait.score.toFixed(1)}</span>
                            </span>
                        ))}
                    </div>
                )}
                <div className="card-actions">
                    <button
                        className="primary card-chat-btn"
                        onClick={onStartChat}
                        aria-label={`Start chat with ${character.name}`}
                    >
                        Start Chat
                    </button>
                </div>
            </div>
        </div>
    );
}
