const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// CORS Ayarı: Frontend'den gelen isteklere izin verir
app.use(cors());
app.use(express.json());

// Mail Servis Ayarı
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Mail Gönderme Endpoint'i
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'ybozan183@gmail.com', // Mesajın düşeceği adres
        subject: `🚀 Siteden Yeni Mesaj: ${name}`,
        text: `Gönderen: ${name}\nE-posta: ${email}\n\nMesaj:\n${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("❌ Mail hatası:", error);
            return res.status(500).json({ success: false });
        }
        console.log('✅ Mail başarıyla uçtu!');
        res.status(200).json({ success: true, message: "Mesajın mail kutuna düştü bro!" });
    });
});

// Render için kritik Port Ayarı
// Render portu otomatik atar (process.env.PORT), bulamazsa localde 5000'i kullanır.
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Sunucu ${PORT} portunda aktif!`);
});
