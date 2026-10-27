const nodemailer = require('nodemailer');

// Mails sent without SMTP configured (development, tests) end up here
const outbox = [];
let transport = null;

function getTransport() {
    if (!transport) {
        // e.g. SMTP_URL=smtps://user:password@smtp.example.com:465
        transport = process.env.SMTP_URL
            ? nodemailer.createTransport(process.env.SMTP_URL)
            : nodemailer.createTransport({ jsonTransport: true });
    }
    return transport;
}

async function sendMail({ to, subject, text }) {
    const mail = { from: process.env.MAIL_FROM || 'Vadi <no-reply@vadi.click>', to, subject, text };
    await getTransport().sendMail(mail);
    if (!process.env.SMTP_URL) {
        outbox.push(mail);
        if (process.env.NODE_ENV !== 'test') {
            console.log(`[mail, not sent: SMTP_URL is not set] To: ${to}\nSubject: ${subject}\n${text}\n`);
        }
    }
}

exports.sendMail = sendMail;
exports.outbox = outbox;
