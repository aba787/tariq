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
    try {
      if (this.employees && Array.isArray(this.employees) && this.employees.length > 0) {
        localStorage.setItem('employeesData', JSON.stringify(this.employees));
        console.log('تم حفظ البيانات بنجاح');
      }
      if (this.currentEmployeeId !== undefined && this.currentEmployeeId !== null) {
        localStorage.setItem('currentEmployeeId', this.currentEmployeeId.toString());
      }
    } catch (error) {
      console.error('خطأ في حفظ البيانات:', error);
      showNotification('خطأ في حفظ البيانات', 'warning');
    }
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
        showNotification(`حقل "${field}" مطلوب`, 'warning');
        return false;
      }
    }

    // التحقق من صحة البريد الإلكتروني
    if (data.email && data.email.trim() !== '' && !this.isValidEmail(data.email)) {
      console.error('عنوان البريد الإلكتروني غير صحيح');
      showNotification('عنوان البريد الإلكتروني غير صحيح', 'warning');
      return false;
    }

    // التحقق من سنوات الخبرة
    if (isNaN(data.yearsOfExperience) || data.yearsOfExperience < 0 || data.yearsOfExperience > 50) {
      console.error('سنوات الخبرة يجب أن تكون رقم موجب وأقل من 50');
      showNotification('سنوات الخبرة يجب أن تكون بين 0 و 50', 'warning');
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

  updateEmployee(employeeId, updatedData) {
    const employeeIndex = this.employees.findIndex(emp => emp.id === employeeId);
    if (employeeIndex !== -1) {
      // التحقق من صحة البيانات الأساسية
      if (!this.validateEmployeeData(updatedData)) {
        throw new Error('بيانات الموظف غير صحيحة');
      }

      // تحديث البيانات مع الحفاظ على المعرف وتاريخ الانضمام
      this.employees[employeeIndex] = {
        ...this.employees[employeeIndex],
        ...updatedData,
        id: employeeId,
        joinDate: this.employees[employeeIndex].joinDate || updatedData.joinDate
      };

      this.saveData();
      return this.employees[employeeIndex];
    }
    return null;
  }

  addCourseToEmployee(employeeId, courseData) {
    const employee = this.employees.find(emp => emp.id === employeeId);
    if (employee) {
      if (!employee.courses) {
        employee.courses = [];
      }
      
      const newCourse = {
        id: Date.now(),
        name: courseData.name,
        date: courseData.date,
        duration: courseData.duration,
        points: courseData.points || 5, // نقاط افتراضية للدورة
        ...courseData
      };
      
      employee.courses.push(newCourse);
      employee.completedCourses = employee.courses.length;
      
      this.saveData();
      return newCourse;
    }
    return null;
  }

  removeCourseFromEmployee(employeeId, courseId) {
    const employee = this.employees.find(emp => emp.id === employeeId);
    if (employee && employee.courses) {
      employee.courses = employee.courses.filter(course => course.id !== courseId);
      employee.completedCourses = employee.courses.length;
      this.saveData();
      return true;
    }
    return false;
  }

  getAllDepartments() {
    const departments = new Set();
    this.employees.forEach(emp => {
      if (emp.department) {
        departments.add(emp.department);
      }
    });
    return Array.from(departments).sort();
  }
}

// إنشاء مدير البيانات العام
let dataManager, currentEmployee, employees;

// تهيئة البيانات بشكل آمن
function initializeApp() {
  try {
    dataManager = new DataManager();
    currentEmployee = dataManager.getCurrentEmployee();
    employees = dataManager.getAllEmployees();
    return true;
  } catch (error) {
    console.error('خطأ في تهيئة التطبيق:', error);
    return false;
  }
}

