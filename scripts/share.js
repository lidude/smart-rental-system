const localtunnel = require('localtunnel');

async function main() {
  const port = process.env.PORT || 4000;
  const subdomain = process.env.TUNNEL_SUBDOMAIN;

  try {
    const tunnel = await localtunnel({ port: Number(port), subdomain });
    console.log(`Shareable URL: ${tunnel.url}`);
    console.log('Keep this terminal open while the tunnel is active.');
    console.log('Press Ctrl+C to stop the tunnel.');

    tunnel.on('close', () => {
      console.log('Tunnel closed');
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to create shareable link:', error.message || error);
    process.exit(1);
  }
}

main();
