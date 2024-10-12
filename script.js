// انتظار تحميل المحتوى
document.addEventListener('DOMContentLoaded', () => {
  const calculateBtn = document.getElementById('calculate-btn');
  const resultsSection = document.getElementById('results');

  // عناصر النتائج
  const establishmentCostEl = document.getElementById('establishment-cost');
  const annualOperationalCostEl = document.getElementById('annual-operational-cost');
  const annualExpectedReturnsEl = document.getElementById('annual-expected-returns');
  const annualReturnGrowthRateEl = document.getElementById('annual-return-growth-rate');
  const riskAnalysisEl = document.getElementById('risk-analysis');
  const recommendationsEl = document.getElementById('recommendations');
  const downloadReportBtn = document.getElementById('download-report');

  // عناصر النموذج
  const landSizeInput = document.getElementById('land-size');
  const greenhouseSizeInput = document.getElementById('greenhouse-size');
  const cropTypeInput = document.getElementById('crop-type');

  // توفر الخدمات (الكهرباء)
  const electricityAvailabilityInputs = document.getElementsByName('electricity-availability');
  const electricitySourceContainer = document.getElementById('electricity-source-container');
  const electricitySourceSelect = document.getElementById('electricity-source');
  const electricityCostContainer = document.getElementById('electricity-cost-container');
  const electricityCostInput = document.getElementById('electricity-cost');

  // مصدر الماء
  const waterSourceSelect = document.getElementById('water-source');
  const waterPpmInput = document.getElementById('water-ppm');

  // نوع الصالات المحمية
  const greenhouseTypeSelect = document.getElementById('greenhouse-type');

  // إظهار أو إخفاء حقل مصدر الكهرباء بناءً على توفر الكهرباء
  electricityAvailabilityInputs.forEach(input => {
    input.addEventListener('change', () => {
      if (input.value === 'no' && input.checked) {
        electricitySourceContainer.style.display = 'block';
      } else if (input.value === 'yes' && input.checked) {
        electricitySourceContainer.style.display = 'none';
        electricityCostContainer.style.display = 'none';
      }
    });
  });

  // إظهار أو إخفاء حقل تكلفة الكيلو واط إذا تم اختيار "آخرى" في مصدر الكهرباء
  electricitySourceSelect.addEventListener('change', () => {
    if (electricitySourceSelect.value === 'other') {
      electricityCostContainer.style.display = 'block';
    } else {
      electricityCostContainer.style.display = 'none';
    }
  });

  calculateBtn.addEventListener('click', () => {
    // الحصول على قيم الإدخال
    const landSize = parseFloat(landSizeInput.value);
    const greenhouseSize = parseFloat(greenhouseSizeInput.value);
    const cropType = cropTypeInput.value;

    // التحقق من توفر الكهرباء
    let electricityAvailability = '';
    electricityAvailabilityInputs.forEach(input => {
      if (input.checked) {
        electricityAvailability = input.value;
      }
    });

    let electricitySource = '';
    let electricityCost = 0;
    if (electricityAvailability === 'no') {
      electricitySource = electricitySourceSelect.value;
      if (electricitySource === 'other') {
        electricityCost = parseFloat(electricityCostInput.value);
        if (isNaN(electricityCost) || electricityCost <= 0) {
          alert('يرجى إدخال تكلفة الكيلو واط صحيحة.');
          return;
        }
      }
    }

    // مصدر الماء
    const waterSource = waterSourceSelect.value;
    const waterPpm = parseFloat(waterPpmInput.value);

    // نوع الصالات المحمية
    const greenhouseType = greenhouseTypeSelect.value;

    // التحقق من الإدخالات
    if (isNaN(landSize) || isNaN(greenhouseSize) || landSize <= 0 || greenhouseSize <= 0) {
      alert('يرجى إدخال قيم صحيحة لحجم الأرض وحجم الصالات المحمية.');
      return;
    }
    if (!cropType) {
      alert('يرجى إدخال نوع المحصول.');
      return;
    }

    // حساب التكاليف الإجمالية للتأسيس
    const establishmentCost = calculateEstablishmentCost(landSize, greenhouseSize, greenhouseType);

    // حساب التكاليف التشغيلية السنوية
    const annualOperationalCost = calculateAnnualOperationalCost(landSize, greenhouseSize, electricityAvailability, electricitySource, electricityCost, waterSource);

    // تقدير العوائد المتوقعة السنوية
    const annualExpectedReturns = calculateAnnualExpectedReturns(cropType, greenhouseSize);

    // نسبة معدل زيادة العائد المتوقع السنوية
    const annualReturnGrowthRate = calculateAnnualReturnGrowthRate(cropType);

    // تحليل المخاطر
    const riskAnalysis = analyzeRisk(waterPpm, electricityAvailability);

    // توصيات
    const recommendations = provideRecommendations(riskAnalysis);

    // عرض النتائج
    establishmentCostEl.textContent = `التكاليف الإجمالية للتأسيس: $${establishmentCost.toFixed(2)}`;
    annualOperationalCostEl.textContent = `التكاليف التشغيلية السنوية: $${annualOperationalCost.toFixed(2)}`;
    annualExpectedReturnsEl.textContent = `العوائد المتوقعة السنوية: $${annualExpectedReturns.toFixed(2)}`;
    annualReturnGrowthRateEl.textContent = `نسبة معدل زيادة العائد المتوقع السنوية: ${annualReturnGrowthRate}%`;
    riskAnalysisEl.textContent = `تحليل المخاطر: ${riskAnalysis}`;
    recommendationsEl.textContent = `التوصيات: ${recommendations}`;

    // إظهار قسم النتائج
    resultsSection.style.display = 'block';
  });

  // دوال حساب التكاليف والعوائد والمخاطر

  // دالة لحساب التكاليف الإجمالية للتأسيس
  function calculateEstablishmentCost(landSize, greenhouseSize, greenhouseType) {
    // يمكن تعديل هذه الدالة بناءً على بيانات فعلية
    let costPerSquareMeter = 0;
    switch (greenhouseType) {
      case 'glass':
        costPerSquareMeter = 50;
        break;
      case 'polycarbonate':
        costPerSquareMeter = 40;
        break;
      case 'plastic':
        costPerSquareMeter = 30;
        break;
      default:
        costPerSquareMeter = 30;
    }
    return greenhouseSize * costPerSquareMeter;
  }

  // دالة لحساب التكاليف التشغيلية السنوية
  function calculateAnnualOperationalCost(landSize, greenhouseSize, electricityAvailability, electricitySource, electricityCost, waterSource) {
    // يمكن تعديل هذه الدالة بناءً على بيانات فعلية
    let electricityCostPerYear = 0;
    if (electricityAvailability === 'yes') {
      electricityCostPerYear = greenhouseSize * 10; // تكلفة افتراضية
    } else {
      if (electricitySource === 'generator') {
        electricityCostPerYear = greenhouseSize * 15;
      } else if (electricitySource === 'solar') {
        electricityCostPerYear = greenhouseSize * 5;
      } else if (electricitySource === 'other') {
        electricityCostPerYear = greenhouseSize * electricityCost;
      }
    }

    let waterCostPerYear = 0;
    switch (waterSource) {
      case 'company':
        waterCostPerYear = greenhouseSize * 8;
        break;
      case 'well':
        waterCostPerYear = greenhouseSize * 5;
        break;
      case 'transport':
        waterCostPerYear = greenhouseSize * 12;
        break;
      default:
        waterCostPerYear = greenhouseSize * 8;
    }

    // تكاليف تشغيلية أخرى
    const otherOperationalCosts = greenhouseSize * 20;

    return electricityCostPerYear + waterCostPerYear + otherOperationalCosts;
  }

  // دالة لتقدير العوائد المتوقعة السنوية
  function calculateAnnualExpectedReturns(cropType, greenhouseSize) {
    // يمكن تعديل هذه الدالة بناءً على بيانات فعلية
    const returnPerSquareMeter = 200; // قيمة افتراضية
    return returnPerSquareMeter * greenhouseSize;
  }

  // دالة لحساب نسبة معدل زيادة العائد المتوقع السنوية
  function calculateAnnualReturnGrowthRate(cropType) {
    // يمكن تعديل هذه الدالة بناءً على بيانات فعلية
    return 5; // نسبة افتراضية
  }

  // دالة لتحليل المخاطر
  function analyzeRisk(waterPpm, electricityAvailability) {
    // يمكن تعديل هذه الدالة بناءً على عوامل فعلية
    let riskLevel = 'منخفضة';
    if (waterPpm && waterPpm > 1000) {
      riskLevel = 'مرتفعة بسبب جودة الماء';
    }
    if (electricityAvailability === 'no') {
      riskLevel = 'متوسطة بسبب عدم توفر الكهرباء';
    }
    return riskLevel;
  }

  // دالة لتقديم التوصيات
  function provideRecommendations(riskAnalysis) {
    if (riskAnalysis.includes('مرتفعة')) {
      return 'ننصح بتحسين جودة الماء وتقليل المخاطر';
    } else if (riskAnalysis.includes('متوسطة')) {
      return 'ننصح بتأمين مصدر كهرباء مستقر';
    } else {
      return 'المشروع ذو جاذبية عالية للاستثمار';
    }
  }

  // وظيفة تنزيل التقرير
  downloadReportBtn.addEventListener('click', () => {
    // توليد محتوى التقرير
    const reportContent = `
      تقرير جاذبية الاستثمار:

      التكاليف الإجمالية للتأسيس: $${establishmentCostEl.textContent.split('$')[1]}
      التكاليف التشغيلية السنوية: $${annualOperationalCostEl.textContent.split('$')[1]}
      العوائد المتوقعة السنوية: $${annualExpectedReturnsEl.textContent.split('$')[1]}
      نسبة معدل زيادة العائد المتوقع السنوية: ${annualReturnGrowthRateEl.textContent.split(': ')[1]}
      تحليل المخاطر: ${riskAnalysisEl.textContent.split(': ')[1]}
      التوصيات: ${recommendationsEl.textContent.split(': ')[1]}
    `;

    // إنشاء ملف وتنزيله
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'تقرير_جاذبية_الاستثمار.txt';
    link.click();
  });
});