// تهيئة التطبيق
initializeApp();

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
  let coursesScore = 0;
  if (employeeData.courses && employeeData.courses.length > 0) {
    // حساب النقاط بناء على مجموع نقاط الدورات
    const totalCoursePoints = employeeData.courses.reduce((sum, course) => sum + (course.points || 5), 0);
    coursesScore = Math.min(totalCoursePoints, 20); // الحد الأقصى 20 نقطة
  } else {
    // الطريقة التقليدية للموظفين القدامى
    if (employeeData.completedCourses >= 5) {
      coursesScore = 20;
    } else if (employeeData.completedCourses >= 3) {
      coursesScore = 15;
    } else if (employeeData.completedCourses >= 1) {
      coursesScore = 10;
    }
  }
  score += coursesScore;

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
            <button onclick="showEditEmployeeForm(${emp.id})" class="edit-button">✏️ تعديل البيانات</button>
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
    
    // تحديث قائمة الموظفين العامة من المصدر الأساسي
    employees = dataManager.getAllEmployees();
    
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

// وظائف تعديل الموظفين
function showEditEmployeeForm(employeeId) {
  const employee = employees.find(emp => emp.id === employeeId);
  if (!employee) return;

  const formDiv = document.querySelector('.edit-employee-form');
  if (formDiv) {
    formDiv.style.display = 'block';
    
    // ملء النموذج بالبيانات الحالية
    document.getElementById('editEmployeeId').value = employee.id;
    document.getElementById('editEmployeeName').value = employee.name;
    document.getElementById('editEmployeePosition').value = employee.position;
    document.getElementById('editEmployeeDepartment').value = employee.department;
    document.getElementById('editEmployeeExperience').value = employee.yearsOfExperience;
    document.getElementById('editEmployeeRating').value = employee.performanceRating;
    document.getElementById('editEmployeeEmail').value = employee.email || '';
    document.getElementById('editEmployeeCourses').value = employee.completedCourses || 0;
    document.getElementById('editEmployeeMonths').value = employee.monthsSinceLastPromotion || 0;
    
    // عرض الدورات المسجلة
    displayEmployeeCourses(employee);
  }
}

function hideEditEmployeeForm() {
  const formDiv = document.querySelector('.edit-employee-form');
  if (formDiv) {
    formDiv.style.display = 'none';
  }
}

function updateEmployee(event) {
  event.preventDefault();
  
  try {
    const employeeId = parseInt(document.getElementById('editEmployeeId').value);
    const updatedData = {
      name: document.getElementById('editEmployeeName').value.trim(),
      position: document.getElementById('editEmployeePosition').value.trim(),
      department: document.getElementById('editEmployeeDepartment').value,
      yearsOfExperience: parseInt(document.getElementById('editEmployeeExperience').value),
      performanceRating: document.getElementById('editEmployeeRating').value,
      email: document.getElementById('editEmployeeEmail').value.trim(),
      completedCourses: parseInt(document.getElementById('editEmployeeCourses').value),
      monthsSinceLastPromotion: parseInt(document.getElementById('editEmployeeMonths').value)
    };

    const updatedEmployee = dataManager.updateEmployee(employeeId, updatedData);
    
    if (updatedEmployee) {
      // تحديث المتغيرات العامة
      employees = dataManager.getAllEmployees();
      
      // إذا كان هذا الموظف الحالي، قم بتحديث العرض
      if (currentEmployee && currentEmployee.id === employeeId) {
        currentEmployee = updatedEmployee;
        const score = calculatePromotionReadiness(currentEmployee);
        const recommendation = getPromotionRecommendation(score, currentEmployee);
        updateScoreDisplay(score, recommendation);
        displayEmployeeStats();
      }
      
      showNotification(`تم تحديث بيانات الموظف ${updatedEmployee.name} بنجاح!`, 'success');
      hideEditEmployeeForm();
      
      // تحديث قائمة الموظفين إذا كانت مفتوحة
      const employeesList = document.querySelector('.employees-list');
      if (employeesList && employeesList.style.display !== 'none') {
        showEmployeeList();
      }
    }
    
  } catch (error) {
    showNotification(`خطأ في تحديث بيانات الموظف: ${error.message}`, 'warning');
  }
}

