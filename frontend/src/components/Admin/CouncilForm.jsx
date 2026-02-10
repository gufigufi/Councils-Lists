import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { councilsAPI } from "../../services/api";
import "./CouncilForm.css";

function CouncilForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    purchaseDate: "",
    endDate: "",
    name: "",
    email: "",
    address: "",
    zipCode: "",
    state: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [geocoding, setGeocoding] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      loadCouncil();
    }
  }, [id]);

  const loadCouncil = async () => {
    try {
      setLoading(true);
      const response = await councilsAPI.getById(id);
      const council = response.data;

      setFormData({
        purchaseDate: council.purchaseDate.split("T")[0],
        endDate: council.endDate.split("T")[0],
        name: council.name,
        email: council.email,
        address: council.address,
        zipCode: council.zipCode,
        state: council.state,
      });
    } catch (err) {
      console.error("Error loading council:", err);
      setError("Failed to load council");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.purchaseDate || !formData.endDate) {
      setError("Please select both purchase and end dates");
      return false;
    }

    if (new Date(formData.purchaseDate) > new Date(formData.endDate)) {
      setError("End date must be after purchase date");
      return false;
    }

    if (!formData.name || !formData.email) {
      setError("Name and email are required");
      return false;
    }

    if (!formData.address || !formData.zipCode || !formData.state) {
      setError("Complete address information is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setGeocoding(true);

      if (isEditMode) {
        await councilsAPI.update(id, formData);
      } else {
        await councilsAPI.create(formData);
      }

      navigate("/admin");
    } catch (err) {
      console.error("Error saving council:", err);
      setError(
        err.response?.data?.error ||
          "Failed to save council. Please check the address and try again.",
      );
    } finally {
      setLoading(false);
      setGeocoding(false);
    }
  };

  if (loading && isEditMode && !formData.name) {
    return (
      <div className="loading-container" style={{ minHeight: "100vh" }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="council-form-page">
      <header className="form-header">
        <div className="container">
          <h1 className="form-title">
            {isEditMode ? "✏️ Edit Council" : "➕ Create New Council"}
          </h1>

          <button
            onClick={() => navigate("/admin")}
            className="btn btn-secondary"
          >
            ← Back to Dashboard
          </button>
        </div>
      </header>

      <main className="form-content container">
        <div className="form-card card">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="purchaseDate" className="form-label">
                  Purchase Date *
                </label>
                <input
                  id="purchaseDate"
                  name="purchaseDate"
                  type="date"
                  className="input"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDate" className="form-label">
                  End Date *
                </label>
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  className="input"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="John Doe"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address" className="form-label">
                Address *
              </label>
              <input
                id="address"
                name="address"
                type="text"
                className="input"
                value={formData.address}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="123 Main Street"
              />
              <small className="form-hint">
                This address will be automatically geocoded to place a marker on
                the map
              </small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="zipCode" className="form-label">
                  Zip Code *
                </label>
                <input
                  id="zipCode"
                  name="zipCode"
                  type="text"
                  className="input"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="12345"
                />
              </div>

              <div className="form-group">
                <label htmlFor="state" className="form-label">
                  State / Province *
                </label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  className="input"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="NY или ON"
                  maxLength="2"
                />
                <small className="form-hint">
                  Код штата США (NY, CA) или провинции Канады (ON, BC). Страна
                  определится автоматически.
                </small>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            {geocoding && (
              <div className="info-message">
                🌍 Geocoding address to coordinates...
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate("/admin")}
                className="btn btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div
                      className="spinner"
                      style={{ width: "1rem", height: "1rem" }}
                    ></div>
                    {geocoding ? "Geocoding..." : "Saving..."}
                  </>
                ) : isEditMode ? (
                  "Update Council"
                ) : (
                  "Create Council"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default CouncilForm;
