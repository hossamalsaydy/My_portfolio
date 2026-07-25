// إدارة البيانات باستخدام LocalStorage
const DATA_KEY = 'portfolio_data';

const defaultData = {
    about: {
        name: "حسام عمر محمد الصائدي",
        title: "مطور برمجيات شامل - حاصل على بكالوريوس تقنية معلومات it",
        typedTexts: ["مطور برمجيات شامل", "خبير في Flutter و Laravel", "مطور أنظمة ERP ومحاسبية", "مطور تطبيقات موبايل وويب"],
        image: "IMG_20260709_201517_315.png"
    },
    education: [
        {
            id: 1,
            degree: "بكالوريوس تقنية معلومات IT",
            institution: "جامعة العلوم والتكنولوجيا",
            period: "2019 - 2023",
            image: "https://via.placeholder.com/400x300?text=Certificate"
        }
    ],
    experience: [
        {
            id: 1,
            title: "مطور تطبيقات موبايل",
            company: "شركة حلول تقنية",
            description: "تطوير تطبيقات متكاملة باستخدام Flutter",
            tech: "Flutter, Firebase, REST API"
        }
    ],
    skills: [
        { id: 1, name: "Laravel", description: "تطوير الواجهات الخلفية" },
        { id: 2, name: "Flutter", description: "تطوير تطبيقات الموبايل" },
        { id: 3, name: "MySQL / Firebase", description: "إدارة قواعد البيانات" }
    ],
    projects: [
        {
            id: 1,
            name: "لوحة تحكم متجر إلكتروني",
            description: "نظام متكامل لإدارة المتاجر الإلكترونية مع تقارير مفصلة",
            tech: "Laravel + API + MySQL",
            link: "https://wa.me/p/9700828300016243/967778470907",
            image: "project1.png"
        }
    ],
    stats: {
        projects: 14,
        experience: 3,
        clients: 25
    }
};

function loadData() {
    const savedData = localStorage.getItem(DATA_KEY);
    return savedData ? JSON.parse(savedData) : defaultData;
}

function saveData(data) {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
}

// تهيئة البيانات إذا لم تكن موجودة
if (!localStorage.getItem(DATA_KEY)) {
    saveData(defaultData);
}
