import { useState } from "react";
import styles from "./Note.module.css";
import search from "../../assets/search.svg";
import whitePlus from "../../assets/white-plus.svg";

function Note() {
    const [notes, setNotes] = useState([
        { 
            id: 1, 
            title: "Belajar React", 
            desc: "Pelajari cara kerja useState dan props.", 
            category: "Coding", 
            date: "6/7/2067" 
        }
    ]);

    const [editData, setEditData] = useState(null);

    const handleAddNote = () => {
        const newNote = {
            id: Date.now(),
            title: "Judul Baru",
            desc: "Deskripsi baru...",
            category: "Umum",
            date: new Date().toLocaleDateString()
        };
        setNotes([...notes, newNote]);
    };

    const handleRightClick = (e, note) => {
        e.preventDefault();
        setEditData(note);
    };

    const handleSave = (e) => {
        e.preventDefault();
        setNotes(notes.map(n => n.id === editData.id ? editData : n));
        setEditData(null);
    };

    return (
        <div className={styles.container}>
            {/* FORM EDIT DENGAN LABEL */}
            {editData && (
                <div style={modalOverlayStyle}>
                    <form onSubmit={handleSave} style={modalStyle}>
                        <h2 style={{ marginBottom: "10px" }}>Edit Note</h2>
                        
                        <label style={labelStyle}>Judul Note:</label>
                        <input 
                            style={inputStyle}
                            type="text" 
                            value={editData.title} 
                            onChange={(e) => setEditData({...editData, title: e.target.value})} 
                        />

                        <label style={labelStyle}>Deskripsi:</label>
                        <textarea 
                            style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
                            value={editData.desc} 
                            onChange={(e) => setEditData({...editData, desc: e.target.value})} 
                        />

                        <label style={labelStyle}>Kategori:</label>
                        <input 
                            style={inputStyle}
                            type="text" 
                            value={editData.category} 
                            onChange={(e) => setEditData({...editData, category: e.target.value})} 
                        />

                        <label style={labelStyle}>Tanggal:</label>
                        <input 
                            style={inputStyle}
                            type="text" 
                            value={editData.date} 
                            onChange={(e) => setEditData({...editData, date: e.target.value})} 
                        />

                        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                            <button type="submit" style={btnSaveStyle}>Simpan</button>
                            <button type="button" onClick={() => setEditData(null)} style={btnCancelStyle}>Batal</button>
                        </div>
                    </form>
                </div>
            )}

            <div className={styles.mainContent}>
                <div id={styles.notes}>
                    <div id={styles.notesHead}>
                        <h1>All Notes:</h1>
                        <div id={styles.notesHeadItem}>
                            <img src={search} alt="Search" />
                            Search
                            <img 
                                src={whitePlus} 
                                alt="Create" 
                                onClick={handleAddNote} 
                                style={{ cursor: "pointer" }} 
                            />
                        </div>
                    </div>

                    <div id={styles.notesItem}>
                        {notes.map((note) => (
                            <div 
                                key={note.id} 
                                className={styles.item}
                                onContextMenu={(e) => handleRightClick(e, note)}
                            >
                                <h2>{note.title}:</h2>
                                <p style={{ marginTop: "10px", color: "#ccc", fontSize: "0.9rem" }}>
                                    {note.desc}
                                </p>
                                <div>
                                    <p>Kategori: {note.category}</p>
                                    <p>{note.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Styling tambahan untuk elemen Form (Inline agar mudah dicoba)
const modalOverlayStyle = {
    position: "fixed",
    top: 0, left: 0, width: "100%", height: "100%",
    backgroundColor: "rgba(0,0,0,0.8)",
    display: "flex", justifyContent: "center", alignItems: "center",
    zIndex: 1000
};

const modalStyle = {
    backgroundColor: "#0F172A",
    padding: "25px",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    width: "350px",
    color: "white",
    boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
};

const labelStyle = {
    fontSize: "0.85rem",
    marginBottom: "5px",
    marginTop: "10px",
    color: "#ffffff"
};

const inputStyle = {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ffffff",
    backgroundColor: "#ffffff",
    color: "black",
    outline: "none"
};

const btnSaveStyle = {
    flex: 1,
    padding: "10px",
    backgroundColor: "#0000FF",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold"
};

const btnCancelStyle = {
    flex: 1,
    padding: "10px",
    backgroundColor: "#FF0000",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold"
};

export default Note;