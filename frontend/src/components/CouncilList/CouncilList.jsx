import { formatDate } from '../../utils/helpers';
import './CouncilList.css';

function CouncilList({ councils, searchLocation, selectedCouncil, onCouncilClick }) {
    if (!councils || councils.length === 0) {
        return (
            <div className="council-list card">
                <div className="card-header">
                    <h3 className="card-title">
                        {searchLocation ? 'Nearest Councils' : 'All Councils'}
                    </h3>
                </div>
                <div className="empty-state">
                    <p>No councils found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="council-list card">
            <div className="card-header">
                <h3 className="card-title">
                    {searchLocation ? `📍 ${councils.length} Nearest Councils` : `📅 ${councils.length} Total Councils`}
                </h3>
            </div>
            <div className="council-list-scroll">
                {councils.map((council, index) => (
                    <div
                        key={council.id}
                        className={`council-item ${selectedCouncil?.id === council.id ? 'selected' : ''}`}
                        onClick={() => onCouncilClick(council)}
                    >
                        <div className="council-header">
                            <h4 className="council-name">
                                {searchLocation && <span className="council-rank">#{index + 1}</span>}
                                {council.name}
                            </h4>
                            {council.distance !== undefined && (
                                <span className="council-distance">
                                    📏 {council.distance.toFixed(1)} mi
                                </span>
                            )}
                        </div>
                        <div className="council-details">
                            <p className="council-detail">
                                <span className="detail-label">Email:</span> {council.email}
                            </p>
                            <p className="council-detail">
                                <span className="detail-label">Address:</span> {council.address}
                            </p>
                            <p className="council-detail">
                                <span className="detail-label">Location:</span> {council.zipCode}, {council.state}
                            </p>
                            <p className="council-detail">
                                <span className="detail-label">Dates:</span> {formatDate(council.purchaseDate)} - {formatDate(council.endDate)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CouncilList;
