import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAppStore } from "../lib/state/CharacterStore";

export default function Gallery() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const images = useAppStore((s) => s.images);
    const removeImage = useAppStore((s) => s.removeImage);
    const [previewImageId, setPreviewImageId] = useState<string | null>(null);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    const previewImage = images.find((img) => img.id === previewImageId);
    const previewUri = previewImage?.candidates.find((c) => c.id === previewImage?.selectedCandidateId)?.uri || previewImage?.candidates[0]?.uri || "";

    useEffect(() => {
        const imageId = searchParams.get("image");
        if (imageId) {
            setPreviewImageId(imageId);
        }
    }, [searchParams]);

    const handleDelete = (imageId: string) => {
        removeImage(imageId);
        setPreviewImageId(null);
    };

    const handleFavorite = (imageId: string) => {
        setFavorites((prev) => {
            const next = new Set(prev);
            if (next.has(imageId)) {
                next.delete(imageId);
            } else {
                next.add(imageId);
            }
            return next;
        });
    };

    return (
        <div className="page">
            <nav className="navbar">
                <button className="secondary" onClick={() => navigate("/home")}>
                    ← Home
                </button>
                <h1>Gallery</h1>
            </nav>

            <div className="content">
                {images.length === 0 ? (
                    <div className="empty-state">
                        <p>No images generated yet.</p>
                        <button className="primary" onClick={() => navigate("/home")}>
                            Go to Characters
                        </button>
                    </div>
                ) : (
                    <div className="gallery-grid">
                        {images.map((img) => (
                            <div key={img.id} className="gallery-card" onClick={() => setPreviewImageId(img.id)}>
                                <img src={img.candidates[0]?.uri || ""} alt={img.prompt} />
                                <div className="gallery-overlay">
                                    <p>{img.prompt}</p>
                                    <div className="gallery-actions">
                                <button
                                    className="favorite-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleFavorite(img.id);
                                    }}
                                >
                                    {favorites.has(img.id) ? "★" : "☆"}
                                </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {previewImageId && (
                <div className="modal-overlay" onClick={() => setPreviewImageId(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setPreviewImageId(null)}>
                            ×
                        </button>
                        <img src={previewUri} alt="Preview" />
                        <div className="modal-actions">
                            <button className="primary" onClick={() => handleFavorite(previewImageId)}>
                                Favorite
                            </button>
                            <button className="danger" onClick={() => handleDelete(previewImageId)}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
