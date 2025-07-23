"use client";
import styles from "./page.module.css";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import SwiperAdmin from './swiper';
import GridAdmin from './grid';
import { useTranslation } from 'react-i18next';

type GalleryItem = {
  src: string;
  title: string;
  description?: string;
  category?: string;
  type?: string;
  url?: string;
};

export default function AdminPage() {
  const [section, setSection] = useState<'swiper' | 'grid'>('swiper');
  const [files, setFiles] = useState<GalleryItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const { data: session } = useSession();
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const categories = ["logo", "art", "nature", "video", "other"];
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({ title: '', description: '', category: '' });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const { t } = useTranslation('common');

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => setFiles(data));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      // שמירה פיזית (לוקאלית בלבד):
      const formData = new FormData();
      formData.append("file", selectedFile);
      await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      // עדכון רשימת התמונות בגלריה
      await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ src: `/uploads/${selectedFile.name}`, title: selectedFile.name }),
      });
      setUploadStatus("Upload successful!");
      setSelectedFile(null);
      // רענון התמונות
      fetch("/api/gallery")
        .then((res) => res.json())
        .then((data) => setFiles(data));
    }
  };

  const handleDelete = async (idx: number) => {
    // שלח בקשת מחיקה (נממש ב-API)
    await fetch("/api/gallery", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index: idx }),
    });
    // רענון התמונות
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => setFiles(data));
  };

  const handlePayment = async () => {
    const res = await fetch("/api/payment", { method: "POST" });
    const data = await res.json();
    if (data.success) {
      setPaymentStatus(`Payment started with ${data.provider} (status: ${data.status})`);
    } else {
      setPaymentStatus("Payment failed.");
    }
  };

  // Drag & Drop (סידור)
  const handleDragStart = (idx: number) => setDragIndex(idx);
  const handleDrop = (idx: number) => {
    if (dragIndex === null || dragIndex === idx) return;
    const newFiles = [...files];
    const [removed] = newFiles.splice(dragIndex, 1);
    newFiles.splice(idx, 0, removed);
    setFiles(newFiles);
    setDragIndex(null);
    // שלח סדר חדש לשרת (נממש ב-API)
    fetch("/api/gallery", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images: newFiles }),
    });
  };

  const handleEdit = (idx: number) => {
    setEditIndex(idx);
    setEditData(files[idx]);
  };
  const handleEditChange = (e: any) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };
  const handleEditSave = async () => {
    const newFiles = [...files];
    newFiles[editIndex!] = editData;
    setFiles(newFiles);
    setEditIndex(null);
    setEditData({ title: '', description: '', category: '' });
    await fetch("/api/gallery", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images: newFiles }),
    });
  };
  const handleEditCancel = () => {
    setEditIndex(null);
    setEditData({ title: '', description: '', category: '' });
  };

  const filteredFiles = files.filter(f =>
    (!search || f.title.toLowerCase().includes(search.toLowerCase()) || (f.description && f.description.toLowerCase().includes(search.toLowerCase()))) &&
    (!filter || f.category === filter)
  );

  if (!session) {
    return (
      <div style={{ textAlign: 'center', marginTop: 80 }}>
        <h2>Admin Login</h2>
        <button onClick={() => signIn('google')}>Sign in with Google</button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
        <span style={{ marginRight: 16 }}>Signed in as {session.user?.email}</span>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
      <div style={{ display: 'flex', gap: 24 }}>
        <nav style={{ minWidth: 180 }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: 16 }}>
              <button onClick={() => setSection('swiper')} style={{ width: '100%', background: section === 'swiper' ? '#b85c38' : 'transparent', color: '#222', border: 'none', padding: 12, borderRadius: 8, cursor: 'pointer' }}>{t('carousel')}</button>
            </li>
            <li style={{ marginBottom: 16 }}>
              <button onClick={() => setSection('grid')} style={{ width: '100%', background: section === 'grid' ? '#b85c38' : 'transparent', color: '#222', border: 'none', padding: 12, borderRadius: 8, cursor: 'pointer' }}>{t('grid')}</button>
            </li>
          </ul>
        </nav>
        <div style={{ flex: 1 }}>
          {section === 'swiper' ? <SwiperAdmin /> : <GridAdmin />}
        </div>
      </div>
    </div>
  );
} 