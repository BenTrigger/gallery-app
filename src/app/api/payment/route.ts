import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // כאן תוכל להרחיב: חיבור ל-Stripe, Bit, או כל מערכת סליקה אחרת
  // כרגע מחזיר תשובה דמה
  return NextResponse.json({ success: true, provider: 'bit', status: 'pending' });
} 