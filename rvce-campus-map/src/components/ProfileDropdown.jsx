import { Icon } from './Icons';
import './ProfileDropdown.css';

export default function ProfileDropdown({ user, onLogout, onClose }) {
    return (
        <div className="profile-dropdown-overlay" onClick={onClose}>
            <div className="profile-dropdown" onClick={e => e.stopPropagation()}>
                <div className="profile-info">
                    <div className="profile-avatar">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="profile-details">
                        <span className="profile-username">{user.username}</span>
                        <span className="profile-role">{user.role}</span>
                    </div>
                </div>

                <div className="profile-menu">
                    <button className="profile-menu-item logout" onClick={onLogout}>
                        <Icon name="logout" size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
