import iconPic from "../assets/logo.png";
import "../style/IconText.css"
function IconText() {
  return (
    <div className="icon">
      <img
        id= "img"
        src={iconPic}
        alt="Icon VOLTRA"
        width={25}
        height={25}
      />
      <h2>VOLTRA</h2>
    </div>
  );
}

export default IconText;
