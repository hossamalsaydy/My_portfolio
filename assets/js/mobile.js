// إدارة القائمة الجانبية والوظائف المتعلقة بالهاتف

const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

// فتح/إغلاق القائمة الجانبية
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
    });
}

// إغلاق القائمة عند النقر على الخلفية
if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    });
}

// دالة إغلاق القائمة الجانبية
function closeSidebar() {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
}

// إغلاق القائمة عند النقر على أي رابط
document.querySelectorAll('.sidebar-nav a').forEach(link => {
    link.addEventListener('click', closeSidebar);
});

// وظائف رفع الصور
function setupImageUpload() {
    const imageUpload = document.getElementById('imageUpload');
    
    if (!imageUpload) {
        // إنشاء input للصور إذا لم يكن موجوداً
        const input = document.createElement('input');
        input.type = 'file';
        input.id = 'imageUpload';
        input.accept = 'image/*';
        input.style.display = 'none';
        document.body.appendChild(input);
    }
}

function triggerImageUpload() {
    const imageUpload = document.getElementById('imageUpload');
    if (imageUpload) {
        imageUpload.click();
    }
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            // تحويل الصورة إلى Base64 وحفظها في localStorage
            const base64Image = e.target.result;
            const timestamp = Date.now();
            const imageName = `image_${timestamp}`;
            
            // حفظ الصورة في localStorage
            localStorage.setItem(imageName, base64Image);
            
            // إرجاع اسم الصورة المحفوظة
            const imageUrlInput = document.getElementById('newEduImg') || 
                                  document.getElementById('newProjImg');
            if (imageUrlInput) {
                imageUrlInput.value = imageName;
            }
            
            alert('تم رفع الصورة بنجاح!');
        };
        reader.readAsDataURL(file);
    }
}

// إضافة مستمع لـ input الصور
document.addEventListener('DOMContentLoaded', () => {
    setupImageUpload();
    const imageUpload = document.getElementById('imageUpload');
    if (imageUpload) {
        imageUpload.addEventListener('change', handleImageUpload);
    }
});

// دالة لتحميل الصور المحفوظة من localStorage
function getImageUrl(imageName) {
    if (imageName.startsWith('image_')) {
        return localStorage.getItem(imageName) || 'https://via.placeholder.com/400x300?text=Image';
    }
    return imageName;
}
