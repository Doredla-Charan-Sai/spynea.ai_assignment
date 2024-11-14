import { Routes, Route, BrowserRouter } from 'react-router-dom';
import LoginWrapper from './component/LoginWrapper';
import CreateProduct from './component/CreateProduct';
import ProtectedRoute from './component/ProtectedRoute';
import ProductList from './component/ProductList';
import ProductDetails from './component/ProductDetails';
import Header from './component/Header';
import './App.css';

const App = () => (
  <BrowserRouter>
    <Routes>
    <Route exact path="/login" element={<LoginWrapper />} /> 
      <Route exact
        path="/"
        element={<ProtectedRoute element={<><Header /><CreateProduct /></>} />}
      />
      <Route exact
        path="/edit/:productId"
        element={<ProtectedRoute element={<><Header /><CreateProduct /></>} />}
      />
      <Route exact
        path="/products"
        element={<ProtectedRoute element={<><Header /><ProductList /></>} />}
      />
      <Route exact
        path="/product/:id"
        element={<ProtectedRoute element={<><Header /><ProductDetails /></>} />}
      />
    </Routes>
  </BrowserRouter>
);

export default App;
