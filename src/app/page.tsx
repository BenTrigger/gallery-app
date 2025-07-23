"use client";
import styles from "./gallery.module.css";
import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

type GalleryItem = {
  src: string;
  title: string;
  description?: string;
  category?: string;
  type?: string;
  url?: string;
};

export default function GalleryPage() {
  const [swiperImages, setSwiperImages] = useState<GalleryItem[]>([]);
  const [gridImages, setGridImages] = useState<GalleryItem[]>([]);
  const [modal, setModal] = useState<null | { type: 'swiper' | 'grid', index: number }>(null);
  const [category, setCategory] = useState<string>('all');
  const { t } = useTranslation('common');

  useEffect(() => {
    fetch("/api/gallery-swiper")
      .then((res) => res.json())
      .then((data) => setSwiperImages(data));
    fetch("/api/gallery-grid")
      .then((res) => res.json())
      .then((data) => setGridImages(data));
  }, []);

  // קטגוריות ל-grid בלבד
  const categories = ['all', ...Array.from(new Set(gridImages.map(img => img.category ?? 'other')))]
  const filteredGridImages = category === 'all' ? gridImages : gridImages.filter(img => (img.category ?? 'other') === category);

  function getImageSrc(img: GalleryItem) {
    if (img.src.startsWith("/uploads/")) return img.src;
    if (img.url && img.url.startsWith("/uploads/")) return img.url;
    return img.src;
  }

  function addToCart(item: GalleryItem) {
    if (typeof window !== 'undefined') {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const idx = cart.findIndex((p: any) => p.src === item.src);
      if (idx > -1) {
        cart[idx].quantity = (cart[idx].quantity || 1) + 1;
      } else {
        cart.push({ ...item, quantity: 1, price: 100 }); // דוגמה למחיר
      }
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }

  // modal logic
  const openModal = (type: 'swiper' | 'grid', index: number) => setModal({ type, index });
  const closeModal = () => setModal(null);

  return (
    <div className={styles.galleryContainer}>
      <h1 style={{ textAlign: "center", marginBottom: 32 }}>{t('title')}</h1>
      {/* Swiper ראשי */}
      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        style={{ maxWidth: 700, margin: '0 auto 32px' }}
      >
        {swiperImages.map((img, idx) => (
          <SwiperSlide key={idx}>
            <div onClick={() => openModal('swiper', idx)} style={{ cursor: 'pointer' }}>
              {img.type === "video" ? (
                <video src={img.url || img.src} className={styles.galleryImage} controls />
              ) : (
                <img src={img.src} alt={img.title} className={styles.galleryImage} />
              )}
              <div className={styles.galleryTitle}>{img.title}</div>
              {img.category && <div style={{ fontSize: 12, color: '#888', padding: '0 16px 8px' }}>{img.category}</div>}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Grid */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              padding: '8px 22px',
              borderRadius: 20,
              border: 'none',
              background: category === cat ? '#222' : '#eee',
              color: category === cat ? '#fff' : '#222',
              fontWeight: 500,
              fontSize: 16,
              cursor: 'pointer',
              marginBottom: 8,
              transition: 'background 0.2s, color 0.2s',
            }}
          >
            {cat === 'all' ? t('all') || 'All' : cat}
          </button>
        ))}
      </div>
      <div className={styles.galleryGrid}>
        {filteredGridImages.map((img, idx) => (
          <div
            className={styles.galleryItem}
            key={idx}
            onClick={() => openModal('grid', idx)}
          >
            {img.type === "video" ? (
              <video src={img.url || img.src} className={styles.galleryImage} controls />
            ) : (
              <img
                src={img.src}
                alt={img.title}
                className={styles.galleryImage}
                onError={e => (e.currentTarget.src = "/file.svg")}
              />
            )}
            <div className={styles.galleryTitle}>{img.title}</div>
            {img.category && <div style={{ fontSize: 12, color: '#888', padding: '0 16px 8px' }}>{img.category}</div>}
            <button onClick={e => { e.stopPropagation(); addToCart(img); }} style={{ margin: '8px 16px', padding: '6px 18px', borderRadius: 8, background: '#b85c38', color: '#fff', border: 'none', fontWeight: 500, cursor: 'pointer' }}>{t('add_to_cart')}</button>
          </div>
        ))}
      </div>
      {/* מודל */}
      {modal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={closeModal}
        >
          <div
            style={{ background: "#fff", borderRadius: 12, padding: 24, maxWidth: 900, maxHeight: "90vh", overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            {modal.type === 'swiper' ? (
              <Swiper
                initialSlide={modal.index}
                spaceBetween={30}
                slidesPerView={1}
                style={{ maxWidth: 600, margin: '0 auto 32px' }}
              >
                {swiperImages.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    {img.type === "video" ? (
                      <video src={img.url || img.src} style={{ maxWidth: "100%", maxHeight: 400, display: "block", margin: "0 auto" }} controls autoPlay />
                    ) : (
                      <img src={img.src} alt={img.title} style={{ maxWidth: "100%", maxHeight: 400, display: "block", margin: "0 auto" }} />
                    )}
                    <div style={{ textAlign: "center", marginTop: 16, fontWeight: 500 }}>{img.title}</div>
                    {img.description && <div style={{ textAlign: "center", marginTop: 8, color: '#555' }}>{img.description}</div>}
                    {img.category && <div style={{ textAlign: "center", marginTop: 4, color: '#888', fontSize: 13 }}>{img.category}</div>}
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: 16,
                marginTop: 24,
                marginBottom: 16
              }}>
                {filteredGridImages.map((img, idx) => (
                  <div key={idx} style={{ cursor: 'pointer', border: idx === modal.index ? '2px solid #b85c38' : '2px solid transparent', borderRadius: 8, padding: 4, background: '#fafafa' }}
                    onClick={() => { setModal({ type: 'grid', index: idx }); }}
                  >
                    {img.type === "video" ? (
                      <video src={img.url || img.src} style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 6 }} />
                    ) : (
                      <img src={img.src} alt={img.title} style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 6 }} />
                    )}
                  </div>
                ))}
              </div>
            )}
            <button style={{ margin: "24px auto 0", display: "block" }} onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
