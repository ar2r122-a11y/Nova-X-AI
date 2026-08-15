import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import clsx from "clsx";

const NAV_ITEMS = [
    { path: "/home", label: "Discover", icon: "🏠" },
    { path: "/gallery", label: "Gallery", icon: "🖼️" },
];

export default function Sidebar({ open, onNavigate }: { open?: boolean; onNavigate?: () => void }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside
            className={clsx("sidebar", { collapsed, open })}
            dir="ltr"
        >
            <div className="sidebar-header">
                <div className="sidebar-brand" onClick={() => navigate("/home")}>
                    <span className="sidebar-logo">✦</span>
                    {!collapsed && <span className="sidebar-title">Nova X AI</span>}
                </div>
                <button
                    className="sidebar-toggle"
                    onClick={() => setCollapsed(!collapsed)}
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {collapsed ? "→" : "←"}
                </button>
            </div>

            <nav className="sidebar-nav">
                {NAV_ITEMS.map((item) => (
                    <button
                        key={item.path}
                        className={clsx("sidebar-link", {
                            active: location.pathname === item.path,
                        })}
                        onClick={() => {
                            navigate(item.path);
                            onNavigate?.();
                        }}
                    >
                        <span className="sidebar-icon">{item.icon}</span>
                        {!collapsed && <span className="sidebar-label">{item.label}</span>}
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button
                    className="sidebar-create-btn"
                    onClick={() => {
                        navigate("/characters/create");
                        onNavigate?.();
                    }}
                >
                    <span className="sidebar-icon">+</span>
                    {!collapsed && <span>New Character</span>}
                </button>
            </div>
        </aside>
    );
}
