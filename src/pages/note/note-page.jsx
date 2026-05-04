import { useState, useEffect, useCallback } from "react";
import styles from "./Note.module.css";
import search from "../../assets/search.svg";
import whitePlus from "../../assets/white-plus.svg";

function Note() {
  const [notes, setNotes] = useState([]);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = "https://voltra-be.vercel.app/api/notes";
  const token = localStorage.getItem("token");

  // ================= HELPER =================
  const getNoteId = (note) => note?.id || note?._id;

  const getHeaders = useCallback(() => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }), [token]);

  // ================= FETCH =================
  const fetchNotes = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "GET",
        headers: getHeaders(),
      });

      const text = await res.text();
      console.log("FETCH RESPONSE:", text);

      if (!res.ok) throw new Error("Fetch gagal");

      const data = JSON.parse(text);
      setNotes(Array.isArray(data) ? data : data?.notes || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [token, getHeaders]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // ================= ADD =================
  const handleAddNote = async () => {
    if (!token) return alert("Login dulu!");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          description: "Catatan baru",
        }),
      });

      const text = await res.text();
      console.log("ADD RESPONSE:", text);

      if (!res.ok) throw new Error("Gagal tambah");

      const data = JSON.parse(text);
      setNotes((prev) => [...prev, data]);
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  // ================= UPDATE =================
  const handleSave = async (e) => {
    e.preventDefault();

    const id = getNoteId(editData);
    if (!id) return alert("ID tidak valid!");

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({
          description: editData.description,
        }),
      });

      const text = await res.text();
      console.log("UPDATE RESPONSE:", text);

      if (!res.ok) throw new Error("Gagal update");

      setNotes((prev) =>
        prev.map((n) =>
          getNoteId(n) === id ? { ...n, description: editData.description } : n
        )
      );

      setEditData(null);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (note) => {
    const id = getNoteId(note);
    if (!id) return;

    if (!window.confirm("Hapus note ini?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      const text = await res.text();
      console.log("DELETE RESPONSE:", text);

      if (!res.ok) throw new Error("Gagal delete");

      setNotes((prev) => prev.filter((n) => getNoteId(n) !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // ================= UI =================
  const handleRightClick = (e, note) => {
    e.preventDefault();
    setEditData(note);
  };

  return (
    <div className={styles.container}>
      {/* MODAL */}
      {editData && (
        <div className={styles.modalOverlay}>
          <form onSubmit={handleSave} className={styles.modal}>
            <h2>Edit Note</h2>

            <textarea
              value={editData.description}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  description: e.target.value,
                })
              }
            />

            <div className={styles.modalActions}>
              <button type="submit">Simpan</button>
              <button type="button" onClick={() => setEditData(null)}>
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.mainContent}>
        <div id={styles.notes}>
          <div id={styles.notesHead}>
            <h1>All Notes</h1>

            <div id={styles.notesHeadItem}>
              <img src={search} alt="search" />
              <span>Search</span>

              <img
                src={whitePlus}
                alt="add"
                onClick={handleAddNote}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>

          <div id={styles.notesItem}>
            {loading ? (
              <p>Loading...</p>
            ) : notes.length > 0 ? (
              notes.map((note) => (
                <div
                  key={getNoteId(note)}
                  className={styles.item}
                  onContextMenu={(e) => handleRightClick(e, note)}
                  onDoubleClick={() => handleDelete(note)}
                >
                  <p>{note.description}</p>
                  <small>{note.date || "-"}</small>
                </div>
              ))
            ) : (
              <p>Belum ada catatan</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Note;