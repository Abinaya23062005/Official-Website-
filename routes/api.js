const express    = require('express');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const { stmts }  = require('../db');
const router     = express.Router();

let transporter = null;
function getTransporter() {
  if (transporter) return transporter;
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
  }
  return transporter;
}

// Email to Abinaya (notification)
async function sendOwnerEmail(data) {
  const tp = getTransporter();
  if (!tp) return;
  try {
    await tp.sendMail({
      from: `"Abinaya Portfolio" <${process.env.EMAIL_USER}>`,
      to:   process.env.EMAIL_TO,
      subject: `📩 New Application: ${data.service} — ${data.first_name} ${data.last_name||''}`,
      html: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:12px;overflow:hidden">
  <div style="background:#e8c547;padding:1.2rem 1.8rem"><h2 style="margin:0;color:#080b10">🎉 New Application!</h2></div>
  <div style="padding:1.6rem 1.8rem;background:#fff">
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr><td style="padding:8px 0;color:#888;font-weight:bold;width:110px">Name</td><td>${data.first_name} ${data.last_name||''}</td></tr>
      <tr style="background:#fafafa"><td style="padding:8px;color:#888;font-weight:bold">Email</td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
      <tr><td style="padding:8px 0;color:#888;font-weight:bold">Phone</td><td>${data.phone||'Not provided'}</td></tr>
      <tr style="background:#fafafa"><td style="padding:8px;color:#888;font-weight:bold">Service</td><td><strong>${data.service}</strong></td></tr>
      <tr><td style="padding:8px 0;color:#888;font-weight:bold;vertical-align:top">Message</td><td>${data.message||'—'}</td></tr>
    </table>
    <div style="margin-top:1rem;padding:.8rem 1rem;background:#fffbea;border-left:4px solid #e8c547;border-radius:4px;font-size:13px;color:#555">
      💡 Reply to <strong><a href="mailto:${data.email}">${data.email}</a></strong>
    </div>
  </div>
</div>`
    });
    console.log('✅ Owner notification email sent');
  } catch(err) { console.error('❌ Owner email error:', err.message); }
}

// Auto-reply to applicant
async function sendApplicantReply(data) {
  const tp = getTransporter();
  if (!tp) return;
  try {
    await tp.sendMail({
      from: `"Abinaya" <${process.env.EMAIL_USER}>`,
      to:   data.email,
      subject: `✅ Application Received — ${data.service}`,
      html: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:12px;overflow:hidden">
  <div style="background:#e8c547;padding:1.2rem 1.8rem"><h2 style="margin:0;color:#080b10">Hi ${data.first_name}! 👋</h2></div>
  <div style="padding:1.6rem 1.8rem;background:#fff">
    <p style="font-size:15px;color:#333;line-height:1.7">Thank you for reaching out! I've received your application for <strong>${data.service}</strong> and will get back to you within <strong>24 hours</strong>.</p>
    <div style="background:#f9f9f9;border-radius:8px;padding:1rem 1.2rem;margin:1rem 0">
      <p style="margin:0;font-size:13px;color:#666"><strong>Your submission details:</strong></p>
      <p style="margin:.4rem 0 0;font-size:13px;color:#444">Service: ${data.service}<br>${data.message ? 'Message: '+data.message : ''}</p>
    </div>
    <p style="font-size:14px;color:#555;line-height:1.7">In the meantime, feel free to check out my work on <a href="https://github.com/abinaya" style="color:#1a6b3a">GitHub</a> or connect with me on <a href="https://linkedin.com/in/abinaya" style="color:#1a6b3a">LinkedIn</a>.</p>
    <p style="font-size:14px;color:#555;margin-top:1rem">Best regards,<br><strong>Abinaya</strong><br>Full Stack Developer · DSA Educator · Chennai 🇮🇳</p>
  </div>
  <div style="padding:.8rem 1.8rem;background:#f9f9f9;text-align:center;font-size:12px;color:#aaa">abinaya230605@gmail.com · +91 81483 28608</div>
</div>`
    });
    console.log('✅ Applicant auto-reply sent to', data.email);
  } catch(err) { console.error('❌ Auto-reply error:', err.message); }
}

router.post('/apply', [
  body('first_name').trim().notEmpty().withMessage('First name is required').isLength({max:60}),
  body('last_name').trim().optional().isLength({max:60}),
  body('email').trim().isEmail().withMessage('Valid email required').normalizeEmail(),
  body('phone').trim().optional().isLength({max:20}),
  body('service').trim().notEmpty().withMessage('Please select a service'),
  body('message').trim().optional().isLength({max:2000}),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({success:false, errors:errors.array()});
  try {
    const { first_name, last_name, email, phone, service, message } = req.body;
    const ip_address = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const result = stmts.insertApplication({ first_name, last_name:last_name||'', email, phone:phone||'', service, message:message||'', ip_address });
    // Send both emails non-blocking
    sendOwnerEmail({ first_name, last_name, email, phone, service, message }).catch(()=>{});
    sendApplicantReply({ first_name, email, service, message }).catch(()=>{});
    return res.status(201).json({ success:true, message:"Application submitted! I'll get back to you within 24 hours.", id:result.lastInsertRowid });
  } catch(err) {
    console.error('Apply error:', err);
    return res.status(500).json({success:false, message:'Something went wrong. Please try again.'});
  }
});

router.post('/contact', [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({max:80}),
  body('email').trim().isEmail().withMessage('Valid email required').normalizeEmail(),
  body('subject').trim().optional().isLength({max:120}),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({max:2000}),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({success:false, errors:errors.array()});
  try {
    const { name, email, subject, message } = req.body;
    const ip_address = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    stmts.insertContact({ name, email, subject:subject||'', message, ip_address });
    return res.status(201).json({success:true, message:'Message sent! I will reply soon.'});
  } catch(err) {
    return res.status(500).json({success:false, message:'Something went wrong.'});
  }
});

router.get('/health', (req,res) => res.json({success:true,status:'ok',timestamp:new Date().toISOString()}));
module.exports = router;
