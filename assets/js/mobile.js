// إدارة القائمة الجانبية ورفع الصور محلياً
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

if (menuToggle && sidebar && sidebarOverlay) {
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
    });

    sidebarOverlay.addEventListener('click', closeSidebar);
}

function closeSidebar() {
    if (sidebar) sidebar.classList.remove('active');
    if (sidebarOverlay) sidebarOverlay.classList.remove('active');
}

document.querySelectorAll('.sidebar-nav a').forEach(link => {
    link.addEventListener('click', closeSidebar);
});

function setupImageUpload() {
    let input = document.getElementById('imageUpload');
    if (!input) {
        input = document.createElement('input');
        input.type = 'file';
        input.id = 'imageUpload';
        input.accept = 'image/jpeg,image/png,image/webp,image/gif';
        input.setAttribute('aria-label', 'اختيار صورة');
        document.body.appendChild(input);
    }

    if (!input.dataset.listenerAttached) {
        input.addEventListener('change', handleImageUpload);
        input.dataset.listenerAttached = 'true';
    }
}

function triggerImageUpload() {
    setupImageUpload();
    const imageInput = document.getElementById('newProjImg') || document.getElementById('newEduImg');
    if (!imageInput) {
        alert('افتح نموذج إضافة مشروع أو مؤهل أولاً.');
        return;
    }

    const fileInput = document.getElementById('imageUpload');
    fileInput.dataset.targetId = imageInput.id;
    fileInput.value = '';
    fileInput.click();
}

function loadImageFromFile(file) {
    return new Promise((resolve, reject) => {
        const objectUrl = URL.createObjectURL(file);
        const image = new Image();
        image.onload = () => {
            const maxDimension = 1400;
            const scale = Math.min(1, maxDimension / image.width, maxDimension / image.height);
            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1, Math.round(image.width * scale));
            canvas.height = Math.max(1, Math.round(image.height * scale));
            const context = canvas.getContext('2d');
            if (!context) {
                URL.revokeObjectURL(objectUrl);
                reject(new Error('تعذر تجهيز الصورة في هذا المتصفح.'));
                return;
            }

            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            URL.revokeObjectURL(objectUrl);

            // WebP يقلل المساحة ويحتفظ بالشفافية عند دعمها.
            let quality = 0.82;
            let dataUrl = canvas.toDataURL('image/webp', quality);
            while (dataUrl.length > 1_350_000 && quality > 0.48) {
                quality -= 0.1;
                dataUrl = canvas.toDataURL('image/webp', quality);
            }
            resolve(dataUrl);
        };
        image.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error('تعذر قراءة ملف الصورة. اختر صورة بصيغة JPG أو PNG أو WebP.'));
        };
        image.src = objectUrl;
    });
}

async function handleImageUpload(event) {
    const file = event.target.files && event.target.files[0];
    const targetId = event.target.dataset.targetId;
    event.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('الملف المختار ليس صورة.');
        return;
    }
    if (file.size > 12 * 1024 * 1024) {
        alert('حجم الصورة الأصلية أكبر من 12 ميغابايت. اختر صورة أصغر.');
        return;
    }

    try {
        const dataUrl = await loadImageFromFile(file);
        const imageKey = `image_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        // تخزين الصورة المضغوطة في المتصفح وإسناد مفتاحها إلى نموذج المشروع.
        localStorage.setItem(imageKey, dataUrl);
        const target = document.getElementById(targetId);
        if (!target) {
            localStorage.removeItem(imageKey);
            return;
        }
        target.value = imageKey;

        const preview = document.getElementById('projectImagePreview');
        if (targetId === 'newProjImg' && preview) {
            preview.src = dataUrl;
            preview.hidden = false;
        }
        alert('تم تجهيز الصورة وحفظها في هذا المتصفح. احفظ المشروع لإظهارها في بطاقته.');
    } catch (error) {
        console.error('Image upload failed:', error);
        alert(error.name === 'QuotaExceededError'
            ? 'مساحة تخزين المتصفح غير كافية. احذف بعض الصور أو استخدم صورة أصغر.'
            : (error.message || 'تعذر رفع الصورة.'));
    }
}

// تُستخدم عند إنشاء بطاقات المشاريع كي تتحول مفاتيح الصور المحلية إلى صور فعلية.
function getImageUrl(imageValue) {
    if (!imageValue) return 'https://via.placeholder.com/300x200?text=Project';
    if (typeof imageValue !== 'string') return 'https://via.placeholder.com/300x200?text=Project';
    if (imageValue.startsWith('image_')) {
        try {
            return localStorage.getItem(imageValue) || 'https://via.placeholder.com/300x200?text=Project';
        } catch (error) {
            console.warn('Unable to access locally stored image:', error);
            return 'https://via.placeholder.com/300x200?text=Project';
        }
    }
    return imageValue;
}

document.addEventListener('DOMContentLoaded', setupImageUpload);
