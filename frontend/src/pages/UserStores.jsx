import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import StarRating from '../components/StarRating';
import RatingChip from '../components/RatingChip';
import { Search, MapPin } from 'lucide-react';

export default function UserStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [savingId, setSavingId] = useState(null);

  const load = async (q) => {
    setLoading(true);
    const { data } = await api.get('/stores', { params: q ? { search: q } : {} });
    setStores(data.stores);
    setLoading(false);
  };

  useEffect(() => { load(''); }, []);

  const handleSearch = (e) => { e.preventDefault(); load(search); };

  const rate = async (store, value) => {
    setSavingId(store.id);
    try {
      if (store.userRating) {
        await api.put(`/stores/${store.id}/ratings`, { rating: value });
      } else {
        await api.post(`/stores/${store.id}/ratings`, { rating: value });
      }
      await load(search);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <Layout title="Stores">
      <form className="filters-row" onSubmit={handleSearch} style={{ marginBottom: 20 }}>
        <input
          placeholder="Search by name or address"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ minWidth: 280 }}
        />
        <button className="btn btn-primary btn-sm"><Search size={14} style={{ marginRight: 4, verticalAlign: -2 }} />Search</button>
      </form>

      {loading ? (
        <div className="loading">Loading stores…</div>
      ) : stores.length === 0 ? (
        <div className="empty-state">
          <h3>No stores found</h3>
          <p>Try a different search term.</p>
        </div>
      ) : (
        <div className="store-grid">
          {stores.map((s) => (
            <div className="store-card" key={s.id}>
              <h3>{s.name}</h3>
              <div className="addr"><MapPin size={12} style={{ verticalAlign: -1, marginRight: 4 }} />{s.address}</div>
              <div className="ratings-row">
                <RatingChip value={s.overallRating} />
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {s.userRating ? 'Your rating' : 'Rate this store'}
                </span>
              </div>
              <StarRating
                value={s.userRating || 0}
                onChange={(v) => rate(s, v)}
              />
              {savingId === s.id && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Saving…</div>}
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
