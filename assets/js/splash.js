// إدارة الشاشة الافتتاحية (Splash Screen)

document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splashScreen');
    
    // إظهار الشاشة الافتتاحية لمدة 10 ثوان
    setTimeout(() => {
        closeSplashScreen();
    }, 10000);
    
    // السماح بإغلاق الشاشة بالنقر عليها (اختياري)
    splashScreen.addEventListener('click', closeSplashScreen);
});

function closeSplashScreen() {
    const splashScreen = document.getElementById('splashScreen');
    const body = document.body;
    
    // إضافة تأثير التفكك
    splashScreen.classList.add('disintegrate');
    
    // إنشاء جزيئات التفكك
    createDisintegrationParticles();
    
    // إزالة الشاشة من الـ DOM بعد انتهاء التأثير
    setTimeout(() => {
        splashScreen.style.display = 'none';
        body.classList.remove('splash-active');
        body.style.overflow = 'auto';
    }, 1000);
}

function createDisintegrationParticles() {
    const splashScreen = document.getElementById('splashScreen');
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'splash-particle';
        
        // حجم عشوائي
        const size = Math.random() * 30 + 10;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // موضع عشوائي على الشاشة
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        // لون عشوائي (أزرق وأبيض)
        const colors = ['#00d4ff', '#ffffff', '#0099cc'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = randomColor;
        particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        
        // إضافة الجزيء إلى الصفحة
        document.body.appendChild(particle);
        
        // حساب اتجاه التحرك العشوائي
        const tx = (Math.random() - 0.5) * 300;
        const ty = (Math.random() - 0.5) * 300 - 200;
        
        // تطبيق التأثير
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        particle.style.animation = `particleDisintegrate 1s ease-out forwards`;
        
        // إزالة الجزيء بعد انتهاء التأثير
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}
