document.addEventListener('DOMContentLoaded', async () => {
  const nav = document.getElementById('homeNav');
  const heroText = document.querySelector('.hero-content p');
  const user = await fetchCurrentUserOrNull();

  if (user) {
    nav.innerHTML = `
      <a href="dashboard.html">Dashboard</a>
      <a href="#search">Search Houses</a>
      <a href="#" onclick="logout(); return false;">Logout</a>
    `;
    if (heroText) {
      heroText.textContent = `Welcome back, ${user.name}. Find verified rentals, save favorites, and manage your dashboard.`;
    }
    return;
  }

  nav.innerHTML = `
    <a href="register.html">Register</a>
    <a href="login.html">Login</a>
    <a href="#search">Search Houses</a>
  `;
});
