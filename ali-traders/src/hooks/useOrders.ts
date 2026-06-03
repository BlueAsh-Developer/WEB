"use client";
import { useState, useEffect, useCallback } from "react";
import { insforge } from "@/lib/insforge";

export type OrderItem = { id: number; name: string; price: number; quantity: number; image: string };

export type Order = {
  deliveryId: string; createdAt: string;
  fullName: string; phone: string; phone2?: string; email?: string;
  address: string; city: string; province: string; postalCode?: string;
  country: string; landmark?: string; deliveryType: string;
  paymentMethod: string; notes?: string;
  items: OrderItem[]; subtotal: number; deliveryFee: number; total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
};

type Row = {
  delivery_id: string; created_at: string;
  full_name: string; phone: string; phone2?: string; email?: string;
  address: string; city: string; province: string; postal_code?: string;
  country: string; landmark?: string; delivery_type: string;
  payment_method: string; notes?: string;
  items: OrderItem[]; subtotal: number; delivery_fee: number; total: number;
  status: Order["status"];
};

function toOrder(r: Row): Order {
  return {
    deliveryId: r.delivery_id, createdAt: r.created_at,
    fullName: r.full_name, phone: r.phone, phone2: r.phone2, email: r.email,
    address: r.address, city: r.city, province: r.province, postalCode: r.postal_code,
    country: r.country, landmark: r.landmark, deliveryType: r.delivery_type,
    paymentMethod: r.payment_method, notes: r.notes,
    items: r.items ?? [], subtotal: r.subtotal, deliveryFee: r.delivery_fee, total: r.total,
    status: r.status,
  };
}

export function generateDeliveryId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AT-${ts}-${rand}`;
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchAll = useCallback(async () => {
    const { data } = await insforge.database
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setOrders((data as Row[]).map(toOrder));
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const saveOrder = useCallback(async (order: Order) => {
    const { data } = await insforge.database.from("orders").insert([{
      delivery_id: order.deliveryId, created_at: order.createdAt,
      full_name: order.fullName, phone: order.phone, phone2: order.phone2 ?? null,
      email: order.email ?? null, address: order.address, city: order.city,
      province: order.province, postal_code: order.postalCode ?? null,
      country: order.country, landmark: order.landmark ?? null,
      delivery_type: order.deliveryType, payment_method: order.paymentMethod,
      notes: order.notes ?? null, items: order.items,
      subtotal: order.subtotal, delivery_fee: order.deliveryFee,
      total: order.total, status: order.status,
    }]).select().maybeSingle();
    if (data) setOrders((prev) => [toOrder(data as Row), ...prev]);
  }, []);

  const updateStatus = useCallback(async (deliveryId: string, status: Order["status"]) => {
    await insforge.database.from("orders").update({ status }).eq("delivery_id", deliveryId);
    setOrders((prev) => prev.map((o) => o.deliveryId === deliveryId ? { ...o, status } : o));
  }, []);

  const getOrder = useCallback((deliveryId: string): Order | undefined => {
    return orders.find((o) => o.deliveryId === deliveryId.trim().toUpperCase());
  }, [orders]);

  return { orders, saveOrder, updateStatus, getOrder };
}
