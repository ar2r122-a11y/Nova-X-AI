import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Home from "./pages/Home";
import CharacterCreate from "./pages/CharacterCreate";
import CharacterDetail from "./pages/CharacterDetail";
import Gallery from "./pages/Gallery";
import Chat from "./pages/Chat";
import Settings from "./pages/Settings";
import AppShell from "./components/layout/AppShell";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route element={<AppShell />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/characters/create" element={<CharacterCreate />} />
                    <Route path="/characters/:id" element={<CharacterDetail />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/settings" element={<Settings />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
