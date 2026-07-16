import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import RatingChip from '../components/RatingChip';
import { ChevronUp, ChevronDown } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sort, setSort] = useState({ sortBy: 'name', order: 'ASC' });

  const load = async () => {
    setLoading(true);
    const params = { ...filters, ...sort };
    Object.keys(params).forEach((k) => { if (!params[k]) delete params[k]; });
    const { data } = await api.get('/admin/users', { params });
    setUsers(data.users);
    setLoading(false);
  };

  useEffect(() => { load(); }, [sort]);

  const applyFilters = (e) => { e.preventDefault(); load(); };

  const toggleSort = (field) => {
    setSort((s) => ({
      sortBy: field,
      order: s.sortBy === field && s.order === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const SortIcon = ({ field }) =>
    sort.sortBy === field ? (sort.order === 'ASC' ? <ChevronUp size={13} style={{ verticalAlign: -2 }} /> : <ChevronDown size={13} style={{ verticalAlign: -2 }} />) : null;

  return (
    <Layout title="Users">
      <div className="panel">
        <form className="filters-row" onSubmit={applyFilters}>
          <input placeholder="Filter by name" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
          <input placeholder="Filter by email" value={filters.email} onChange={(e) => setFilters({ ...filters, email: e.target.value })} />
          <input placeholder="Filter by address" value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} />
          <select value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })}>
            <option value="">All roles</option>
            <option value="admin">Admin</option>
            <option value="user">Normal user</option>
            <option value="owner">Store owner</option>
          </select>
          <button className="btn btn-primary btn-sm">Apply filters</button>
        </form>

        {loading ? (
          <div className="loading">Loading users…</div>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <h3>No users found</h3>
            <p>Try adjusting your filters.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th onClick={() => toggleSort('name')}>Name <SortIcon field="name" /></th>
                <th onClick={() => toggleSort('email')}>Email <SortIcon field="email" /></th>
                <th onClick={() => toggleSort('address')}>Address <SortIcon field="address" /></th>
                <th onClick={() => toggleSort('role')}>Role <SortIcon field="role" /></th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.address}</td>
                  <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                  <td>{u.role === 'owner' ? <RatingChip value={u.rating} /> : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}
