import { useNavigate } from "react-router-dom";
// import { useAppStore } from "../lib/state/CharacterStore";

export default function Welcome() {
    const navigate = useNavigate();
    // const characters = useAppStore((s) => s.characters);

    return (
        <div className="landing">
            <div className="background-grid"></div>
            <div className="glass">
                <div className="logo">🚀</div>
                <h1>Nova X AI</h1>
                <p className="subtitle">The Next Generation AI Platform</p>
                <div className="buttons">
                    <button className="primary" onClick={() => navigate("/home")}>
                        Continue
                    </button>
                </div>
                <div className="footer">
                    Powered by <strong>Nova Core</strong>
                </div>
            </div>
        </div>
    );
}
