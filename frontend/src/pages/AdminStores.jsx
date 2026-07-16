import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import RatingChip from '../components/RatingChip';
import { ChevronUp, ChevronDown } from 'lucide-react';

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sort, setSort] = useState({ sortBy: 'name', order: 'ASC' });

  const load = async () => {
    setLoading(true);
    const params = { ...filters, ...sort };
    Object.keys(params).forEach((k) => { if (!params[k]) delete params[k]; });
    const { data } = await api.get('/admin/stores', { params });
    setStores(data.stores);
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
    <Layout title="Stores">
      <div className="panel">
        <form className="filters-row" onSubmit={applyFilters}>
          <input placeholder="Filter by name" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
          <input placeholder="Filter by email" value={filters.email} onChange={(e) => setFilters({ ...filters, email: e.target.value })} />
          <input placeholder="Filter by address" value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} />
          <button className="btn btn-primary btn-sm">Apply filters</button>
        </form>

        {loading ? (
          <div className="loading">Loading stores…</div>
        ) : stores.length === 0 ? (
          <div className="empty-state">
            <h3>No stores yet</h3>
            <p>Add one from the "Add User" page or the API.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th onClick={() => toggleSort('name')}>Name <SortIcon field="name" /></th>
                <th onClick={() => toggleSort('email')}>Email <SortIcon field="email" /></th>
                <th onClick={() => toggleSort('address')}>Address <SortIcon field="address" /></th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.address}</td>
                  <td><RatingChip value={s.rating} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}
