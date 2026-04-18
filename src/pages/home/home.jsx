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
    title: "New Task",
    date: "7/7/2026",
    name: "User",
    status: "To Do",
    priority: "Medium",
    category: "Frontend"
  };

  setTasks([...tasks, newTask]);
}
    const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Teks",
      date: "6/7/2026",
      name: "Name",
      status: "Done",
      priority: "Low",
      category: "UIUX"
    }
  ]);
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
                    <span onClick={handleCreateTask} style={{cursor: "pointer"}}><img src={whitePlus} />New</span>
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
  <>
    <div className={styles.firtColumn}>
      <label><b>{task.title}</b></label>
    </div>

    <div className={styles.updatesMainContent}>
      <label>{task.date}</label>
    </div>

    <div className={styles.updatesMainContent}>
      <img src={account} width="25px" />
      <label><b>{task.name}</b></label>
    </div>

    <div className={styles.updatesMainContent}>
      <div className={styles.statusToDo}>
        <b>{task.status}</b>
      </div>
    </div>

    <div className={styles.updatesMainContent}>
      <div className={styles.priorityMedium}>
        <b>{task.priority}</b>
      </div>
    </div>

    <div className={styles.lastColumn}>
      <div className={styles.frontendCategory}>
        <img src={frontend} width="20px" />
        <b>{task.category}</b>
      </div>
    </div>
  </>
))}
                </div>  
          </div>
        </div>   
    </div>
)
}

export default Home;