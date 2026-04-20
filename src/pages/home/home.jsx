import styles from "./Home.module.css";
import search from "../../assets/search.svg";
import quicknotes from "../../assets/quick-notes.svg";
import clock from "../../assets/clock.svg";
import todoList from "../../assets/todo-list.svg";
import filter from "../../assets/filter.svg";
import whitePlus from "../../assets/white-plus.svg";
import account from "../../assets/account.svg";
import backend from "../../assets/backend.svg";
import frontend from "../../assets/frontend.svg";
import UIUX from "../../assets/UIUX.svg";
import { useState } from "react";
function Home() {
    function handleCreateTask() {
      const newTask = {
        id: Date.now(),
        title: "Task",
        date: "2026-07-07",
        name: "User",
        status: "To Do",
        priority: "High",
        category: "Frontend"
      };

      setTasks([...tasks, newTask]);
    }
    function getCategoryIcon(category) {
      if (category === "Frontend") return frontend;
      if (category === "Backend") return backend;
      if (category === "UI/UX") return UIUX;
    }
    function getStatusClass(status) {
      if (status === "Done") return styles.statusDone;
      return styles.statusToDo;
    }

    function getPriorityClass(priority) {
      if (priority === "High") return styles.priorityHigh;
      if (priority === "Medium") return styles.priorityMedium;
      return styles.priorityLow;
    }

    function getCategoryClass(category) {
      if (category === "Frontend") return styles.frontendCategory;
      if (category === "Backend") return styles.backendCategory;
      if (category === "UI/UX") return styles.uiuxCategory;
    }

    function formatDate(date) {
      const d = new Date(date);
      return d.toLocaleDateString(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    }

    const [tasks, setTasks] = useState([
      {
        id: 1,
        title: "Task",
        date: "2026-07-07",
        name: "User",
        status: "Done",
        priority: "High",
        category: "Frontend"
      }
    ]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
return (

    <div className={styles.container}>
        <div id={styles.mainContent}>
          <div id={styles.project}>
            <div id={styles.projectHeader}>
              <h1>Your Project</h1>
              <label><b>Here's your overview:</b></label>
            </div>
            <div id={styles.projectContent}>
                <div id={styles.card}>
                    <span>
                    <img src={todoList} alt="Todo List" style={{width: "25px"}}/>
                    <h3>To-Do List</h3>
                    </span>
                    <div id={styles.cardItems}>
                       <p>12</p><p><b>Tasks Pending</b></p>
                    </div>
                </div>
                 <div id={styles.card}>
                    <span>
                    <img src={clock} alt="clock" style={{width: "25px"}}/>
                    <h3>Project Updates</h3>
                    </span>
                    <div id={styles.cardItems}>
                       <p>5</p><p><b>Ongoing Project</b></p>
                    </div>
                </div>
                 <div id={styles.card}>
                    <span>
                    <img src={quicknotes} alt="Quick Notes" style={{width: "25px"}}/>
                    <h3>Quick Notes</h3>
                    </span>
                    <div id={styles.cardItems}>
                       <p>3</p><p><b>New Notes</b></p>
                    </div>
                </div>
            </div>
          </div>
          <div id={styles.updates}>
                <div id={styles.utilities}>
                    <span><img src={search} alt="Search" style={{width: "25px"}}/>Search</span>
                    <span><img src={filter} alt="Filter" style={{width: "25px"}}/>Filter</span>
                    <span onClick={handleCreateTask} style={{cursor: "pointer"}}><img src={whitePlus} alt="Create Task"/>New</span>
                </div>
                <div id={styles.updatesContent}>
                    {/*Table Header*/}
                   
                        <div><label><b>Task Title</b></label></div>
                        <div><label><b>Deadline</b></label></div>
                        <div><label><b>People</b></label></div>
                        <div><label><b>Status</b></label></div>
                        <div><label><b>Priority</b></label></div>
                        <div><label><b>Category</b></label></div>
                        {tasks.map((task) => (
  <div
    key={task.id}
    onContextMenu={(e) => {
      e.preventDefault();
      setSelectedTask(task);
      setShowPopup(true);
    }}
    style={{ display: "contents" }}
  >
    <div className={styles.firtColumn}>
      <label><b>{task.title}</b></label>
    </div>

    <div className={styles.updatesMainContent}>
      <label>{formatDate(task.date)}</label>
    </div>

    <div className={styles.updatesMainContent}>
      <img src={account} width="25px" alt="Account Icon"/>
      <label><b>{task.name}</b></label>
    </div>

    <div className={styles.updatesMainContent}>
      <div className={getStatusClass(task.status)}>
        <b>{task.status}</b>
      </div>
    </div>

    <div className={styles.updatesMainContent}>
      <div className={getPriorityClass(task.priority)}>
        <b>{task.priority}</b>
      </div>
    </div>

    <div className={styles.lastColumn}>
      <div className={getCategoryClass(task.category)}>
        <img src={getCategoryIcon(task.category)} width="20px" alt="Category Icon" />
        <b>{task.category}</b>
      </div>
    </div>
  </div>
))}
                </div>
                {showPopup && selectedTask && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <h3>Edit Task</h3>

            <input
              type="text"
              value={selectedTask.title}
              onChange={(e) =>
                setSelectedTask({ ...selectedTask, title: e.target.value })
              }
            />

            <input
              type="date"
              value={selectedTask.date}
              onChange={(e) =>
                setSelectedTask({ ...selectedTask, date: e.target.value })
              }
            />

            <input
              type="text"
              value={selectedTask.name}
              onChange={(e) =>
                setSelectedTask({ ...selectedTask, name: e.target.value })
              }
            />

            <select
              value={selectedTask.status}
              onChange={(e) =>
                setSelectedTask({ ...selectedTask, status: e.target.value })
              }
            >
              <option>To Do</option>
              <option>Done</option>
            </select>

            <select
              value={selectedTask.priority}
              onChange={(e) =>
                setSelectedTask({ ...selectedTask, priority: e.target.value })
              }
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>

            <select
              value={selectedTask.category}
              onChange={(e) =>
                setSelectedTask({ ...selectedTask, category: e.target.value })
              }
            >
              <option>Frontend</option>
              <option>Backend</option>
              <option>UI/UX</option>
            </select>

            <button
              onClick={() => {
                setTasks(
                  tasks.map((t) =>
                    t.id === selectedTask.id ? selectedTask : t
                  )
                );
                setShowPopup(false);
              }}
            >
              Save
            </button>

            <button onClick={() => setShowPopup(false)}>Cancel</button>
          </div>
        </div>
      )}
          </div>
        </div>   
    </div>
)
}

export default Home;