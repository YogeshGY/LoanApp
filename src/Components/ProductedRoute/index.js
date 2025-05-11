import { Navigate } from 'react-router-dom';
import cookies from 'js-cookie';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = cookies.get('token');
    const userRole = cookies.get('role');


    if (!token || !allowedRoles.includes(userRole)) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
