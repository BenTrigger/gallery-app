"use client";
import { useState } from "react";

const demoOrders = [
  { id: 1, items: ["Painting 1", "Painting 2"], total: 320, status: "Pending" },
  { id: 2, items: ["Sculpture"], total: 180, status: "Shipped" },
];

export default function OrdersPage() {
  const [orders] = useState(demoOrders);
  return (
    <div style={{ maxWidth: 700, margin: '40px auto', background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
      <h1>Orders</h1>
      {orders.length === 0 ? <div>No orders yet.</div> : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f7f7f7' }}>
              <th style={{ textAlign: 'left', padding: 8 }}>Order #</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Items</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Total</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: 8 }}>{order.id}</td>
                <td style={{ padding: 8 }}>{order.items.join(", ")}</td>
                <td style={{ padding: 8 }}>${order.total}</td>
                <td style={{ padding: 8 }}>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 