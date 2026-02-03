import { useState } from 'react';
import { Icon } from './Icons';
import './ProfileDropdown.css';

export default function ProfileDropdown({
    user,
    onLogout,
    onClose,
    savedRoutes,
    favorites,
    history,
    onLoadRoute,
    onDeleteRoute,
    onDeleteFavorite,
    onClearHistory
}) {
    const [activeTab, setActiveTab] = useState('routes');

    return (
        <div className="profile-dropdown-overlay" onClick={onClose}>
            <div className="profile-dropdown expanded" onClick={e => e.stopPropagation()}>
                <div className="profile-header">
                    <div className="profile-info">
                        <div className="profile-avatar">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="profile-details">
                            <span className="profile-username">{user.username}</span>
                            <span className="profile-role">{user.role}</span>
                        </div>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <Icon name="close" size={20} />
                    </button>
                </div>

                <div className="profile-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'routes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('routes')}
                    >
                        Saved
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
                        onClick={() => setActiveTab('favorites')}
                    >
                        Favorites
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        History
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === 'routes' && (
                        <div className="list-container">
                            {savedRoutes.length === 0 ? (
                                <p className="empty-msg">No saved routes yet.</p>
                            ) : (
                                savedRoutes.map(route => (
                                    <div key={route._id} className="list-item">
                                        <div className="item-info" onClick={() => { onLoadRoute(route.path); onClose(); }}>
                                            <span className="item-title">{route.name}</span>
                                            <span className="item-subtitle">{route.start} → {route.end}</span>
                                        </div>
                                        <button className="delete-btn" onClick={() => onDeleteRoute(route._id)}>
                                            <Icon name="clear" size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'favorites' && (
                        <div className="list-container">
                            {favorites.length === 0 ? (
                                <p className="empty-msg">No favorites added yet.</p>
                            ) : (
                                favorites.map(fav => (
                                    <div key={fav._id} className="list-item">
                                        <div className="item-info" onClick={() => { /* Handle center on fav */ onClose(); }}>
                                            <span className="item-title">{fav.locationName}</span>
                                        </div>
                                        <button className="delete-btn" onClick={() => onDeleteFavorite(fav.locationName)}>
                                            <Icon name="clear" size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="list-container">
                            <div className="history-header">
                                <h3>Recent History</h3>
                                {history.length > 0 && <button className="clear-all" onClick={onClearHistory}>Clear All</button>}
                            </div>
                            {history.length === 0 ? (
                                <p className="empty-msg">Nav history is empty.</p>
                            ) : (
                                history.map(item => (
                                    <div key={item._id} className="list-item">
                                        <div className="item-info" onClick={() => { onLoadRoute(item.path); onClose(); }}>
                                            <span className="item-title">{item.start} → {item.end}</span>
                                            <span className="item-subtitle">{new Date(item.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                <div className="profile-footer">
                    <button className="profile-menu-item logout" onClick={onLogout}>
                        <Icon name="logout" size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
