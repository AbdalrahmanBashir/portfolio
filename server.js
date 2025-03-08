require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
});

// Production optimizations
app.use(express.json({ limit: '10kb' })); // Limit JSON payload size
app.use(express.static('public', {
    maxAge: '1d', // Cache static files for 1 day
    etag: true // Enable ETags for caching
}));

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Basic rate limiting
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5; // 5 requests per minute

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle contact form submissions with rate limiting
app.post('/api/contact', async (req, res) => {
    const clientIP = req.ip;
    const now = Date.now();
    
    // Check rate limit
    if (rateLimit.has(clientIP)) {
        const { count, timestamp } = rateLimit.get(clientIP);
        if (now - timestamp < RATE_LIMIT_WINDOW) {
            if (count >= MAX_REQUESTS) {
                return res.status(429).json({ error: 'Too many requests. Please try again later.' });
            }
            rateLimit.set(clientIP, { count: count + 1, timestamp });
        } else {
            rateLimit.set(clientIP, { count: 1, timestamp: now });
        }
    } else {
        rateLimit.set(clientIP, { count: 1, timestamp: now });
    }

    try {
        const { name, email, message } = req.body;

        // Basic validation
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Email configuration
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `Portfolio Contact from ${name}`,
            text: `
Name: ${name}
Email: ${email}
Message:
${message}
            `,
            html: `
<h3>New Contact Form Submission</h3>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Message:</strong></p>
<p>${message}</p>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        // Send auto-reply to the sender
        const autoReplyOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thank you for contacting Abdalrahman Bashir',
            text: `
Dear ${name},

Thank you for reaching out! I have received your message and will get back to you as soon as possible.

Best regards,
Abdalrahman Bashir
            `,
            html: `
<p>Dear ${name},</p>
<p>Thank you for reaching out! I have received your message and will get back to you as soon as possible.</p>
<p>Best regards,<br>Abdalrahman Bashir</p>
            `
        };

        await transporter.sendMail(autoReplyOptions);

        res.status(200).json({ message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Perform graceful shutdown if needed
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
    // Perform graceful shutdown if needed
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 