import iconPic from "../assets/logo.png";
import "../style/IconText.css"
function IconText() {
  return (
    <div className="icon">
      <img
        id= "img"
        src={iconPic}
        alt="Icon VOLTRA"
      />
      <h2>VOLTRA</h2>
    </div>
  );
}

export default IconText;
