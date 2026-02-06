import { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch, loading, onClear }) {
    const [address, setAddress] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (address.trim()) {
            onSearch(address);
        }
    };

    const handleClear = () => {
        setAddress('');
        if (onClear) {
            onClear();
        }
    };

    return (
        <div className="search-bar">
            <h2 className="search-title">Find Events Near You</h2>
            <form onSubmit={handleSubmit} className="search-form">
                <input
                    type="text"
                    className="input search-input"
                    placeholder="Enter address, city, or zip code..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={loading}
                />
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || !address.trim()}
                >
                    {loading ? (
                        <>
                            <div className="spinner" style={{ width: '1rem', height: '1rem' }}></div>
                            Searching...
                        </>
                    ) : (
                        <>🔍 Search</>
                    )}
                </button>
                {onClear && (
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleClear}
                        disabled={loading}
                    >
                        Clear
                    </button>
                )}
            </form>
        </div>
    );
}

export default SearchBar;
