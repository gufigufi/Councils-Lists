import { useState, useEffect } from 'react';
import './PasswordGate.css';

const PASSWORD_HASH = 'a5dd4e9d22c5d58f19b8226dc0e655d5199440cb167849ea371d4a519fc75491';

async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function PasswordGate({ children }) {
    const [unlocked, setUnlocked] = useState(
        () => sessionStorage.getItem('siteUnlocked') === 'true'
    );
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!password) {
            setError('Please enter the password');
            return;
        }

        setLoading(true);
        const hash = await sha256(password);

        if (hash === PASSWORD_HASH) {
            sessionStorage.setItem('siteUnlocked', 'true');
            setUnlocked(true);
        } else {
            setError('Incorrect password');
        }
        setLoading(false);
    };

    if (unlocked) {
        return children;
    }

    return (
        <div className="gate-page">
            <div className="gate-container">
                <div className="gate-card">
                    <div className="gate-header">
                        <h1 className="gate-title">🔒</h1>
                        <p className="gate-subtitle">Enter password to access the site</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="password"
                                className="input gate-input"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                autoFocus
                            />
                        </div>

                        {error && (
                            <div className="gate-error">{error}</div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary gate-btn"
                            disabled={loading}
                        >
                            {loading ? 'Checking...' : 'Enter'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default PasswordGate;
