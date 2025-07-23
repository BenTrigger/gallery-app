"use client";
import { SessionProvider } from "next-auth/react";
import styles from './page.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <aside style={{ width: 220, background: '#222', color: '#fff', padding: 24 }}>
          <h2 style={{ fontSize: 22, marginBottom: 32 }}>Admin Panel</h2>
          <nav>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: 16 }}><a href="/admin" style={{ color: '#fff', textDecoration: 'none' }}>Dashboard</a></li>
              {/* כאן אפשר להוסיף קישורים נוספים בהמשך */}
            </ul>
          </nav>
        </aside>
        <main style={{ flex: 1, background: '#f7f7f7', padding: 32 }}>
          {children}
        </main>
      </div>
    </SessionProvider>
  );
} 