/* global React, ReactDOM */

// Simple icon components using emoji
const InfoIcon = ({ className, ...props }) => <span className={className} {...props}>ℹ️</span>;
const Download = ({ className, ...props }) => <span className={className} {...props}>📥</span>;
const Calculator = ({ className, ...props }) => <span className={className} {...props}>🧮</span>;
const FileText = ({ className, ...props }) => <span className={className} {...props}>📄</span>;
const DollarSign = ({ className, ...props }) => <span className={className} {...props}>💰</span>;

const { useState, useRef } = React;

export default function ForeignWorkerSalaryCalculator() {
  // פונקציה לקבלת שכר מינימום לפי תאריך
  // עדכן את הערכים האלה כאשר משרד העבודה / כל זכות מעדכנים את השכר המינימום
  // מקור: https://www.kolzchut.org.il/he/minimum_wage_in_israel
  const getMinimumWage = () => {
    const today = new Date();
    
    // TODO: כשמשרד העבודה מפרסם שכר מינימום חדש, הוסף תאריך ושכר כאן
    // דוגמה לעדכון עתידי:
    // const january2027 = new Date('2027-01-01');
    // if (today >= january2027) return 6650.00; // שכר מינימום מעודכן
    
    const april2026 = new Date('2026-04-01');
    if (today >= april2026) {
      return 6443.85; // שכר מינימום מאפריל 2026
    }
    
    return 6247.67; // שכר מינימום עד מרץ 2026
  };

  const initialFormData = {
    // פרטי עובד
    employeeName: '',
    employeeId: '',
    monthYear: new Date().toISOString().slice(0, 7),
    
    // שכר יסוד - מתעדכן אוטומטי
    baseSalary: getMinimumWage(),
    
    // ימי עבודה
    saturdaysWorked: 4.3,
    holidaysWorked: 0,
    vacationDays: 0,
    
    // הפרשות
    pensionRate: 12.5,
    nationalInsuranceRate: 3.6,
    healthInsurance: 280,
    
    // הוצאות מחיה
    foodAllowance: 0,
    utilities: 275,
    gifts: 80,
    recuperationDays: 0,
    recuperationPayPerDay: 418,
    
    // תשלומים נוספים
    phonePackage: 0,
    managementFee: 70,
    transportDaily: 0,
    transportMonthly: 0,
    
    // ניכויים
    housingDeduction: 0,
    utilitiesDeduction: 0,
    healthInsuranceDeduction: 0,
    advancesDeduction: 0,
    
    // תשלום עבור מחליף
    replacementDays: 0,
    replacementCostPerDay: 400,
  };

  const [formData, setFormData] = useState(initialFormData);

  const [showTooltip, setShowTooltip] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const printRef = useRef();

  // פונקציה לאיפוס הטופס
  const resetForm = () => {
    if (window.confirm('האם אתה בטוח שברצונך לאפס את כל הנתונים?')) {
      setFormData({
        ...initialFormData,
        baseSalary: getMinimumWage(), // עדכון לשכר המינימום הנוכחי
        monthYear: new Date().toISOString().slice(0, 7), // תאריך נוכחי
      });
    }
  };

  // חישובים
  const calculations = {
    // שכר יסוד
    baseSalary: formData.baseSalary,
    
    // הפרשות
    pensionAndSeverance: (formData.baseSalary * formData.pensionRate) / 100,
    nationalInsurance: (formData.baseSalary * formData.nationalInsuranceRate) / 100,
    healthInsurance: formData.healthInsurance,
    
    // ימי מנוחה וחגים
    saturdayPay: formData.saturdaysWorked * 426.35,
    holidayPay: formData.holidaysWorked * 426.35,
    replacementCost: formData.replacementDays * formData.replacementCostPerDay,
    
    // הוצאות מחיה
    foodAllowance: formData.foodAllowance,
    utilities: formData.utilities,
    gifts: formData.gifts,
    recuperationPay: formData.recuperationDays * formData.recuperationPayPerDay,
    
    // הוצאות נוספות
    phonePackage: formData.phonePackage,
    managementFee: formData.managementFee,
    transportCost: (formData.transportDaily * 22) + formData.transportMonthly,
    
    // ניכויים
    totalDeductions: formData.housingDeduction + formData.utilitiesDeduction + formData.healthInsuranceDeduction + formData.advancesDeduction,
  };

  // סה"כ עלות מעסיק
  calculations.totalEmployerCost = 
    calculations.baseSalary +
    calculations.pensionAndSeverance +
    calculations.nationalInsurance +
    calculations.healthInsurance +
    calculations.saturdayPay +
    calculations.holidayPay +
    calculations.replacementCost +
    calculations.foodAllowance +
    calculations.utilities +
    calculations.gifts +
    calculations.recuperationPay +
    calculations.phonePackage +
    calculations.managementFee +
    calculations.transportCost;

  // שכר לתשלום לעובד (לאחר ניכויים)
  calculations.netSalary = calculations.baseSalary + 
    calculations.foodAllowance + 
    calculations.recuperationPay +
    calculations.transportCost -
    calculations.totalDeductions;

  const componentInfo = {
    baseSalary: `שכר מינימום חודשי (ברוטו) - נכון ל-${new Date() >= new Date('2026-04-01') ? 'אפריל 2026 ואילך' : 'פברואר 2026'}: ${getMinimumWage().toFixed(2)} ₪`,
    pension: "הפרשה חובה של 12.5% (6.5% תגמולים + 6% פיצויים) לקרן פנסיה לעובד",
    nationalInsurance: "ביטוח לאומי מעסיק - 3.6% מהשכר. אסור לנכות מהעובד בענף הסיעוד!",
    healthInsurance: "ביטוח בריאות פרטי - תשלום מלא של המעסיק לחברת הביטוח (כ-280 ₪ לחודש)",
    saturdays: "תשלום עבור עבודה בשבתות - 426.35 ₪ ליום (בממוצע 4.3 שבתות בחודש)",
    holidays: "תשלום עבור עבודה בחגים - 426.35 ₪ ליום (9 ימי חג בשנה)",
    replacement: "עלות מחליף בימי חופשה/מחלה - 400 ₪ ליום (בממוצע 14 ימי חופשה שנתיים)",
    foodAllowance: "דמי כיס למזון - תשלום חודשי אם העובד קונה מזון לעצמו (אופציונלי)",
    utilities: "הוצאות חשמל, מים וגז - צריכה עודפת של אדם נוסף בבית (250-350 ₪)",
    gifts: "מתנות לחגים ויום הולדת - פעמיים בשנה (פסח וראש השנה) + יום הולדת",
    recuperation: "דמי הבראה - 418 ₪ ליום. זכאות ל-5 ימים לאחר שנת עבודה ראשונה, מצטבר עד 14 יום",
    phone: "סים עם חבילת גלישה ושיחות לחו\"ל - כ-50 ₪ (אופציונלי)",
    management: "דמי טיפול לתאגיד/חברת כוח אדם - תשלום חודשי קבוע (כ-70 ₪)",
    transport: "דמי נסיעה - עד 22.60 ₪ ליום חופשי או חופשי חודשי אזורי 139 ₪",
    housingDeduction: "ניכוי דיור - ניתן לנכות בין 315 ₪ ל-578 ₪ (תלוי באזור המגורים)",
    utilitiesDeduction: "ניכוי הוצאות נלוות - ניתן לנכות עד 94.34 ₪ (חשמל ומים)",
    healthInsuranceDeduction: "ניכוי ביטוח בריאות - ניתן לנכות עד 168.80 ₪ מהעובד",
    advancesDeduction: "ניכוי מפרעות - החזר מקדמות או הלוואות שניתנו לעובד במהלך החודש"
  };

  const Tooltip = ({ text, id }) => (
    <div className="relative inline-block">
      <InfoIcon 
        className="w-4 h-4 text-blue-500 cursor-help ml-1 inline"
        onMouseEnter={() => setShowTooltip(id)}
        onMouseLeave={() => setShowTooltip(null)}
      />
      {showTooltip === id && (
        <div className="absolute z-10 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg -top-2 left-6">
          {text}
          <div className="absolute w-3 h-3 bg-gray-800 transform rotate-45 -left-1.5 top-3"></div>
        </div>
      )}
    </div>
  );

  const InputField = ({ label, value, field, tooltipId, tooltipText, type = "number", step = "0.01", min = "0" }) => {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {tooltipText && <Tooltip text={tooltipText} id={tooltipId} />}
        </label>
        <input
          type={type}
          value={value}
          onChange={(e) => {
            const newValue = type === "number" ? (parseFloat(e.target.value) || 0) : e.target.value;
            setFormData(prev => ({ ...prev, [field]: newValue }));
          }}
          step={type === "number" ? step : undefined}
          min={type === "number" ? min : undefined}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    );
  };

  const generateReport = () => {
    setShowReport(true);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  if (showReport) {
    return (
      <div ref={printRef} className="max-w-4xl mx-auto p-8 bg-white" dir="rtl">
        <style>{`
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        `}</style>
        
        <div className="border-4 border-gray-800 p-6">
          <h1 className="text-3xl font-bold text-center mb-6">דוח שכר חודשי - עובד זר</h1>
          
          <div className="grid grid-cols-2 gap-4 mb-6 pb-4 border-b-2">
            <div>
              <p className="text-sm text-gray-600">שם העובד:</p>
              <p className="font-semibold text-lg">{formData.employeeName || '_________________'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">ת.ז. / דרכון:</p>
              <p className="font-semibold text-lg">{formData.employeeId || '_________________'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">חודש/שנה:</p>
              <p className="font-semibold text-lg">{formData.monthYear}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">תאריך הפקה:</p>
              <p className="font-semibold text-lg">{new Date().toLocaleDateString('he-IL')}</p>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-4 bg-gray-100 p-2">מרכיבי השכר</h2>
          
          <div className="space-y-2 mb-6">
            <div className="flex justify-between border-b py-2">
              <span className="font-medium">שכר יסוד (ברוטו)</span>
              <span className="font-semibold">{calculations.baseSalary.toFixed(2)} ₪</span>
            </div>
            
            <div className="mr-4 space-y-1">
              <div className="flex justify-between text-sm py-1">
                <span>פנסיה ופיצויים ({formData.pensionRate}%)</span>
                <span>{calculations.pensionAndSeverance.toFixed(2)} ₪</span>
              </div>
              <div className="flex justify-between text-sm py-1">
                <span>ביטוח לאומי מעסיק ({formData.nationalInsuranceRate}%)</span>
                <span>{calculations.nationalInsurance.toFixed(2)} ₪</span>
              </div>
              <div className="flex justify-between text-sm py-1">
                <span>ביטוח בריאות</span>
                <span>{calculations.healthInsurance.toFixed(2)} ₪</span>
              </div>
            </div>

            {calculations.saturdayPay > 0 && (
              <div className="flex justify-between border-b py-2">
                <span className="font-medium">עבודה בשבתות ({formData.saturdaysWorked} ימים)</span>
                <span className="font-semibold">{calculations.saturdayPay.toFixed(2)} ₪</span>
              </div>
            )}

            {calculations.holidayPay > 0 && (
              <div className="flex justify-between border-b py-2">
                <span className="font-medium">עבודה בחגים ({formData.holidaysWorked} ימים)</span>
                <span className="font-semibold">{calculations.holidayPay.toFixed(2)} ₪</span>
              </div>
            )}

            {calculations.replacementCost > 0 && (
              <div className="flex justify-between border-b py-2">
                <span className="font-medium">עלות מחליף ({formData.replacementDays} ימים)</span>
                <span className="font-semibold">{calculations.replacementCost.toFixed(2)} ₪</span>
              </div>
            )}

            {calculations.foodAllowance > 0 && (
              <div className="flex justify-between border-b py-2">
                <span className="font-medium">דמי כיס למזון</span>
                <span className="font-semibold">{calculations.foodAllowance.toFixed(2)} ₪</span>
              </div>
            )}

            <div className="flex justify-between border-b py-2">
              <span className="font-medium">חשמל, מים וגז</span>
              <span className="font-semibold">{calculations.utilities.toFixed(2)} ₪</span>
            </div>

            <div className="flex justify-between border-b py-2">
              <span className="font-medium">מתנות</span>
              <span className="font-semibold">{calculations.gifts.toFixed(2)} ₪</span>
            </div>

            {calculations.recuperationPay > 0 && (
              <div className="flex justify-between border-b py-2">
                <span className="font-medium">דמי הבראה ({formData.recuperationDays} ימים)</span>
                <span className="font-semibold">{calculations.recuperationPay.toFixed(2)} ₪</span>
              </div>
            )}

            {calculations.phonePackage > 0 && (
              <div className="flex justify-between border-b py-2">
                <span className="font-medium">חבילת סלולר</span>
                <span className="font-semibold">{calculations.phonePackage.toFixed(2)} ₪</span>
              </div>
            )}

            {calculations.managementFee > 0 && (
              <div className="flex justify-between border-b py-2">
                <span className="font-medium">דמי טיפול לתאגיד</span>
                <span className="font-semibold">{calculations.managementFee.toFixed(2)} ₪</span>
              </div>
            )}

            {calculations.transportCost > 0 && (
              <div className="flex justify-between border-b py-2">
                <span className="font-medium">דמי נסיעה</span>
                <span className="font-semibold">{calculations.transportCost.toFixed(2)} ₪</span>
              </div>
            )}
          </div>

          <div className="bg-blue-50 p-4 mb-6">
            <div className="flex justify-between text-xl font-bold">
              <span>סה"כ עלות מעסיק:</span>
              <span className="text-blue-700">{calculations.totalEmployerCost.toFixed(2)} ₪</span>
            </div>
          </div>

          {calculations.totalDeductions > 0 && (
            <>
              <h2 className="text-xl font-bold mb-4 bg-gray-100 p-2">ניכויים מהעובד</h2>
              
              <div className="space-y-2 mb-6">
                {formData.housingDeduction > 0 && (
                  <div className="flex justify-between border-b py-2">
                    <span>ניכוי דיור</span>
                    <span className="text-red-600">-{formData.housingDeduction.toFixed(2)} ₪</span>
                  </div>
                )}
                {formData.utilitiesDeduction > 0 && (
                  <div className="flex justify-between border-b py-2">
                    <span>ניכוי הוצאות נלוות</span>
                    <span className="text-red-600">-{formData.utilitiesDeduction.toFixed(2)} ₪</span>
                  </div>
                )}
                {formData.healthInsuranceDeduction > 0 && (
                  <div className="flex justify-between border-b py-2">
                    <span>ניכוי ביטוח בריאות</span>
                    <span className="text-red-600">-{formData.healthInsuranceDeduction.toFixed(2)} ₪</span>
                  </div>
                )}
                {formData.advancesDeduction > 0 && (
                  <div className="flex justify-between border-b py-2">
                    <span>ניכוי מפרעות</span>
                    <span className="text-red-600">-{formData.advancesDeduction.toFixed(2)} ₪</span>
                  </div>
                )}
                
                <div className="flex justify-between border-b-2 py-2 font-semibold">
                  <span>סה"כ ניכויים:</span>
                  <span className="text-red-600">-{calculations.totalDeductions.toFixed(2)} ₪</span>
                </div>
              </div>
            </>
          )}

          <div className="bg-green-50 p-4 mb-8 border-2 border-green-500">
            <div className="flex justify-between text-2xl font-bold">
              <span>שכר נטו לתשלום:</span>
              <span className="text-green-700">{calculations.netSalary.toFixed(2)} ₪</span>
            </div>
          </div>

          <div className="border-t-2 pt-6 mt-8">
            <p className="mb-6 text-center font-semibold">אני הח"מ מאשר/ת כי קיבלתי את מלוא השכר המפורט לעיל</p>
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="mb-2">תאריך: _______________</p>
                <p className="mb-2">שם העובד/ת: {formData.employeeName || '_______________'}</p>
                <div className="border-b-2 border-gray-400 pt-12 mt-4">
                  <p className="text-center text-sm text-gray-600">חתימת העובד/ת</p>
                </div>
              </div>
              
              <div>
                <p className="mb-2">תאריך: _______________</p>
                <p className="mb-2">שם המעסיק: _______________</p>
                <div className="border-b-2 border-gray-400 pt-12 mt-4">
                  <p className="text-center text-sm text-gray-600">חתימת המעסיק</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-xs text-gray-500 text-center">
            <p>דוח זה הופק באמצעות מחשבון שכר עובדים זרים</p>
            <p>נכון לתאריך: {new Date().toLocaleDateString('he-IL')}</p>
          </div>
        </div>

        <div className="no-print text-center mt-6">
          <button
            onClick={() => setShowReport(false)}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            חזרה למחשבון
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center justify-center flex-1">
                <Calculator className="w-12 h-12 ml-3" />
                <h1 className="text-4xl font-bold">מחשבון שכר עובד זר לסיעוד</h1>
              </div>
              <button
                onClick={resetForm}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition font-semibold shadow-lg"
              >
                🔄 איפוס טופס
              </button>
            </div>
            <p className="text-center text-blue-100 text-lg">חישוב מדויק של כל מרכיבי השכר והעלויות</p>
            <p className="text-center text-blue-200 text-sm mt-2">
              שכר מינימום נוכחי: {getMinimumWage().toFixed(2)} ₪ 
              {new Date() >= new Date('2026-04-01') ? ' (מעודכן לאפריל 2026)' : ' (יעודכן אוטומטית באפריל 2026)'}
            </p>
          </div>

          <div className="p-8">
            {/* פרטי עובד */}
            <div className="mb-8 pb-6 border-b-2">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
                <FileText className="w-6 h-6 ml-2" />
                פרטי עובד
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    שם העובד/ת
                  </label>
                  <input
                    type="text"
                    value={formData.employeeName}
                    onChange={(e) => setFormData(prev => ({ ...prev, employeeName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ת.ז. / מספר דרכון
                  </label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    חודש/שנה
                  </label>
                  <input
                    type="month"
                    value={formData.monthYear}
                    onChange={(e) => setFormData(prev => ({ ...prev, monthYear: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* עמודה ימנית */}
              <div>
                {/* שכר יסוד והפרשות */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
                    <DollarSign className="w-6 h-6 ml-2" />
                    שכר יסוד והפרשות
                  </h2>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <InputField
                      label="שכר יסוד (ברוטו)"
                      value={formData.baseSalary}
                      field="baseSalary"
                      tooltipId="baseSalary"
                      tooltipText={componentInfo.baseSalary}
                    />
                    <InputField
                      label="אחוז פנסיה ופיצויים (%)"
                      value={formData.pensionRate}
                      field="pensionRate"
                      tooltipId="pension"
                      tooltipText={componentInfo.pension}
                    />
                    <InputField
                      label="אחוז ביטוח לאומי מעסיק (%)"
                      value={formData.nationalInsuranceRate}
                      field="nationalInsuranceRate"
                      tooltipId="nationalInsurance"
                      tooltipText={componentInfo.nationalInsurance}
                    />
                    <InputField
                      label="ביטוח בריאות (₪)"
                      value={formData.healthInsurance}
                      field="healthInsurance"
                      tooltipId="healthInsurance"
                      tooltipText={componentInfo.healthInsurance}
                    />
                  </div>
                </div>

                {/* ימי מנוחה וחגים */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">ימי מנוחה וחגים</h2>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <InputField
                      label="כמה שבתות עבד העובד החודש?"
                      value={formData.saturdaysWorked}
                      field="saturdaysWorked"
                      tooltipId="saturdays"
                      tooltipText={componentInfo.saturdays}
                      step="0.1"
                    />
                    <InputField
                      label="כמה חגים עבד העובד החודש?"
                      value={formData.holidaysWorked}
                      field="holidaysWorked"
                      tooltipId="holidays"
                      tooltipText={componentInfo.holidays}
                    />
                    <InputField
                      label="כמה ימי חופשה נוצלו (עלות מחליף)?"
                      value={formData.replacementDays}
                      field="replacementDays"
                      tooltipId="replacement"
                      tooltipText={componentInfo.replacement}
                    />
                    <InputField
                      label="עלות מחליף ליום (₪)"
                      value={formData.replacementCostPerDay}
                      field="replacementCostPerDay"
                    />
                  </div>
                </div>

                {/* הוצאות מחיה */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">הוצאות מחיה ותפעול</h2>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <InputField
                      label="דמי כיס למזון (₪ - אופציונלי)"
                      value={formData.foodAllowance}
                      field="foodAllowance"
                      tooltipId="foodAllowance"
                      tooltipText={componentInfo.foodAllowance}
                    />
                    <InputField
                      label="חשמל, מים וגז (₪)"
                      value={formData.utilities}
                      field="utilities"
                      tooltipId="utilities"
                      tooltipText={componentInfo.utilities}
                    />
                    <InputField
                      label="מתנות (חישוב חודשי - ₪)"
                      value={formData.gifts}
                      field="gifts"
                      tooltipId="gifts"
                      tooltipText={componentInfo.gifts}
                    />
                    <InputField
                      label="כמה ימי הבראה נוצלו החודש?"
                      value={formData.recuperationDays}
                      field="recuperationDays"
                      tooltipId="recuperation"
                      tooltipText={componentInfo.recuperation}
                    />
                    <InputField
                      label="תשלום ליום הבראה (₪)"
                      value={formData.recuperationPayPerDay}
                      field="recuperationPayPerDay"
                    />
                  </div>
                </div>
              </div>

              {/* עמודה שמאלית */}
              <div>
                {/* תשלומים נוספים */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">תשלומים נוספים (אופציונלי)</h2>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <InputField
                      label="חבילת סלולר (₪)"
                      value={formData.phonePackage}
                      field="phonePackage"
                      tooltipId="phone"
                      tooltipText={componentInfo.phone}
                    />
                    <InputField
                      label="דמי טיפול לתאגיד (₪)"
                      value={formData.managementFee}
                      field="managementFee"
                      tooltipId="management"
                      tooltipText={componentInfo.management}
                    />
                    <InputField
                      label="דמי נסיעה יומי (₪)"
                      value={formData.transportDaily}
                      field="transportDaily"
                      tooltipId="transport"
                      tooltipText={componentInfo.transport}
                    />
                    <InputField
                      label="חופשי חודשי אזורי (₪)"
                      value={formData.transportMonthly}
                      field="transportMonthly"
                    />
                  </div>
                </div>

                {/* ניכויים מהעובד */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">ניכויים מהעובד</h2>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <InputField
                      label="ניכוי דיור (315-578 ₪)"
                      value={formData.housingDeduction}
                      field="housingDeduction"
                      tooltipId="housingDeduction"
                      tooltipText={componentInfo.housingDeduction}
                    />
                    <InputField
                      label="ניכוי הוצאות נלוות (עד 94.34 ₪)"
                      value={formData.utilitiesDeduction}
                      field="utilitiesDeduction"
                      tooltipId="utilitiesDeduction"
                      tooltipText={componentInfo.utilitiesDeduction}
                    />
                    <InputField
                      label="ניכוי ביטוח בריאות (עד 168.80 ₪)"
                      value={formData.healthInsuranceDeduction}
                      field="healthInsuranceDeduction"
                      tooltipId="healthInsuranceDeduction"
                      tooltipText={componentInfo.healthInsuranceDeduction}
                    />
                    <InputField
                      label="ניכוי מפרעות (₪)"
                      value={formData.advancesDeduction}
                      field="advancesDeduction"
                      tooltipId="advancesDeduction"
                      tooltipText={componentInfo.advancesDeduction}
                    />
                  </div>
                </div>

                {/* סיכום */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-6 rounded-xl text-white shadow-lg">
                  <h2 className="text-2xl font-bold mb-4">סיכום עלויות</h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-lg pb-2 border-b border-blue-400">
                      <span>שכר יסוד:</span>
                      <span className="font-semibold">{calculations.baseSalary.toFixed(2)} ₪</span>
                    </div>
                    
                    <div className="flex justify-between text-lg pb-2 border-b border-blue-400">
                      <span>הפרשות וביטוחים:</span>
                      <span className="font-semibold">
                        {(calculations.pensionAndSeverance + calculations.nationalInsurance + calculations.healthInsurance).toFixed(2)} ₪
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-lg pb-2 border-b border-blue-400">
                      <span>שבתות וחגים:</span>
                      <span className="font-semibold">
                        {(calculations.saturdayPay + calculations.holidayPay).toFixed(2)} ₪
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-lg pb-2 border-b border-blue-400">
                      <span>הוצאות מחיה:</span>
                      <span className="font-semibold">
                        {(calculations.foodAllowance + calculations.utilities + calculations.gifts + calculations.recuperationPay).toFixed(2)} ₪
                      </span>
                    </div>
                    
                    {calculations.replacementCost > 0 && (
                      <div className="flex justify-between text-lg pb-2 border-b border-blue-400">
                        <span>עלות מחליף:</span>
                        <span className="font-semibold">{calculations.replacementCost.toFixed(2)} ₪</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-2xl font-bold pt-3 border-t-2 border-white">
                      <span>סה"כ עלות מעסיק:</span>
                      <span>{calculations.totalEmployerCost.toFixed(2)} ₪</span>
                    </div>
                    
                    {calculations.totalDeductions > 0 && (
                      <>
                        <div className="flex justify-between text-lg pb-2 border-b border-blue-400 text-red-200">
                          <span>ניכויים:</span>
                          <span className="font-semibold">-{calculations.totalDeductions.toFixed(2)} ₪</span>
                        </div>
                        
                        <div className="flex justify-between text-2xl font-bold pt-3 bg-white text-green-600 p-3 rounded-lg">
                          <span>שכר נטו לתשלום:</span>
                          <span>{calculations.netSalary.toFixed(2)} ₪</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* כפתור הפקת דוח */}
                <button
                  onClick={generateReport}
                  className="w-full mt-6 bg-green-600 text-white py-4 px-6 rounded-xl hover:bg-green-700 transition transform hover:scale-105 shadow-lg flex items-center justify-center text-lg font-semibold"
                >
                  <Download className="w-6 h-6 ml-2" />
                  הפק דוח להדפסה וחתימה
                </button>
              </div>
            </div>

            {/* הערות חשובות */}
            <div className="mt-8 bg-amber-50 border-r-4 border-amber-500 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-3 text-amber-800">הערות חשובות:</h3>
              <ul className="space-y-2 text-sm text-amber-900">
                <li>• <strong>עדכון אוטומטי:</strong> שכר המינימום מתעדכן אוטומטית ל-6,443.85 ₪ באפריל 2026</li>
                <li>• <strong>איפוס טופס:</strong> לחץ על כפתור "איפוס טופס" כדי למחוק את כל הנתונים ולהתחיל מחדש</li>
                <li>• אם המטופל זכאי לגמלת סיעוד, חלק מהשכר משולם ע"י המוסד לביטוח לאומי</li>
                <li>• ניכויים מהעובד הם אופציונליים ותלויים בהסכם העבודה</li>
                <li>• המחשבון מתבסס על הנתונים המעודכנים ביותר ממשרד העבודה וכל זכות</li>
                <li>• יש להתייעץ עם רו"ח או יועץ מס לאישור החישוב הסופי</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}