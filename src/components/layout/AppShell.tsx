import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import clsx from "clsx";

export default function AppShell() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="app-shell">
            <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
            <button
                className="mobile-menu-btn"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle menu"
            >
                ☰
            </button>
            <main className={clsx("app-main", { "sidebar-open": sidebarOpen })}>
                <div className="app-content"><Outlet /></div>
            </main>
            <div
                className={clsx("sidebar-overlay", { open: sidebarOpen })}
                onClick={() => setSidebarOpen(false)}
            />
        </div>
    );
}
