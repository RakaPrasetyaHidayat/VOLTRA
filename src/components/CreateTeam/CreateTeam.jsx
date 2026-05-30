import { useState, useEffect } from "react";
import styles from "./CreateTeam.module.css"; // Path styling komponen ini
import exitIcon from "../../assets/exit.svg"; // Path icon exit, sesuaikan dengan struktur folder Anda

function CreateTeamModal({ isOpen, onClose, onSubmit }) {
  const [teamType, setTeamType] = useState("Private");
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");

  // Logika exit menggunakan tombol Escape (Esc)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!teamName.trim()) {
      alert("Team Name wajib diisi!");
      return;
    }
    
    // Kirim data ke fungsi onSubmit milik parent component
    onSubmit({
      type: teamType,
      name: teamName,
      description: description,
    });

    // Reset form & tutup modal setelah submit
    setTeamName("");
    setDescription("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
        
        {/* BARIS ATAS: Tombol Exit Kiri & Judul/Dropdown Kanan */}
        <div className={styles.headerRow}>
          <img 
            src={exitIcon} 
            width="20" 
            alt="Close" 
            className={styles.exitButton} 
            onClick={onClose} 
          />
          <div className={styles.titleWrapper}>
            <span className={styles.headerText}>Create New </span>
            <select 
              value={teamType} 
              onChange={(e) => setTeamType(e.target.value)}
              className={styles.dropdownType}
            >
              <option value="Private">Private</option>
              <option value="Team">Team</option>
            </select>
          </div>
        </div>

        {/* FORM UTAMA */}
        <form onSubmit={handleSubmit} className={styles.formBody}>
          <div className={styles.formGroup}>
            <label htmlFor="teamName"><b>Team Name</b></label>
            <input
              id="teamName"
              type="text"
              placeholder="Enter team name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className={styles.inputField}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="desc"><b>Project Description</b></label>
            <textarea
              id="desc"
              rows="4"
              placeholder="Enter project description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.textareaField}
            />
          </div>

          {/* TOMBOL CREATE DI TENGAH BAWAH */}
          <div className={styles.buttonWrapper}>
            <button type="submit" className={styles.submitButton}>
              Create
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default CreateTeamModal;