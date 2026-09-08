require('dotenv').config();
const express   = require('express');
const path      = require('path');
const helmet    = require('helmet');
const cors      = require('cors');
const rateLimit = require('express-rate-limit');
const { init, stmts } = require('./db');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:    ["'self'"],
      scriptSrc:     ["'self'", "'unsafe-inline'", "fonts.googleapis.com", "www.googletagmanager.com"],
      scriptSrcAttr: ["'unsafe-inline'"],
      styleSrc:      ["'self'", "'unsafe-inline'", "fonts.googleapis.com", "fonts.gstatic.com"],
      fontSrc:       ["'self'", "fonts.gstatic.com"],
      imgSrc:        ["'self'", "data:", "www.google-analytics.com"],
      connectSrc:    ["'self'", "www.google-analytics.com"],
      mediaSrc:      ["'self'", "data:"],
      objectSrc:     ["'none'"],
      frameSrc:      ["'none'"],
    }
  },
  hidePoweredBy: true,
  frameguard: { action: 'deny' },
}));

app.use(cors({ origin: ['http://localhost:3000'], methods: ['GET','POST'] }));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public'), { dotfiles: 'deny' }));

const formLimiter  = rateLimit({ windowMs:15*60*1000, max:5, message:{success:false,message:'Too many submissions. Please wait 15 minutes.'} });
const adminLimiter = rateLimit({ windowMs:15*60*1000, max:200 });

app.use((req, res, next) => {
  res.removeHeader('X-Powered-By');
  if (req.method==='GET' && !req.path.startsWith('/api') && !req.path.startsWith('/admin') && !req.path.includes('.')) {
    try { stmts.insertPageView(req.path, req.ip, req.headers['user-agent']||''); } catch{}
  }
  next();
});

const apiRoutes   = require('./routes/api');
const adminRoutes = require('./routes/admin');
app.use('/api',   formLimiter,  apiRoutes);
app.use('/admin', adminLimiter, adminRoutes);

// Sitemap
app.get('/sitemap.xml', (req, res) => {
  res.set('Content-Type','text/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>http://localhost:${PORT}/</loc><priority>1.0</priority></url>
  <url><loc>http://localhost:${PORT}/#about</loc><priority>0.8</priority></url>
  <url><loc>http://localhost:${PORT}/#services</loc><priority>0.9</priority></url>
  <url><loc>http://localhost:${PORT}/#projects</loc><priority>0.8</priority></url>
  <url><loc>http://localhost:${PORT}/#apply</loc><priority>0.9</priority></url>
</urlset>`);
});

// Robots.txt
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send('User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: http://localhost:3000/sitemap.xml');
});

app.get('/', (req,res) => res.sendFile(path.join(__dirname,'public','index.html')));
app.use((req,res) => res.status(404).json({success:false,message:'Not found'}));
app.use((err,req,res,next) => { console.error('[ERROR]',err.message); res.status(500).json({success:false,message:'Something went wrong.'}); });

init().then(() => {
  app.listen(PORT, () => {
    console.log(`\n✅  Server started`);
    console.log(`🌐  Website  →  http://localhost:${PORT}`);
    console.log(`🔧  Admin    →  http://localhost:${PORT}/admin\n`);
  });
}).catch(err => { console.error('❌ Failed to start:', err); process.exit(1); });

module.exports = app;
