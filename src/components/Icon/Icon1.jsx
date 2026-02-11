import iconPic from "../../assets/logo.png";
import styles from "./IconText1.module.css";
function IconText() {
  return (
    <div className={styles.icon}>
      <img
        id={styles.img}
        src={iconPic}
        alt="Icon VOLTRA"
      />
      <h2>VOLTRA</h2>
    </div>
  );
}

export default IconText;
