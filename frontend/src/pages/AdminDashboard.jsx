import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import { Users, Store, Star } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then((res) => setStats(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <Layout title="Dashboard">
      {loading ? (
        <div className="loading">Loading stats…</div>
      ) : (
        <div className="stat-grid">
          <div className="stat-card">
            <div className="label"><Users size={13} style={{ marginRight: 6, verticalAlign: -2 }} />Total users</div>
            <div className="value">{stats.totalUsers}</div>
          </div>
          <div className="stat-card">
            <div className="label"><Store size={13} style={{ marginRight: 6, verticalAlign: -2 }} />Total stores</div>
            <div className="value">{stats.totalStores}</div>
          </div>
          <div className="stat-card">
            <div className="label"><Star size={13} style={{ marginRight: 6, verticalAlign: -2 }} />Total ratings</div>
            <div className="value">{stats.totalRatings}</div>
          </div>
        </div>
      )}
    </Layout>
  );
}
