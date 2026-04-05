import { useTab } from "./TabContext";
import { useNavigate } from "react-router-dom";
import styles from "./Tab.module.css";
import exit from "../../assets/exit.svg";
function Tab() {
  const { tabs, activeTab, closeTab, setActiveTab, setTabs } = useTab();
  const navigate = useNavigate();

  const routeMap = {
    Home: "/home",
    Notes: "/note",
    Task: "/task",
    Notification: "/notification"
  };

 const switchTab = (tab) => {
  // 🔥 kalau Home → cukup navigate
  if (tab.name === "Home") {
    setActiveTab(tab.id);
    navigate(routeMap[tab.name]);
    return;
  }

  setActiveTab(tab.id);

  const homeTab = tabs.find(t => t.name === "Home");
  const otherTabs = tabs.filter(t => t.name !== "Home" && t.id !== tab.id);

  setTabs([homeTab, tab, ...otherTabs]);

  navigate(routeMap[tab.name]);
  };

  return (
    <div id={styles.pages}>
    <ul>
      {tabs.map((tab) => (
        <li
          key={tab.id}
          onClick={() => switchTab(tab)}
          className={`
          ${styles.tabItem}
          ${tab.name === "Home" ? styles.homeTab : ""}
          ${tab.id === activeTab ? styles.activeTab : ""}
          `}
        >
          <span 
            className={`
            ${styles.tabContent}
            ${tab.id !== activeTab && tab.name !== "Home" ? styles.anotherTab : ""}
            `}>
            <img src={tab.icon} style={{ width: "20px" }} alt="Icon"/>
            {tab.name}
          </span>

          {tab.name !== "Home" && (
            <img
              src={exit}
              className={tab.id !== activeTab ? styles.exitBtn : ""}
              alt="Exit"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
            />
          )}
        </li>
      ))}
    </ul>
    </div>
  );
}

export default Tab;