import { Component } from 'react';
import cookies from 'js-cookie';
import withRouter from '../../WithRouter';
import './index.css';

class Login extends Component {
    state = {
        username: '',
        password: '',
        role: '',
        error: null,
        isLogin: true,
    };

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    onSubmitFormRegister = async (e) => {
        e.preventDefault();
        const { username, password } = this.state;
        const response = await fetch('https://loan-backend-dwqw.onrender.com/user/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Registered:', data);
            this.setState({
                username: '',
                password: '',
                role: '',
                error: null,
            });
        } else {
            const errorData = await response.json();
            console.error(errorData);
            this.setState({ error: errorData });
        }
    };

    onSubmitFormLogin = async (e) => {
        e.preventDefault();
        const { username, password, role } = this.state;
        const { navigate } = this.props;

        const response = await fetch('https://loan-backend-dwqw.onrender.com/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role }),
        });

        if (response.ok) {
            const data = await response.json();
            cookies.set('token', data.token);
            cookies.set('role', data.role);

            this.setState({
                username: '',
                password: '',
                role: '',
                error: null,
            });

            if (data.role === 'admin') {
                navigate('/admin');
            } else if (data.role === 'verifier') {
                navigate('/verifier');
            } else {
                navigate('/user');
            }

            console.log('Logged in:', data);
        } else {
            const errorData = await response.json();
            console.error(errorData);
            this.setState({ error: errorData });
        }
    };

    render() {
        const { username, password, role, isLogin, error } = this.state;

        return (
            <div className='login-form_container'>
                <h1>Welcome To Cread Loan</h1>

                {isLogin ? (
                    <div className='login-form_container_left'>
                        <form onSubmit={this.onSubmitFormLogin}>
                            <h1>Login</h1>
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={username}
                                onChange={this.handleChange}
                            />

                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={this.handleChange}
                            />

                            <label htmlFor="role">Role</label>
                            <select name="role" value={role} onChange={this.handleChange}>
                                <option value="">Select</option>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                                <option value="verifier">Verifier</option>
                            </select>

                            {error && <p className='error_message'>{error.error}</p>}

                            <button type="submit" className='submit_button'>Login</button>
                        </form>

                        <button
                            onClick={() =>
                                this.setState({
                                    isLogin: false,
                                    username: '',
                                    password: '',
                                    role: '',
                                    error: null,
                                })
                            }
                        >
                            Switch to Register
                        </button>
                    </div>
                ) : (
                    <div className='login-form_container_right'>
                        <button
                            onClick={() =>
                                this.setState({
                                    isLogin: true,
                                    username: '',
                                    password: '',
                                    role: '',
                                    error: null,
                                })
                            }
                        >
                            Switch to Login
                        </button>

                        <form onSubmit={this.onSubmitFormRegister}>
                            <h1>Register</h1>
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={username}
                                onChange={this.handleChange}
                            />

                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={this.handleChange}
                            />

                            {error && <p className='error_message'>{error.error}</p>}

                            <button type="submit" className='submit_button'>Register</button>
                        </form>
                    </div>
                )}
            </div>
        );
    }
}

export default withRouter(Login);
