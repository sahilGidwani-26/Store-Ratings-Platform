import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Store, UserPlus, KeyRound, LogOut, ClipboardList } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV = {
  admin: [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/stores', label: 'Stores', icon: Store },
    { to: '/admin/add-user', label: 'Add User', icon: UserPlus },
  ],
  user: [
    { to: '/', label: 'Stores', icon: Store },
    { to: '/account/password', label: 'Password', icon: KeyRound },
  ],
  owner: [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/account/password', label: 'Password', icon: KeyRound },
  ],
};

export default function Layout({ title, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = NAV[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="dot" />
          <span>StoreRate</span>
        </div>
        <nav>
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user">{user?.name}</div>
          <div className="sidebar-role">{user?.role}</div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={15} /> Log out
          </button>
        </div>
      </aside>
      <div className="main-area">
        <header className="topbar">
          <h1>{title}</h1>
          <ClipboardList size={20} color="var(--text-muted)" />
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
