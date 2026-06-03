"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X, Save, ImagePlus, Package, Loader2, Upload } from "lucide-react";
import { useProducts, uploadProductImage } from "@/hooks/useProducts";
import { Product, categories } from "@/lib/data";

const BADGES = ["", "Sale", "Hot", "New", "Best Seller"];

type FormState = Omit<Product, "id"> & { imageKeys: string[] };

const emptyForm = (): FormState => ({
  name: "", category: "", price: 0, originalPrice: undefined,
  rating: 5, reviews: 0, image: "", images: [], imageKeys: [],
  description: "", specs: [], badge: "", inStock: true,
});

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [specKey, setSpecKey] = useState("");
  const [specVal, setSpecVal] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const openCreate = () => { setForm(emptyForm()); setCreating(true); setEditing(null); };
  const openEdit = (p: Product) => { setForm({ ...p, imageKeys: [] }); setEditing(p); setCreating(false); };
  const closeForm = () => { setCreating(false); setEditing(null); };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      const results = await Promise.all(files.map((f) => uploadProductImage(f)));
      const uploaded = results.filter(Boolean) as { url: string; key: string }[];
      setForm((f) => ({
        ...f,
        image: f.image || (uploaded[0]?.url ?? ""),
        images: [...f.images, ...uploaded.map((u) => u.url)],
        imageKeys: [...f.imageKeys, ...uploaded.map((u) => u.key)],
      }));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const addImageUrl = (url: string) => {
    if (!url.trim()) return;
    setForm((f) => ({ ...f, image: f.image || url, images: [...f.images, url] }));
  };

  const removeImage = (idx: number) => {
    setForm((f) => {
      const imgs = f.images.filter((_, i) => i !== idx);
      const keys = f.imageKeys.filter((_, i) => i !== idx);
      return { ...f, images: imgs, imageKeys: keys, image: imgs[0] ?? "" };
    });
  };

  const addSpec = () => {
    if (!specKey.trim() || !specVal.trim()) return;
    setForm((f) => ({ ...f, specs: [...f.specs, { label: specKey.trim(), value: specVal.trim() }] }));
    setSpecKey(""); setSpecVal("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { imageKeys, ...productData } = form;
      if (editing) {
        await updateProduct({ ...productData, id: editing.id } as Product, imageKeys.length ? imageKeys : undefined);
      } else {
        await addProduct(productData, imageKeys);
      }
      closeForm();
    } finally {
      setSaving(false);
    }
  };

  const inp = "w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500";

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-white">Products <span className="text-gray-500 font-normal text-lg">({products.length})</span></h1>
        <button onClick={openCreate} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-xl transition-colors">
          <Plus size={18} /> Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <Package size={48} className="mx-auto mb-3 opacity-30" />
          <p>No products yet. Click "Add Product" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((p) => (
            <div key={p.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-colors group">
              <div className="relative aspect-square bg-gray-800">
                {p.image ? (
                  <Image src={p.image} alt={p.name} fill className="object-cover" sizes="300px" unoptimized />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600"><ImagePlus size={32} /></div>
                )}
                {p.badge && <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{p.badge}</span>}
                {!p.inStock && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="text-white text-xs font-bold bg-red-600 px-2 py-1 rounded">Out of Stock</span></div>}
              </div>
              <div className="p-4">
                <p className="text-white font-semibold text-sm line-clamp-2 mb-1">{p.name}</p>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-orange-400 font-bold">Rs. {p.price.toLocaleString()}</p>
                  {p.originalPrice && <p className="text-gray-500 text-xs line-through">Rs. {p.originalPrice.toLocaleString()}</p>}
                </div>
                <p className="text-gray-500 text-xs mb-3">{categories.find((c) => c.id === p.category)?.name ?? p.category}</p>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(p)} className="flex-1 flex items-center justify-center gap-1 bg-gray-800 hover:bg-gray-700 text-white text-xs py-2 rounded-lg transition-colors">
                    <Pencil size={13} /> Edit
                  </button>
                  <button onClick={() => { if (confirm("Delete this product?")) deleteProduct(p.id); }}
                    className="flex-1 flex items-center justify-center gap-1 bg-red-900/40 hover:bg-red-900/70 text-red-400 text-xs py-2 rounded-lg transition-colors">
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide-over form */}
      {(creating || !!editing) && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/60" onClick={closeForm} />
          <div className="w-full max-w-xl bg-gray-900 border-l border-gray-700 overflow-y-auto flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
              <h2 className="text-lg font-black text-white">{editing ? "Edit Product" : "New Product"}</h2>
              <button onClick={closeForm} className="text-gray-400 hover:text-white p-1"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1">

              {/* ── Images ─────────────────────────────── */}
              <section>
                <label className="block text-sm font-semibold text-gray-300 mb-3">Product Images</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-700 group/img">
                      <Image src={img} alt="" fill className="object-cover" sizes="80px" unoptimized />
                      <button type="button" onClick={() => removeImage(i)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                        <X size={16} className="text-white" />
                      </button>
                      {i === 0 && <span className="absolute bottom-0 left-0 right-0 text-center text-white text-[10px] bg-orange-500/80 py-0.5">Main</span>}
                    </div>
                  ))}
                  <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                    className="w-20 h-20 border-2 border-dashed border-gray-600 hover:border-orange-500 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:text-orange-400 transition-colors disabled:opacity-50">
                    {uploading ? <Loader2 size={20} className="animate-spin" /> : <><Upload size={18} /><span className="text-[10px] mt-1">Upload</span></>}
                  </button>
                </div>
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileUpload} />
                <input type="url" placeholder="Or paste image URL and press Enter"
                  className={inp}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImageUrl((e.target as HTMLInputElement).value); (e.target as HTMLInputElement).value = ""; } }} />
              </section>

              {/* ── Basic Info ─────────────────────────── */}
              <section className="space-y-4">
                <label className="block text-sm font-semibold text-gray-300">Product Name *</label>
                <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inp} placeholder="e.g. JBL Tune 510BT Wireless Headphones" />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Category *</label>
                    <select required value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className={inp}>
                      <option value="">Select…</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Badge</label>
                    <select value={form.badge ?? ""} onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))} className={inp}>
                      {BADGES.map((b) => <option key={b} value={b}>{b || "None"}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Sale Price (Rs.) *</label>
                    <input required type="number" min={0} value={form.price || ""} onChange={(e) => setForm((f) => ({ ...f, price: +e.target.value }))} className={inp} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Original Price (Rs.)</label>
                    <input type="number" min={0} value={form.originalPrice || ""} onChange={(e) => setForm((f) => ({ ...f, originalPrice: e.target.value ? +e.target.value : undefined }))} className={inp} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Rating (1-5)</label>
                    <input type="number" min={1} max={5} step={0.1} value={form.rating} onChange={(e) => setForm((f) => ({ ...f, rating: +e.target.value }))} className={inp} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Review Count</label>
                    <input type="number" min={0} value={form.reviews} onChange={(e) => setForm((f) => ({ ...f, reviews: +e.target.value }))} className={inp} />
                  </div>
                </div>
              </section>

              {/* ── Description ────────────────────────── */}
              <section>
                <label className="block text-sm font-semibold text-gray-300 mb-1.5">Description *</label>
                <textarea required rows={4} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className={`${inp} resize-none`} placeholder="Describe the product features, quality, use cases…" />
              </section>

              {/* ── Specifications ─────────────────────── */}
              <section>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Specifications</label>
                <div className="space-y-1.5 mb-3">
                  {form.specs.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg">
                      <span className="text-orange-400 text-xs font-medium min-w-0 truncate">{s.label}</span>
                      <span className="text-gray-300 text-xs flex-1 truncate">{s.value}</span>
                      <button type="button" onClick={() => setForm((f) => ({ ...f, specs: f.specs.filter((_, idx) => idx !== i) }))} className="text-red-400 hover:text-red-300 shrink-0"><X size={12} /></button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={specKey} onChange={(e) => setSpecKey(e.target.value)} placeholder="Label (e.g. Battery)"
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs focus:outline-none focus:ring-1 focus:ring-orange-500" />
                  <input value={specVal} onChange={(e) => setSpecVal(e.target.value)} placeholder="Value (e.g. 40hr)"
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSpec(); } }} />
                  <button type="button" onClick={addSpec} className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-xs font-bold">+ Add</button>
                </div>
              </section>

              {/* ── In Stock ───────────────────────────── */}
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input type="checkbox" checked={form.inStock} onChange={(e) => setForm((f) => ({ ...f, inStock: e.target.checked }))} className="w-4 h-4 accent-orange-500" />
                <span className="text-sm text-gray-300">In Stock</span>
              </label>

              <button type="submit" disabled={saving}
                className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors">
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {saving ? "Saving…" : editing ? "Save Changes" : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
