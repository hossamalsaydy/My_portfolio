const ADMIN_PASSWORD = "eng-hossam";
let currentSection = '';

document.getElementById('openAdminBtn').onclick = () => {
    const pass = prompt("الرجاء إدخال كلمة مرور لوحة التحكم:");
    if (pass === ADMIN_PASSWORD) {
        document.getElementById('adminDashboard').style.display = 'block';
    } else {
        alert("كلمة المرور غير صحيحة!");
    }
};

document.getElementById('closeAdminBtn').onclick = () => {
    document.getElementById('adminDashboard').style.display = 'none';
    location.reload(); // تحديث الصفحة لرؤية التغييرات
};

function showAdminSection(section) {
    currentSection = section;
    document.getElementById('adminHome').style.display = 'none';
    document.getElementById('adminEditor').style.display = 'block';
    renderEditor();
}

function backToAdminHome() {
    document.getElementById('adminHome').style.display = 'block';
    document.getElementById('adminEditor').style.display = 'none';
}

function renderEditor() {
    const data = loadData();
    const container = document.getElementById('editorContent');
    let html = '';

    switch(currentSection) {
        case 'about':
            html = `
                <h3>تحديث النبذة</h3>
                <div class="form-group">
                    <label>الاسم:</label>
                    <input type="text" id="editName" value="${data.about.name}">
                </div>
                <div class="form-group">
                    <label>العنوان الوظيفي:</label>
                    <input type="text" id="editTitle" value="${data.about.title}">
                </div>
                <button class="btn" onclick="saveAbout()">حفظ التغييرات</button>
            `;
            break;

        case 'education':
            html = `
                <h3>إدارة التعليم</h3>
                <button class="btn btn-sm" onclick="showAddEduForm()" style="margin-bottom: 15px;">إضافة مؤهل جديد +</button>
                <div id="eduList">
                    ${data.education.map(edu => `
                        <div class="card" style="margin-bottom: 10px; padding: 15px; display: flex; justify-content: space-between; align-items: center;">
                            <div><strong>${edu.degree}</strong> - ${edu.institution}</div>
                            <button class="btn btn-sm" style="background: #ff4b2b;" onclick="deleteItem('education', ${edu.id})">حذف</button>
                        </div>
                    `).join('')}
                </div>
                <div id="addEduForm" style="display: none; margin-top: 20px; border-top: 1px solid #00d4ff; padding-top: 20px;">
                    <h4>إضافة مؤهل جديد</h4>
                    <div class="form-group"><input type="text" id="newEduDegree" placeholder="المؤهل"></div>
                    <div class="form-group"><input type="text" id="newEduInst" placeholder="المؤسسة التعليمية"></div>
                    <div class="form-group"><input type="text" id="newEduPeriod" placeholder="الفترة (مثلاً: 2019 - 2023)"></div>
                    <div class="form-group">
                        <div class="file-upload-wrapper">
                            <input type="text" id="newEduImg" placeholder="رابط صورة الشهادة" style="flex: 1;">
                            <button class="upload-btn" onclick="triggerImageUpload()"><i class="fas fa-cloud-upload-alt"></i> رفع صورة</button>
                        </div>
                    </div>
                    <button class="btn" onclick="addEducation()">إضافة</button>
                </div>
            `;
            break;

        case 'experience':
            html = `
                <h3>إدارة الخبرات</h3>
                <button class="btn btn-sm" onclick="showAddExpForm()" style="margin-bottom: 15px;">إضافة خبرة جديدة +</button>
                <div id="expList">
                    ${data.experience.map(exp => `
                        <div class="card" style="margin-bottom: 10px; padding: 15px; display: flex; justify-content: space-between; align-items: center;">
                            <div><strong>${exp.title}</strong> في ${exp.company}</div>
                            <button class="btn btn-sm" style="background: #ff4b2b;" onclick="deleteItem('experience', ${exp.id})">حذف</button>
                        </div>
                    `).join('')}
                </div>
                <div id="addExpForm" style="display: none; margin-top: 20px; border-top: 1px solid #00d4ff; padding-top: 20px;">
                    <h4>إضافة خبرة جديدة</h4>
                    <div class="form-group"><input type="text" id="newExpTitle" placeholder="المسمى الوظيفي"></div>
                    <div class="form-group"><input type="text" id="newExpCompany" placeholder="الجهة"></div>
                    <div class="form-group"><textarea id="newExpDesc" placeholder="وصف قصير"></textarea></div>
                    <div class="form-group"><input type="text" id="newExpTech" placeholder="التقنيات المستخدمة (مفصولة بفاصلة)"></div>
                    <button class="btn" onclick="addExperience()">إضافة</button>
                </div>
            `;
            break;

        case 'skills':
            html = `
                <h3>إدارة المهارات</h3>
                <button class="btn btn-sm" onclick="showAddSkillForm()" style="margin-bottom: 15px;">إضافة مهارة جديدة +</button>
                <div id="skillsList">
                    ${data.skills.map(skill => `
                        <div class="card" style="margin-bottom: 10px; padding: 15px; display: flex; justify-content: space-between; align-items: center;">
                            <div><strong>${skill.name}</strong></div>
                            <button class="btn btn-sm" style="background: #ff4b2b;" onclick="deleteItem('skills', ${skill.id})">حذف</button>
                        </div>
                    `).join('')}
                </div>
                <div id="addSkillForm" style="display: none; margin-top: 20px; border-top: 1px solid #00d4ff; padding-top: 20px;">
                    <h4>إضافة مهارة جديدة</h4>
                    <div class="form-group"><input type="text" id="newSkillName" placeholder="اسم المهارة"></div>
                    <div class="form-group"><input type="text" id="newSkillDesc" placeholder="وصف المهارة"></div>
                    <button class="btn" onclick="addSkill()">إضافة</button>
                </div>
            `;
            break;

        case 'projects':
            html = `
                <h3>إدارة المشاريع</h3>
                <button class="btn btn-sm" onclick="showAddProjForm()" style="margin-bottom: 15px;">إضافة مشروع جديد +</button>
                <div id="projList">
                    ${data.projects.map(proj => `
                        <div class="card" style="margin-bottom: 10px; padding: 15px; display: flex; justify-content: space-between; align-items: center;">
                            <div><strong>${proj.name}</strong></div>
                            <button class="btn btn-sm" style="background: #ff4b2b;" onclick="deleteItem('projects', ${proj.id})">حذف</button>
                        </div>
                    `).join('')}
                </div>
                <div id="addProjForm" style="display: none; margin-top: 20px; border-top: 1px solid #00d4ff; padding-top: 20px;">
                    <h4>إضافة مشروع جديد</h4>
                    <div class="form-group"><input type="text" id="newProjName" placeholder="اسم المشروع"></div>
                    <div class="form-group"><textarea id="newProjDesc" placeholder="وصف قصير"></textarea></div>
                    <div class="form-group"><input type="text" id="newProjTech" placeholder="التقنيات (مفصولة بفاصلة)"></div>
                    <div class="form-group"><input type="text" id="newProjLink" placeholder="رابط المشروع"></div>
                    <div class="form-group">
                        <div class="file-upload-wrapper">
                            <input type="text" id="newProjImg" placeholder="رابط الصورة التوضيحية" style="flex: 1;">
                            <button class="upload-btn" onclick="triggerImageUpload()"><i class="fas fa-cloud-upload-alt"></i> رفع صورة</button>
                        </div>
                    </div>
                    <button class="btn" onclick="addProject()">إضافة</button>
                </div>
            `;
            break;
    }
    container.innerHTML = html;
}

