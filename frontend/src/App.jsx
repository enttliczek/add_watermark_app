import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { HomePage } from "./pages/HomePage";
import { LessonPage } from "./pages/LessonPage";
import { LessonCompletePage } from "./pages/LessonCompletePage";
import { ConversationPage } from "./pages/ConversationPage";
import { ProfilePage } from "./pages/ProfilePage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-duo-bg">
        <Header />
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/lesson/:id" element={<LessonPage />} />
            <Route path="/lesson/:id/complete" element={<LessonCompletePage />} />
            <Route path="/conversation" element={<ConversationPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
