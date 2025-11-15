
// Firebase Configuration (سيتم استخدام CDN بدلاً من modules)
const firebaseConfig = {
  apiKey: "AIzaSyBQlS9bEVuEMIztaHEltgsOOjz-mTzDxNc",
  authDomain: "trgi-4f4f1.firebaseapp.com",
  projectId: "trgi-4f4f1",
  storageBucket: "trgi-4f4f1.firebasestorage.app",
  messagingSenderId: "644222531254",
  appId: "1:644222531254:web:eb547ecc96015a586c5817",
  measurementId: "G-E0EGTNLRW3"
};

// بيانات الموظفين التجريبية
let currentEmployee = {
  id: 1,
  name: 'أحمد محمد الشعلان',
  position: 'محلل نظم',
  yearsOfExperience: 4,
  performanceRating: 'ممتاز',
  completedCourses: 3,
  monthsSinceLastPromotion: 18,
  lastCourseDate: '2023-06-15',
  department: 'تقنية المعلومات'
};

// قاعدة بيانات الموظفين التجريبية
const employees = [
  currentEmployee,
  {
    id: 2,
    name: 'فاطمة أحمد علي',
    position: 'محاسبة',
    yearsOfExperience: 6,
    performanceRating: 'جيد جداً',
    completedCourses: 5,
    monthsSinceLastPromotion: 30,
    department: 'المالية'
  },
  {
    id: 3,
    name: 'محمد سالم القحطاني',
    position: 'مشرف إداري',
    yearsOfExperience: 2,
    performanceRating: 'جيد',
    completedCourses: 2,
    monthsSinceLastPromotion: 8,
    department: 'الإدارة العامة'
  }
];

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
  scoreElement.classList.add('score-updated');
  setTimeout(() => scoreElement.classList.remove('score-updated'), 1000);
}

// تحديث عرض النسبة
function updateScoreDisplay(score, recommendation) {
  const scoreElement = document.querySelector('.readiness-score');
  const recommendationElement = document.querySelector('.recommendation-text');
  
  scoreElement.textContent = `${score}%`;
  scoreElement.className = 'readiness-score';
  
  if (score >= 90) {
    scoreElement.classList.add('ready-100');
  } else if (score >= 75) {
    scoreElement.classList.add('ready-85');
  } else {
    scoreElement.classList.add('ready-low');
  }
  
  recommendationElement.textContent = `🔸 ${recommendation}`;
}

// عرض إحصائيات الموظف
function displayEmployeeStats() {
  const statsElement = document.querySelector('.employee-stats');
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

// عرض لوحة تحكم المدير
function showManagerDashboard() {
  const readyEmployees = employees.filter(emp => calculatePromotionReadiness(emp) >= 75);
  const topPerformers = employees.filter(emp => emp.performanceRating === 'ممتاز');
  
  document.querySelector('.manager-dashboard').style.display = 'block';
  
  // عرض الموظفين الجاهزين للترقية
  const readyList = document.querySelector('.ready-employees');
  readyList.innerHTML = readyEmployees.map(emp => 
    `<li>🌟 ${emp.name} - ${emp.position} (${calculatePromotionReadiness(emp)}%)</li>`
  ).join('');
  
  // عرض أعلى الموظفين أداءً
  const topList = document.querySelector('.top-performers');
  topList.innerHTML = topPerformers.map(emp => 
    `<li>⭐ ${emp.name} - ${emp.department}</li>`
  ).join('');
}

// إخفاء لوحة تحكم المدير
function hideManagerDashboard() {
  document.querySelector('.manager-dashboard').style.display = 'none';
}

// تبديل عرض لوحة المدير
function toggleManagerView() {
  const dashboard = document.querySelector('.manager-dashboard');
  if (dashboard.style.display === 'none' || !dashboard.style.display) {
    showManagerDashboard();
  } else {
    hideManagerDashboard();
  }
}

// تشغيل التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
  const initialScore = calculatePromotionReadiness(currentEmployee);
  const initialRecommendation = getPromotionRecommendation(initialScore, currentEmployee);
  
  updateScoreDisplay(initialScore, initialRecommendation);
  displayEmployeeStats();
});

// تصدير الوظائف للاستخدام العام
window.calculateNewScore = calculateNewScore;
window.toggleManagerView = toggleManagerView;
window.showManagerDashboard = showManagerDashboard;
window.hideManagerDashboard = hideManagerDashboard;
