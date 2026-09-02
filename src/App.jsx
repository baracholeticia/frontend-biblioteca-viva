import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { isLoggedIn, getUserRole } from './services/authService';

import { Home } from './pages/home/Home';
import { Category } from './pages/category/Category';
import { Login } from './pages/login/Login';
import { ForgotPassword } from './pages/login/Forgotpassword';
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

function RequireAuth({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
}

function RequireRole({ children, allowedRoles }) {
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  const role = getUserRole();
  if (!allowedRoles.includes(role)) return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
      <ToastProvider>
        <BrowserRouter>
          <AccessibilityMenu />

          <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Register />} />
            <Route path="/esqueceu-senha" element={<ForgotPassword />} />
            <Route path="/busca" element={<Category />} />
            <Route path="/autor/:autor" element={<Autor />} />
            <Route path="/categoria/:id" element={<Category />} />
            <Route path="/:categoria/:id" element={<PostDetail />} />
            
            {/* Rotas de Usuário Logado */}
            <Route path="/perfil" element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            } />

            {/* Rotas de Admin */}
            <Route path="/admin" element={
              <RequireRole allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </RequireRole>
            } />
            <Route path="/admin/posts" element={
              <RequireRole allowedRoles={['ADMIN']}>
                <AdminPosts />
              </RequireRole>
            } />
            <Route path="/admin/comentarios" element={
              <RequireRole allowedRoles={['ADMIN']}>
                <AdminComments />
              </RequireRole>
            } />
            <Route path="/admin/usuarios" element={
              <RequireRole allowedRoles={['ADMIN']}>
                <AdminUsers />
              </RequireRole>
            } />
            <Route path="/admin/equipe" element={
              <RequireRole allowedRoles={['ADMIN']}>
                <AdminStaff />
              </RequireRole>
            } />

            {/* Rotas de Curador */}
            <Route path="/curadoria/posts" element={
              <RequireRole allowedRoles={['CURADOR', 'ADMIN']}>
                <CuradorPosts />
              </RequireRole>
            } />
            
            <Route path="/curador" element={<Navigate to="/curadoria/posts" replace />} />
            <Route path="/curadoria" element={<Navigate to="/curadoria/posts" replace />} />

          </Routes>
        </BrowserRouter>
      </ToastProvider>
  );
}

export default App;