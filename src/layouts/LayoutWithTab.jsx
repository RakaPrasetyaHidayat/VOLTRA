import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Tab from "../components/Tab/Tab";
import styles from "../layouts/Layout.module.css";
import Home from "../pages/home/home";
import Note from "../pages/note/note-page";
import Notification from "../pages/notification/notification";

function LayoutWithTab() {
  return (
    <>
      <div className={styles.container}>
        <Sidebar />
          <div className={styles.main}>
             <div className={styles.tab}>
              <Tab />
             </div>
              <div className={styles.content}>
                  <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/note" element={<Note />} />
                    <Route path="/notification" element={<Notification />} />
                  </Routes>
              </div>
          </div>
      </div>
    </>
  );
}

export default LayoutWithTab;