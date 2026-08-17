import { useNavigate } from "react-router-dom";

export default function Settings() {
    const navigate = useNavigate();

    return (
        <div className="page">
            <div className="profile-content">
                <div className="profile-header">
                    <div className="profile-primary-info">
                        <h1 className="profile-name">Settings</h1>
                        <p className="profile-title">Manage your preferences and account</p>
                    </div>
                </div>

                <div className="profile-sections">
                    <div className="profile-section">
                        <h3 className="section-label">Appearance</h3>
                        <p className="section-text">Theme and display options coming soon.</p>
                    </div>

                    <div className="profile-section">
                        <h3 className="section-label">Notifications</h3>
                        <p className="section-text">Notification preferences coming soon.</p>
                    </div>

                    <div className="profile-section">
                        <h3 className="section-label">Privacy</h3>
                        <p className="section-text">Privacy settings coming soon.</p>
                    </div>

                    <div className="profile-section">
                        <h3 className="section-label">Account</h3>
                        <p className="section-text">Account management coming soon.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
