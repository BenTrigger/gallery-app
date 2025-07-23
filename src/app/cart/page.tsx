"use client";
import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';

export default function CartPage() {
  const [cart, setCart] = useState<any[]>(typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cart') || '[]') : []);
  const { t } = useTranslation('common');

  // דוגמת פריטים
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let cart = JSON.parse(localStorage.getItem('cart') || '[]');
      if (cart.length === 0) {
        cart = [
          { src: '/uploads/sample-grid-1.jpg', title: 'Grid 1', price: 100, quantity: 2 },
          { src: '/uploads/sample-swiper-1.jpg', title: 'Swiper 1', price: 150, quantity: 1 }
        ];
        localStorage.setItem('cart', JSON.stringify(cart));
        setCart(cart);
      }
    }
  }, []);

  const removeFromCart = (idx: number) => {
    const newCart = [...cart];
    newCart.splice(idx, 1);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const increaseQty = (idx: number) => {
    const newCart = [...cart];
    newCart[idx].quantity = (newCart[idx].quantity || 1) + 1;
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };
  const decreaseQty = (idx: number) => {
    const newCart = [...cart];
    if (newCart[idx].quantity > 1) {
      newCart[idx].quantity -= 1;
      setCart(newCart);
      localStorage.setItem('cart', JSON.stringify(newCart));
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
      <h1>Cart</h1>
      {cart.length === 0 ? <div>{t('no_images')}</div> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {cart.map((item, idx) => (
            <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <img src={item.src} alt={item.title} style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }} />
              <span style={{ flex: 1 }}>{item.title}</span>
              <span>{t('quantity') || 'Qty'}: </span>
              <button onClick={() => decreaseQty(idx)} style={{ fontWeight: 700, padding: '2px 8px' }}>-</button>
              <span>{item.quantity || 1}</span>
              <button onClick={() => increaseQty(idx)} style={{ fontWeight: 700, padding: '2px 8px' }}>+</button>
              <span>${(item.price || 0) * (item.quantity || 1)}</span>
              <button onClick={() => removeFromCart(idx)} style={{ color: 'red' }}>{t('delete')}</button>
            </li>
          ))}
        </ul>
      )}
      <div style={{ marginTop: 24, fontWeight: 500 }}>Total: ${total}</div>
      <button style={{ marginTop: 24, padding: '10px 32px', borderRadius: 8, background: '#222', color: '#fff', border: 'none', fontSize: 18, cursor: 'pointer' }} disabled={cart.length === 0} onClick={() => alert('Proceed to payment (demo)')}>Proceed to Payment</button>
    </div>
  );
} 