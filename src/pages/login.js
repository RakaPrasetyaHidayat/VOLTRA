import IconText from "../components/Icon.js";
import "../style/Login.css";
function Login() {
    return(
        <>
        <div>
            <div id="tengah"><IconText /></div>
            <div class="container">
            <div id="box1">
                <h1 class="title">Welcome back!</h1>
                <p class="subtitle">Please enter your account to continue...</p>
            </div>
            </div>
        </div>
        </>
    )
}



export default Login;