document.addEventListener('DOMContentLoaded', () => {

    // 1. Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Typing Effect
    const textElement = document.getElementById('typing-text');
    if (textElement) {
        const words = [
            "Scalable Backends",
            "Modern UI/UX",
            "Creative Solutions",
            "Flutter Specialist"
        ];

        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentWord = words[wordIndex];

            if (isDeleting) {
                textElement.textContent = currentWord.substring(0, charIndex--);
            } else {
                textElement.textContent = currentWord.substring(0, charIndex++);
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                setTimeout(type, 2000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                setTimeout(type, 500);
            } else {
                setTimeout(type, isDeleting ? 50 : 120);
            }
        }
        type();
    }


    // 3. CONTACT FORM (Node.js Backend Entegrasyonu)
    const contactForm = document.getElementById('contactForm');
    const successOverlay = document.getElementById('successOverlay');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = document.getElementById('submitButton');
            const btnSpan = submitBtn.querySelector('span');
            const originalText = btnSpan.innerText;

            // Buton durumunu güncelle
            btnSpan.innerText = 'Gönderiliyor...';
            submitBtn.disabled = true;

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            try {
                // Şimdilik Localhost üzerinden test ediyoruz
                const API_URL = "http://localhost:5000/api/contact"; 

                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                // Backend'den dönen response.ok ve result.success kontrolü
                if (response.ok && result.success) {
                    // Başarı durumunda overlay'i göster
                    successOverlay.style.display = 'flex'; 
                    successOverlay.classList.remove('opacity-0', 'pointer-events-none');
                    successOverlay.classList.add('opacity-100', 'pointer-events-auto');

                    contactForm.reset();
                } else {
                    alert('Hata: ' + (result.message || 'Mesaj kaydedilemedi bro, veritabanı hatası olabilir.'));
                }

            } catch (error) {
                console.error('Bağlantı hatası:', error);
                alert('Sunucuya bağlanılamadı bro! Terminalde index.js açık mı?');
            } finally {
                // Her durumda butonu eski haline getir
                btnSpan.innerText = originalText;
                submitBtn.disabled = false;
            }
        });
    }

});

// 4. Overlay kapatma
function resetForm() {
    const successOverlay = document.getElementById('successOverlay');
    if (successOverlay) {
        successOverlay.style.display = 'none'; // Direkt gizle
        successOverlay.classList.add('opacity-0', 'pointer-events-none');
        successOverlay.classList.remove('opacity-100', 'pointer-events-auto');
    }
}

// 5. Modal Fonksiyonları
function openModal(projectId) {
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    const dataElement = document.getElementById('data-' + projectId);

    if (modal && modalBody && dataElement) {
        modalBody.innerHTML = dataElement.innerHTML;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('project-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// 6. Skill Progress Animation
window.onload = () => {
    const progressFills = document.querySelectorAll('.progress-fill');
    progressFills.forEach(fill => {
        const percent = fill.getAttribute('data-percent');
        fill.style.width = percent + '%';
    });
};

// 7. Navbar Scroll Effect & Mobile Menu
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (nav) {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
});

const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.getElementById('nav-links');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
        
        const icon = mobileMenuBtn.querySelector('i');
        if (icon && !mobileMenuBtn.classList.contains('active')) {
             // İkon değişimi logic buraya gelebilir
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        });
    });
}