import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { Home } from './pages/home/Home';
import { Category } from './pages/category/Category';
import { Login } from './pages/login/Login';
import { Register } from './pages/register/Register';
import { PostDetail } from './pages/postDetail/PostDetail';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminPosts } from './pages/admin/AdminPosts';
import { AdminComments } from './pages/admin/AdminComments';
import { AdminUsers } from './pages/admin/AdminUsers';
import { Profile } from './pages/profile/Profile';

function App() {
  return (
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/categoria/:id" element={<Category />} />
            <Route path="/:categoria/:id" element={<PostDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Register />} />

            {/* Perfil do usuário */}
            <Route path="/perfil" element={<Profile />} />

            {/* Rotas Administrativas */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/posts" element={<AdminPosts />} />
            <Route path="/admin/comentarios" element={<AdminComments />} />
            <Route path="/admin/usuarios" element={<AdminUsers />} />
            <Route path="/busca" element={<Category />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
  );
}

export default App;