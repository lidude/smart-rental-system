const listingsContainer = document.getElementById('listings');
const searchForm = document.getElementById('searchForm');

async function loadListings(query = {}) {
  const queryString = new URLSearchParams(query).toString();
  const requestFn = typeof authFetch === 'function' ? authFetch : fetch;
  const response = await requestFn(`/api/listings?${queryString}`);
  if (!response.ok) {
    listingsContainer.innerHTML = '<p>Unable to load listings right now.</p>';
    return;
  }
  const data = await response.json();
  renderListings(data.listings || []);
}

function renderListings(listings) {
  if (!listings.length) {
    listingsContainer.innerHTML = '<p>No listings found. Try a wider search.</p>';
    return;
  }
  listingsContainer.innerHTML = listings.map(listing => {
    const thumbnail = listing.photos ? listing.photos.split(',')[0] : '';
    const pendingLabel = listing.status !== 'approved' ? `<div class="badge">${listing.status.toUpperCase()}</div>` : '';
    return `
      <a class="card listing-link" href="listing.html?id=${listing.id}">
        ${thumbnail ? `<img class="listing-thumb" src="/uploads/${thumbnail}" alt="${listing.title}" />` : ''}
        <div>
          <h3>${listing.title}</h3>
          ${pendingLabel}
          <p>${listing.description || 'No description available.'}</p>
          <div class="meta">
            <span>${listing.city} • ${listing.area}</span>
            <span>${listing.rooms} rooms</span>
            <span>${listing.type}</span>
          </div>
          <p><strong>ETB ${listing.price}</strong></p>
          <p>Status: ${listing.status}</p>
        </div>
      </a>
    `;
  }).join('');
}

if (searchForm) {
  searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(searchForm);
    const query = {};
    for (const [key, value] of formData.entries()) {
      if (value) query[key] = value;
    }
    loadListings(query);
  });
}

if (listingsContainer) {
  loadListings();
}
