import { Component } from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import User from './Components/User';
import Login from './Components/Login';
import ProtectedRoute from './Components/ProductedRoute';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/verifier"
            element={
              <ProtectedRoute allowedRoles={['verifier']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user"
            element={
              <ProtectedRoute allowedRoles={['user', 'admin', 'verifier']}>
                <User />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    );
  }
}

export default App;
