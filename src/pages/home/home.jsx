import styles from "./Home.module.css";

import searchIcon from "../../assets/search.svg";
import quicknotes from "../../assets/quick-notes.svg";
import todoList from "../../assets/todo-list.svg";
import filterIcon from "../../assets/filter.svg";
import clock from "../../assets/clock.svg";
import whitePlus from "../../assets/white-plus.svg";
import account from "../../assets/account.svg";

import SearchModal from "../../components/Search/Search";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = "https://voltra-be.vercel.app/api";

function Home() {
  const token = localStorage.getItem("token");

  const activeTeamId = localStorage.getItem("activeTeamId");

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showCreate, setShowCreate] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [filterCriteria, setFilterCriteria] = useState({
    status: "All",
    priority: "All",
  });

  const [form, setForm] = useState({
    projectId: 1,
    teamId: activeTeamId || "",
    title: "",
    deadline: "",
    assignedUserId: "",
    status: "To Do",
    priority: "Low",
  });

  const getHeaders = useCallback(() => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }), [token]);

  const fetchTasks = useCallback( async () => {
    if (!activeTeamId) {
      setTasks([]);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/task/team/${activeTeamId}`,
        {
          headers: getHeaders(),
        }
      );

      const data = await response.json();

      if (Array.isArray(data)) {
        setTasks(data);
      } else if (Array.isArray(data.data)) {
        setTasks(data.data);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error(error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
 }, [activeTeamId, getHeaders]);

 useEffect(() => {
  fetchTasks();
}, [activeTeamId, fetchTasks]);

  const filteredTasks = tasks.filter((task) => {
    const matchStatus =
      filterCriteria.status === "All" ||
      task.status === filterCriteria.status;

    const matchPriority =
      filterCriteria.priority === "All" ||
      task.priority === filterCriteria.priority;

    const matchSearch =
      task.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    return matchStatus && matchPriority && matchSearch;
  });

  const handleCreateTask = async () => {
    if (!activeTeamId) {
      alert("Buat atau pilih Team terlebih dahulu.");
      return;
    }

    if (!form.title || !form.deadline) {
      alert("Title dan deadline wajib diisi.");
      return;
    }

    try {
      const payload = {
        ...form,
        teamId: Number(activeTeamId),
        projectId: Number(form.projectId),
        assignedUserId: Number(form.assignedUserId) || 0,
      };

      const response = await fetch(`${API_URL}/task`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Create task failed");
      }

      await fetchTasks();

      setShowCreate(false);

      setForm({
        projectId: 1,
        teamId: activeTeamId,
        title: "",
        deadline: "",
        assignedUserId: "",
        status: "To Do",
        priority: "Low",
      });
    } catch (error) {
      console.error(error);
      alert("Gagal membuat task");
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      await fetch(`${API_URL}/task/${task.id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({
          ...task,
          status: newStatus,
        }),
      });

      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTask = async (task) => {
    const confirmDelete = window.confirm(
      `Hapus task "${task.title}" ?`
    );

    if (!confirmDelete) return;

    try {
      await fetch(`${API_URL}/task/${task.id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Done":
        return styles.statusDone;

      case "In Progress":
        return styles.statusInProgress;

      default:
        return styles.statusToDo;
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "High":
        return styles.priorityHigh;

      case "Medium":
        return styles.priorityMedium;

      default:
        return styles.priorityLow;
    }
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className={styles.mainContent}>
        {/* CARDS */}

        <div className={styles.project}>
          <div className={styles.projectHeader}>
            <h1>Your Project</h1>
            <label>Here's your overview:</label>
          </div>

          <div className={styles.projectContent}>
            <div className={styles.card}>
              <span>
                <img src={todoList} width="25" alt="To-do List" />
                <h3>To-Do List</h3>
              </span>

              <div className={styles.cardItems}>
                <p>{tasks.length}</p>
                <p>
                  <b>Tasks</b>
                </p>
              </div>
            </div>

            <div className={styles.card}>
              <span>
                <img src={clock} width="25" alt="To-do List" />
                <h3>Project Updates</h3>
              </span>

              <div className={styles.cardItems}>
                <p>
                  {
                    tasks.filter(
                      (t) => t.status === "In Progress"
                    ).length
                  }
                </p>

                <p>
                  <b>Ongoing</b>
                </p>
              </div>
            </div>

            <div className={styles.card}>
              <span>
                <img src={quicknotes} width="25" alt="Quick Notes"  />
                <h3>Quick Notes</h3>
              </span>

              <div className={styles.cardItems}>
                <p>-</p>
                <p>
                  <b>Notes</b>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ACTIONS */}

        <div className={styles.updates}>
          <div className={styles.utilities}>
            <span onClick={() => setShowSearch(true)}>
              <img src={searchIcon} width="25" alt="Search"  />
              Search
            </span>

            <span onClick={() => setShowFilter(!showFilter)}>
              <img src={filterIcon} width="25" alt="Filter"  />
              Filter
            </span>

            <span onClick={() => setShowCreate(true)}>
              <img src={whitePlus}  alt="New Task" />
              New Task
            </span>
          </div>

          <SearchModal
            isOpen={showSearch}
            onClose={() => setShowSearch(false)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {/* FILTER */}

          {showFilter && (
            <div className={styles.filterMenu}>
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
                <option value="In Progress">
                  In Progress
                </option>
                <option value="Done">Done</option>
              </select>

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
          )}

          {/* TABLE */}

          {loading ? (
            <div className={styles.emptyState}>
              <h3>Loading...</h3>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No Tasks</h3>
              <p>Create a Team then create your first task.</p>
            </div>
          ) : (
            <div className={styles.updatesContent}>
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  style={{ display: "contents" }}
                  onDoubleClick={() =>
                    handleDeleteTask(task)
                  }
                >
                  <div className={styles.firstColumn}>
                    {task.title}
                  </div>

                  <div className={styles.updatesMainContent}>
                    {task.deadline}
                  </div>

                  <div className={styles.updatesMainContent}>
                    {task.teamId}
                  </div>

                  <div className={styles.updatesMainContent}>
                    <img
                      src={account}
                      width="15"
                      alt="account" 
                    />
                    {task.assignedUserId}
                  </div>

                  <div className={styles.updatesMainContent}>
                    <select
                      value={task.status}
                      className={`${getStatusClass(task.status)} ${styles.labelSelect}`}
                      onChange={(e) =>
                        handleStatusChange(
                          task,
                          e.target.value
                        )
                      }
                    >
                      <option>To Do</option>
                      <option>In Progress</option>
                      <option>Done</option>
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
              ))}
            </div>
          )}
        </div>

        {/* CREATE TASK MODAL */}

        <AnimatePresence>
          {showCreate && (
            <div className={styles.popupOverlay}>
              <div className={styles.popup}>
                <h3>Create Task</h3>

                <input
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                />

                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      deadline: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Assigned User ID"
                  value={form.assignedUserId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      assignedUserId:
                        e.target.value,
                    })
                  }
                />

                <select
                  value={form.priority}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      priority: e.target.value,
                    })
                  }
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>

                <div className={styles.buttonContainer}>
                  <button
                    className={styles.saveButton}
                    onClick={handleCreateTask}
                  >
                    Create
                  </button>

                  <button
                    className={styles.cancelButton}
                    onClick={() =>
                      setShowCreate(false)
                    }
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default Home;