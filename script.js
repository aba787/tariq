
// نظام إدارة البيانات المحسن
class DataManager {
  constructor() {
    this.initializeData();
  }

  initializeData() {
    // تحميل البيانات من localStorage أو استخدام البيانات التجريبية
    const savedData = localStorage.getItem('employeesData');
    if (savedData) {
      try {
        this.employees = JSON.parse(savedData);
      } catch (e) {
        console.warn('فشل في تحميل البيانات المحفوظة، استخدام البيانات التجريبية');
        this.loadDefaultData();
      }
    } else {
      this.loadDefaultData();
    }
    
    this.currentEmployeeId = parseInt(localStorage.getItem('currentEmployeeId')) || 1;
  }

  loadDefaultData() {
    this.employees = [
      {
        id: 1,
        name: 'أحمد محمد الشعلان',
        position: 'محلل نظم',
        yearsOfExperience: 4,
        performanceRating: 'ممتاز',
        completedCourses: 3,
        monthsSinceLastPromotion: 18,
        lastCourseDate: '2023-06-15',
        department: 'تقنية المعلومات',
        joinDate: '2020-01-15',
        email: 'ahmed.alshaalan@company.gov.sa'
      },
      {
        id: 2,
        name: 'فاطمة أحمد علي',
        position: 'محاسبة',
        yearsOfExperience: 6,
        performanceRating: 'جيد جداً',
        completedCourses: 5,
        monthsSinceLastPromotion: 30,
        department: 'المالية',
        joinDate: '2018-03-10',
        email: 'fatima.ali@company.gov.sa'
      },
      {
        id: 3,
        name: 'محمد سالم القحطاني',
        position: 'مشرف إداري',
        yearsOfExperience: 2,
        performanceRating: 'جيد',
        completedCourses: 2,
        monthsSinceLastPromotion: 8,
        department: 'الإدارة العامة',
        joinDate: '2022-06-01',
        email: 'mohammed.alqahtani@company.gov.sa'
      },
      {
        id: 4,
        name: 'نورا عبدالله المطيري',
        position: 'مطورة برمجيات',
        yearsOfExperience: 3,
        performanceRating: 'ممتاز',
        completedCourses: 4,
        monthsSinceLastPromotion: 15,
        department: 'تقنية المعلومات',
        joinDate: '2021-09-01',
        email: 'nora.almutairi@company.gov.sa'
      }
    ];
    this.saveData();
  }

  saveData() {
    localStorage.setItem('employeesData', JSON.stringify(this.employees));
    localStorage.setItem('currentEmployeeId', this.currentEmployeeId.toString());
  }

  getCurrentEmployee() {
    return this.employees.find(emp => emp.id === this.currentEmployeeId) || this.employees[0];
  }

  getAllEmployees() {
    return [...this.employees];
  }

  addEmployee(employeeData) {
    // التحقق من صحة البيانات
    if (!this.validateEmployeeData(employeeData)) {
      throw new Error('بيانات الموظف غير صحيحة');
    }

    const newEmployee = {
      ...employeeData,
      id: Math.max(...this.employees.map(emp => emp.id)) + 1,
      joinDate: employeeData.joinDate || new Date().toISOString().split('T')[0]
    };

    this.employees.push(newEmployee);
    this.saveData();
    return newEmployee;
  }

