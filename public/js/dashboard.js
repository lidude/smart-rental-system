document.addEventListener('DOMContentLoaded', async () => {
  requireAuth();
  const user = await fetchCurrentUser();
  if (!user) return;

  document.getElementById('welcome').textContent = `Welcome, ${user.name}!`;
  document.getElementById('roleNotice').textContent = `Role: ${user.role}`;

  if (user.role === 'admin') {
    document.getElementById('adminActions').innerHTML = '<p>Use the Admin panel to manage listings, brokers, and reports.</p>';
  }

  if (user.role === 'owner' || user.role === 'broker') {
    document.getElementById('ownerActions').innerHTML = '<a class="button" href="add-listing.html">Post a new listing</a>';
    loadUserListings();
  }

  if (user.role === 'seeker') {
    document.getElementById('seekerActions').innerHTML = '<p>Browse and favorite verified listings from the home page.</p>';
    loadFavorites();
  }
});

async function loadUserListings() {
  const response = await authFetch('/api/user/listings');
  const section = document.getElementById('listingsSection');
  if (!response.ok) {
    section.innerHTML = '<p>Unable to load your listings.</p>';
    return;
  }
  const data = await response.json();
  section.innerHTML = '<h2>Your Listings</h2>' + renderListingCards(data.listings || []);
}

async function loadFavorites() {
  const response = await authFetch('/api/user/favorites');
  const section = document.getElementById('listingsSection');
  if (!response.ok) {
    section.innerHTML = '<p>Unable to load favorites.</p>';
    return;
  }
  const data = await response.json();
  section.innerHTML = '<h2>Your Favorites</h2>' + renderFavoriteCards(data.favorites || []);
}

function renderListingCards(listings) {
  if (!listings.length) return '<p>No listings yet. Add one from the button above.</p>';
  return listings.map(listing => `
    <div class="card">
      <h3>${listing.title}</h3>
      <p>${listing.city} • ${listing.area}</p>
      <p>${listing.rooms} rooms • ${listing.type}</p>
      <p><strong>ETB ${listing.price}</strong></p>
      <p>Status: ${listing.status}</p>
    </div>
  `).join('');
}

function renderFavoriteCards(listings) {
  if (!listings.length) return '<p>No favorite houses yet. Add some from the home page.</p>';
  return listings.map(listing => `
    <div class="card">
      <h3>${listing.title}</h3>
      <p>${listing.city} • ${listing.area}</p>
      <p>${listing.rooms} rooms • ${listing.type}</p>
      <p><strong>ETB ${listing.price}</strong></p>
      <button class="button secondary" onclick="removeFavorite(${listing.id})">Remove Favorite</button>
    </div>
  `).join('');
}

async function removeFavorite(listingId) {
  const response = await authFetch(`/api/favorites/${listingId}`, { method: 'DELETE' });
  if (response.ok) {
    loadFavorites();
  } else {
    alert('Unable to remove favorite');
  }
}
