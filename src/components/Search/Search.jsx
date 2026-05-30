import { useState, useEffect } from "react";
import styles from "./Search.module.css"; // Sesuaikan path styling Anda
import searchIcon from "../../assets/search.svg";
import exit from "../../assets/exit.svg";
import clockIcon from "../../assets/clock.svg";

function SearchModal({ isOpen, onClose, searchQuery, setSearchQuery }) {
  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem("searchHistory");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    // Cleanup listener saat komponen unmount atau tertutup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      const newHistory = [searchQuery, ...searchHistory.filter(h => h !== searchQuery)].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem("searchHistory", JSON.stringify(newHistory));
      onClose(); // Tutup popup setelah enter
    }
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
  };

  // Jika modal tidak aktif, jangan render apapun
  if (!isOpen) return null;

  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      <div className={styles.searchPopup} onClick={(e) => e.stopPropagation()}>
        <div className={styles.searchBarWrapper}>
          <img src={searchIcon} width="20" alt="Search" />
          <input
            autoFocus
            className={styles.searchInput}
            placeholder="Cari judul task..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
          />
          <img 
            src={exit} 
            width="20" 
            alt="Close" 
            className={styles.exitButton} 
            onClick={onClose} 
            style={{ cursor: 'pointer' }} 
          />
        </div>
        
        {searchHistory.length > 0 && (
          <div className={styles.historySection}>
            <p className={styles.historyTitle}>Riwayat Pencarian</p>
            <div className={styles.historyList}>
              {searchHistory.map((item, index) => (
                <div 
                  key={index} 
                  className={styles.historyItem}
                  onClick={() => { 
                    setSearchQuery(item); 
                    onClose(); 
                  }}
                >
                  <img src={clockIcon} width="14" alt="History" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <button className={styles.clearHistory} onClick={handleClearHistory}>
              Hapus Riwayat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchModal;