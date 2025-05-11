import { Component } from "react";
import cookies from "js-cookie";
import { CgProfile } from "react-icons/cg";
import { MdOutlineSavings } from "react-icons/md";
import { FaUsersLine, FaUserCheck } from "react-icons/fa6";
import { MdOtherHouses } from "react-icons/md";
import { FaUserMinus } from "react-icons/fa";
import { TbCash } from "react-icons/tb";
import Header from "../Header";
import NavBar from "../NaveBar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './index.css';

const getDaysAgo = (dateString) => {
    const currentDate = new Date();
    const pastDate = new Date(dateString);
    const timeDiff = currentDate - pastDate;
    const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    return `${daysAgo} days ago`;
};

const formatDates = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${month},${day},${year}`;
};

const formatHours = (dateString) => {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

class Dashboard extends Component {
    state = {
        appliedLoans: [],
        errorMessage: "",
        showPopupId: null,
        updatedOfficer: "",
        updatedStatus: "",
        loanStatuses: {
            approved: 0,
            pending: 0,
            rejected: 0
        },
        loanCountPerUser: []
    };

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
                this.setState({ appliedLoans: data, errorMessage: "" }, this.processLoanData(data));
            } else {
                this.setState({ errorMessage: "Failed to fetch loans." });
            }
        } catch (error) {
            this.setState({ errorMessage: "Error fetching loans. Please try again later." });
        }
    };
    onUpdateLoan = async (loanId) => {
        const { updatedOfficer, updatedStatus } = this.state;

        try {
            const response = await fetch(`https://loan-backend-dwqw.onrender.com/loan/${loanId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${cookies.get('token')}`
                },
                body: JSON.stringify({
                    officer: updatedOfficer,
                    status: updatedStatus
                })
            });

            if (response.ok) {
                this.getAppliedLoans(); 
                this.setState({ showPopupId: null });
            } else {
                console.error("Failed to update loan");
            }
        } catch (error) {
            console.error("Error updating loan:", error);
        }
    };

    onDeleteLoan = async (loanId) => {
        try {
            const response = await fetch(`https://loan-backend-dwqw.onrender.com/loan/${loanId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${cookies.get('token')}`
                }
            });

            if (response.ok) {
                this.getAppliedLoans();
            } else {
                console.error("Failed to delete loan");
            }
        } catch (error) {
            console.error("Error deleting loan:", error);
        }
    };

    processLoanData = (data) => {
        const loanStatuses = { approved: 0, pending: 0, rejected: 0 };

        data.forEach((loan) => {
            if (loan.status === 'approved') loanStatuses.approved++;
            if (loan.status === 'pending') loanStatuses.pending++;
            if (loan.status === 'rejected') loanStatuses.rejected++;
        }
        );


        this.setState({ loanStatuses });
    };

    componentDidMount() {
        this.getAppliedLoans();
    }

    render() {
        const { appliedLoans, showPopupId, updatedOfficer, updatedStatus, loanStatuses } = this.state;
        const role = cookies.get("role");
        const barData = [
            { name: 'Approved', count: loanStatuses.approved },
            { name: 'Pending', count: loanStatuses.pending },
            { name: 'Rejected', count: loanStatuses.rejected }
        ];

        return (
            <div>
                <Header />
                <div className="dashboard_container">
                    <NavBar />
                    <div className="dashboard_content">
                        <h1 className="dashboard_heading">Dashboard</h1>
                        <div className="dashboard_stats">
                            <div className="dashboard_card_logo">
                                <FaUsersLine className="dashboard_logo" />
                                <div><p>200</p><p>ACTIVE USERS</p></div>
                            </div>
                            <div className="dashboard_card_logo">
                                <FaUserMinus className="dashboard_logo" />
                                <div><p>200</p><p>BORROWERS</p></div>
                            </div>
                            <div className="dashboard_card_logo">
                                <TbCash className="dashboard_logo" />
                                <div><p>200</p><p>CASH DISBURSED</p></div>
                            </div>
                            <div className="dashboard_card_logo">
                                <MdOutlineSavings className="dashboard_logo" />
                                <div><p>200</p><p>SAVINGS</p></div>
                            </div>
                            <div className="dashboard_card_logo">
                                <FaUserCheck className="dashboard_logo" />
                                <div><p>200</p><p>REPAID LOANS</p></div>
                            </div>
                            <div className="dashboard_card_logo">
                                <MdOtherHouses className="dashboard_logo" />
                                <div><p>200</p><p>OTHER Accounts</p></div>
                            </div>
                        </div>

                        <div>
                            <div className="dashboard_card">
                                <p>Recent Loans</p>
                                <div className="dashboard_filter_sort">
                                    <p>sort</p>
                                    <p>Filter</p>
                                </div>
                            </div>

                            {appliedLoans.length > 0 ? (
                                <ul className="dashboard_loan_list">
                                    <li className="dashboard_loan_item">
                                        <p>User Details</p>
                                        <p>Customer Name</p>
                                        <p>Date</p>
                                        <p>Action</p>
                                        <p>Update</p>
                                    </li>

                                    {appliedLoans.map((loan) => (
                                        <li key={loan.id} className="dashboard_loan_item">
                                            <div className="user_details_profile_container">
                                                <CgProfile className="profile_logo" />
                                                <div className="item_diaplay">
                                                    <p>{loan.userActivity}</p>
                                                    <p className="subpara">{getDaysAgo(loan.updatedAt)}</p>
                                                </div>
                                            </div>
                                            <div className="item_diaplay">
                                                <p>{loan.name}</p>
                                                <p className="subpara">On {formatDate(loan.createdAt)}</p>
                                            </div>
                                            <div>
                                                <p>{formatDates(loan.createdAt)}</p>
                                                <p className="subpara">{formatHours(loan.createdAt)}</p>
                                            </div>
                                            <p className={loan.status}>{loan.status}</p>

                                            <div>
                                                <button
                                                    type="button"
                                                    className="update_button_loan"
                                                    onClick={() => {
                                                        const isSameLoan = this.state.showPopupId === loan._id;
                                                        this.setState({
                                                            showPopupId: isSameLoan ? null : loan._id,
                                                            selectedLoanId: loan._id,
                                                            updatedOfficer: loan.officer || "",
                                                            updatedStatus: loan.status || "",
                                                        });
                                                    }}
                                                >
                                                    Update
                                                </button>
                                                {role === 'admin' && (
                                                    <button type="button" onClick={() => this.onDeleteLoan(loan._id)} className="cancel_button_loan">
                                                        Cancel
                                                    </button>
                                                )}
                                                {showPopupId === loan._id && (
                                                    <div className="popup_form">
                                                        {role === 'admin' && (
                                                            <label>Officer Name:
                                                                <input
                                                                    type="text"
                                                                    value={updatedOfficer}
                                                                    onChange={(e) => this.setState({ updatedOfficer: e.target.value })}
                                                                />
                                                            </label>
                                                        )}
                                                        <label>Status:
                                                            <select value={updatedStatus} onChange={(e) => this.setState({ updatedStatus: e.target.value })}>
                                                                <option value="">Select</option>
                                                                <option value="approved">Approved</option>
                                                                <option value="pending">Pending</option>
                                                                <option value="rejected">Rejected</option>
                                                            </select>
                                                        </label>
                                                        <button type="button" onClick={() => this.onUpdateLoan(loan._id)}>Submit</button>
                                                    </div>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : ('No loans available')}
                        </div>


                        <div className="graph_section">
                            <h3>Loan Statuses</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={barData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Dashboard;
