require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

// --- 1. Middleware ---
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// --- 2. MongoDB Bağlantısı ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Batman Veritabanı Bağlantısı Başarılı!'))
  .catch(err => console.error('❌ Veritabanı Hatası:', err));

// --- 3. MongoDB Şeması ---
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  date: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', contactSchema);

// --- 4. Nodemailer (Mail) Ayarı ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// --- 5. Tek ve Güçlü API Endpoint ---
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    try {
        // A. Veritabanına Kaydet (Async/Await kullanarak jilet gibi)
        const newContact = new Contact({ name, email, message });
        await newContact.save();
        console.log("💾 Veri DB'ye yazıldı.");

        // B. Mail Gönder
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'ybozan183@gmail.com', 
            subject: `🚀 Siteden Yeni Mesaj: ${name}`,
            text: `Gönderen: ${name}\nE-posta: ${email}\n\nMesaj:\n${message}`
        };

        await transporter.sendMail(mailOptions);
        console.log("📧 Mail kutuna uçtu!");

        // C. Frontend'e Başarı Mesajı Gönder
        res.status(200).json({ success: true, message: "Mesajın her yere ulaştı bro!" });

    } catch (error) {
        console.error("❌ Hata oluştu:", error);
        res.status(500).json({ success: false, message: "Bir şeyler ters gitti bro." });
    }
});

// --- 6. Sunucuyu Başlat ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Batman Sunucusu ${PORT} portunda aktif!`);
});