  validateEmployeeData(data) {
    const required = ['name', 'position', 'yearsOfExperience', 'performanceRating', 'department'];
    
    for (let field of required) {
      if (!data[field] || data[field].toString().trim() === '') {
        console.error(`حقل مطلوب مفقود: ${field}`);
        return false;
      }
    }

    // التحقق من صحة البريد الإلكتروني
    if (data.email && !this.isValidEmail(data.email)) {
      console.error('عنوان البريد الإلكتروني غير صحيح');
      return false;
    }

    // التحقق من سنوات الخبرة
    if (isNaN(data.yearsOfExperience) || data.yearsOfExperience < 0) {
      console.error('سنوات الخبرة يجب أن تكون رقم موجب');
      return false;
    }

    return true;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  filterEmployees(criteria) {
    let filtered = [...this.employees];

    if (criteria.department && criteria.department !== 'الكل') {
      filtered = filtered.filter(emp => emp.department === criteria.department);
    }

    if (criteria.performanceRating && criteria.performanceRating !== 'الكل') {
      filtered = filtered.filter(emp => emp.performanceRating === criteria.performanceRating);
    }

    if (criteria.minExperience) {
      filtered = filtered.filter(emp => emp.yearsOfExperience >= criteria.minExperience);
    }

    if (criteria.readyForPromotion) {
      filtered = filtered.filter(emp => calculatePromotionReadiness(emp) >= 75);
    }

    return filtered;
  }

  switchEmployee(employeeId) {
    const employee = this.employees.find(emp => emp.id === employeeId);
    if (employee) {
      this.currentEmployeeId = employeeId;
      this.saveData();
      return employee;
    }
    return null;
  }
}

// إنشاء مدير البيانات العام
const dataManager = new DataManager();

// الحصول على الموظف الحالي
let currentEmployee = dataManager.getCurrentEmployee();
const employees = dataManager.getAllEmployees();

// حساب نسبة جاهزية الموظف للترقية
function calculatePromotionReadiness(employeeData) {
  let score = 0;
  const maxScore = 100;

  // تقييم سنوات الخبرة (30 نقطة)
  if (employeeData.yearsOfExperience >= 5) {
    score += 30;
  } else if (employeeData.yearsOfExperience >= 3) {
    score += 20;
  } else if (employeeData.yearsOfExperience >= 1) {
    score += 10;
  }

  // تقييم الأداء السنوي (40 نقطة)
  if (employeeData.performanceRating === 'ممتاز') {
    score += 40;
  } else if (employeeData.performanceRating === 'جيد جداً') {
    score += 30;
  } else if (employeeData.performanceRating === 'جيد') {
    score += 20;
  }

  // الدورات التدريبية (20 نقطة)
  if (employeeData.completedCourses >= 5) {
    score += 20;
  } else if (employeeData.completedCourses >= 3) {
    score += 15;
  } else if (employeeData.completedCourses >= 1) {
    score += 10;
  }

  // آخر ترقية (10 نقاط)
  const monthsSinceLastPromotion = employeeData.monthsSinceLastPromotion || 0;
  if (monthsSinceLastPromotion >= 24) {
    score += 10;
  } else if (monthsSinceLastPromotion >= 12) {
    score += 5;
  }

  return Math.min(score, maxScore);
}

// تحديد رسالة التوصية
function getPromotionRecommendation(score, employeeData) {
  if (score >= 90) {
    return '🎉 مبروك! أنت جاهز للترقية';
  } else if (score >= 75) {
    return '⚡ قريب جداً من الترقية - اكمل دورة تدريبية';
  } else if (score >= 60) {
    return '📚 حسّن من تقييمك السنوي واحصل على دورات';
  } else {
    return '💪 استمر في العمل وطور مهاراتك';
  }
}

// حساب النسبة الجديدة
function calculateNewScore() {
  const score = calculatePromotionReadiness(currentEmployee);
  const recommendation = getPromotionRecommendation(score, currentEmployee);
  
  updateScoreDisplay(score, recommendation);
  
  // إضافة تأثير بصري
  const scoreElement = document.querySelector('.readiness-score');
  if (scoreElement) {
    scoreElement.classList.add('score-updated');
    setTimeout(() => scoreElement.classList.remove('score-updated'), 1000);
  }
}

// تحديث عرض النسبة
function updateScoreDisplay(score, recommendation) {
  const scoreElement = document.querySelector('.readiness-score');
  const recommendationElement = document.querySelector('.recommendation-text');
  
  if (scoreElement) {
    scoreElement.textContent = `${score}%`;
    scoreElement.className = 'readiness-score';
    
    if (score >= 90) {
      scoreElement.classList.add('ready-100');
    } else if (score >= 75) {
      scoreElement.classList.add('ready-85');
    } else {
      scoreElement.classList.add('ready-low');
    }
  }
  
  if (recommendationElement) {
    recommendationElement.textContent = `🔸 ${recommendation}`;
  }
}

// عرض إحصائيات الموظف
function displayEmployeeStats() {
  const statsElement = document.querySelector('.employee-stats');
  if (statsElement) {
    statsElement.innerHTML = `
      <li>الاسم: ${currentEmployee.name}</li>
      <li>المنصب: ${currentEmployee.position}</li>
      <li>القسم: ${currentEmployee.department}</li>
      <li>سنوات الخبرة: ${currentEmployee.yearsOfExperience} سنوات</li>
      <li>التقييم السنوي: ${currentEmployee.performanceRating}</li>
      <li>الدورات المكتملة: ${currentEmployee.completedCourses} دورات</li>
      <li>آخر ترقية: منذ ${currentEmployee.monthsSinceLastPromotion} شهر</li>
    `;
  }
}

// عرض لوحة تحكم المدير
function showManagerDashboard() {
  const readyEmployees = employees.filter(emp => calculatePromotionReadiness(emp) >= 75);
  const topPerformers = employees.filter(emp => emp.performanceRating === 'ممتاز');
  
  const dashboard = document.querySelector('.manager-dashboard');
  if (dashboard) {
    dashboard.style.display = 'block';
  }
  
  // عرض الموظفين الجاهزين للترقية
  const readyList = document.querySelector('.ready-employees');
  if (readyList) {
    readyList.innerHTML = readyEmployees.map(emp => 
      `<li>🌟 ${emp.name} - ${emp.position} (${calculatePromotionReadiness(emp)}%)</li>`
    ).join('');
  }
  
  // عرض أعلى الموظفين أداءً
  const topList = document.querySelector('.top-performers');
  if (topList) {
    topList.innerHTML = topPerformers.map(emp => 
      `<li>⭐ ${emp.name} - ${emp.department}</li>`
    ).join('');
  }
}

// إخفاء لوحة تحكم المدير
function hideManagerDashboard() {
  const dashboard = document.querySelector('.manager-dashboard');
  if (dashboard) {
    dashboard.style.display = 'none';
  }
}

// تبديل عرض لوحة المدير
function toggleManagerView() {
  const dashboard = document.querySelector('.manager-dashboard');
  if (dashboard) {
    if (dashboard.style.display === 'none' || !dashboard.style.display) {
      showManagerDashboard();
    } else {
      hideManagerDashboard();
    }
  }
}

// تصدير التقرير
function generateReport() {
  // إنشاء تقرير مفصل
  const reportData = {
    date: new Date().toLocaleDateString('ar-SA'),
    totalEmployees: employees.length,
    readyForPromotion: employees.filter(emp => calculatePromotionReadiness(emp) >= 75).length,
    averageScore: Math.round(employees.reduce((sum, emp) => sum + calculatePromotionReadiness(emp), 0) / employees.length),
    topPerformers: employees.filter(emp => emp.performanceRating === 'ممتاز').length
  };

  const reportContent = `
📄 تقرير الترقيات والأداء
التاريخ: ${reportData.date}
═══════════════════════════

📊 الإحصائيات العامة:
• إجمالي الموظفين: ${reportData.totalEmployees}
• الجاهزين للترقية: ${reportData.readyForPromotion}
• متوسط النقاط: ${reportData.averageScore}%
• أصحاب الأداء الممتاز: ${reportData.topPerformers}

📋 تفاصيل الموظفين:
${employees.map(emp => {
  const score = calculatePromotionReadiness(emp);
  return `• ${emp.name} - ${emp.position}
  النقاط: ${score}%
  التقييم: ${emp.performanceRating}
  الخبرة: ${emp.yearsOfExperience} سنوات`;
}).join('\n')}

🎯 التوصيات:
• تنظيم دورات تدريبية للموظفين ذوي النقاط المنخفضة
• مراجعة ملفات الموظفين الجاهزين للترقية
• تحديث معايير التقييم السنوي
  `;

  // إنشاء ملف قابل للتحميل
  const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `تقرير_الترقيات_${new Date().toISOString().split('T')[0]}.txt`;
  link.click();
  URL.revokeObjectURL(url);

  // عرض رسالة نجح
  showNotification('📄 تم تصدير التقرير بنجاح!', 'success');
}

// جدولة التدريب
function scheduleTraining() {
  // تحليل احتياجات التدريب
  const trainingNeeds = {
    'تطوير الذات': employees.filter(emp => emp.completedCourses < 3).length,
    'إدارة المشاريع': employees.filter(emp => emp.performanceRating !== 'ممتاز').length,
    'التطوير التقني': employees.filter(emp => emp.department === 'تقنية المعلومات' && emp.completedCourses < 5).length
  };

  const scheduleData = `
📅 جدولة الدورات التدريبية
التاريخ: ${new Date().toLocaleDateString('ar-SA')}
═══════════════════════════

🎓 الدورات المقترحة:

1. دورة تطوير الذات
   • عدد المحتاجين: ${trainingNeeds['تطوير الذات']} موظف
   • المدة المقترحة: 3 أيام
   • التاريخ المقترح: ${new Date(Date.now() + 7*24*60*60*1000).toLocaleDateString('ar-SA')}

2. دورة إدارة المشاريع
   • عدد المحتاجين: ${trainingNeeds['إدارة المشاريع']} موظف
   • المدة المقترحة: 5 أيام
   • التاريخ المقترح: ${new Date(Date.now() + 14*24*60*60*1000).toLocaleDateString('ar-SA')}

3. دورة التطوير التقني
   • عدد المحتاجين: ${trainingNeeds['التطوير التقني']} موظف
   • المدة المقترحة: 4 أيام
   • التاريخ المقترح: ${new Date(Date.now() + 21*24*60*60*1000).toLocaleDateString('ar-SA')}

👥 قائمة الموظفين وتوصيات التدريب:
${employees.map(emp => {
  const recommendations = [];
  if (emp.completedCourses < 3) recommendations.push('تطوير الذات');
  if (emp.performanceRating !== 'ممتاز') recommendations.push('إدارة المشاريع');
  if (emp.department === 'تقنية المعلومات' && emp.completedCourses < 5) recommendations.push('التطوير التقني');
  
  return `• ${emp.name} - ${emp.position}
  الدورات المطلوبة: ${recommendations.length > 0 ? recommendations.join(', ') : 'لا توجد دورات مطلوبة حالياً'}`;
}).join('\n')}
  `;

  // إنشاء ملف الجدولة
  const blob = new Blob([scheduleData], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `جدولة_التدريب_${new Date().toISOString().split('T')[0]}.txt`;
  link.click();
  URL.revokeObjectURL(url);

  // عرض رسالة نجح
  showNotification('📅 تم إنشاء جدول التدريب بنجاح!', 'success');
}

// وظائف إدارة الموظفين
function showEmployeeList() {
  const employeesListDiv = document.querySelector('.employees-list');
  const container = document.querySelector('.employee-cards-container');
  
  if (employeesListDiv && container) {
    // إظهار قائمة الموظفين
    employeesListDiv.style.display = 'block';
    
    // تطبيق الفلاتر الحالية
    const filters = getCurrentFilters();
    const filteredEmployees = dataManager.filterEmployees(filters);
    
    // إنشاء بطاقات الموظفين
    container.innerHTML = filteredEmployees.map(emp => {
      const score = calculatePromotionReadiness(emp);
      const scoreClass = score >= 90 ? 'ready-100' : score >= 75 ? 'ready-85' : 'ready-low';
      
      return `
        <div class="employee-card">
          <div class="employee-header">
            <h4>${emp.name}</h4>
            <div class="employee-score ${scoreClass}">${score}%</div>
          </div>
          <div class="employee-details">
            <p><strong>المنصب:</strong> ${emp.position}</p>
            <p><strong>القسم:</strong> ${emp.department}</p>
            <p><strong>الخبرة:</strong> ${emp.yearsOfExperience} سنوات</p>
            <p><strong>التقييم:</strong> ${emp.performanceRating}</p>
            <p><strong>الدورات:</strong> ${emp.completedCourses || 0} دورات</p>
          </div>
          <div class="employee-actions">
            <button onclick="switchToEmployee(${emp.id})" class="switch-button">عرض التفاصيل</button>
          </div>
        </div>
      `;
    }).join('');
    
    // إظهار رسالة إذا لم توجد نتائج
    if (filteredEmployees.length === 0) {
      container.innerHTML = '<p class="no-results">لا توجد موظفين يطابقون معايير البحث</p>';
    }
  }
}

function hideEmployeeList() {
  const employeesListDiv = document.querySelector('.employees-list');
  if (employeesListDiv) {
    employeesListDiv.style.display = 'none';
  }
}

function showAddEmployeeForm() {
  const formDiv = document.querySelector('.add-employee-form');
  if (formDiv) {
    formDiv.style.display = 'block';
    // مسح النموذج
    document.getElementById('newEmployeeForm').reset();
  }
}

function hideAddEmployeeForm() {
  const formDiv = document.querySelector('.add-employee-form');
  if (formDiv) {
    formDiv.style.display = 'none';
  }
}

function addNewEmployee(event) {
  event.preventDefault();
  
  try {
    const employeeData = {
      name: document.getElementById('employeeName').value.trim(),
      position: document.getElementById('employeePosition').value.trim(),
      department: document.getElementById('employeeDepartment').value,
      yearsOfExperience: parseInt(document.getElementById('employeeExperience').value),
      performanceRating: document.getElementById('employeeRating').value,
      email: document.getElementById('employeeEmail').value.trim(),
      completedCourses: 0,
      monthsSinceLastPromotion: 0
    };

    const newEmployee = dataManager.addEmployee(employeeData);
    
    // تحديث قائمة الموظفين العامة
    employees.push(newEmployee);
    
    showNotification(`تم إضافة الموظف ${newEmployee.name} بنجاح!`, 'success');
    hideAddEmployeeForm();
    
    // تحديث قائمة الموظفين إذا كانت مفتوحة
    const employeesList = document.querySelector('.employees-list');
    if (employeesList && employeesList.style.display !== 'none') {
      showEmployeeList();
    }
    
  } catch (error) {
    showNotification(`خطأ في إضافة الموظف: ${error.message}`, 'warning');
  }
}

function switchToEmployee(employeeId) {
  const employee = dataManager.switchEmployee(employeeId);
  if (employee) {
    currentEmployee = employee;
    
    // تحديث العرض
    const score = calculatePromotionReadiness(currentEmployee);
    const recommendation = getPromotionRecommendation(score, currentEmployee);
    
    updateScoreDisplay(score, recommendation);
    displayEmployeeStats();
    
    // إخفاء قائمة الموظفين
    hideEmployeeList();
    
    showNotification(`تم التبديل إلى موظف: ${employee.name}`, 'info');
  }
}

// وظائف الفلترة
function getCurrentFilters() {
  return {
    department: document.getElementById('departmentFilter')?.value || 'الكل',
    performanceRating: document.getElementById('performanceFilter')?.value || 'الكل',
    readyForPromotion: document.getElementById('readyForPromotionFilter')?.checked || false
  };
}

function applyFilters() {
  // إذا كانت قائمة الموظفين مفتوحة، قم بتحديثها
  const employeesList = document.querySelector('.employees-list');
  if (employeesList && employeesList.style.display !== 'none') {
    showEmployeeList();
  }
}

// تحسين وظيفة عرض لوحة المدير
function showManagerDashboard() {
  // إظهار أدوات الإدارة
  const managementTools = document.querySelector('.management-tools');
  if (managementTools) {
    managementTools.style.display = 'block';
  }
  
  // الكود الأصلي للوحة المدير
  const readyEmployees = employees.filter(emp => calculatePromotionReadiness(emp) >= 75);
  const topPerformers = employees.filter(emp => emp.performanceRating === 'ممتاز');
  
  const dashboard = document.querySelector('.manager-dashboard');
  if (dashboard) {
    dashboard.style.display = 'block';
  }
  
  // عرض الموظفين الجاهزين للترقية
  const readyList = document.querySelector('.ready-employees');
  if (readyList) {
    readyList.innerHTML = readyEmployees.map(emp => 
      `<li>🌟 ${emp.name} - ${emp.position} (${calculatePromotionReadiness(emp)}%)</li>`
    ).join('');
  }
  
  // عرض أعلى الموظفين أداءً
  const topList = document.querySelector('.top-performers');
  if (topList) {
    topList.innerHTML = topPerformers.map(emp => 
      `<li>⭐ ${emp.name} - ${emp.department}</li>`
    ).join('');
  }
}

function hideManagerDashboard() {
  // إخفاء أدوات الإدارة
  const managementTools = document.querySelector('.management-tools');
  if (managementTools) {
    managementTools.style.display = 'none';
  }
  
  // إخفاء لوحة المدير
  const dashboard = document.querySelector('.manager-dashboard');
  if (dashboard) {
    dashboard.style.display = 'none';
  }
  
  // إخفاء القوائم المفتوحة
  hideEmployeeList();
  hideAddEmployeeForm();
  
  showNotification('تم إغلاق لوحة تحكم المدير', 'info');
}

// تشغيل التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
  // التأكد من تحميل البيانات بشكل صحيح
  try {
    currentEmployee = dataManager.getCurrentEmployee();
    
    const initialScore = calculatePromotionReadiness(currentEmployee);
    const initialRecommendation = getPromotionRecommendation(initialScore, currentEmployee);
    
    updateScoreDisplay(initialScore, initialRecommendation);
    displayEmployeeStats();
    
    showNotification('تم تحميل البيانات بنجاح', 'success');
    
  } catch (error) {
    console.error('خطأ في تحميل البيانات:', error);
    showNotification('خطأ في تحميل البيانات، يتم استخدام البيانات التجريبية', 'warning');
    
    // استخدام البيانات التجريبية كخطة احتياطية
    dataManager.loadDefaultData();
    currentEmployee = dataManager.getCurrentEmployee();
    
    const initialScore = calculatePromotionReadiness(currentEmployee);
    const initialRecommendation = getPromotionRecommendation(initialScore, currentEmployee);
    
    updateScoreDisplay(initialScore, initialRecommendation);
    displayEmployeeStats();
  }
});

