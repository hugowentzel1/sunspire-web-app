const https = require('https');
const url = process.env.NEXT_PUBLIC_APP_URL;
const start = Date.now();
function check() {
  https.get(url, res => {
    if (res.statusCode === 200) { console.log('Live!'); process.exit(0); }
    if (Date.now() - start > 600000) { console.error('Timeout'); process.exit(1); }
    setTimeout(check, 5000);
  }).on('error', () => setTimeout(check, 5000));
}
check();