// وظائف إدارة الدورات
function displayEmployeeCourses(employee) {
  const coursesContainer = document.querySelector('.employee-courses-list');
  if (!coursesContainer) return;

  const courses = employee.courses || [];
  
  if (courses.length === 0) {
    coursesContainer.innerHTML = '<p class="no-courses">لا توجد دورات مسجلة</p>';
    return;
  }

  coursesContainer.innerHTML = courses.map(course => `
    <div class="course-item">
      <div class="course-info">
        <strong>${course.name}</strong>
        <p>التاريخ: ${course.date || 'غير محدد'}</p>
        <p>المدة: ${course.duration || 'غير محدد'}</p>
        <p>النقاط: +${course.points || 5}</p>
      </div>
      <button onclick="removeCourse(${employee.id}, ${course.id})" class="remove-course-btn">حذف</button>
    </div>
  `).join('');
}

function showAddCourseForm(employeeId) {
  const formHTML = `
    <div class="add-course-overlay" id="addCourseOverlay">
      <div class="add-course-form">
        <h4>إضافة دورة جديدة</h4>
        <form onsubmit="addCourseToEmployee(event, ${employeeId})">
          <div class="form-group">
            <label>اسم الدورة</label>
            <input type="text" id="courseName" required>
          </div>
          <div class="form-group">
            <label>تاريخ الدورة</label>
            <input type="date" id="courseDate">
          </div>
          <div class="form-group">
            <label>مدة الدورة (بالساعات)</label>
            <input type="number" id="courseDuration" min="1" value="8">
          </div>
          <div class="form-group">
            <label>النقاط المكتسبة</label>
            <input type="number" id="coursePoints" min="1" max="20" value="5">
          </div>
          <div class="form-actions">
            <button type="submit" class="primary-button">إضافة الدورة</button>
            <button type="button" onclick="hideAddCourseForm()" class="secondary-button">إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', formHTML);
}

function hideAddCourseForm() {
  const overlay = document.getElementById('addCourseOverlay');
  if (overlay) {
    overlay.remove();
  }
}

function addCourseToEmployee(event, employeeId) {
  event.preventDefault();
  
  try {
    const courseData = {
      name: document.getElementById('courseName').value.trim(),
      date: document.getElementById('courseDate').value,
      duration: parseInt(document.getElementById('courseDuration').value),
      points: parseInt(document.getElementById('coursePoints').value)
    };

    const addedCourse = dataManager.addCourseToEmployee(employeeId, courseData);
    
    if (addedCourse) {
      employees = dataManager.getAllEmployees();
      
      const employee = employees.find(emp => emp.id === employeeId);
      displayEmployeeCourses(employee);
      
      // تحديث عدد الدورات في النموذج
      document.getElementById('editEmployeeCourses').value = employee.completedCourses;
      
      showNotification(`تم إضافة دورة "${courseData.name}" بنجاح!`, 'success');
      hideAddCourseForm();
    }
    
  } catch (error) {
    showNotification(`خطأ في إضافة الدورة: ${error.message}`, 'warning');
  }
}

function removeCourse(employeeId, courseId) {
  if (confirm('هل أنت متأكد من حذف هذه الدورة؟')) {
    const removed = dataManager.removeCourseFromEmployee(employeeId, courseId);
    
    if (removed) {
      employees = dataManager.getAllEmployees();
      
      const employee = employees.find(emp => emp.id === employeeId);
      displayEmployeeCourses(employee);
      
      // تحديث عدد الدورات في النموذج
      document.getElementById('editEmployeeCourses').value = employee.completedCourses;
      
      showNotification('تم حذف الدورة بنجاح!', 'success');
    }
  }
}

// تحديث الفلاتر الديناميكية
function updateDepartmentFilters() {
  const departments = dataManager.getAllDepartments();
  const departmentSelect = document.getElementById('departmentFilter');
  const addDepartmentSelect = document.getElementById('employeeDepartment');
  const editDepartmentSelect = document.getElementById('editEmployeeDepartment');
  
  if (departmentSelect) {
    const currentValue = departmentSelect.value;
    departmentSelect.innerHTML = '<option value="الكل">جميع الأقسام</option>';
    
    departments.forEach(dept => {
      const option = document.createElement('option');
      option.value = dept;
      option.textContent = dept;
      departmentSelect.appendChild(option);
    });
    
    // استعادة القيمة المحددة سابقاً
    if (currentValue && departments.includes(currentValue)) {
      departmentSelect.value = currentValue;
    }
  }
  
  // تحديث قوائم الأقسام في النماذج
  [addDepartmentSelect, editDepartmentSelect].forEach(select => {
    if (select) {
      const currentValue = select.value;
      const firstOption = select.querySelector('option');
      select.innerHTML = '';
      
      if (firstOption) {
        select.appendChild(firstOption);
      }
      
      departments.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept;
        option.textContent = dept;
        select.appendChild(option);
      });
      
      if (currentValue && departments.includes(currentValue)) {
        select.value = currentValue;
      }
    }
  });
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
    // التحقق من وجود مدير البيانات
    if (!dataManager) {
      console.log('إعادة تهيئة مدير البيانات...');
      if (!initializeApp()) {
        throw new Error('فشل في تهيئة التطبيق');
      }
    }
    
    currentEmployee = dataManager.getCurrentEmployee();
    
    // التحقق من وجود موظف حالي
    if (!currentEmployee) {
      console.log('لا يوجد موظف حالي، استخدام أول موظف');
      const allEmployees = dataManager.getAllEmployees();
      if (allEmployees.length > 0) {
        currentEmployee = allEmployees[0];
        dataManager.currentEmployeeId = currentEmployee.id;
      } else {
        throw new Error('لا يوجد موظفين في البيانات');
      }
    }
    
    const initialScore = calculatePromotionReadiness(currentEmployee);
    const initialRecommendation = getPromotionRecommendation(initialScore, currentEmployee);
    
    updateScoreDisplay(initialScore, initialRecommendation);
    displayEmployeeStats();
    
    // تحديث الفلاتر الديناميكية
    updateDepartmentFilters();
    
    showNotification('تم تحميل التطبيق بنجاح! 🎉', 'success');
    
  } catch (error) {
    console.error('خطأ في تحميل البيانات:', error);
    showNotification('خطأ في تحميل البيانات، يتم استخدام البيانات التجريبية', 'warning');
    
    // استخدام البيانات التجريبية كخطة احتياطية
    try {
      dataManager = new DataManager();
      dataManager.loadDefaultData();
      currentEmployee = dataManager.getCurrentEmployee();
      employees = dataManager.getAllEmployees();
      
      const initialScore = calculatePromotionReadiness(currentEmployee);
      const initialRecommendation = getPromotionRecommendation(initialScore, currentEmployee);
      
      updateScoreDisplay(initialScore, initialRecommendation);
      displayEmployeeStats();
      updateDepartmentFilters();
      
      showNotification('تم تحميل البيانات التجريبية', 'info');
    } catch (fallbackError) {
      console.error('خطأ حرج:', fallbackError);
      showNotification('خطأ حرج في تحميل التطبيق', 'warning');
    }
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
window.showEditEmployeeForm = showEditEmployeeForm;
window.hideEditEmployeeForm = hideEditEmployeeForm;
window.updateEmployee = updateEmployee;
window.showAddCourseForm = showAddCourseForm;
window.hideAddCourseForm = hideAddCourseForm;
window.addCourseToEmployee = addCourseToEmployee;
window.removeCourse = removeCourse;
window.updateDepartmentFilters = updateDepartmentFilters;