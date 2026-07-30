import React, { useEffect, useMemo, useState } from 'react';
import './AdminDashboard.css';

const apiBase = 'http://localhost:8080/api/admin';

const formatDate = (value) => {
  if (!value) return 'N/A';
  return new Date(value).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
};

const emptyDashboard = {
  totalApplications: 0,
  pendingApplications: 0,
  approvedApplications: 0,
  rejectedApplications: 0,
  totalFarmers: 0,
  activeFarmers: 0,
  totalRiders: 0,
  activeRiders: 0,
  totalUsers: 0,
  activeUsers: 0,
  totalAdmins: 0,
  activeAdmins: 0,
  totalOrders: 0,
  totalProducts: 0
};

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [farmers, setFarmers] = useState([]);
  const [riders, setRiders] = useState([]);
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);

  const headers = useMemo(() => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  const fetchJson = async (path, options = {}) => {
    const response = await fetch(`${apiBase}${path}`, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers || {})
      }
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }
    return data;
  };

  const loadOverview = async () => {
    const data = await fetchJson('/dashboard');
    setDashboard(data);
  };

  const loadApplications = async () => {
    const data = await fetchJson('/farmer-applications');
    setApplications(data);
    if (!selectedApplication && data.length > 0) {
      setSelectedApplication(data[0]);
    }
  };

  const loadAccounts = async () => {
    const [farmerData, riderData, userData, adminData] = await Promise.all([
      fetchJson('/farmers'),
      fetchJson('/riders'),
      fetchJson('/users'),
      fetchJson('/admins')
    ]);
    setFarmers(farmerData);
    setRiders(riderData);
    setUsers(userData);
    setAdmins(adminData);
  };

  const refreshAll = async () => {
    setLoading(true);
    try {
      await Promise.all([loadOverview(), loadApplications(), loadAccounts()]);
    } catch (error) {
      setNotice(error.message || 'Unable to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const showMessage = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 4500);
  };

  const approveApplication = async (applicationId) => {
    try {
      const result = await fetchJson(`/farmer-applications/${applicationId}/approve`, { method: 'POST' });
      showMessage(`${result.message}${result.generatedFarmerId ? ` | ID: ${result.generatedFarmerId}` : ''}`);
      await refreshAll();
    } catch (error) {
      showMessage(error.message);
    }
  };

  const rejectApplication = async (applicationId) => {
    try {
      const result = await fetchJson(`/farmer-applications/${applicationId}/reject`, { method: 'POST' });
      showMessage(result.message);
      await refreshAll();
    } catch (error) {
      showMessage(error.message);
    }
  };

  const toggleAccount = async (kind, account) => {
    try {
      const result = await fetchJson(`/${kind}/${account.id}/status?active=${!account.active}`, { method: 'PUT' });
      showMessage(result.message);
      await refreshAll();
    } catch (error) {
      showMessage(error.message);
    }
  };

  const accountSections = {
    farmers,
    riders,
    users,
    admins
  };

  return (
    <div className="admin-dashboard-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand-zone">
          <h2>Farmer<span>AGRI</span></h2>
          <span className="role-pill admin">ADMIN</span>
        </div>

        <nav className="admin-sidebar-nav">
          {['overview', 'applications', 'farmers', 'riders', 'users', 'admins'].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`admin-nav-item ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'overview' && '📊'}
              {tab === 'applications' && '📄'}
              {tab === 'farmers' && '🚜'}
              {tab === 'riders' && '🚚'}
              {tab === 'users' && '🧑‍💼'}
              {tab === 'admins' && '🛡️'}
              <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button type="button" className="admin-logout-btn" onClick={onLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      <main className="admin-main-viewport">
        <header className="admin-top-strip">
          <div>
            <p className="section-kicker">Platform control center</p>
            <h1>Admin Dashboard</h1>
            <p className="section-summary">Approve farmers, manage roles, and monitor the platform from one place.</p>
          </div>
          {notice && <div className="admin-notice">{notice}</div>}
        </header>

        {loading ? (
          <div className="admin-loading-card">Loading admin data...</div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <section className="admin-overview-grid">
                {[
                  ['Applications', dashboard.totalApplications],
                  ['Pending', dashboard.pendingApplications],
                  ['Farmers', dashboard.totalFarmers],
                  ['Riders', dashboard.totalRiders],
                  ['Users', dashboard.totalUsers],
                  ['Orders', dashboard.totalOrders]
                ].map(([label, value]) => (
                  <article key={label} className="admin-stat-card">
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </article>
                ))}
              </section>
            )}

            {activeTab === 'applications' && (
              <section className="admin-split-panel">
                <div className="admin-list-card">
                  <div className="card-heading-row">
                    <h2>Farmer Applications</h2>
                    <span>{applications.length} records</span>
                  </div>
                  <div className="admin-record-list">
                    {applications.map((application) => (
                      <button
                        key={application.id}
                        type="button"
                        className={`admin-record-item ${selectedApplication?.id === application.id ? 'selected' : ''}`}
                        onClick={() => setSelectedApplication(application)}
                      >
                        <div>
                          <strong>{application.name}</strong>
                          <p>{application.location}</p>
                        </div>
                        <span className={`status-pill ${String(application.status || '').toLowerCase()}`}>{application.status}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="admin-detail-card">
                  {selectedApplication ? (
                    <>
                      <div className="card-heading-row">
                        <h2>Application Details</h2>
                        <span>{formatDate(selectedApplication.createdAt)}</span>
                      </div>
                      <div className="detail-grid">
                        <div><label>Name</label><p>{selectedApplication.name}</p></div>
                        <div><label>Phone</label><p>{selectedApplication.phone}</p></div>
                        <div><label>Location</label><p>{selectedApplication.location}</p></div>
                        <div><label>Status</label><p>{selectedApplication.status}</p></div>
                        <div><label>Land Patta</label><p>{selectedApplication.landPattaNo}</p></div>
                        <div><label>Kisan Card</label><p>{selectedApplication.kisanCardNo}</p></div>
                        <div><label>Co-op Society</label><p>{selectedApplication.coopSocietyNo}</p></div>
                      </div>
                      <div className="admin-action-row">
                        <button type="button" className="approve-btn" onClick={() => approveApplication(selectedApplication.id)} disabled={selectedApplication.status !== 'PENDING'}>
                          Approve
                        </button>
                        <button type="button" className="reject-btn" onClick={() => rejectApplication(selectedApplication.id)} disabled={selectedApplication.status !== 'PENDING'}>
                          Reject
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="empty-state-text">Select an application to inspect its details.</p>
                  )}
                </div>
              </section>
            )}

            {['farmers', 'riders', 'users', 'admins'].includes(activeTab) && (
              <section className="admin-record-grid">
                {accountSections[activeTab].map((account) => (
                  <article key={`${activeTab}-${account.id}`} className="account-card">
                    <div className="card-heading-row compact">
                      <div>
                        <h2>{account.name}</h2>
                        <p>{account.identifier}</p>
                      </div>
                      <span className={`status-pill ${account.active ? 'active' : 'inactive'}`}>{account.active ? 'Active' : 'Inactive'}</span>
                    </div>
                    <div className="account-meta">
                      <span>Role: {account.role}</span>
                      <span>Location: {account.location || 'N/A'}</span>
                      <span>Joined: {formatDate(account.createdAt)}</span>
                    </div>
                    <button type="button" className="toggle-status-btn" onClick={() => toggleAccount(activeTab, account)}>
                      {account.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </article>
                ))}
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}