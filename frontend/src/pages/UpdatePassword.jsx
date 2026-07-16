import { useState } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';

export default function UpdatePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      await api.put('/auth/password', { currentPassword, newPassword });
      setSuccess('Password updated successfully.');
      setCurrentPassword(''); setNewPassword('');
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Could not update password.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Update password">
      <div className="panel" style={{ maxWidth: 420 }}>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Current password</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
          </div>
          <div className="field">
            <label>New password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            <div className="field-hint">8–16 characters, 1 uppercase letter, 1 special character</div>
          </div>
          <button className="btn btn-primary" disabled={loading}>
            {loading ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </div>
    </Layout>
  );
}
