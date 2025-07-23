This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

הבאג הזה נגרם בגלל חוסר תאימות בין React 19 לבין Next.js 15 (או חבילות צד שלישי כמו react-i18next, Swiper וכו').  
**Next.js 15 לא תומך רשמית ב-React 19!**  
זו בעיה ידועה בקהילת Next.js.

### הפתרון הבטוח:
**להוריד את גרסת React ו-ReactDOM ל־18.2.0**

---

## בצע את השלבים הבאים בטרמינל שלך:

1. **הסר את React 19 והתקן React 18:**
   ```powershell
   npm install react@18.2.0 react-dom@18.2.0
   ```

2. **נקה קאש והתקן מחדש:**
   ```powershell
   rd /s /q node_modules
   rd /s /q .next
   del package-lock.json
   npm install
   ```

3. **הפעל את השרת:**
   ```powershell
   npm run dev
   ```

---

### למה זה פותר את הבעיה?
- Next.js 15 והחבילות שלך (כולל next-i18next, react-i18next, Swiper) נבדקו ועובדות עם React 18.
- React 19 עדיין לא נתמך רשמית ע"י Next.js, ולכן קוד שמנסה להשתמש ב־createContext או ב־context API אחר פשוט נופל.

---

**לאחר ביצוע השלבים, האתר אמור לעבוד ללא שגיאת createContext.**
אם תיתקל בשגיאה נוספת, שלח לי את ההודעה המדויקת ואעזור!
