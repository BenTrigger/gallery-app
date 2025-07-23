"use client";
import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';

export default function GridAdmin() {
  const [images, setImages] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({ title: '', description: '', category: '' });
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const { t } = useTranslation('common');

  useEffect(() => {
    fetch("/api/gallery-grid").then(res => res.json()).then(setImages);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      await fetch("/api/upload", { method: "POST", body: formData });
      await fetch("/api/gallery-grid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ src: `/uploads/${selectedFile.name}`, title: editData.title || selectedFile.name, description: editData.description || '', category: editData.category || 'art', type: 'image' })
      });
      setSelectedFile(null);
      setEditData({ title: '', description: '', category: '' });
      fetch("/api/gallery-grid").then(res => res.json()).then(setImages);
    }
  };

  const handleDelete = async (idx: number) => {
    await fetch("/api/gallery-grid", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index: idx })
    });
    fetch("/api/gallery-grid").then(res => res.json()).then(setImages);
  };

  const handleDragStart = (idx: number) => setDragIndex(idx);
  const handleDrop = (idx: number) => {
    if (dragIndex === null || dragIndex === idx) return;
    const newImages = [...images];
    const [removed] = newImages.splice(dragIndex, 1);
    newImages.splice(idx, 0, removed);
    setImages(newImages);
    setDragIndex(null);
    fetch("/api/gallery-grid", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images: newImages })
    });
  };

  const handleEdit = (idx: number) => {
    setEditIndex(idx);
    setEditData(images[idx]);
  };
  const handleEditChange = (e: any) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };
  const handleEditSave = async () => {
    const newImages = [...images];
    newImages[editIndex!] = editData;
    setImages(newImages);
    setEditIndex(null);
    setEditData({ title: '', description: '', category: '' });
    await fetch("/api/gallery-grid", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images: newImages })
    });
  };
  const handleEditCancel = () => {
    setEditIndex(null);
    setEditData({ title: '', description: '', category: '' });
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
      <h2>{t('grid')}</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {images.map((img, idx) => (
          <li key={idx} draggable onDragStart={() => handleDragStart(idx)} onDragOver={e => e.preventDefault()} onDrop={() => handleDrop(idx)} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#f7f7f7', borderRadius: 8, marginBottom: 8, padding: 8 }}>
            {editIndex === idx ? (
              <>
                <input name="title" value={editData.title ?? ''} onChange={handleEditChange} placeholder={t('title')} />
                <input name="description" value={editData.description ?? ''} onChange={handleEditChange} placeholder={t('description') || 'Description'} />
                <input name="category" value={editData.category ?? ''} onChange={handleEditChange} placeholder={t('category')} />
                <button onClick={handleEditSave}>{t('save')}</button>
                <button onClick={handleEditCancel}>{t('cancel')}</button>
              </>
            ) : (
              <>
                <img src={img.src} alt={img.title} style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                <span style={{ flex: 1 }}>{img.title}</span>
                <button onClick={() => handleEdit(idx)} style={{ color: 'blue' }}>{t('edit')}</button>
                <button onClick={() => handleDelete(idx)} style={{ color: 'red' }}>{t('delete')}</button>
              </>
            )}
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 24 }}>
        <h3>{t('add_image')}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ background: '#eee', borderRadius: 6, padding: '6px 18px', cursor: 'pointer', border: '1px solid #ccc', fontWeight: 500 }}>
            {t('choose_file')}
            <input type="file" accept="image/*,video/*" onChange={handleFileChange} style={{ display: 'none' }} />
          </label>
          <span>{selectedFile ? selectedFile.name : ''}</span>
        </div>
        <input type="text" placeholder={t('title')} value={editData.title ?? ''} onChange={e => setEditData({ ...editData, title: e.target.value })} />
        <input type="text" placeholder={t('description') || 'Description'} value={editData.description ?? ''} onChange={e => setEditData({ ...editData, description: e.target.value })} />
        <input type="text" placeholder={t('category')} value={editData.category ?? ''} onChange={e => setEditData({ ...editData, category: e.target.value })} />
        <button onClick={handleUpload}>{t('upload_btn')}</button>
      </div>
    </div>
  );
} 