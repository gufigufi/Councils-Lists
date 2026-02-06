import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { councilsAPI } from '../../services/api';
import { logout, formatDate } from '../../utils/helpers';
import './Dashboard.css';

function Dashboard() {
    const [councils, setCouncils] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadCouncils();
    }, []);

    const loadCouncils = async () => {
        try {
            setLoading(true);
            const response = await councilsAPI.getAll();
            setCouncils(response.data);
            setError(null);
        } catch (err) {
            console.error('Error loading councils:', err);
            setError('Failed to load councils');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, councilName) => {
        if (!window.confirm(`Are you sure you want to delete council: ${councilName}?`)) {
            return;
        }

        try {
            await councilsAPI.delete(id);
            setCouncils(councils.filter(council => council.id !== id));
        } catch (err) {
            console.error('Error deleting council:', err);
            alert('Failed to delete council');
        }
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
        }
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div className="container">
                    <h1 className="dashboard-title">📊 Admin Dashboard</h1>
                    <div className="header-actions">
                        <a href="/" className="btn btn-secondary">View Public Map</a>
                        <button onClick={handleLogout} className="btn btn-danger">
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="dashboard-content container">
                <div className="dashboard-actions">
                    <h2>Councils Management</h2>
                    <button
                        onClick={() => navigate('/admin/councils/new')}
                        className="btn btn-primary"
                    >
                        ➕ Add New Council
                    </button>
                </div>

                {error && (
                    <div className="error-message">{error}</div>
                )}

                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <div className="events-table-container card">
                        {councils.length === 0 ? (
                            <div className="empty-state">
                                <p>No councils yet. Create your first council!</p>
                            </div>
                        ) : (
                            <table className="events-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Address</th>
                                        <th>Location</th>
                                        <th>Purchase Date</th>
                                        <th>End Date</th>
                                        <th className="actions-column">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {councils.map((council) => (
                                        <tr key={council.id}>
                                            <td>{council.name}</td>
                                            <td>{council.email}</td>
                                            <td>{council.address}</td>
                                            <td>{council.zipCode}, {council.state}</td>
                                            <td>{formatDate(council.purchaseDate)}</td>
                                            <td>{formatDate(council.endDate)}</td>
                                            <td className="actions-cell">
                                                <button
                                                    onClick={() => navigate(`/admin/councils/edit/${council.id}`)}
                                                    className="btn btn-secondary btn-sm"
                                                >
                                                    ✏️ Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(council.id, council.name)}
                                                    className="btn btn-danger btn-sm"
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Dashboard;
