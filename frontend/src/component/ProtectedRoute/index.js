import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ element: Component }) => {
  const token = Cookies.get('jwt_token');

  if (token === undefined) {
    return <Navigate to="/login" replace />;
  }

  return Component;
};

export default ProtectedRoute;
