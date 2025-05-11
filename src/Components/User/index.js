import { Component } from "react";
import cookies from "js-cookie";
import { CgProfile } from "react-icons/cg";
import Header from "../Header";
import Popup from "../Popup";
import "./index.css";

class User extends Component {
    state = {
        appliedLoans: [],
        showPopup: false,
        search: "",
        errorMessage: "", 
    };

    // Function to fetch applied loans
    getAppliedLoans = async () => {
        try {
            const response = await fetch("https://loan-backend-dwqw.onrender.com/loan", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${cookies.get("token")}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                this.setState({ appliedLoans: data, errorMessage: "" });
            } else {
                const errorData = await response.json();
                this.setState({ errorMessage: "Failed to fetch loans." });
                console.error("Failed to fetch loans:", errorData);
            }
        } catch (error) {
            this.setState({ errorMessage: "Error fetching loans. Please try again later." });
            console.error("Error fetching loans:", error);
        }
    };

    // Function to delete a loan
    onDeleteLoan = async (id) => {
        try {
            const response = await fetch(`https://loan-backend-dwqw.onrender.com/loan/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${cookies.get("token")}`,
                },
            });

            if (response.ok) {
                this.getAppliedLoans();
            } else {
                const errorData = await response.json();
                this.setState({ errorMessage: "Failed to delete loan." });
                console.error("Failed to delete loan:", errorData);
            }
        } catch (error) {
            this.setState({ errorMessage: "Error deleting loan. Please try again later." });
            console.error("Error deleting loan:", error);
        }
    };


    togglePopup = () => {
        this.setState((prevState) => ({ showPopup: !prevState.showPopup }));
        this.getAppliedLoans();
    };

    onChangeSearch = (e) => {
        this.setState({ search: e.target.value });
    }


    componentDidMount() {
        this.getAppliedLoans();
    }

    render() {
        const { appliedLoans, showPopup, search, errorMessage } = this.state;


        const filteredLoans = appliedLoans.filter((loan) =>
            loan.name.toLowerCase().includes(search.toLowerCase())
        );

        return (
            <div>
                <Header />
                <div className="user-container">
                    <div className="user-card_get_loan">
                        <CgProfile />
                        <button type="button" className="get_popup_button" onClick={this.togglePopup}>Get Loan</button>
                        {showPopup && <Popup onClose={this.togglePopup} />}
                    </div>

                    <div className="user-card_payment">
                        <p>Barrow Cash</p>
                        <p>Transact</p>
                        <p>Deposit Cash</p>
                    </div>

                    <input
                        type="search"
                        className="input_user"
                        value={search}
                        onChange={this.onChangeSearch}
                        placeholder="Search for loans"
                    />

                    {errorMessage && <p className="error-message">{errorMessage}</p>}

                    <div className="user-card_applied_loans">
                        <p>Applied Loans</p>
                        <div className="user-card_applied_loans_filter_sort">
                            <p>Sort</p>
                            <p>Filter</p>
                        </div>
                    </div>

                    <ul className="user-card_applied_loans_list">
                        <li className="user-card_applied_loans_list_item">

                            <div className="user-card_applied_loans_list_item_details">
                                <p>Loan Officer</p>
                                <p>Amount</p>
                                <p>Date Applied</p>
                                <p>Status</p>
                                <p>Cancel</p>
                            </div>
                        </li>
                        {filteredLoans.length > 0 ? (
                            filteredLoans.map((loan) => (
                                <li key={loan._id} className="user-card_applied_loans_list_item">

                                    <div className="user-card_applied_loans_list_item_details">
                                        <div>
                                            <p>{loan.loanOfficer}</p>
                                            <p>cust-name: {loan.name}</p>
                                        </div>
                                        <p>{loan.amount}</p>
                                        <p>{new Date(loan.createdAt).toLocaleDateString()}</p>
                                        <p className={loan.status}>{loan.status}</p>

                                        <button
                                            type="button"
                                            onClick={() => this.onDeleteLoan(loan._id)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="user-card_applied_loans_list_item">
                                <p>No applied loans</p>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        );
    }
}

export default User;
