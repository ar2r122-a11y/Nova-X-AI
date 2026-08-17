import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore, Character } from "../lib/state/CharacterStore";
import { loadCharactersFromEngine } from "../lib/engine/CharacterDataLoader";
import CharacterCard from "../components/features/CharacterCard";
import clsx from "clsx";

const CATEGORIES = ["All", "Fantasy", "Sci-Fi", "Romance", "Mystery", "Comedy", "Drama", "Action"];
const LOAD_TIMEOUT = 15000;

export default function Home() {
    const navigate = useNavigate();
    const characters = useAppStore((s) => s.characters);
    const favoriteCharacterIds = useAppStore((s) => s.favoriteCharacterIds);
    const recentCharacterIds = useAppStore((s) => s.recentCharacterIds);
    const lastVisitedAt = useAppStore((s) => s.lastVisitedAt);
    const mergeCharacters = useAppStore((s) => s.mergeCharacters);
    const setLoading = useAppStore((s) => s.setLoading);
    const setError = useAppStore((s) => s.setError);
    const toggleFavoriteCharacter = useAppStore((s) => s.toggleFavoriteCharacter);
    const addRecentCharacter = useAppStore((s) => s.addRecentCharacter);
    const isFavoriteCharacter = useAppStore((s) => s.isFavoriteCharacter);
    const engineLoading = useAppStore((s) => s.isLoading);
    const engineError = useAppStore((s) => s.error);

    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

    useEffect(() => {
        let cancelled = false;
        let timeoutId: ReturnType<typeof setTimeout>;

        setLoading(true);
        setError(null);

        timeoutId = setTimeout(() => {
            if (!cancelled) {
                setError("Character loading is taking longer than expected. Please check your connection and try again.");
                setLoading(false);
            }
        }, LOAD_TIMEOUT);

        loadCharactersFromEngine()
            .then((fromEngine) => {
                if (cancelled) return;
                clearTimeout(timeoutId);
                if (fromEngine.length > 0) {
                    mergeCharacters(fromEngine);
                }
                setLoading(false);
            })
            .catch((err) => {
                if (cancelled) return;
                clearTimeout(timeoutId);
                setError(err instanceof Error ? err.message : "Failed to load characters");
                setLoading(false);
            });

        return () => {
            cancelled = true;
            clearTimeout(timeoutId);
        };
    }, [mergeCharacters, setLoading, setError]);

    const isFreshLoading = engineLoading && characters.length === 0;

    const filteredCharacters = useMemo(() => {
        let result = characters;
        if (showFavoritesOnly) {
            result = result.filter((c) => favoriteCharacterIds.includes(c.id));
        }
        if (activeCategory !== "All") {
            result = result.filter(
                (c) =>
                    c.tags.some((t) => t.toLowerCase() === activeCategory.toLowerCase()) ||
                    c.role.toLowerCase() === activeCategory.toLowerCase()
            );
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (c) =>
                    c.name.toLowerCase().includes(q) ||
                    c.description.toLowerCase().includes(q) ||
                    c.tags.some((t) => t.toLowerCase().includes(q))
            );
        }
        return result;
    }, [characters, activeCategory, searchQuery, favoriteCharacterIds, showFavoritesOnly]);

    const recentlyUsed = useMemo(() => {
        return recentCharacterIds
            .map((id) => characters.find((c) => c.id === id))
            .filter((c): c is Character => c != null)
            .sort((a, b) => (lastVisitedAt[b.id] || 0) - (lastVisitedAt[a.id] || 0));
    }, [recentCharacterIds, characters, lastVisitedAt]);

    const favorites = useMemo(() => {
        return characters.filter((c) => favoriteCharacterIds.includes(c.id));
    }, [characters, favoriteCharacterIds]);

    const trending = useMemo(() => {
        const favorited = characters.filter((c) => favoriteCharacterIds.includes(c.id));
        const newest = [...characters].sort((a, b) => b.createdAt - a.createdAt);
        const combined = [...favorited, ...newest.filter((c) => !favorited.includes(c))];
        return combined.slice(0, 12);
    }, [characters, favoriteCharacterIds]);

    const recommended = useMemo(() => {
        const recentIds = new Set(recentlyUsed.slice(0, 6).map((c) => c.id));
        return characters
            .filter((c) => !recentIds.has(c.id))
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 12);
    }, [characters, recentlyUsed]);

    const handleStartChat = (id: string) => {
        addRecentCharacter(id);
        navigate(`/chat?characterId=${id}`);
    };

    const handleViewProfile = (id: string) => {
        addRecentCharacter(id);
        navigate(`/characters/${id}`);
    };

    const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        toggleFavoriteCharacter(id);
    };

    const clearAllFilters = () => {
        setSearchQuery("");
        setActiveCategory("All");
        setShowFavoritesOnly(false);
    };

    const renderCard = (char: Character) => (
        <CharacterCard
            key={char.id}
            character={char}
            isFavorite={isFavoriteCharacter(char.id)}
            onClick={() => handleViewProfile(char.id)}
            onToggleFavorite={(e) => handleToggleFavorite(char.id, e)}
            onStartChat={(e) => {
                e.stopPropagation();
                handleStartChat(char.id);
            }}
        />
    );

    const hasActiveFilters = searchQuery.trim().length > 0 || activeCategory !== "All" || showFavoritesOnly;

    return (
        <div className="home-page">
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Discover <span className="hero-accent">Characters</span>
                    </h1>
                    <p className="hero-subtitle">
                        Connect with unique AI companions. Find your perfect match and start a conversation.
                    </p>

                    <div className="search-container">
                        <div className="search-bar">
                            <span className="search-icon" aria-hidden="true">🔍</span>
                            <input
                                type="text"
                                placeholder="Search characters by name, description, or tags..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                dir="auto"
                                aria-label="Search characters"
                            />
                            {searchQuery && (
                                <button
                                    className="search-clear"
                                    onClick={() => setSearchQuery("")}
                                    aria-label="Clear search"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="hero-ctas">
                        <button className="primary" onClick={() => navigate("/characters/create")}>
                            + Create Character
                        </button>
                        <button className="secondary" onClick={() => navigate("/gallery")}>
                            🖼️ View Gallery
                        </button>
                    </div>
                </div>

                <div className="hero-stats">
                    <div className="stat">
                        <span className="stat-value">{characters.length}</span>
                        <span className="stat-label">Characters</span>
                    </div>
                    <div className="stat">
                        <span className="stat-value">{favoriteCharacterIds.length}</span>
                        <span className="stat-label">Favorites</span>
                    </div>
                    <div className="stat">
                        <span className="stat-value">{recentCharacterIds.length}</span>
                        <span className="stat-label">Recently Used</span>
                    </div>
                </div>

                <div className="hero-features">
                    <button
                        className="feature-card"
                        onClick={() => navigate("/characters/create")}
                        aria-label="Story discovery - create a character to begin"
                    >
                        <span className="feature-icon" aria-hidden="true">📖</span>
                        <div className="feature-card-body">
                            <h3>Story Mode</h3>
                            <p>Narrative adventures unfold through your characters.</p>
                        </div>
                        <span className="feature-card-arrow" aria-hidden="true">→</span>
                    </button>
                    <button
                        className="feature-card"
                        onClick={() => navigate("/gallery")}
                        aria-label="World discovery - browse generated art"
                    >
                        <span className="feature-icon" aria-hidden="true">🌍</span>
                        <div className="feature-card-body">
                            <h3>World Explorer</h3>
                            <p>Browse generated artwork and character galleries.</p>
                        </div>
                        <span className="feature-card-arrow" aria-hidden="true">→</span>
                    </button>
                </div>
            </section>

            <section className="categories-section">
                <div className="categories-scroll">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            className={clsx("category-chip", { active: activeCategory === cat })}
                            onClick={() => {
                                setActiveCategory(cat);
                                setShowFavoritesOnly(false);
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                    <button
                        className={clsx("category-chip", { active: showFavoritesOnly })}
                        onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    >
                        {showFavoritesOnly ? "★ Favorites" : "☆ Show Favorites"}
                    </button>
                </div>
            </section>

            {engineError && characters.length === 0 && (
                <section className="section">
                    <div className="error-state">
                        <span className="error-icon" aria-hidden="true">⚠️</span>
                        <p className="error-message">{engineError}</p>
                        <button className="primary" onClick={() => window.location.reload()}>
                            Retry
                        </button>
                    </div>
                </section>
            )}

            {isFreshLoading && (
                <section className="section">
                    <div className="loading-state">
                        <div className="spinner" />
                        <p>Loading characters…</p>
                    </div>
                </section>
            )}

            {!isFreshLoading && characters.length === 0 && (
                <section className="section">
                    <div className="empty-state">
                        <div className="empty-icon" aria-hidden="true">🚀</div>
                        <h2>No characters yet</h2>
                        <p>Create your first character to start discovering AI companions.</p>
                        <button className="primary" onClick={() => navigate("/characters/create")}>
                            Create Character
                        </button>
                    </div>
                </section>
            )}

            {!isFreshLoading && characters.length > 0 && (
                <>
                    {recentlyUsed.length > 0 && !showFavoritesOnly && !searchQuery && activeCategory === "All" && (
                        <section className="section">
                            <div className="section-header">
                                <h2 className="section-title">Recently Used</h2>
                                <span className="section-count">{recentlyUsed.length} characters</span>
                            </div>
                            <div className="character-row">
                                {recentlyUsed.map(renderCard)}
                            </div>
                        </section>
                    )}

                    {showFavoritesOnly && (
                        <section className="section">
                            <div className="section-header">
                                <h2 className="section-title">Your Favorites</h2>
                                <span className="section-count">{favorites.length} characters</span>
                                <button className="text-btn" onClick={() => setShowFavoritesOnly(false)}>
                                    Show All
                                </button>
                            </div>
                            {favorites.length === 0 ? (
                                <div className="empty-state">
                                    <p>You haven't favorited any characters yet.</p>
                                </div>
                            ) : (
                                <div className="character-grid">
                                    {favorites.map(renderCard)}
                                </div>
                            )}
                        </section>
                    )}

                    {!showFavoritesOnly && trending.length > 0 && (
                        <section className="section">
                            <div className="section-header">
                                <h2 className="section-title">Trending</h2>
                                <span className="section-count">{trending.length} characters</span>
                            </div>
                            <div className="character-row">
                                {trending.map(renderCard)}
                            </div>
                        </section>
                    )}

                    {!showFavoritesOnly && recommended.length > 0 && (
                        <section className="section">
                            <div className="section-header">
                                <h2 className="section-title">Recommended</h2>
                                <span className="section-count">{recommended.length} characters</span>
                            </div>
                            <div className="character-row">
                                {recommended.map(renderCard)}
                            </div>
                        </section>
                    )}

                    <section className="section">
                        <div className="section-header">
                            <h2 className="section-title">
                                {hasActiveFilters ? "Matching Characters" : "New Characters"}
                            </h2>
                            <span className="section-count">{filteredCharacters.length} results</span>
                            {hasActiveFilters && (
                                <button className="text-btn" onClick={clearAllFilters}>
                                    Clear Filters
                                </button>
                            )}
                        </div>
                        {filteredCharacters.length === 0 ? (
                            <div className="empty-state">
                                <p>
                                    {searchQuery
                                        ? `No characters match "${searchQuery}".`
                                        : showFavoritesOnly
                                        ? "No favorite characters found."
                                        : "No characters match the selected filters."}
                                </p>
                                <button className="primary" onClick={clearAllFilters}>
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <div className="character-grid">
                                {filteredCharacters.map(renderCard)}
                            </div>
                        )}
                    </section>
                </>
            )}

            {engineError && characters.length > 0 && (
                <div className="error-banner-fixed">
                    <span>{engineError}</span>
                    <button className="error-dismiss" onClick={() => setError(null)}>×</button>
                </div>
            )}
        </div>
    );
}
