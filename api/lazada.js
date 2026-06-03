// Vercel Serverless Function — Lazada Affiliate Link Generator
// Credentials อยู่ใน Vercel Environment Variables เท่านั้น ไม่ถูก expose ให้ frontend
import crypto from 'node:crypto';

const LAZADA_API_URL = 'https://auth.lazada.com/rest';

function sign(method, params, secret) {
  const sorted = Object.keys(params).sort().map(k => k + params[k]).join('');
  const str = method + sorted;
  return crypto.createHmac('sha256', secret).update(str).digest('hex').toUpperCase();
}

export default async function handler(req, res) {
  // CORS — อนุญาตเฉพาะโดเมนของเรา
  res.setHeader('Access-Control-Allow-Origin', 'https://suksanfongfon.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url parameter' });

  const APP_KEY    = process.env.LAZADA_APP_KEY;
  const APP_SECRET = process.env.LAZADA_APP_SECRET;
  const TOKEN      = process.env.LAZADA_USER_TOKEN;

  if (!APP_KEY || !APP_SECRET || !TOKEN) {
    return res.status(500).json({ error: 'Lazada credentials not configured' });
  }

  const method = '/lazada/open/affiliate/link/generate';
  const ts = Date.now().toString();

  const params = {
    app_key:      APP_KEY,
    timestamp:    ts,
    sign_method:  'sha256',
    access_token: TOKEN,
    promotion_link_type: '2',       // 2 = custom deeplink
    deep_link_url: decodeURIComponent(url),
  };

  params.sign = sign(method, params, APP_SECRET);

  const qs = new URLSearchParams(params).toString();
  const apiUrl = `${LAZADA_API_URL}${method}?${qs}`;

  try {
    const lazRes = await fetch(apiUrl);
    const data = await lazRes.json();

    if (data.code !== '0') {
      // fallback: return original URL if API error
      return res.status(200).json({ affiliate_url: decodeURIComponent(url), fallback: true, error: data.message });
    }

    const affiliateUrl = data.result?.click_url || data.result?.[0]?.click_url || decodeURIComponent(url);
    return res.status(200).json({ affiliate_url: affiliateUrl });
  } catch (err) {
    // network error → fallback to original URL
    return res.status(200).json({ affiliate_url: decodeURIComponent(url), fallback: true });
  }
}
