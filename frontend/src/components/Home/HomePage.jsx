import { useState, useEffect } from 'react';
import MapView from '../Map/MapView';
import SearchBar from '../Search/SearchBar';
import CouncilList from '../CouncilList/CouncilList';
import { councilsAPI } from '../../services/api';
import './HomePage.css';

function HomePage() {
    const [councils, setCouncils] = useState([]);
    const [searchResults, setSearchResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCouncil, setSelectedCouncil] = useState(null);
    const [mapCenter, setMapCenter] = useState([37.0902, -95.7129]); // USA center
    const [mapZoom, setMapZoom] = useState(4);

    // Load all councils on mount
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

    const handleSearch = async (address) => {
        try {
            setLoading(true);
            const response = await councilsAPI.searchNearest(address);
            const { searchLocation, councils: nearestCouncils } = response.data;

            setSearchResults({
                location: searchLocation,
                councils: nearestCouncils
            });

            // Center map on search location
            setMapCenter([searchLocation.latitude, searchLocation.longitude]);
            setMapZoom(12);
            setError(null);
        } catch (err) {
            console.error('Search error:', err);
            setError(err.response?.data?.error || 'Search failed');
            setSearchResults(null);
        } finally {
            setLoading(false);
        }
    };

    const handleCouncilClick = (council) => {
        setSelectedCouncil(council);
        if (council.latitude && council.longitude) {
            setMapCenter([council.latitude, council.longitude]);
            setMapZoom(15);
        }
    };

    const handleClearSearch = () => {
        setSearchResults(null);
        setSelectedCouncil(null);
        setMapCenter([37.0902, -95.7129]);
        setMapZoom(4);
    };

    const displayedCouncils = searchResults ? searchResults.councils : councils;

    return (
        <div className="home-page">
            <header className="header">
                <div className="container">
                    <h1 className="logo">📍 Council Map Finder</h1>
                    <a href="/admin" className="admin-link">Admin Panel</a>
                </div>
            </header>

            <main className="main-content">
                <div className="search-section">
                    <SearchBar
                        onSearch={handleSearch}
                        loading={loading}
                        onClear={searchResults ? handleClearSearch : null}
                        placeholder="Search address to find nearest councils..."
                    />
                    {error && <div className="error-message">{error}</div>}
                </div>

                <div className="content-grid">
                    <div className="map-container">
                        {loading && !councils.length ? (
                            <div className="loading-container">
                                <div className="spinner"></div>
                            </div>
                        ) : (
                            <MapView
                                councils={displayedCouncils}
                                center={mapCenter}
                                zoom={mapZoom}
                                selectedCouncil={selectedCouncil}
                                onCouncilClick={handleCouncilClick}
                                searchLocation={searchResults?.location}
                            />
                        )}
                    </div>

                    <div className="sidebar">
                        <CouncilList
                            councils={displayedCouncils}
                            searchLocation={searchResults?.location}
                            selectedCouncil={selectedCouncil}
                            onCouncilClick={handleCouncilClick}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default HomePage;
