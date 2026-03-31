import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/home/Home';
import { Category } from './pages/category/Category';
import { Login } from './pages/login/Login';
import { Register } from './pages/register/Register';
import { PostDetail } from './pages/postDetail/PostDetail';
import { Admin } from './pages/admin/Admin'; // 👈 adicionar

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/categoria/:id" element={<Category />} />
                <Route path="/:categoria/:id" element={<PostDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Register />} />
                <Route path="/admin" element={<Admin />} /> {/* 👈 adicionar */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;