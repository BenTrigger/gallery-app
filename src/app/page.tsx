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

      {/* Video Art Collection Section */}
      <section className={styles.videoArtSection}>
        <div className={styles.videoArtContainer}>
          <h2 className={styles.videoArtTitle}>{t('video_art_collection') || 'VideoArt Collection'}</h2>
          <div className={styles.videoArtGrid}>
            {gridImages.filter(img => img.type === 'video').slice(0, 4).map((video, idx) => (
              <div key={idx} className={styles.videoArtItem}>
                <video src={video.url || video.src} className={styles.videoArtVideo} controls />
                <div className={styles.videoArtContent}>
                  <h3 className={styles.videoArtTitle}>{video.title}</h3>
                  <button className={styles.videoArtButton}>
                    {t('learn_more') || 'Learn More'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stories Section */}
      <section className={styles.storiesSection}>
        <div className={styles.storiesContainer}>
          <h2 className={styles.storiesTitle}>{t('stories') || 'STORIES'}</h2>
          <div className={styles.storiesGrid}>
            {[
              { title: 'Art Miami 2022 Art Basel Week', image: gridImages[0]?.src },
              { title: 'Orit Fuchs', image: gridImages[1]?.src },
              { title: 'Museum Exhibition Seoul, Korea', image: gridImages[2]?.src }
            ].map((story, idx) => (
              <div key={idx} className={styles.storyCard}>
                <img src={story.image || "/file.svg"} alt={story.title} className={styles.storyImage} />
                <div className={styles.storyContent}>
                  <h3 className={styles.storyTitle}>{story.title}</h3>
                  <button className={styles.storyButton}>
                    {t('learn_more') || 'Learn More'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className={styles.newsletterSection}>
        <div className={styles.newsletterContainer}>
          <h2 className={styles.newsletterTitle}>{t('join_mailing_list') || 'Join our mailing list'}</h2>
          <p className={styles.newsletterSubtitle}>
            {t('newsletter_subtitle') || 'No spam, unsubscribe anytime!'}
          </p>
          <div className={styles.newsletterForm}>
            <input 
              type="email" 
              placeholder={t('email_address') || 'Email address'} 
              className={styles.newsletterInput}
            />
            <button className={styles.newsletterButton}>
              {t('join') || 'Join'}
            </button>
          </div>
          <p className={styles.newsletterNote}>
            {t('newsletter_note') || '*You\'re signing up to receive our emails and can unsubscribe at any time.'}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>{t('exclusive_services') || 'EXCLUSIVE SERVICES'}</h3>
            <ul className={styles.footerList}>
              <li><a href="#">{t('search') || 'Search'}</a></li>
              <li><a href="#">{t('contact') || 'Contact'}</a></li>
            </ul>
          </div>
          
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>{t('need_help') || 'NEED HELP?'}</h3>
            <ul className={styles.footerList}>
              <li><a href="#">{t('contact_us') || 'Contact Us'}</a></li>
              <li><a href="#">{t('shipping_services') || 'Shipping Services'}</a></li>
            </ul>
          </div>
          
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>{t('the_company') || 'THE COMPANY'}</h3>
            <ul className={styles.footerList}>
              <li><a href="#">{t('about') || 'About'}</a></li>
              <li><a href="#">{t('privacy_cookies') || 'Privacy & Cookies'}</a></li>
              <li><a href="#">{t('accessibility_statement') || 'Accessibility Statement'}</a></li>
            </ul>
          </div>
          
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>{t('find_us_on') || 'FIND US ON'}</h3>
            <div className={styles.socialLinks}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                Facebook
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                Instagram
              </a>
            </div>
          </div>
          
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>{t('sign_up_updates') || 'SIGN UP FOR ORIT FUCHS UPDATES'}</h3>
            <p className={styles.footerDescription}>
              {t('footer_description') || 'By entering your email address below, you consent to receiving our newsletter with access to our latest collections, events and initiatives. More details on this are provided in our Privacy Policy'}
            </p>
            <div className={styles.footerNewsletter}>
              <input 
                type="email" 
                placeholder={t('join_mailing_list') || 'Join our mailing list'} 
                className={styles.footerInput}
              />
              <button className={styles.footerButton}>
                {t('join') || 'Join'}
              </button>
            </div>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © 2025 ORITFUCHS • yayu.co.il
          </p>
        </div>
      </footer>

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