// وظائف الحفظ والإضافة
function saveAbout() {
    const data = loadData();
    data.about.name = document.getElementById('editName').value;
    data.about.title = document.getElementById('editTitle').value;
    saveData(data);
    alert("تم التحديث بنجاح!");
    renderEditor();
}

function showAddEduForm() { document.getElementById('addEduForm').style.display = 'block'; }
function addEducation() {
    const data = loadData();
    const newEdu = {
        id: Date.now(),
        degree: document.getElementById('newEduDegree').value,
        institution: document.getElementById('newEduInst').value,
        period: document.getElementById('newEduPeriod').value,
        image: document.getElementById('newEduImg').value || 'https://via.placeholder.com/400x300?text=Certificate'
    };
    data.education.push(newEdu);
    saveData(data);
    renderEditor();
}

function showAddExpForm() { document.getElementById('addExpForm').style.display = 'block'; }
function addExperience() {
    const data = loadData();
    const newExp = {
        id: Date.now(),
        title: document.getElementById('newExpTitle').value,
        company: document.getElementById('newExpCompany').value,
        description: document.getElementById('newExpDesc').value,
        tech: document.getElementById('newExpTech').value
    };
    data.experience.push(newExp);
    saveData(data);
    renderEditor();
}

function showAddSkillForm() { document.getElementById('addSkillForm').style.display = 'block'; }
function addSkill() {
    const data = loadData();
    const newSkill = {
        id: Date.now(),
        name: document.getElementById('newSkillName').value,
        description: document.getElementById('newSkillDesc').value
    };
    data.skills.push(newSkill);
    saveData(data);
    renderEditor();
}

function showAddProjForm() { document.getElementById('addProjForm').style.display = 'block'; }
function addProject() {
    const data = loadData();
    const newProj = {
        id: Date.now(),
        name: document.getElementById('newProjName').value,
        description: document.getElementById('newProjDesc').value,
        tech: document.getElementById('newProjTech').value,
        link: document.getElementById('newProjLink').value,
        image: document.getElementById('newProjImg').value || 'https://via.placeholder.com/300x200?text=Project'
    };
    data.projects.push(newProj);
    saveData(data);
    renderEditor();
}

function deleteItem(type, id) {
    if (confirm("هل أنت متأكد من الحذف؟")) {
        const data = loadData();
        data[type] = data[type].filter(item => item.id !== id);
        saveData(data);
        renderEditor();
    }
}
