import { Routes, Route } from "react-router-dom";
import Login from "./pages/login/login";
import Profile from "./pages/profile/profile";
import Registration from "./pages/registration/registration";
function App() {
    return (
        <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Registration />} />
        </Routes>
       
    );
}

export default App;