import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import StarostaDashboard from './pages/StarostaDashboard';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import DeanDashboard from './pages/DeanDashboard';
import './styles.css';
import ParticlesBackground from './components/ParticlesBackground';

function Navigation() {
  const location = useLocation();

  const linkClasses = (path) =>
    `px-4 py-2 font-semibold transition duration-300 rounded-xl ${
      location.pathname === path
        ? 'text-[#00D4FF] bg-white/10'
        : 'text-white hover:text-[#00D4FF] hover:bg-white/5'
    }`;

  return (
    <nav className="fixed top-0 left-0 w-full h-16 flex items-center bg-[#1A0B2E]/30 backdrop-blur-md shadow-md z-50">
      <div className="container mx-auto flex justify-center space-x-4">
        <Link to="/" className={linkClasses('/')}>Вход</Link>
        <Link to="/register" className={linkClasses('/register')}>Регистрация</Link>
        <Link to="/student" className={linkClasses('/student')}>Студент</Link>
        <Link to="/starosta" className={linkClasses('/starosta')}>Староста</Link>
        <Link to="/teacher" className={linkClasses('/teacher')}>Преподаватель</Link>
        <Link to="/dean" className={linkClasses('/dean')}>Декан</Link>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <ParticlesBackground />
      <div className="min-h-screen flex flex-col relative z-10">
        <Navigation />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/starosta" element={<StarostaDashboard />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/dean" element={<DeanDashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
