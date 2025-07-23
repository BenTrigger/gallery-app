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
  const [section, setSection] = useState<'dashboard' | 'swiper' | 'grid' | 'categories' | 'stories' | 'video' | 'newsletter' | 'settings'>('dashboard');
  const [files, setFiles] = useState<GalleryItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const { data: session } = useSession();
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const categories = ["Vivid Series", "SGIATH Series", "Short Stories", "Video Art", "Stories", "Other"];
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
      const formData = new FormData();
      formData.append("file", selectedFile);
      await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ src: `/uploads/${selectedFile.name}`, title: selectedFile.name }),
      });
      setUploadStatus("Upload successful!");
      setSelectedFile(null);
      fetch("/api/gallery")
        .then((res) => res.json())
        .then((data) => setFiles(data));
    }
  };

  const handleDelete = async (idx: number) => {
    await fetch("/api/gallery", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index: idx }),
    });
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

  const handleDragStart = (idx: number) => setDragIndex(idx);
  const handleDrop = (idx: number) => {
    if (dragIndex === null || dragIndex === idx) return;
    const newFiles = [...files];
    const [removed] = newFiles.splice(dragIndex, 1);
    newFiles.splice(idx, 0, removed);
    setFiles(newFiles);
    setDragIndex(null);
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

  const stats = {
    total: files.length,
    swiper: files.filter(f => f.category === 'swiper').length,
    grid: files.filter(f => f.category === 'grid').length,
    video: files.filter(f => f.type === 'video').length,
    categories: categories.length
  };

  if (!session) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <h2 className={styles.loginTitle}>Admin Login</h2>
          <p className={styles.loginSubtitle}>Sign in to manage your gallery</p>
          <button className={styles.loginButton} onClick={() => signIn('google')}>
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      {/* Header */}
      <div className={styles.adminHeader}>
        <div className={styles.adminHeaderContent}>
          <h1 className={styles.adminTitle}>Gallery Admin Panel</h1>
          <div className={styles.adminUser}>
            <span className={styles.userEmail}>Signed in as {session.user?.email}</span>
            <button className={styles.signOutButton} onClick={() => signOut()}>
              Sign out
            </button>
          </div>
        </div>
      </div>

      <div className={styles.adminContent}>
        {/* Sidebar Navigation */}
        <nav className={styles.adminSidebar}>
          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>Dashboard</h3>
            <ul className={styles.sidebarList}>
              <li>
                <button 
                  onClick={() => setSection('dashboard')} 
                  className={`${styles.sidebarButton} ${section === 'dashboard' ? styles.active : ''}`}
                >
                  📊 Dashboard
                </button>
              </li>
            </ul>
          </div>

          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>Content Management</h3>
            <ul className={styles.sidebarList}>
              <li>
                <button 
                  onClick={() => setSection('swiper')} 
                  className={`${styles.sidebarButton} ${section === 'swiper' ? styles.active : ''}`}
                >
                  🎠 Swiper Gallery
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setSection('grid')} 
                  className={`${styles.sidebarButton} ${section === 'grid' ? styles.active : ''}`}
                >
                  🖼️ Grid Gallery
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setSection('categories')} 
                  className={`${styles.sidebarButton} ${section === 'categories' ? styles.active : ''}`}
                >
                  📂 Categories
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setSection('stories')} 
                  className={`${styles.sidebarButton} ${section === 'stories' ? styles.active : ''}`}
                >
                  📖 Stories
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setSection('video')} 
                  className={`${styles.sidebarButton} ${section === 'video' ? styles.active : ''}`}
                >
                  🎥 Video Art
                </button>
              </li>
            </ul>
          </div>

          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>Settings</h3>
            <ul className={styles.sidebarList}>
              <li>
                <button 
                  onClick={() => setSection('newsletter')} 
                  className={`${styles.sidebarButton} ${section === 'newsletter' ? styles.active : ''}`}
                >
                  📧 Newsletter
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setSection('settings')} 
                  className={`${styles.sidebarButton} ${section === 'settings' ? styles.active : ''}`}
                >
                  ⚙️ Settings
                </button>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <div className={styles.adminMain}>
          {section === 'dashboard' && (
            <div className={styles.dashboardSection}>
              <h2 className={styles.sectionTitle}>Dashboard Overview</h2>
              
              {/* Stats Cards */}
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>{stats.total}</div>
                  <div className={styles.statLabel}>Total Items</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>{stats.swiper}</div>
                  <div className={styles.statLabel}>Swiper Items</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>{stats.grid}</div>
                  <div className={styles.statLabel}>Grid Items</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>{stats.video}</div>
                  <div className={styles.statLabel}>Video Items</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className={styles.quickActions}>
                <h3 className={styles.quickActionsTitle}>Quick Actions</h3>
                <div className={styles.quickActionsGrid}>
                  <button className={styles.quickActionButton} onClick={() => setSection('swiper')}>
                    Manage Swiper
                  </button>
                  <button className={styles.quickActionButton} onClick={() => setSection('grid')}>
                    Manage Grid
                  </button>
                  <button className={styles.quickActionButton} onClick={() => setSection('categories')}>
                    Manage Categories
                  </button>
                  <Link href="/" className={styles.quickActionButton}>
                    View Site
                  </Link>
                </div>
              </div>

              {/* Recent Activity */}
              <div className={styles.recentActivity}>
                <h3 className={styles.recentActivityTitle}>Recent Activity</h3>
                <div className={styles.activityList}>
                  {files.slice(0, 5).map((file, idx) => (
                    <div key={idx} className={styles.activityItem}>
                      <div className={styles.activityIcon}>📷</div>
                      <div className={styles.activityContent}>
                        <div className={styles.activityTitle}>{file.title}</div>
                        <div className={styles.activityMeta}>
                          {file.category || 'Uncategorized'} • {file.type || 'Image'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {section === 'swiper' && <SwiperAdmin />}
          {section === 'grid' && <GridAdmin />}
          
          {section === 'categories' && (
            <div className={styles.categoriesSection}>
              <h2 className={styles.sectionTitle}>Manage Categories</h2>
              <div className={styles.categoriesGrid}>
                {categories.map((category, idx) => (
                  <div key={idx} className={styles.categoryCard}>
                    <h3 className={styles.categoryCardTitle}>{category}</h3>
                    <div className={styles.categoryCardStats}>
                      {files.filter(f => f.category === category).length} items
                    </div>
                    <div className={styles.categoryCardActions}>
                      <button className={styles.categoryCardButton}>Edit</button>
                      <button className={styles.categoryCardButton}>View Items</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {section === 'stories' && (
            <div className={styles.storiesSection}>
              <h2 className={styles.sectionTitle}>Manage Stories</h2>
              <div className={styles.storiesList}>
                {[
                  'Art Miami 2022 Art Basel Week',
                  'Morin',
                  'Museum Exhibition Seoul, Korea'
                ].map((story, idx) => (
                  <div key={idx} className={styles.storyItem}>
                    <div className={styles.storyContent}>
                      <h3 className={styles.storyTitle}>{story}</h3>
                      <div className={styles.storyMeta}>Story #{idx + 1}</div>
                    </div>
                    <div className={styles.storyActions}>
                      <button className={styles.storyButton}>Edit</button>
                      <button className={styles.storyButton}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {section === 'video' && (
            <div className={styles.videoSection}>
              <h2 className={styles.sectionTitle}>Manage Video Art</h2>
              <div className={styles.videoGrid}>
                {files.filter(f => f.type === 'video').map((video, idx) => (
                  <div key={idx} className={styles.videoItem}>
                    <video src={video.url || video.src} className={styles.videoPreview} controls />
                    <div className={styles.videoContent}>
                      <h3 className={styles.videoTitle}>{video.title}</h3>
                      <div className={styles.videoActions}>
                        <button className={styles.videoButton}>Edit</button>
                        <button className={styles.videoButton}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {section === 'newsletter' && (
            <div className={styles.newsletterSection}>
              <h2 className={styles.sectionTitle}>Newsletter Management</h2>
              <div className={styles.newsletterStats}>
                <div className={styles.newsletterStat}>
                  <div className={styles.newsletterStatNumber}>1,234</div>
                  <div className={styles.newsletterStatLabel}>Subscribers</div>
                </div>
                <div className={styles.newsletterStat}>
                  <div className={styles.newsletterStatNumber}>56</div>
                  <div className={styles.newsletterStatLabel}>Campaigns Sent</div>
                </div>
              </div>
              <div className={styles.newsletterActions}>
                <button className={styles.newsletterButton}>Send Newsletter</button>
                <button className={styles.newsletterButton}>Export Subscribers</button>
                <button className={styles.newsletterButton}>Manage Templates</button>
              </div>
            </div>
          )}

          {section === 'settings' && (
            <div className={styles.settingsSection}>
              <h2 className={styles.sectionTitle}>Site Settings</h2>
              <div className={styles.settingsGrid}>
                <div className={styles.settingCard}>
                  <h3 className={styles.settingTitle}>General Settings</h3>
                  <div className={styles.settingForm}>
                    <label className={styles.settingLabel}>Site Title</label>
                    <input type="text" className={styles.settingInput} defaultValue="Gallery" />
                    <label className={styles.settingLabel}>Site Description</label>
                    <textarea className={styles.settingTextarea} defaultValue="Discover our curated collection of stunning artworks and creative pieces" />
                    <button className={styles.settingButton}>Save Changes</button>
                  </div>
                </div>
                
                <div className={styles.settingCard}>
                  <h3 className={styles.settingTitle}>Social Media</h3>
                  <div className={styles.settingForm}>
                    <label className={styles.settingLabel}>Facebook URL</label>
                    <input type="url" className={styles.settingInput} defaultValue="https://facebook.com" />
                    <label className={styles.settingLabel}>Instagram URL</label>
                    <input type="url" className={styles.settingInput} defaultValue="https://instagram.com" />
                    <button className={styles.settingButton}>Save Changes</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 