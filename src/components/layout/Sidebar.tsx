import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import clsx from "clsx";

const NAV_ITEMS = [
    { path: "/home", label: "Discover", icon: "🏠" },
    { path: "/chat", label: "Chats", icon: "💬" },
    { path: "/home", label: "Characters", icon: "👥" },
    { path: "/gallery", label: "Gallery", icon: "🖼️" },
    { path: "/home?favorites=true", label: "Favorites", icon: "⭐" },
];

const CREATE_ITEMS = [
    { path: "/characters/create", label: "Character", icon: "🧑‍🤝‍🧑" },
    { path: "/characters/create", label: "Image", icon: "🎨" },
    { path: "/characters/create", label: "Story", icon: "📖" },
    { path: "/characters/create", label: "World", icon: "🌍" },
];

export default function Sidebar({ open, onNavigate }: { open?: boolean; onNavigate?: () => void }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [createExpanded, setCreateExpanded] = useState(false);

    return (
        <aside
            className={clsx("sidebar", { collapsed, open })}
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
                        key={item.path + item.label}
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

                <div className="sidebar-submenu">
                    <button
                        className={clsx("sidebar-link", "sidebar-submenu-trigger", {
                            active: location.pathname === "/characters/create",
                        })}
                        onClick={() => !collapsed && setCreateExpanded(!createExpanded)}
                    >
                        <span className="sidebar-icon">✨</span>
                        {!collapsed && (
                            <>
                                <span className="sidebar-label">Create</span>
                                <span className="sidebar-arrow">{createExpanded ? "▾" : "▸"}</span>
                            </>
                        )}
                    </button>
                    {createExpanded && !collapsed && (
                        <div className="sidebar-submenu-items">
                            {CREATE_ITEMS.map((item) => (
                                <button
                                    key={item.path + item.label}
                                    className="sidebar-submenu-item"
                                    onClick={() => {
                                        navigate(item.path);
                                        onNavigate?.();
                                    }}
                                >
                                    <span className="sidebar-icon">{item.icon}</span>
                                    <span className="sidebar-label">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
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
