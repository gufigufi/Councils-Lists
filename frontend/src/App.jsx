import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PasswordGate from './components/Auth/PasswordGate';
import HomePage from './components/Home/HomePage';
import Dashboard from './components/Admin/Dashboard';
import CouncilForm from './components/Admin/CouncilForm';

function App() {
    return (
        <PasswordGate>
            <Router>
                <Routes>
                    {/* Public route */}
                    <Route path="/" element={<HomePage />} />

                    {/* Admin routes */}
                    <Route path="/admin" element={<Dashboard />} />
                    <Route path="/admin/councils/new" element={<CouncilForm />} />
                    <Route path="/admin/councils/edit/:id" element={<CouncilForm />} />
                </Routes>
            </Router>
        </PasswordGate>
    );
}

export default App;
