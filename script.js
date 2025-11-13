
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQlS9bEVuEMIztaHEltgsOOjz-mTzDxNc",
  authDomain: "trgi-4f4f1.firebaseapp.com",
  projectId: "trgi-4f4f1",
  storageBucket: "trgi-4f4f1.firebasestorage.app",
  messagingSenderId: "644222531254",
  appId: "1:644222531254:web:eb547ecc96015a586c5817",
  measurementId: "G-E0EGTNLRW3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

// مثال على وظيفة لحساب نسبة جاهزية الموظف للترقية
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

// مثال على بيانات موظف
const sampleEmployee = {
  name: 'أحمد محمد',
  yearsOfExperience: 4,
  performanceRating: 'ممتاز',
  completedCourses: 3,
  monthsSinceLastPromotion: 18
};

// حساب نسبة الجاهزية
const readinessScore = calculatePromotionReadiness(sampleEmployee);
console.log(`نسبة جاهزية ${sampleEmployee.name} للترقية: ${readinessScore}%`);

// تصدير المتغيرات للاستخدام في أماكن أخرى
window.firebaseApp = app;
window.firebaseDb = db;
window.firebaseAuth = auth;
window.calculatePromotionReadiness = calculatePromotionReadiness;
