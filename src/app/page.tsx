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
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <h1 className={styles.heroTitle}>{t('title')}</h1>
        <p className={styles.heroSubtitle}>
          {t('hero_subtitle') || 'Discover our curated collection of stunning artworks and creative pieces'}
        </p>
      </section>

      {/* Featured Text Section */}
      <section className={styles.featuredText}>
        <h2>{t('featured_title') || 'A great place to share about a sale!'}</h2>
        <p>
          {t('featured_description') || 'Excited to Launch My New Website - Explore our latest collection featuring unique pieces that tell compelling stories through art.'}
        </p>
      </section>

      {/* Swiper Section */}
      {swiperImages.length > 0 && (
        <section className={styles.swiperSection}>
          <div className={styles.swiperContainer}>
            <Swiper
              spaceBetween={30}
              slidesPerView={1}
              loop={true}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
            >
              {swiperImages.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <div className={styles.swiperSlide} onClick={() => openModal('swiper', idx)}>
                    {img.type === "video" ? (
                      <video src={img.url || img.src} className={styles.swiperImage} controls />
                    ) : (
                      <img src={getImageSrc(img)} alt={img.title} className={styles.swiperImage} />
                    )}
                    <div className={styles.swiperContent}>
                      <h3 className={styles.swiperTitle}>{img.title}</h3>
                      {img.description && (
                        <p className={styles.swiperDescription}>{img.description}</p>
                      )}
                      <button className={styles.swiperButton}>
                        {t('learn_more') || 'Learn More'}
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className={styles.categoriesSection}>
        <div className={styles.categoriesContainer}>
          <h2 className={styles.categoriesTitle}>{t('categories_title') || 'Featured Series'}</h2>
          <div className={styles.categoriesGrid}>
            {['Vivid Series', 'SGIATH Series', 'Short Stories'].map((cat, idx) => (
              <div key={cat} className={styles.categoryCard}>
                <img 
                  src={gridImages[idx]?.src || "/file.svg"} 
                  alt={cat} 
                  className={styles.categoryImage}
                />
                <div className={styles.categoryContent}>
                  <h3 className={styles.categoryTitle}>{cat}</h3>
                  <p className={styles.categoryDescription}>
                    {t(`category_${cat.toLowerCase().replace(' ', '_')}_description`) || 
                     'Explore our unique collection featuring stunning artworks and creative pieces.'}
                  </p>
                  <button className={styles.categoryButton}>
                    {t('learn_more') || 'Learn More'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid Section */}
      <section className={styles.gallerySection}>
        <div className={styles.galleryContainer}>
          <h2 className={styles.galleryTitle}>{t('gallery_title') || 'Gallery Collection'}</h2>
          
          {/* Category Filters */}
          <div className={styles.categoryFilters}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`${styles.categoryFilter} ${category === cat ? styles.active : ''}`}
              >
                {cat === 'all' ? t('all') || 'All' : cat}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
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
                    src={getImageSrc(img)}
                    alt={img.title}
                    className={styles.galleryImage}
                    onError={e => (e.currentTarget.src = "/file.svg")}
                  />
                )}
                <div className={styles.galleryContent}>
                  <h3 className={styles.galleryTitle}>{img.title}</h3>
                  {img.category && (
                    <div className={styles.galleryCategory}>{img.category}</div>
                  )}
                  <div className={styles.galleryActions}>
                    <button 
                      onClick={e => { e.stopPropagation(); addToCart(img); }} 
                      className={styles.addToCartButton}
                    >
                      {t('add_to_cart')}
                    </button>
                    <button className={styles.viewButton}>
                      {t('view') || 'View'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {modal && (
        <div className={styles.modal} onClick={closeModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={closeModal}>×</button>
            {modal.type === 'swiper' ? (
              <Swiper
                initialSlide={modal.index}
                spaceBetween={30}
                slidesPerView={1}
                loop={true}
              >
                {swiperImages.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    {img.type === "video" ? (
                      <video src={img.url || img.src} className={styles.modalImage} controls autoPlay />
                    ) : (
                      <img src={getImageSrc(img)} alt={img.title} className={styles.modalImage} />
                    )}
                    <div className={styles.modalInfo}>
                      <h3 className={styles.modalTitle}>{img.title}</h3>
                      {img.description && (
                        <p className={styles.modalDescription}>{img.description}</p>
                      )}
                      {img.category && (
                        <div className={styles.galleryCategory}>{img.category}</div>
                      )}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div>
                <img 
                  src={getImageSrc(filteredGridImages[modal.index])} 
                  alt={filteredGridImages[modal.index].title} 
                  className={styles.modalImage} 
                />
                <div className={styles.modalInfo}>
                  <h3 className={styles.modalTitle}>{filteredGridImages[modal.index].title}</h3>
                  {filteredGridImages[modal.index].description && (
                    <p className={styles.modalDescription}>{filteredGridImages[modal.index].description}</p>
                  )}
                  {filteredGridImages[modal.index].category && (
                    <div className={styles.galleryCategory}>{filteredGridImages[modal.index].category}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
