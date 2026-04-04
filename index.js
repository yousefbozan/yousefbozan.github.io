require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

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

// --- 4. API Endpoint (Sadece DB Kaydı) ---
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    try {
        // Veritabanına Kaydet
        const newContact = new Contact({ name, email, message });
        await newContact.save();
        
        console.log(`💾 Yeni Mesaj Geldi: ${name} (DB'ye yazıldı)`);

        // Frontend'e anında başarı dön
        res.status(200).json({ 
            success: true, 
            message: "Mesajın Batman mağarasına ulaştı bro!" 
        });

    } catch (error) {
        console.error("❌ Hata:", error);
        res.status(500).json({ 
            success: false, 
            message: "Bir şeyler ters gitti bro." 
        });
    }
});

// --- 5. Sunucuyu Başlat ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Batman Sunucusu ${PORT} portunda aktif!`);
});