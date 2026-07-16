import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import RatingChip from '../components/RatingChip';

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/owner/dashboard')
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load dashboard.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Layout title="Dashboard"><div className="loading">Loading…</div></Layout>;

  if (error) {
    return (
      <Layout title="Dashboard">
        <div className="empty-state">
          <h3>{error}</h3>
          <p>Ask an administrator to link a store to your account.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard">
      <div className="stat-grid">
        <div className="stat-card">
          <div className="label">Store</div>
          <div className="value" style={{ fontSize: 20 }}>{data.store.name}</div>
        </div>
        <div className="stat-card">
          <div className="label">Average rating</div>
          <div className="value"><RatingChip value={data.averageRating} /></div>
        </div>
        <div className="stat-card">
          <div className="label">Total raters</div>
          <div className="value">{data.raters.length}</div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header"><h2 style={{ fontSize: 16 }}>Users who rated your store</h2></div>
        {data.raters.length === 0 ? (
          <div className="empty-state">
            <h3>No ratings yet</h3>
            <p>Ratings from customers will appear here.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Rating</th></tr>
            </thead>
            <tbody>
              {data.raters.map((r) => (
                <tr key={r.userId}>
                  <td>{r.name}</td>
                  <td>{r.email}</td>
                  <td><RatingChip value={r.rating} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}
