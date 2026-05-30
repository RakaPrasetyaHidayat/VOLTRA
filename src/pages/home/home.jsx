import styles from "./Home.module.css";
import search from "../../assets/search.svg";
import quicknotes from "../../assets/quick-notes.svg";
import todoList from "../../assets/todo-list.svg";
import filter from "../../assets/filter.svg";
import clock from "../../assets/clock.svg";
import SearchModal from "../../components/Search/Search"; // Pastikan path ini benar
import whitePlus from "../../assets/white-plus.svg";
import account from "../../assets/account.svg";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import searchModal from "../../components/Search/Search.jsx";

function Home() {
  const API = "https://voltra-be.vercel.app/api";
  const [token, setToken] = useState(localStorage.getItem("token"));

  // 1. DEKLARASIKAN STATE TERLEBIH DAHULU
  const [tasks, setTasks] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState({
    status: "All",
    priority: "All",
  });

  const [form, setForm] = useState({
    projectId: 1,
    teamId: "",
    title: "",
    deadline: "",
    assignedUserId: "",
    status: "To Do",
    priority: "Low",
  });
  // ... state yang sudah ada ...
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState(() => {
    // Ambil riwayat dari localStorage saat pertama kali load
    const saved = localStorage.getItem("searchHistory");
    return saved ? JSON.parse(saved) : [];
  });

  // Logika Filter yang diperbarui (Menambahkan pencarian berdasarkan judul)
  const filteredTasks = tasks.filter((task) => {
    const matchStatus =
      filterCriteria.status === "All" || task.status === filterCriteria.status;
    const matchPriority =
      filterCriteria.priority === "All" ||
      task.priority === filterCriteria.priority;
    const matchSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchStatus && matchPriority && matchSearch;
  });

  // Fungsi untuk menyimpan history
  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      const newHistory = [
        searchQuery,
        ...searchHistory.filter((h) => h !== searchQuery),
      ].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem("searchHistory", JSON.stringify(newHistory));
      setShowSearch(false); // Tutup popup setelah enter
    }
  };

  const getHeaders = useCallback(
    () => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }),
    [token],
  );

  const getId = (obj) => obj?.id ?? obj?._id;

  const safeFetch = async (url, options = {}) => {
    try {
      const res = await fetch(url, {
        headers: getHeaders(),
        ...options,
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.error("URL:", url);
      console.error("FETCH ERROR FULL:", err);
      console.error("OPTIONS:", options);
      return null;
    }
  };

  const fetchTasks = useCallback(async () => {
    const data = await safeFetch(`${API}/tasks`);
    if (!data) return;
    const normalized = (Array.isArray(data) ? data : []).map((t) => ({
      ...t,
      deadline: t.deadline || t.date || t.created_at || null,
    }));
    setTasks(normalized);
  }, [API]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleSubmitCreate = async () => {
    if (!form.title || !form.deadline) {
      alert("Title dan Deadline wajib diisi!");
      return;
    }

    const payload = {
      ...form,
      projectId: Number(form.projectId) || 0,
      teamId: Number(form.teamId) || 0,
      assignedUserId: Number(form.assignedUserId) || 0,
    };

    const data = await safeFetch(`${API}/tasks`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (data) {
      await fetchTasks();
      setShowCreate(false);
      setForm({
        projectId: 1,
        teamId: "",
        title: "",
        deadline: "",
        assignedUserId: "",
        status: "To Do",
        priority: "Low",
      });
    }
  };

  const handleUpdateStatus = async (task, newStatus) => {
    const id = getId(task);
    if (!id) return;

    await safeFetch(`${API}/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status: newStatus }),
    });

    fetchTasks();
  };

  const handleDelete = async (task) => {
    const id = getId(task);
    if (!id || !window.confirm("Hapus task?")) return;
    await safeFetch(`${API({ method: "DELETE" })}/tasks/${id}`, {
      method: "DELETE",
    });
    fetchTasks();
  };

  function formatDate(date) {
    if (!date) return "-";
    const d = new Date(date);
    return isNaN(d)
      ? "-"
      : d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  }

  function getStatusClass(status) {
    const s = String(status || "").toLowerCase();
    if (s.includes("done")) return styles.statusDone;
    if (s.includes("progress")) return styles.statusInProgress;
    return styles.statusToDo;
  }

  function getPriorityClass(priority) {
    const p = String(priority || "").toLowerCase();
    if (p === "high") return styles.priorityHigh;
    if (p === "medium") return styles.priorityMedium;
    return styles.priorityLow;
  }

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className={styles.mainContent}>
        {/* TOP CARDS */}
        <div className={styles.project}>
          <div className={styles.projectHeader}>
            <h1>Your Project</h1>
            <label>
              <b>Here's your overview:</b>
            </label>
          </div>
          <div className={styles.projectContent}>
            <motion.div
              className={styles.card}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <span>
                <img src={todoList} width="25" alt="" /> <h3>To-Do List</h3>
              </span>
              <div className={styles.cardItems}>
                <p>{tasks.length}</p>
                <p>
                  <b>Tasks</b>
                </p>
              </div>
            </motion.div>
            <motion.div
              className={styles.card}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <span>
                <img src={clock} width="25" alt="" /> <h3>Project Updates</h3>
              </span>
              <div className={styles.cardItems}>
                <p>-</p>
                <p>
                  <b>Ongoing</b>
                </p>
              </div>
            </motion.div>
            <motion.div
              className={styles.card}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <span>
                <img src={quicknotes} width="25" alt="" /> <h3>Quick Notes</h3>
              </span>
              <div className={styles.cardItems}>
                <p>-</p>
                <p>
                  <b>Notes</b>
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        <div className={styles.updates}>
          <div className={styles.utilities}>
            {/* Tombol Search Trigger */}
            <span
              onClick={() => setShowSearch(true)}
              style={{ cursor: "pointer" }}
            >
              <img src={search} width="25" alt="" />
              Search
            </span>

            <SearchModal 
                isOpen={showSearch} 
                onClose={() => setShowSearch(false)} 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            {/* FILTER BUTTON & MENU */}
            <div style={{ position: "relative" }}>
              <span
                onClick={() => setShowFilter(!showFilter)}
                style={{ cursor: "pointer" }}
              >
                <img src={filter} width="25" alt="" />
                Filter
              </span>
              {showFilter && (
                <div className={styles.filterMenu}>
                  <div className={styles.filterGroup}>
                    <label>Status</label>
                    <select
                      value={filterCriteria.status}
                      onChange={(e) =>
                        setFilterCriteria({
                          ...filterCriteria,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="All">All Status</option>
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                  <div className={styles.filterGroup}>
                    <label>Priority</label>
                    <select
                      value={filterCriteria.priority}
                      onChange={(e) =>
                        setFilterCriteria({
                          ...filterCriteria,
                          priority: e.target.value,
                        })
                      }
                    >
                      <option value="All">All Priority</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <button
                    onClick={() => {
                      setFilterCriteria({ status: "All", priority: "All" });
                      setShowFilter(false);
                    }}
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>

            <span
              onClick={() => setShowCreate(true)}
              style={{ cursor: "pointer" }}
            >
              <img src={whitePlus} alt="" />
              New Task
            </span>
          </div>

          {/* TABLE - MENGGUNAKAN filteredTasks */}
          <div
            className={styles.updatesContent}
            style={{ gridTemplateColumns: "2fr 1.2fr 1fr 1fr 1.2fr 1fr" }}
          >
            <div>
              <b>Title</b>
            </div>
            <div>
              <b>Deadline</b>
            </div>
            <div>
              <b>Team</b>
            </div>
            <div>
              <b>People</b>
            </div>
            <div>
              <b>Status</b>
            </div>
            <div>
              <b>Priority</b>
            </div>

            {filteredTasks.map((task, index) => (
              <motion.div
                key={getId(task)}
                style={{ display: "contents" }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onDoubleClick={() => handleDelete(task)}
              >
                <div
                  key={getId(task)}
                  style={{ display: "contents" }}
                  onDoubleClick={() => handleDelete(task)}
                >
                  <div className={styles.firstColumn}>
                    <b>{task.title}</b>
                  </div>
                  <div className={styles.updatesMainContent}>
                    {formatDate(task.deadline)}
                  </div>
                  <div className={styles.updatesMainContent}>
                    {task.teamId || "-"}
                  </div>
                  <div className={styles.updatesMainContent}>
                    <img
                      src={account}
                      width="14"
                      alt=""
                      style={{ marginRight: "4px" }}
                    />
                    {task.assignedUserId || "-"}
                  </div>
                  <div className={styles.updatesMainContent}>
                    <select
                      className={`${getStatusClass(task.status)} ${styles.labelSelect}`}
                      value={task.status}
                      onChange={(e) => handleUpdateStatus(task, e.target.value)}
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                  <div className={styles.updatesMainContent}>
                    <div
                      className={`${getPriorityClass(task.priority)} ${styles.label}`}
                    >
                      {task.priority}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* POPUP CREATE TASK WITH LABELS */}
          {showCreate && (
            <motion.div className={styles.popupOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div className={styles.popup} style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '350px' }} initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                <h3>Create New Task</h3>
                <div className={styles.formGroup}>
                  <label>
                    <b>Task Title *</b>
                  </label>
                  <input
                    placeholder="Enter title"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>
                    <b>Deadline *</b>
                  </label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) =>
                      setForm({ ...form, deadline: e.target.value })
                    }
                  />
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <div className={styles.formGroup} style={{ flex: 1 }}>
                    <label>
                      <b>Team ID</b>
                    </label>
                    <input
                      placeholder="0"
                      type="number"
                      value={form.teamId}
                      onChange={(e) =>
                        setForm({ ...form, teamId: e.target.value })
                      }
                    />
                  </div>
                  <div className={styles.formGroup} style={{ flex: 1 }}>
                    <label>
                      <b>Assignee ID</b>
                    </label>
                    <input
                      placeholder="0"
                      type="number"
                      value={form.assignedUserId}
                      onChange={(e) =>
                        setForm({ ...form, assignedUserId: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <div className={styles.formGroup} style={{ flex: 1 }}>
                    <label>
                      <b>Status</b>
                    </label>
                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm({ ...form, status: e.target.value })
                      }
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                  <div className={styles.formGroup} style={{ flex: 1 }}>
                    <label>
                      <b>Priority</b>
                    </label>
                    <select
                      value={form.priority}
                      onChange={(e) =>
                        setForm({ ...form, priority: e.target.value })
                      }
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
                <div className={styles.buttonContainer}>
                  <button
                    className={styles.saveButton}
                    onClick={handleSubmitCreate}
                  >
                    Create
                  </button>
                  <button
                    className={styles.cancelButton}
                    onClick={() => setShowCreate(false)}
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default Home;
