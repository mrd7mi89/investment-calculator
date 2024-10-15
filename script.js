// انتظار تحميل المحتوى
document.addEventListener('DOMContentLoaded', () => {
  const calculateBtn = document.getElementById('calculate-btn');
  const resultsSection = document.getElementById('results');
  const totalCostEl = document.getElementById('total-cost');
  const expectedReturnsEl = document.getElementById('expected-returns');
  const riskAnalysisEl = document.getElementById('risk-analysis');
  const downloadReportBtn = document.getElementById('download-report');

  calculateBtn.addEventListener('click', () => {
    // الحصول على قيم الإدخال
    const equipmentCost = parseFloat(document.getElementById('equipment-cost').value);
    const seedsCost = parseFloat(document.getElementById('seeds-cost').value);
    const maintenanceCost = parseFloat(document.getElementById('maintenance-cost').value);
    const cropType = document.getElementById('crop-type').value;
    const projectSize = parseFloat(document.getElementById('project-size').value);

    // التحقق من الإدخالات
    if (isNaN(equipmentCost) || isNaN(seedsCost) || isNaN(maintenanceCost) || isNaN(projectSize)) {
      alert('يرجى إدخال قيم صحيحة في جميع الحقول.');
      return;
    }

    // حساب التكاليف الإجمالية
    const totalCost = equipmentCost + seedsCost + maintenanceCost;

    // تقدير العوائد المتوقعة (مثال بسيط)
    const expectedReturns = calculateExpectedReturns(cropType, projectSize);

    // تحليل المخاطر (مثال بسيط)
    const riskAnalysis = analyzeRisk();

    // عرض النتائج
    totalCostEl.textContent = `إجمالي التكاليف: $${totalCost.toFixed(2)}`;
    expectedReturnsEl.textContent = `العوائد المتوقعة: $${expectedReturns.toFixed(2)}`;
    riskAnalysisEl.textContent = `تحليل المخاطر: ${riskAnalysis}`;

    // إظهار قسم النتائج
    resultsSection.style.display = 'block';
  });

  // دالة لتقدير العوائد المتوقعة
  function calculateExpectedReturns(cropType, projectSize) {
    // يمكن تعديل هذه الدالة بناءً على بيانات فعلية
    const returnPerSquareMeter = 100; // قيمة افتراضية
    return returnPerSquareMeter * projectSize;
  }

  // دالة لتحليل المخاطر
  function analyzeRisk() {
    // يمكن تعديل هذه الدالة بناءً على عوامل فعلية
    return 'مخاطر متوسطة';
  }

  // وظيفة تنزيل التقرير
  downloadReportBtn.addEventListener('click', () => {
    // توليد محتوى التقرير
    const reportContent = `
      تقرير جاذبية الاستثمار:

      إجمالي التكاليف: $${(equipmentCost + seedsCost + maintenanceCost).toFixed(2)}
      العوائد المتوقعة: $${expectedReturnsEl.textContent.split('$')[1]}
      تحليل المخاطر: ${riskAnalysisEl.textContent.split(': ')[1]}
    `;

    // إنشاء ملف وتنزيله
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'تقرير_جاذبية_الاستثمار.txt';
    link.click();
  });
});
