import { Link } from "react-router-dom";
import Nav from "../../components/Navbar/Navbar.jsx";
import styles from "./Home.module.css";
import Header from "../../components/Header/Header.jsx";

function Home() {
    return(
        <div className={styles.container}>
            <Header />  
            <Nav />
        </div>
    )
}

export default Home;