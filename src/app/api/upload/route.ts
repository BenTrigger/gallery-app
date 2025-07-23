import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getStorageConfig } from '@/config/s3';

const UPLOADS_PATH = path.join(process.cwd(), 'public/uploads');
const SWIPER_PATH = path.join(process.cwd(), 'src/data/gallery-swiper.json');
const GRID_PATH = path.join(process.cwd(), 'src/data/gallery-grid.json');

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file');
  let fileName = '';
  const storage = getStorageConfig();
  if (file && typeof file === 'object' && 'name' in file) {
    fileName = file.name as string;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    if (storage.type === 'local') {
      await fs.mkdir(UPLOADS_PATH, { recursive: true });
      await fs.writeFile(path.join(UPLOADS_PATH, fileName), buffer);
    } else if (storage.type === 's3') {
      // TODO: העלאה ל-S3 תתווסף כאן בעתיד
      // דוגמה: await s3.upload({ Bucket: storage.bucket, Key: fileName, Body: buffer }).promise();
    }
    // הוספה אוטומטית ל-gallery-swiper.json
    try {
      const swiperData = JSON.parse(await fs.readFile(SWIPER_PATH, 'utf-8'));
      swiperData.push({ src: `/uploads/${fileName}`, title: fileName, description: '', category: 'main', type: 'image' });
      await fs.writeFile(SWIPER_PATH, JSON.stringify(swiperData, null, 2));
    } catch (e) {}
    // הוספה אוטומטית ל-gallery-grid.json
    try {
      const gridData = JSON.parse(await fs.readFile(GRID_PATH, 'utf-8'));
      gridData.push({ src: `/uploads/${fileName}`, title: fileName, description: '', category: 'art', type: 'image' });
      await fs.writeFile(GRID_PATH, JSON.stringify(gridData, null, 2));
    } catch (e) {}
    // בדיקת קוד: ודא שהתמונה נוספה לשני הקבצים
    const swiperData = JSON.parse(await fs.readFile(SWIPER_PATH, 'utf-8'));
    const gridData = JSON.parse(await fs.readFile(GRID_PATH, 'utf-8'));
    const inSwiper = swiperData.some((img: any) => img.src === `/uploads/${fileName}`);
    const inGrid = gridData.some((img: any) => img.src === `/uploads/${fileName}`);
    if (!inSwiper || !inGrid) {
      return NextResponse.json({ success: false, error: 'Image not added to galleries' }, { status: 500 });
    }
  }
  return NextResponse.json({ success: true, name: fileName });
} 