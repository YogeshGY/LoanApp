import { Component } from "react";
import cookies from "js-cookie";
import { FaBell } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import withRouter from "../../WithRouter"; 
import "./index.css";

class Header extends Component {
    state = {
        role: cookies.get("role"),
    };

    onChangeRole = (e) => {
        const selectedRole = e.target.value;
        const currentRole = cookies.get("role");
        const { navigate } = this.props;

        if (selectedRole !== currentRole) {
            this.setState({ role: selectedRole });
            cookies.remove("role");
            cookies.remove("token");
            navigate("/login", { replace: true });
            window.location.reload();
        } else {
            this.setState({ role: selectedRole });
        }
    };

    render() {
        return (
            <div className="header-container">
                <h1 className="header_name">CREDIT APP</h1>
                <div className="header-menu">
                    <div><p>Home</p></div>
                    <div><p>Payment</p></div>
                    <div><p>Budget</p></div>
                    <div><p>Card</p></div>
                </div>
                <div className="header-icons_container">
                    <FaBell />
                    <AiFillMessage />
                    <CgProfile />
                    <select value={this.state.role} onChange={this.onChangeRole}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="verifier">Verifier</option>
                        <option value="Logout">Logout</option>
                    </select>
                </div>
            </div>
        );
    }
}

export default withRouter(Header);
