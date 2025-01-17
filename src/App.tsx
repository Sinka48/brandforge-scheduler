import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IndexPage from "./pages/Index";
import BrandPage from "./pages/Brand";
import CalendarPage from "./pages/Calendar";
import SettingsPage from "./pages/Settings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/brand" element={<BrandPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Router>
  );
}

export default App;