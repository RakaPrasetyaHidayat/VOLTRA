import { Routes, Route } from "react-router-dom";
import Login from "./pages/login/login";
import Profile from "./pages/profile/profile";
import Registration from "./pages/registration/registration";
import Home from "./pages/home/home";
import Note from "./pages/note/note-page";
import Notification from "./pages/notification/notification";

function App() {
    return (
        <Routes>
        <Route path="/" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/home" element={<Home />} />
        <Route path="/note" element={<Note />} />
        <Route path="/notification" element={<Notification />} />
        </Routes>
       
    );
}

export default App;