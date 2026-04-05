import styles from "./Note.module.css";
import search from "../../assets/search.svg";
import whitePlus from "../../assets/white-plus.svg";

function Note() {
    return (
        <div className={styles.container}>
            <div className={styles.mainContent}>
                <div id={styles.notes}>
                    <div id={styles.notesHead}>
                        <h1>All Notes:</h1>
                        <div id={styles.notesHeadItem}><img src={search} alt="Search" />Search<img src={whitePlus} alt="Create" /></div>
                    </div>
                    <div id={styles.notesItem}>
                        <div className={styles.item}><h2>Judul:</h2>
                            <div>
                                <p>Kategori: </p>
                                <p>6/7/2067</p>
                            </div>
                        </div>
                        <div className={styles.item}><h2>Judul:</h2>
                            <div>
                                <p>Kategori: </p>
                                <p>6/7/2067</p>
                            </div>
                        </div>
                        <div className={styles.item}><h2>Judul:</h2>
                            <div>
                                <p>Kategori: </p>
                                <p>6/7/2067</p>
                            </div>
                        </div>
                        <div className={styles.item}><h2>Judul:</h2>
                            <div>
                                <p>Kategori: </p>
                                <p>6/7/2067</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
}

export default Note;