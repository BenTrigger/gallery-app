import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'src/data/gallery.json');

export async function GET() {
  const data = await fs.readFile(DATA_PATH, 'utf-8');
  return NextResponse.json(JSON.parse(data));
}

export async function POST(req: NextRequest) {
  const { src, title, description, category, type, url } = await req.json();
  const data = await fs.readFile(DATA_PATH, 'utf-8');
  const images = JSON.parse(data);
  images.push({ src, title, description, category, type, url });
  await fs.writeFile(DATA_PATH, JSON.stringify(images, null, 2));
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { index } = await req.json();
  const data = await fs.readFile(DATA_PATH, 'utf-8');
  const images = JSON.parse(data);
  images.splice(index, 1);
  await fs.writeFile(DATA_PATH, JSON.stringify(images, null, 2));
  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  const { images } = await req.json();
  await fs.writeFile(DATA_PATH, JSON.stringify(images, null, 2));
  return NextResponse.json({ success: true });
} 