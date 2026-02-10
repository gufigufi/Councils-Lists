import { useState, useEffect } from "react";
import MapView from "../Map/MapView";
import SearchBar from "../Search/SearchBar";
import CouncilList from "../CouncilList/CouncilList";
import { councilsAPI } from "../../services/api";
import headerLogo from "../../assets/header-logo.png";
import "./HomePage.css";

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
      console.error("Error loading councils:", err);
      setError("Failed to load councils");
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
        councils: nearestCouncils,
      });

      // Center map on search location
      setMapCenter([searchLocation.latitude, searchLocation.longitude]);
      setMapZoom(12);
      setError(null);
    } catch (err) {
      console.error("Search error:", err);
      setError(err.response?.data?.error || "Search failed");
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
          <div className="logo-container">
            <img src={headerLogo} alt="Logo" className="header-logo" />
            <h1 className="logo">Council Map Finder</h1>
          </div>
          <a href="tel:+13322392379" className="phone-link">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2 3C2 2.44772 2.44772 2 3 2H5.15287C5.64171 2 6.0589 2.35341 6.13927 2.8356L6.87858 7.27147C6.95075 7.70451 6.73206 8.13397 6.3394 8.3303L4.79126 9.10437C5.90756 11.8783 8.12168 14.0924 10.8956 15.2087L11.6697 13.6606C11.866 13.2679 12.2955 13.0492 12.7285 13.1214L17.1644 13.8607C17.6466 13.9411 18 14.3583 18 14.8471V17C18 17.5523 17.5523 18 17 18H15C7.8203 18 2 12.1797 2 5V3Z" />
            </svg>
            +1 332-239-2379
          </a>
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
