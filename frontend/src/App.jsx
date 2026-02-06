import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/Home/HomePage';
import Login from './components/Admin/Login';
import Dashboard from './components/Admin/Dashboard';
import CouncilForm from './components/Admin/CouncilForm';
import ProtectedRoute from './components/Admin/ProtectedRoute';

function App() {
    return (
        <Router>
            <Routes>
                {/* Public route */}
                <Route path="/" element={<HomePage />} />

                {/* Admin routes */}
                <Route path="/admin/login" element={<Login />} />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/councils/new"
                    element={
                        <ProtectedRoute>
                            <CouncilForm />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/councils/edit/:id"
                    element={
                        <ProtectedRoute>
                            <CouncilForm />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
