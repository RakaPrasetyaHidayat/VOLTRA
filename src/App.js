import { Routes, Route } from "react-router-dom";
import { TabProvider } from "./components/Tab/TabContext";

import Login from "./pages/login/login";
import Profile from "./pages/profile/profile";
import Registration from "./pages/registration/registration";

import LayoutWithTab from "./layouts/LayoutWithTab";

function App() {
  return (
    <TabProvider>
      <Routes>
        {/* ❌ TANPA TAB */}
        <Route path="/" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/registration" element={<Registration />} />

        {/* ✅ DENGAN TAB */}
        <Route path="/*" element={<LayoutWithTab />} />
      </Routes>
    </TabProvider>
  );
}

export default App;