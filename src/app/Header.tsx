"use client";
import styles from "./header.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaShoppingCart, FaClipboardList } from 'react-icons/fa';
import i18n from '../../i18n';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: "en", label: "English" },
  { code: "he", label: "עברית" },
  { code: "ru", label: "Русский" },
  { code: "fr", label: "Français" },
  { code: "it", label: "Italiano" },
  { code: "es", label: "Español" },
];

export default function Header() {
  const [lang, setLang] = useState("en");
  const { t } = useTranslation('common');
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.length);
      window.addEventListener('storage', () => {
        const updatedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartCount(updatedCart.length);
      });
    }
  }, []);

  const navLinks = [
    { label: t('home'), href: "/" },
    { label: t('about'), href: "/about" },
    { label: t('painting'), href: "/painting" },
    { label: t('sculptures'), href: "/sculptures" },
    { label: t('video_art'), href: "/video-art" },
    { label: t('originals'), href: "/originals" },
    { label: t('press'), href: "/press" },
    { label: t('blog'), href: "/blog" },
    { label: t('contact'), href: "/contact" },
    { label: t('admin_nav'), href: "/admin" },
  ];
  // TODO: integrate with i18n
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>{t('title')}</Link>
      <nav className={styles.nav}>
        {navLinks.map(link => (
          <Link key={link.href} href={link.href} className={styles.navLink}>{link.label}</Link>
        ))}
        <a href="https://facebook.com" target="_blank" rel="noopener" className={styles.navLink} title="Facebook"><FaFacebookF /></a>
        <a href="https://www.instagram.com/morinlerer/" target="_blank" rel="noopener" className={styles.navLink} title="Instagram"><FaInstagram /></a>
        <a href="https://wa.me/972529270851" target="_blank" rel="noopener" className={styles.navLink} title="WhatsApp"><FaWhatsapp /></a>
        <Link href="/cart" className={styles.navLink} title="Cart">
          <FaShoppingCart />
          <span style={{ fontWeight: 700, marginLeft: 4 }}>({cartCount})</span>
        </Link>
        <Link href="/orders" className={styles.navLink} title="Orders"><FaClipboardList /></Link>
        <select
          className={styles.langSelect}
          value={i18n.language}
          onChange={e => i18n.changeLanguage(e.target.value)}
        >
          {languages.map(l => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </select>
      </nav>
    </header>
  );
} 