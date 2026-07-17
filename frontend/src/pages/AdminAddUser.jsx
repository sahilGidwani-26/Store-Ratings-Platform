import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Layout from '../components/Layout';
import api from '../api/axios';

export default function AdminAddUser() {
  const [tab, setTab] = useState('user');

  const [userForm, setUserForm] = useState({ name: '', email: '', address: '', password: '', role: 'user' });
  const [showPassword, setShowPassword] = useState(false);
  const [userMsg, setUserMsg] = useState({ type: '', text: '' });
  const [userLoading, setUserLoading] = useState(false);

  const [storeForm, setStoreForm] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [storeMsg, setStoreMsg] = useState({ type: '', text: '' });
  const [storeLoading, setStoreLoading] = useState(false);
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    api.get('/admin/users', { params: { role: 'owner' } }).then((res) => setOwners(res.data.users));
  }, [tab, userMsg]);

  const submitUser = async (e) => {
    e.preventDefault();
    setUserMsg({ type: '', text: '' });
    setUserLoading(true);
    try {
      await api.post('/admin/users', userForm);
      setUserMsg({ type: 'success', text: `${userForm.role === 'admin' ? 'Admin' : userForm.role === 'owner' ? 'Store owner' : 'User'} account created.` });
      setUserForm({ name: '', email: '', address: '', password: '', role: 'user' });
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Could not create user.';
      setUserMsg({ type: 'error', text: msg });
    } finally {
      setUserLoading(false);
    }
  };

  const submitStore = async (e) => {
    e.preventDefault();
    setStoreMsg({ type: '', text: '' });
    setStoreLoading(true);
    try {
      const payload = { ...storeForm, ownerId: storeForm.ownerId || undefined };
      await api.post('/admin/stores', payload);
      setStoreMsg({ type: 'success', text: 'Store created.' });
      setStoreForm({ name: '', email: '', address: '', ownerId: '' });
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Could not create store.';
      setStoreMsg({ type: 'error', text: msg });
    } finally {
      setStoreLoading(false);
    }
  };

  return (
    <Layout title="Add user or store">
      <div className="panel" style={{ maxWidth: 480 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <button className={`btn btn-sm ${tab === 'user' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('user')}>New account</button>
          <button className={`btn btn-sm ${tab === 'store' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('store')}>New store</button>
        </div>

        {tab === 'user' ? (
          <>
            {userMsg.text && <div className={`alert alert-${userMsg.type}`}>{userMsg.text}</div>}
            <form onSubmit={submitUser}>
              <div className="field">
                <label>Full name</label>
                <input value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} required />
                <div className="field-hint">20–60 characters</div>
              </div>
              <div className="field">
                <label>Email</label>
                <input type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} required />
              </div>
              <div className="field">
                <label>Address</label>
                <input value={userForm.address} onChange={(e) => setUserForm({ ...userForm, address: e.target.value })} required />
              </div>
              <div className="field">
                <label>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    required
                    style={{ paddingRight: 40 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    style={{
                      position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', padding: 2,
                      display: 'flex', color: 'var(--text-muted)',
                    }}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                <div className="field-hint">8–16 characters, 1 uppercase letter, 1 special character</div>
              </div>
              <div className="field">
                <label>Role</label>
                <select value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}>
                  <option value="user">Normal user</option>
                  <option value="admin">System administrator</option>
                  <option value="owner">Store owner</option>
                </select>
              </div>
              <button className="btn btn-primary" disabled={userLoading}>
                {userLoading ? 'Creating…' : 'Create account'}
              </button>
            </form>
          </>
        ) : (
          <>
            {storeMsg.text && <div className={`alert alert-${storeMsg.type}`}>{storeMsg.text}</div>}
            <form onSubmit={submitStore}>
              <div className="field">
                <label>Store name</label>
                <input value={storeForm.name} onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })} required />
                <div className="field-hint">20–60 characters</div>
              </div>
              <div className="field">
                <label>Store email</label>
                <input type="email" value={storeForm.email} onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })} required />
              </div>
              <div className="field">
                <label>Address</label>
                <input value={storeForm.address} onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })} required />
              </div>
              <div className="field">
                <label>Store owner (optional)</label>
                <select value={storeForm.ownerId} onChange={(e) => setStoreForm({ ...storeForm, ownerId: e.target.value })}>
                  <option value="">— None —</option>
                  {owners.map((o) => (
                    <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
                  ))}
                </select>
                <div className="field-hint">Create a "Store owner" account first if the owner isn't listed.</div>
              </div>
              <button className="btn btn-primary" disabled={storeLoading}>
                {storeLoading ? 'Creating…' : 'Create store'}
              </button>
            </form>
          </>
        )}
      </div>
    </Layout>
  );
}