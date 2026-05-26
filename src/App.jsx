import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';

import { Home } from './pages/home/Home';
import { Category } from './pages/category/Category';
import { Login } from './pages/login/Login';
import { Register } from './pages/register/Register';
import { PostDetail } from './pages/postDetail/PostDetail';
import { Profile } from './pages/profile/Profile';
import { Autor } from './pages/autor/Autor';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminPosts } from './pages/admin/AdminPosts';
import { AdminComments } from './pages/admin/AdminComments';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminStaff } from './pages/admin/AdminStaff';

import { CuradorPosts } from './pages/curador/CuradorPosts';

import { AccessibilityMenu } from './components/accessibility/AccessibilityMenu';

function App() {
  return (
      <ToastProvider>
        <BrowserRouter>
          <AccessibilityMenu />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Register />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/busca" element={<Category />} />
            <Route path="/autor/:autor" element={<Autor />} />
            <Route path="/categoria/:id" element={<Category />} />

            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/posts" element={<AdminPosts />} />
            <Route path="/admin/comentarios" element={<AdminComments />} />
            <Route path="/admin/usuarios" element={<AdminUsers />} />
            <Route path="/admin/equipe" element={<AdminStaff />} />

            <Route path="/curadoria/posts" element={<CuradorPosts />} />
            <Route path="/curador" element={<Navigate to="/curadoria/posts" replace />} />
            <Route path="/curadoria" element={<Navigate to="/curadoria/posts" replace />} />

            <Route path="/:categoria/:id" element={<PostDetail />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
  );
}

export default App;