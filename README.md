# מחשבון שכר עובד זר לסיעוד

## 🔄 הוראות עדכון שכר מינימום

### מתי צריך לעדכן?

כאשר משרד העבודה מפרסם שכר מינימום חדש (בדרך כלל מתעדכן פעם או פעמיים בשנה).

### איפה לבדוק את השכר המינימום העדכני?

1. **אתר כל זכות:** https://www.kolzchut.org.il/he/minimum_wage_in_israel
2. **אתר משרד העבודה:** https://www.gov.il/he/departments/guides/minimum-wage

### איך לעדכן את הקוד?

פתח את הקובץ `salary-calculator.jsx` ומצא את הפונקציה `getMinimumWage()` (בשורות 4-20 בערך).

#### דוגמה לעדכון:

נניח ששכר המינימום עולה ל-6,650 ₪ בינואר 2027:

```javascript
const getMinimumWage = () => {
  const today = new Date();
  
  // הוסף את השורות האלה:
  const january2027 = new Date('2027-01-01');
  if (today >= january2027) {
    return 6650.00; // השכר החדש
  }
  
  const april2026 = new Date('2026-04-01');
  if (today >= april2026) {
    return 6443.85;
  }
  
  return 6247.67;
};
```

### ⚠️ חשוב!

- **תאריך:** הכנס את התאריך המדויק שבו השכר החדש נכנס לתוקף
- **סכום:** הכנס את הסכום המדויק כפי שמפורסם באתר משרד העבודה
- **סדר:** תמיד הוסף את התאריך החדש **לפני** התאריכים הישנים (מלמעלה למטה)

---

## 🔄 עדכון מרכיבים נוספים

### ניכויים מותרים

אם משתנים הסכומים המקסימליים לניכויים (דיור, הוצאות נלוות, ביטוח בריאות), עדכן ב:

1. **הערות בשדות הקלט** - חפש את השורות:
   ```javascript
   label="ניכוי דיור (315-578 ₪)"
   label="ניכוי הוצאות נלוות (עד 94.34 ₪)"
   label="ניכוי ביטוח בריאות (עד 168.80 ₪)"
   ```

2. **הסברי Tooltip** - עדכן ב-`componentInfo`:
   ```javascript
   housingDeduction: "ניכוי דיור - ניתן לנכות בין X ₪ ל-Y ₪"
   ```

### תשלום עבודה בשבת/חג

אם משתנה התעריף (כרגע 426.35 ₪), חפש את השורות:
```javascript
saturdayPay: formData.saturdaysWorked * 426.35,
holidayPay: formData.holidaysWorked * 426.35,
```

ושנה את המספר.

### דמי הבראה

אם משתנה הסכום ליום (כרגע 418 ₪), עדכן ב-`initialFormData`:
```javascript
recuperationPayPerDay: 418,
```

---

## 📊 מקורות מידע מעודכנים

- **שכר מינימום:** https://www.kolzchut.org.il/he/minimum_wage_in_israel
- **ניכויים מותרים:** https://www.kolzchut.org.il/he/permitted_deductions_from_salary_of_foreign_caregiver
- **זכויות עובדים זרים:** https://www.kolzchut.org.il/he/rights_of_foreign_workers_in_nursing
- **משרד העבודה:** https://www.gov.il/he/departments/ministry_of_labor_social_affairs_and_social_services

---

## 💡 טיפים

1. **בדוק עדכונים:** התרגל לבדוק באתר כל זכות פעם בחודש
2. **תעד שינויים:** כשאתה מעדכן, רשום בהערה בקוד את התאריך והמקור
3. **בדוק חישובים:** אחרי כל עדכון, הרץ מספר חישובים לוודא שהכל עובד
4. **גיבוי:** שמור עותק של הקוד לפני כל שינוי

---

## 🆘 צריך עזרה?

אם אתה לא בטוח איך לעדכן משהו, שמור את הקוד הישן ופנה לעזרה טכנית.
