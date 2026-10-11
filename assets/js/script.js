document.addEventListener('DOMContentLoaded', () => {
    const data = loadData();
    renderMainContent(data);
    initParticles();
    initTypeEffect(data.about.typedTexts);
    initModals();
});

function renderMainContent(data) {
    // Hero Section
    document.getElementById('heroName').innerText = data.about.name;
    document.getElementById('heroTitle').innerText = data.about.title;
    document.getElementById('heroImg').src = data.about.image;
    document.getElementById('siteLogo').innerText = data.about.name.split(' ')[0] + ' ' + data.about.name.split(' ')[data.about.name.split(' ').length - 1];

    // About Section
    document.getElementById('aboutContent').innerHTML = `<p style="text-align: center; font-size: 1.2rem;">${data.about.title}</p>`;

    // Education Summary
    const eduSummary = document.getElementById('educationSummary');
    eduSummary.innerHTML = data.education.map(edu => `
        <div class="card">
            <i class="fas fa-graduation-cap" style="font-size: 2rem; color: #00d4ff; margin-bottom: 15px;"></i>
            <h3>${edu.degree}</h3>
            <p>${edu.institution}</p>
        </div>
    `).join('');

    // Experience Section
    const expContent = document.getElementById('experienceContent');
    expContent.innerHTML = data.experience.map(exp => `
        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <h3>${exp.title}</h3>
                <span style="color: #00d4ff; font-size: 0.9rem;">${exp.company}</span>
            </div>
            <p style="margin: 10px 0;">${exp.description}</p>
            <div style="margin-top: 10px;">
                ${exp.tech.split(',').map(t => `<span class="tech-tag">${t.trim()}</span>`).join('')}
            </div>
        </div>
    `).join('');

    // Projects Section
    const projContent = document.getElementById('projectsContent');
    projContent.innerHTML = data.projects.map(proj => `
        <div class="card project-card">
            <div class="project-img-container" onclick="this.classList.toggle('active')">
                <img src="${getImageUrl(proj.image)}" class="project-img" alt="صورة المشروع" loading="lazy" onerror="this.onerror=null;this.src='https://via.placeholder.com/300x200?text=${encodeURIComponent(proj.name)}'">
                <div class="project-overlay">
                    <p>${proj.description}</p>
                </div>
            </div>
            <div class="project-info">
                <h3>${proj.name}</h3>
                <div style="margin: 10px 0;">
                    ${proj.tech.split(',').map(t => `<span class="tech-tag">${t.trim()}</span>`).join('')}
                </div>
                <a href="${proj.link}" target="_blank" class="btn btn-sm">فتح المشروع <i class="fas fa-external-link-alt"></i></a>
            </div>
        </div>
    `).join('');

    // Skills Section
    const skillsContent = document.getElementById('skillsContent');
    skillsContent.innerHTML = data.skills.map(skill => `
        <div class="card" style="text-align: center;">
            <i class="fas fa-check-circle" style="color: #00d4ff; font-size: 1.5rem; margin-bottom: 10px;"></i>
            <h3>${skill.name}</h3>
            <p style="font-size: 0.9rem; opacity: 0.8;">${skill.description}</p>
        </div>
    `).join('');
}

function initTypeEffect(texts) {
    let i = 0, j = 0, isDeleting = false;
    const target = document.getElementById("typedText");
    if (!target) return;
    
    function type() {
        const current = texts[i];
        if (isDeleting) {
            target.innerHTML = current.substring(0, j - 1);
            j--;
            if (j === 0) {
                isDeleting = false;
                i = (i + 1) % texts.length;
            }
        } else {
            target.innerHTML = current.substring(0, j + 1);
            j++;
            if (j === current.length) {
                isDeleting = true;
                setTimeout(() => type(), 1500);
                return;
            }
        }
        setTimeout(type, isDeleting ? 50 : 100);
    }
    type();
}

function initParticles() {
    if (typeof particlesJS === 'undefined') return;
    particlesJS("particles-js", {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#00d4ff" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: "#00d4ff", opacity: 0.4, width: 1 },
            move: { enable: true, speed: 2, direction: "none", random: false, straight: false, out_mode: "out" }
        },
        interactivity: {
            detect_on: "canvas",
            events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" }, resize: true }
        },
        retina_detect: true
    });
}

function initModals() {
    const eduModal = document.getElementById('eduModal');
    const viewBtn = document.getElementById('viewEduDetails');
    const closeBtn = document.getElementById('closeEduModal');
    const closeBtn2 = document.getElementById('closeEduBtn');

    if (!eduModal || !viewBtn) return;

    viewBtn.onclick = () => {
        const data = loadData();
        const modalBody = document.getElementById('eduModalBody');
        modalBody.innerHTML = data.education.map(edu => `
            <div class="card" style="border: 1px solid rgba(0,212,255,0.4);">
                <img src="${edu.image}" style="width: 100%; border-radius: 10px; margin-bottom: 15px;" onerror="this.src='https://via.placeholder.com/400x300?text=Certificate'">
                <h3>${edu.degree}</h3>
                <p><strong>المؤسسة:</strong> ${edu.institution}</p>
                <p><strong>الفترة:</strong> ${edu.period}</p>
            </div>
        `).join('');
        eduModal.style.display = 'block';
    };

    const closeModal = () => eduModal.style.display = 'none';
    if (closeBtn) closeBtn.onclick = closeModal;
    if (closeBtn2) closeBtn2.onclick = closeModal;
    window.onclick = (event) => {
        if (event.target == eduModal) closeModal();
    };
}
