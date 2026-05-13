document.addEventListener('DOMContentLoaded', async () => {
  requireAuth();
  const user = await fetchCurrentUser();
  if (!user || user.role !== 'admin') {
    document.getElementById('adminNotice').textContent = 'Access denied. Admin user only.';
    return;
  }
  loadPendingListings();
  loadPendingBrokers();
  loadReports();
});

async function loadPendingListings() {
  const response = await authFetch('/api/admin/pending-listings');
  const container = document.getElementById('pendingListings');
  if (!response.ok) {
    container.innerHTML = '<p>Unable to load pending listings.</p>';
    return;
  }
  const data = await response.json();
  container.innerHTML = '<h2>Pending Listings</h2>' + renderAdminCards(data.pending || [], 'listing');
}

async function loadPendingBrokers() {
  const response = await authFetch('/api/admin/pending-brokers');
  const container = document.getElementById('pendingBrokers');
  if (!response.ok) {
    container.innerHTML = '<p>Unable to load brokers.</p>';
    return;
  }
  const data = await response.json();
  container.innerHTML = '<h2>Broker Verifications</h2>' + renderBrokerCards(data.brokers || []);
}

async function loadReports() {
  const response = await authFetch('/api/admin/reports');
  const container = document.getElementById('reportsSection');
  if (!response.ok) {
    container.innerHTML = '<p>Unable to load reports.</p>';
    return;
  }
  const data = await response.json();
  container.innerHTML = '<h2>Reports</h2>' + renderReportCards(data.reports || []);
}

function renderAdminCards(items, type) {
  if (!items.length) return '<p>No items waiting for review.</p>';
  return items.map(item => `
    <div class="card">
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <p>${item.city} • ${item.area} • ${item.rooms} rooms • ${item.type}</p>
      <p><strong>ETB ${item.price}</strong></p>
      <p>Posted by owner ${item.owner_id}</p>
      <div class="card-actions">
        <button class="button" onclick="handleListing(${item.id}, true)">Approve</button>
        <button class="button secondary" onclick="handleListing(${item.id}, false)">Reject</button>
      </div>
    </div>
  `).join('');
}

function renderBrokerCards(brokers) {
  if (!brokers.length) return '<p>No brokers to review.</p>';
  return brokers.map(broker => `
    <div class="card">
      <h3>${broker.name}</h3>
      <p>${broker.email} • ${broker.phone}</p>
      <p>ID: ${broker.national_id || 'N/A'}</p>
      <p>Status: ${broker.broker_verified ? 'Verified' : 'Not verified'}</p>
      <div class="card-actions">
        <button class="button" onclick="verifyBroker(${broker.id}, true)">Verify</button>
        <button class="button secondary" onclick="verifyBroker(${broker.id}, false)">Reset</button>
      </div>
    </div>
  `).join('');
}

function renderReportCards(reports) {
  if (!reports.length) return '<p>No reports submitted.</p>';
  return reports.map(report => `
    <div class="card">
      <h3>${report.listing_title}</h3>
      <p>Reported by: ${report.reporter_name}</p>
      <p>${report.message}</p>
      <p>Status: ${report.status}</p>
    </div>
  `).join('');
}

async function handleListing(listingId, approve) {
  const response = await authFetch('/api/admin/approve-listing', {
    method: 'POST',
    body: JSON.stringify({ listing_id: listingId, approve })
  });
  if (response.ok) {
    loadPendingListings();
  } else {
    alert('Unable to update listing.');
  }
}

async function verifyBroker(brokerId, verify) {
  const response = await authFetch('/api/admin/verify-broker', {
    method: 'POST',
    body: JSON.stringify({ broker_id: brokerId, verify })
  });
  if (response.ok) {
    loadPendingBrokers();
  } else {
    alert('Unable to update broker verification.');
  }
}
