import { Component } from "react";
import cookies from "js-cookie";
import "./index.css";

class Popup extends Component {
    onSubmitForm = async (e) => {
        e.preventDefault();
        const { onClose } = this.props;

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        for (let key in data) {
            if (data[key]) {
                data[key] = data[key].trim();
            }
        }

        const requiredFields = [
            "name", "amount", "amountStatus", "interestRate", "tenure",
            "status", "loantenture", "reason", "empstatus", "empaddress",
            "userActivity", "loanOfficer"
        ];

        for (let field of requiredFields) {
            if (!data[field]) {
                alert(`Please fill out the ${field} field.`);
                return;
            }
        }

        try {
            const response = await fetch("https://loan-backend-dwqw.onrender.com/loan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${cookies.get("token")}`,
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                onClose();
                console.log("Loan application submitted successfully:", data);
            } else {
                const errorData = await response.json();
                console.error("Failed to apply for loan:", errorData);
            }
        } catch (error) {
            console.error("Error applying for loan:", error);
        }
    }

    render() {
        const { onClose } = this.props;

        return (
            <div className="popup-overlay">
                <div className="popup-container">
                    <h1>APPLY FOR A LOAN</h1>
                    <form className="popup-form" onSubmit={this.onSubmitForm}>
                        <div className="popup-form-left">
                            <label htmlFor="name">Full Name</label>
                            <input type="text" id="name" name="name" />

                            <label htmlFor="amount">Amount</label>
                            <input type="number" id="amount" name="amount" />

                            <label htmlFor="amountStatus">Amount Status</label>
                            <select id="amountStatus" name="amountStatus">
                                <option value="">Select</option>
                                <option value="disbursed">Disbursed</option>
                                <option value="pending">Pending</option>
                                <option value="rejected">Rejected</option>
                            </select>

                            <label htmlFor="interestRate">Interest Rate (%)</label>
                            <input type="number" id="interestRate" name="interestRate" step="0.1" />

                            <label htmlFor="tenure">Tenure (in months)</label>
                            <input type="number" id="tenure" name="tenure" />

                            <label htmlFor="status">Loan Status</label>
                            <select id="status" name="status">
                                <option value="">Select</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>

                            <label htmlFor="loantenture">Loan Tenure</label>
                            <input type="number" id="loantenture" name="loantenture" />
                        </div>

                        <div className="popup-form-right">
                            <label htmlFor="reason">Reason for Loan</label>
                            <input type="text" id="reason" name="reason" />

                            <label htmlFor="empstatus">Employment Status</label>
                            <select id="empstatus" name="empstatus">
                                <option value="">Select</option>
                                <option value="Salaried">Salaried</option>
                                <option value="Self-employed">Self-employed</option>
                                <option value="Unemployed">Unemployed</option>
                                <option value="Student">Student</option>
                            </select>

                            <label htmlFor="empaddress">Employment Address</label>
                            <input type="text" id="empaddress" name="empaddress" />

                            <label htmlFor="userActivity">User Activity</label>
                            <input type="text" id="userActivity" name="userActivity" />

                            <label htmlFor="loanOfficer">Loan Officer</label>
                            <input type="text" id="loanOfficer" name="loanOfficer" />
                        </div>

                        <button type="submit" className="popup_submit_button">Submit</button>
                    </form>
                    <button type="button" onClick={onClose}>Close</button>
                </div>
            </div>
        );
    }
}

export default Popup;