// عرض التنبيهات
function showNotification(message, type = 'info') {
  // إنشاء عنصر التنبيه
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <span class="notification-icon">
      ${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️'}
    </span>
    <span class="notification-message">${message}</span>
    <button class="notification-close" onclick="this.parentElement.remove()">×</button>
  `;
  
  // إضافة التنبيه إلى الصفحة
  document.body.appendChild(notification);
  
  // إزالة التنبيه تلقائياً بعد 5 ثواني
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
  
  // إضافة تأثير الظهور
  setTimeout(() => notification.classList.add('show'), 100);
}

// تحسين وظيفة إغلاق لوحة المدير
function hideManagerDashboard() {
  const dashboard = document.querySelector('.manager-dashboard');
  if (dashboard) {
    dashboard.style.display = 'none';
    showNotification('تم إغلاق لوحة تحكم المدير', 'info');
  }
}

// تصدير الوظائف للاستخدام العام
window.calculateNewScore = calculateNewScore;
window.toggleManagerView = toggleManagerView;
window.showManagerDashboard = showManagerDashboard;
window.hideManagerDashboard = hideManagerDashboard;
window.generateReport = generateReport;
window.scheduleTraining = scheduleTraining;
window.showNotification = showNotification;
window.showEmployeeList = showEmployeeList;
window.hideEmployeeList = hideEmployeeList;
window.showAddEmployeeForm = showAddEmployeeForm;
window.hideAddEmployeeForm = hideAddEmployeeForm;
window.addNewEmployee = addNewEmployee;
window.switchToEmployee = switchToEmployee;
window.applyFilters = applyFilters;
