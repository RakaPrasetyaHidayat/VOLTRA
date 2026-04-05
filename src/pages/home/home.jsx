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
function Home() {
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
                    <span><img src={whitePlus} alt="New" style={{width: "25px"}}/>New</span>
                </div>
                <div id={styles.updatesContent}>
                    {/*Table Header*/}
                        <div><label><b>Idea</b></label></div>
                        <div><label><b>DD/MM/YY</b></label></div>
                        <div><label><b>People</b></label></div>
                        <div><label><b>Status</b></label></div>
                        <div><label><b>Priority</b></label></div>
                        <div><label><b>Category</b></label></div>
                   {/*Table Content
                        Row 1
                    */}
                        <div className={styles.firtColumn}><label><b>Teks</b></label></div>
                        <div className={styles.updatesMainContent}><label>6/7/2026</label></div>
                        <div className={styles.updatesMainContent}><img src={account} alt="Account" width={"25px"}/><label><b>Name</b></label></div>
                        <div className={styles.updatesMainContent}><div className={styles.statusDone}><b>Done</b></div></div>
                        <div className={styles.updatesMainContent}><div className={styles.priorityLow}><b>Low</b></div></div>
                        <div className={styles.lastColumn}><div className={styles.UIUXCategory}><img src={UIUX} alt="UI/UX" width={"20px"}/><b>UI/UX</b></div></div>
                    {/* Row 2 */}
                        <div className={styles.firtColumn}><label><b>Teks</b></label></div>
                        <div className={styles.updatesMainContent}><label>6/7/2026</label></div>
                        <div className={styles.updatesMainContent}><img src={account} alt="Account" width={"25px"}/><label><b>Name</b></label></div>
                        <div className={styles.updatesMainContent}><div className={styles.statusToDo}><b>To Do</b></div></div>
                        <div className={styles.updatesMainContent}><div className={styles.priorityMedium}><b>Medium</b></div></div>
                        <div className={styles.lastColumn}><div className={styles.frontendCategory}><img src={frontend} alt="Frontend" width={"20px"}/><b>Frontend</b></div></div>
                    {/* Row 3 */}
                        <div className={styles.firtColumn}><label><b>Teks</b></label></div>
                        <div className={styles.updatesMainContent}><label>6/7/2026</label></div>
                        <div className={styles.updatesMainContent}><img src={account} alt="Account" width={"25px"}/><label><b>Name</b></label></div>
                        <div className={styles.updatesMainContent}><div className={styles.statusInProgress}><b>In Progress</b></div></div>
                        <div className={styles.updatesMainContent}><div className={styles.priorityHigh}><b>High</b></div></div>
                        <div className={styles.lastColumn}><div className={styles.backendCategory}><img src={backend} alt="Backend" width={"20px"}/><b>Backend</b></div></div>
                    {/* Row 4 */}
                        <div className={styles.firtColumn}><label><b>Teks</b></label></div>
                        <div className={styles.updatesMainContent}><label>6/7/2026</label></div>
                        <div className={styles.updatesMainContent}><img src={account} alt="Account" width={"25px"}/><label><b>Name</b></label></div>
                        <div className={styles.updatesMainContent}><div className={styles.statusToDo}><b>To Do</b></div></div>
                        <div className={styles.updatesMainContent}><div className={styles.priorityMedium}><b>Medium</b></div></div>
                        <div className={styles.lastColumn}><div className={styles.frontendCategory}><img src={frontend} alt="Frontend" width={"20px"}/><b>Frontend</b></div></div>
                    {/* Row 5 */}
                        <div className={styles.firtColumn}><label><b>Teks</b></label></div>
                        <div className={styles.updatesMainContent}><label>6/7/2026</label></div>
                        <div className={styles.updatesMainContent}><img src={account} alt="Account" width={"25px"}/><label><b>Name</b></label></div>
                        <div className={styles.updatesMainContent}><div className={styles.statusDone}><b>Done</b></div></div>
                        <div className={styles.updatesMainContent}><div className={styles.priorityLow}><b>Low</b></div></div>
                        <div className={styles.lastColumn}><div className={styles.UIUXCategory}><img src={UIUX} alt="UI/UX" width={"20px"}/><b>UI/UX</b></div></div>
                </div>  
          </div>
        </div>   
    </div>
)
}

export default Home;