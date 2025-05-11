import { Component } from "react";
import './index.css';


class NavBar extends Component {
    render() {
        return (
            <div className="nav_bar">
                <p>Yogeshwaran</p>
                <button className="dashboard_button" type="button">Dashboard</button>
                <button className="loan_button" type="button">Loans</button>
            </div>
        );
    }
}


export default NavBar;