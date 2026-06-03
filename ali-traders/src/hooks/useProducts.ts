"use client";
import { useState, useEffect, useCallback } from "react";
import { insforge } from "@/lib/insforge";
import { Product } from "@/lib/data";

type Row = {
  id: number; name: string; category: string; price: number;
  original_price?: number; rating: number; reviews: number;
  image: string; images: string[]; image_keys: string[];
  description: string; specs: { label: string; value: string }[];
  badge?: string; in_stock: boolean;
};

function toProduct(r: Row): Product {
  return {
    id: r.id, name: r.name, category: r.category, price: r.price,
    originalPrice: r.original_price, rating: r.rating, reviews: r.reviews,
    image: r.image, images: r.images ?? [], description: r.description,
    specs: r.specs ?? [], badge: r.badge ?? "", inStock: r.in_stock,
  };
}

export async function uploadProductImage(file: File): Promise<{ url: string; key: string } | null> {
  const { data, error } = await insforge.storage.from("product-images").uploadAuto(file);
  if (error || !data) return null;
  return { url: data.url, key: data.key };
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchAll = useCallback(async () => {
    const { data } = await insforge.database
      .from("products")
      .select("id, name, category, price, original_price, rating, reviews, image, images, description, specs, badge, in_stock")
      .order("id", { ascending: true });
    if (data) setProducts((data as Row[]).map(toProduct));
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const addProduct = useCallback(async (p: Omit<Product, "id">, imageKeys: string[] = []) => {
    const { data } = await insforge.database.from("products").insert([{
      name: p.name, category: p.category, price: p.price,
      original_price: p.originalPrice ?? null,
      rating: p.rating, reviews: p.reviews,
      image: p.image, images: p.images, image_keys: imageKeys,
      description: p.description, specs: p.specs,
      badge: p.badge ?? "", in_stock: p.inStock,
    }]).select().maybeSingle();
    if (data) setProducts((prev) => [...prev, toProduct(data as Row)]);
    return data ? toProduct(data as Row) : null;
  }, []);

  const updateProduct = useCallback(async (p: Product, imageKeys?: string[]) => {
    const payload: Record<string, unknown> = {
      name: p.name, category: p.category, price: p.price,
      original_price: p.originalPrice ?? null,
      rating: p.rating, reviews: p.reviews,
      image: p.image, images: p.images,
      description: p.description, specs: p.specs,
      badge: p.badge ?? "", in_stock: p.inStock,
    };
    if (imageKeys !== undefined) payload.image_keys = imageKeys;
    const { data } = await insforge.database.from("products").update(payload).eq("id", p.id).select().maybeSingle();
    if (data) setProducts((prev) => prev.map((x) => x.id === p.id ? toProduct(data as Row) : x));
  }, []);

  const deleteProduct = useCallback(async (id: number) => {
    await insforge.database.from("products").delete().eq("id", id);
    setProducts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  return { products, addProduct, updateProduct, deleteProduct };
}
