import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { formatDate } from '../../utils/helpers';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

// Custom icon for search location
const searchIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iOCIgZmlsbD0iIzM3NzVGRiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSI0Ii8+Cjwvc3ZnPg==',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
});

// Component to handle map updates
function MapController({ center, zoom }) {
    const map = useMap();

    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);

    return null;
}

function MapView({ councils, center, zoom, selectedCouncil, onCouncilClick, searchLocation }) {
    const mapRef = useRef(null);

    return (
        <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapController center={center} zoom={zoom} />

            {/* Search location marker */}
            {searchLocation && (
                <Marker
                    position={[searchLocation.latitude, searchLocation.longitude]}
                    icon={searchIcon}
                >
                    <Popup>
                        <div style={{ padding: '0.5rem' }}>
                            <strong>📍 Search Location</strong>
                            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
                                {searchLocation.address}
                            </p>
                        </div>
                    </Popup>
                </Marker>
            )}

            {/* Council markers */}
            {councils && councils.map((council) => {
                if (!council.latitude || !council.longitude) return null;

                return (
                    <Marker
                        key={council.id}
                        position={[council.latitude, council.longitude]}
                        eventHandlers={{
                            click: () => onCouncilClick(council)
                        }}
                    >
                        <Popup>
                            <div style={{ padding: '0.5rem', minWidth: '200px' }}>
                                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: '600' }}>
                                    {council.name}
                                </h3>
                                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                    <p style={{ margin: '0.25rem 0' }}>
                                        <strong>Email:</strong> {council.email}
                                    </p>
                                    <p style={{ margin: '0.25rem 0' }}>
                                        <strong>Address:</strong> {council.address}
                                    </p>
                                    <p style={{ margin: '0.25rem 0' }}>
                                        <strong>Location:</strong> {council.zipCode}, {council.state}
                                    </p>
                                    <p style={{ margin: '0.25rem 0' }}>
                                        <strong>Dates:</strong> {formatDate(council.purchaseDate)} - {formatDate(council.endDate)}
                                    </p>
                                    {council.distance !== undefined && (
                                        <p style={{ margin: '0.5rem 0 0 0', fontWeight: '600', color: '#2563eb' }}>
                                            📏 {council.distance.toFixed(1)} miles away
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}

export default MapView;
