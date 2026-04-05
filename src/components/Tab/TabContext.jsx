import { createContext, useContext, useState } from "react";
import home from "../../assets/home.svg";

const TabContext = createContext();

export const TabProvider = ({ children }) => {
  const [tabs, setTabs] = useState([
    { id: 1, name: "Home", icon: home }
  ]);

  const [activeTab, setActiveTab] = useState(1);

  const addTab = (name, icon) => {
  const existing = tabs.find(tab => tab.name === name);

  let updatedTabs = [...tabs];
  let active;

  if (existing) {
    active = existing;
  } else {
    active = {
      id: Date.now(),
      name,
      icon
    };
    updatedTabs.push(active);
  }

  const homeTab = updatedTabs.find(tab => tab.name === "Home");

  // 🔥 FIX: kalau Home, jangan duplikasi
  if (active.name === "Home") {
    const otherTabs = updatedTabs.filter(tab => tab.name !== "Home");
    setTabs([homeTab, ...otherTabs]);
    setActiveTab(homeTab.id);
    return;
  }

  const otherTabs = updatedTabs.filter(
    tab => tab.name !== "Home" && tab.id !== active.id
  );

  setTabs([homeTab, active, ...otherTabs]);
  setActiveTab(active.id);
  };

  const closeTab = (id) => {
    if (id === tabs[0].id) return; // Home aman

    const filtered = tabs.filter(tab => tab.id !== id);
    setTabs(filtered);

    if (id === activeTab) {
      setActiveTab(tabs[0].id);
    }
  };

  return (
    <TabContext.Provider value={{
      tabs,
      activeTab,
      addTab,
      closeTab,
      setActiveTab,
      setTabs
    }}>
      {children}
    </TabContext.Provider>
  );
};

export const useTab = () => useContext(TabContext);