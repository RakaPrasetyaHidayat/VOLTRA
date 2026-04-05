import { Routes, Route, useNavigate, useLocation} from "react-router-dom";
import { useEffect } from "react";
import { TabProvider } from "./components/Tab/TabContext";

import Login from "./pages/login/login";
import Profile from "./pages/profile/profile";
import Registration from "./pages/registration/registration";

import LayoutWithTab from "./layouts/LayoutWithTab";

function App() {
   const navigate = useNavigate();
   const location = useLocation();

  useEffect(() => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    const path = location.pathname;

    if (!token && path !== "/login" && path !== "/registration") {
      navigate("/login");
    }

    if (token && (path === "/" || path === "/login" || path === "/registration")) {
      navigate("/home");
    }
    }, [location.pathname, navigate]);
  return (
    <TabProvider>
      <Routes>
       
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/registration" element={<Registration />} />

        
        <Route path="/*" element={<LayoutWithTab />} />
      </Routes>
    </TabProvider>
  );
}

export default App;