'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import AdminLayout from '../components/AdminLayout';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  compare_price: number;
  sale_price: number | null;
  image: string | null;
  category: string;
  category_id: string | null;
  subcategory_id: string | null;
  stock: number;
  slug: string | null;
  sku: string | null;
  tags: string[];
  is_active: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  is_draft: boolean;
  seo_title: string | null;
  seo_description: string | null;
  metal_options: string[];
  diamond_type: string[];
  carat_range: string | null;
  created_at: string;
  // Master catalog fields
  master_product_id: string | null;
  master_sku: string | null;
  short_description: string | null;
  long_description: string | null;
  h1: string | null;
  canonical_url: string | null;
  breadcrumb: string | null;
  primary_keyword: string | null;
  secondary_keywords: string[] | null;
  aeo_direct_answer: string | null;
  aeo_faqs: any[] | null;
  aeo_tags: string[] | null;
  key_specifications: Record<string, string> | null;
  product_page_status: string | null;
  badge: string | null;
}

interface ProductVariant {
  id: string;
  product_id: string;
  diamond_type: string;
  carat: string;
  metal: string;
  price: number;
  compare_price: number;
  sale_price: number | null;
  stock: number;
  sku: string | null;
  ring_size: string | null;
  shape: string | null;
  setting_type: string | null;
  is_enabled: boolean;
  image_url: string | null;
}

interface ProductMedia {
  id: string;
  product_id: string;
  url: string;
  media_type: string;
  sort_order: number;
  alt_text: string | null;
}

interface MasterCategory {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  sort_order: number;
}

const CATEGORIES = [
  'Rings',
  'Earrings',
  'Necklaces & Pendants',
  'Bracelets',
  "Men\'s Jewellery",
  'Gemstone Jewellery',
];
const METALS = ['18K White Gold', '18K Yellow Gold', '18K Rose Gold', 'Platinum 950'];
const DIAMOND_TYPES = ['Natural', 'Lab-Grown'];
const CARAT_OPTIONS = ['0.30', '0.50', '0.70', '1.00', '1.50', '2.00'];
const SHAPES = ['Round', 'Princess', 'Oval', 'Cushion', 'Emerald', 'Pear', 'Marquise', 'Radiant'];
const SETTINGS = ['Prong', 'Bezel', 'Pavé', 'Channel', 'Halo', 'Tension'];
const RING_SIZES = ['46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60'];

// Currency definitions matching the website
const CURRENCIES = [
  { code: 'EUR', symbol: '€', label: 'EUR €', rate: 1 / 11.8 },
  { code: 'USD', symbol: '$', label: 'USD $', rate: 1 / 10.9 },
  { code: 'GBP', symbol: '£', label: 'GBP £', rate: 1 / 13.8 },
  { code: 'NOK', symbol: 'kr', label: 'NOK kr', rate: 1 },
];

function formatAdminPrice(nokAmount: number, currencyCode: string): string {
  const cur = CURRENCIES.find((c) => c.code === currencyCode) || CURRENCIES[0];
  const converted = Math.round(nokAmount * cur.rate);
  const formatted = converted.toLocaleString('en-US');
  if (currencyCode === 'EUR') return `€${formatted}`;
  if (currencyCode === 'USD') return `$${formatted}`;
  if (currencyCode === 'GBP') return `£${formatted}`;
  if (currencyCode === 'NOK') return `NOK ${formatted}`;
  return `${currencyCode} ${formatted}`;
}

function emptyForm() {
  return {
    name: '', description: '', price: 0, compare_price: 0, sale_price: '',
    image: '', category: 'Engagement Rings', category_id: '', subcategory_id: '', stock: 0, slug: '', sku: '',
    tags: '', is_active: true, is_featured: false, is_bestseller: false, is_draft: false,
    seo_title: '', seo_description: '', carat_range: '0.30ct–2.00ct',
    // Master catalog fields
    master_product_id: '', master_sku: '', short_description: '', long_description: '',
    h1: '', primary_keyword: '', aeo_direct_answer: '', badge: '', product_page_status: 'draft',
  };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [activeTab, setActiveTab] = useState<'details' | 'media' | 'variants' | 'seo'>('details');
  const [displayCurrency, setDisplayCurrency] = useState('EUR');
  const [masterCategories, setMasterCategories] = useState<MasterCategory[]>([]);
  const [allSubcategories, setAllSubcategories] = useState<MasterCategory[]>([]);

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState('');
  const [applyingBulk, setApplyingBulk] = useState(false);

  // Media state
  const [productMedia, setProductMedia] = useState<ProductMedia[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mainImageInputRef = useRef<HTMLInputElement>(null);

  // Variant state
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);
  const [variantLoading, setVariantLoading] = useState(false);
  const [newVariant, setNewVariant] = useState({
    diamond_type: 'Natural', carat: '1.00', metal: '18K White Gold',
    price: 0, compare_price: 0, stock: 10, sku: '', ring_size: '',
    shape: 'Round', setting_type: 'Prong', is_enabled: true,
  });

  const supabase = useMemo(() => createClient(), []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error loading products:', error);
    }
    setProducts(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  // Load master categories and subcategories
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const json = await res.json();
          setMasterCategories(json.categories || []);
          setAllSubcategories(json.subcategories || []);
        }
      } catch { /* ignore */ }
    }
    loadCategories();
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showForm) {
        setShowForm(false);
        setEditingProduct(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showForm]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showForm]);

  const showMsg = (msg: string, type: 'success' | 'error' = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 4000);
  };

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.sku || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === 'All' || p.category === filterCategory;
    const matchStatus = filterStatus === 'all' ||
      (filterStatus === 'active' && p.is_active && !p.is_draft) ||
      (filterStatus === 'draft' && p.is_draft) ||
      (filterStatus === 'inactive' && !p.is_active && !p.is_draft) ||
      (filterStatus === 'featured' && p.is_featured);
    return matchSearch && matchCat && matchStatus;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((p) => p.id)));
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedIds.size === 0) return;
    setApplyingBulk(true);
    const ids = Array.from(selectedIds);

    let updatePayload: Record<string, unknown> = {};
    let shouldDelete = false;

    switch (bulkAction) {
      case 'publish': updatePayload = { is_active: true, is_draft: false }; break;
      case 'unpublish': updatePayload = { is_active: false }; break;
      case 'draft': updatePayload = { is_draft: true, is_active: false }; break;
      case 'feature': updatePayload = { is_featured: true }; break;
      case 'unfeature': updatePayload = { is_featured: false }; break;
      case 'delete': shouldDelete = true; break;
    }

    if (shouldDelete) {
      if (!confirm(`Delete ${ids.length} products? This cannot be undone.`)) {
        setApplyingBulk(false);
        return;
      }
      for (const id of ids) {
        await supabase.from('products').delete().eq('id', id);
      }
      setProducts((prev) => prev.filter((p) => !ids.includes(p.id)));
      showMsg(`${ids.length} products deleted.`);
    } else {
      const { error } = await supabase.from('products').update({ ...updatePayload, updated_at: new Date().toISOString() }).in('id', ids);
      if (error) {
        showMsg(`Error: ${error.message}`, 'error');
      } else {
        setProducts((prev) => prev.map((p) => ids.includes(p.id) ? { ...p, ...updatePayload } : p));
        showMsg(`${ids.length} products updated.`);
      }
    }

    setSelectedIds(new Set());
    setBulkAction('');
    setApplyingBulk(false);
  };

  const openNew = () => {
    setEditingProduct(null);
    setForm(emptyForm());
    setProductMedia([]);
    setProductVariants([]);
    setActiveTab('details');
    setShowForm(true);
  };

  const openEdit = async (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      compare_price: product.compare_price || 0,
      sale_price: product.sale_price?.toString() || '',
      image: product.image || '',
      category: product.category,
      category_id: product.category_id || '',
      subcategory_id: product.subcategory_id || '',
      stock: product.stock,
      slug: product.slug || '',
      sku: product.sku || '',
      tags: (product.tags || []).join(', '),
      is_active: product.is_active,
      is_featured: product.is_featured || false,
      is_bestseller: product.is_bestseller || false,
      is_draft: product.is_draft || false,
      seo_title: product.seo_title || '',
      seo_description: product.seo_description || '',
      carat_range: product.carat_range || '0.30ct–2.00ct',
      // Master catalog fields
      master_product_id: product.master_product_id || '',
      master_sku: product.master_sku || '',
      short_description: product.short_description || '',
      long_description: product.long_description || '',
      h1: product.h1 || '',
      primary_keyword: product.primary_keyword || '',
      aeo_direct_answer: product.aeo_direct_answer || '',
      badge: product.badge || '',
      product_page_status: product.product_page_status || 'draft',
    });
    setActiveTab('details');
    setShowForm(true);
    setMediaLoading(true);
    setVariantLoading(true);
    const [mediaRes, variantsRes] = await Promise.all([
      supabase.from('product_media').select('*').eq('product_id', product.id).order('sort_order'),
      supabase.from('product_variants').select('*').eq('product_id', product.id).order('created_at'),
    ]);
    setProductMedia(mediaRes.data || []);
    setProductVariants(variantsRes.data || []);
    setMediaLoading(false);
    setVariantLoading(false);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      showMsg('Product name is required.', 'error');
      return;
    }
    setSaving(true);
    const payload: Record<string, unknown> = {
      name: form.name.trim(),
      description: form.description || null,
      price: Number(form.price),
      compare_price: Number(form.compare_price) || 0,
      sale_price: form.sale_price ? Number(form.sale_price) : null,
      image: form.image || null,
      category: form.category,
      category_id: form.category_id || null,
      subcategory_id: form.subcategory_id || null,
      stock: Number(form.stock),
      slug: form.slug || null,
      sku: form.sku || null,
      tags: form.tags ? form.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
      is_active: form.is_active,
      is_featured: form.is_featured,
      is_bestseller: form.is_bestseller,
      is_draft: form.is_draft,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
      carat_range: form.carat_range || null,
      updated_at: new Date().toISOString(),
      // Master catalog fields — only update if provided (never overwrite with empty)
      ...(form.master_product_id ? { master_product_id: form.master_product_id } : {}),
      ...(form.master_sku ? { master_sku: form.master_sku } : {}),
      short_description: form.short_description || null,
      long_description: form.long_description || null,
      h1: form.h1 || null,
      primary_keyword: form.primary_keyword || null,
      aeo_direct_answer: form.aeo_direct_answer || null,
      badge: form.badge || null,
      product_page_status: form.product_page_status || 'draft',
    };

    if (editingProduct) {
      const { data, error } = await supabase.from('products').update(payload).eq('id', editingProduct.id).select().single();
      if (error) {
        showMsg(`Save failed: ${error.message}`, 'error');
      } else if (data) {
        setProducts((prev) => prev.map((p) => p.id === editingProduct.id ? data : p));
        setEditingProduct(data);
        showMsg('✓ Product updated successfully.');
      }
    } else {
      const { data, error } = await supabase.from('products').insert(payload).select().single();
      if (error) {
        showMsg(`Create failed: ${error.message}`, 'error');
      } else if (data) {
        setProducts((prev) => [data, ...prev]);
        setEditingProduct(data);
        showMsg('✓ Product created successfully.');
      }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      showMsg(`Delete failed: ${error.message}`, 'error');
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      if (editingProduct?.id === id) { setShowForm(false); setEditingProduct(null); }
      showMsg('Product deleted.');
    }
  };

  const handleDuplicate = async (product: Product) => {
    const { data, error } = await supabase.from('products').insert({
      ...product,
      id: undefined,
      name: `${product.name} (Copy)`,
      slug: product.slug ? `${product.slug}-copy` : null,
      sku: product.sku ? `${product.sku}-COPY` : null,
      created_at: undefined,
      updated_at: undefined,
    }).select().single();
    if (error) {
      showMsg(`Duplicate failed: ${error.message}`, 'error');
    } else if (data) {
      setProducts((prev) => [data, ...prev]);
      showMsg('Product duplicated.');
    }
  };

  const handleToggle = async (id: string, field: string, value: boolean) => {
    const { error } = await supabase.from('products').update({ [field]: value, updated_at: new Date().toISOString() }).eq('id', id);
    if (!error) {
      setProducts((prev) => prev.map((p) => p.id === id ? { ...p, [field]: value } : p));
      if (editingProduct?.id === id) setEditingProduct((prev) => prev ? { ...prev, [field]: value } : prev);
    }
  };

  // Media handlers
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingProduct || !e.target.files?.[0]) return;
    const file = e.target.files[0];
    setUploadingFile(true);
    const ext = file.name.split('.').pop();
    const fileName = `${editingProduct.id}/${Date.now()}.${ext}`;
    const { data: uploadData, error } = await supabase.storage.from('product-images').upload(fileName, file, { upsert: true });
    if (!error && uploadData) {
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(uploadData.path);
      const { data: media, error: mediaError } = await supabase.from('product_media').insert({
        product_id: editingProduct.id,
        url: publicUrl,
        media_type: file.type.startsWith('video') ? 'video' : 'image',
        sort_order: productMedia.length,
        alt_text: editingProduct.name,
      }).select().single();
      if (mediaError) {
        showMsg(`Upload failed: ${mediaError.message}`, 'error');
      } else if (media) {
        setProductMedia((prev) => [...prev, media]);
        showMsg('✓ Image uploaded successfully.');
      }
    } else if (error) {
      showMsg(`Upload error: ${error.message}`, 'error');
    }
    setUploadingFile(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingProduct || !e.target.files?.[0]) return;
    const file = e.target.files[0];
    setUploadingFile(true);
    const ext = file.name.split('.').pop();
    const fileName = `${editingProduct.id}/main-${Date.now()}.${ext}`;
    const { data: uploadData, error } = await supabase.storage.from('product-images').upload(fileName, file, { upsert: true });
    if (!error && uploadData) {
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(uploadData.path);
      // Update product main image
      const { error: updateError } = await supabase.from('products').update({ image: publicUrl, updated_at: new Date().toISOString() }).eq('id', editingProduct.id);
      if (!updateError) {
        setProducts((prev) => prev.map((p) => p.id === editingProduct.id ? { ...p, image: publicUrl } : p));
        setEditingProduct((prev) => prev ? { ...prev, image: publicUrl } : prev);
        setForm((prev) => ({ ...prev, image: publicUrl }));
        showMsg('✓ Main image updated.');
      }
    } else if (error) {
      showMsg(`Upload error: ${error.message}`, 'error');
    }
    setUploadingFile(false);
    if (mainImageInputRef.current) mainImageInputRef.current.value = '';
  };

  const handleDeleteMedia = async (mediaId: string) => {
    const { error } = await supabase.from('product_media').delete().eq('id', mediaId);
    if (!error) {
      setProductMedia((prev) => prev.filter((m) => m.id !== mediaId));
      showMsg('Media removed.');
    }
  };

  const handleSetMainImage = async (url: string) => {
    if (!editingProduct) return;
    const { error } = await supabase.from('products').update({ image: url, updated_at: new Date().toISOString() }).eq('id', editingProduct.id);
    if (!error) {
      setProducts((prev) => prev.map((p) => p.id === editingProduct.id ? { ...p, image: url } : p));
      setEditingProduct((prev) => prev ? { ...prev, image: url } : prev);
      setForm((prev) => ({ ...prev, image: url }));
      showMsg('✓ Main image updated.');
    }
  };

  // Variant handlers
  const handleAddVariant = async () => {
    if (!editingProduct) return;
    setVariantLoading(true);
    const { data, error } = await supabase.from('product_variants').insert({
      product_id: editingProduct.id,
      diamond_type: newVariant.diamond_type,
      carat: newVariant.carat,
      metal: newVariant.metal,
      price: Number(newVariant.price),
      compare_price: Number(newVariant.compare_price) || 0,
      stock: Number(newVariant.stock),
      sku: newVariant.sku || null,
      ring_size: newVariant.ring_size || null,
      shape: newVariant.shape || null,
      setting_type: newVariant.setting_type || null,
      is_enabled: newVariant.is_enabled,
    }).select().single();
    if (error) {
      showMsg(`Add variant failed: ${error.message}`, 'error');
    } else if (data) {
      setProductVariants((prev) => [...prev, data]);
      showMsg('✓ Variant added.');
    }
    setVariantLoading(false);
  };

  const handleDeleteVariant = async (variantId: string) => {
    const { error } = await supabase.from('product_variants').delete().eq('id', variantId);
    if (!error) {
      setProductVariants((prev) => prev.filter((v) => v.id !== variantId));
      showMsg('Variant removed.');
    }
  };

  const inputCls = 'w-full bg-white border border-[rgba(28,25,23,0.15)] px-3 py-2 text-sm text-foreground focus:outline-none focus:border-foreground transition-colors';
  const labelCls = 'block text-[10px] font-medium text-muted uppercase tracking-wider mb-1';
  const checkboxCls = 'w-4 h-4 border border-[rgba(28,25,23,0.3)] rounded-sm accent-foreground cursor-pointer';

  return (
    <AdminLayout>
      <div className="max-w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-lg font-light text-foreground">Products</h1>
            <p className="text-xs text-muted mt-0.5">{products.length} total · {filtered.length} shown</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {message && (
              <span className={`text-xs px-3 py-1.5 border ${messageType === 'error' ? 'text-red-600 bg-red-50 border-red-200' : 'text-green-600 bg-green-50 border-green-200'}`}>
                {message}
              </span>
            )}
            {/* Currency selector for admin */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-muted uppercase tracking-wider">Display:</span>
              <select
                value={displayCurrency}
                onChange={(e) => setDisplayCurrency(e.target.value)}
                className="bg-white border border-[rgba(28,25,23,0.15)] px-2 py-1.5 text-xs text-foreground focus:outline-none focus:border-foreground transition-colors"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
            </div>
            <button onClick={openNew} className="px-4 py-2 bg-[#1C1917] text-white text-xs font-medium uppercase tracking-wider hover:bg-[#2C2927] transition-colors">
              + Add Product
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="bg-white border border-[rgba(28,25,23,0.15)] px-3 py-2 text-sm text-foreground focus:outline-none focus:border-foreground transition-colors w-64"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-white border border-[rgba(28,25,23,0.15)] px-3 py-2 text-sm text-foreground focus:outline-none focus:border-foreground transition-colors"
          >
            <option value="All">All Categories</option>
            {masterCategories.length > 0
              ? masterCategories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)
              : CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)
            }
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white border border-[rgba(28,25,23,0.15)] px-3 py-2 text-sm text-foreground focus:outline-none focus:border-foreground transition-colors"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="inactive">Inactive</option>
            <option value="featured">Featured</option>
          </select>
        </div>

        {/* Bulk Actions Bar */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3 mb-4 bg-[#1C1917] text-white px-4 py-3 flex-wrap">
            <span className="text-xs font-medium">{selectedIds.size} selected</span>
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className="bg-white/10 border border-white/20 text-white text-xs px-3 py-1.5 focus:outline-none"
            >
              <option value="">Choose action...</option>
              <option value="publish">Publish</option>
              <option value="unpublish">Unpublish</option>
              <option value="draft">Set as Draft</option>
              <option value="feature">Mark as Featured</option>
              <option value="unfeature">Remove Featured</option>
              <option value="delete">Delete</option>
            </select>
            <button
              onClick={handleBulkAction}
              disabled={!bulkAction || applyingBulk}
              className="px-4 py-1.5 bg-white text-[#1C1917] text-xs font-medium uppercase tracking-wider hover:bg-[#F4F2EE] transition-colors disabled:opacity-60"
            >
              {applyingBulk ? 'Applying...' : 'Apply'}
            </button>
            <button onClick={() => setSelectedIds(new Set())} className="text-xs text-white/60 hover:text-white ml-auto">
              Clear
            </button>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white border border-[rgba(28,25,23,0.08)] overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-7 h-7 border border-foreground border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-sm text-muted">No products found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[rgba(28,25,23,0.06)] bg-[#F8F6F2]">
                    <th className="px-4 py-3 w-8">
                      <input
                        type="checkbox"
                        checked={selectedIds.size === filtered.length && filtered.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 accent-foreground cursor-pointer"
                      />
                    </th>
                    <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted">Product</th>
                    <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted hidden md:table-cell">Category</th>
                    <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted">Price</th>
                    <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted hidden sm:table-cell">Stock</th>
                    <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted">Status</th>
                    <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-muted text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => (
                    <tr
                      key={product.id}
                      className={`border-b border-[rgba(28,25,23,0.04)] hover:bg-[#F8F6F2] transition-colors ${editingProduct?.id === product.id ? 'bg-[#F4F2EE]' : ''} ${selectedIds.has(product.id) ? 'bg-blue-50' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(product.id)}
                          onChange={() => toggleSelect(product.id)}
                          className="w-4 h-4 accent-foreground cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 bg-[#F4F2EE] flex-shrink-0">
                            {product.image ? (
                              <Image src={product.image} alt={product.name} fill className="object-cover" sizes="40px" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-[8px] text-muted">IMG</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-foreground">{product.name}</p>
                            <p className="text-[10px] text-muted">
                              {product.master_product_id ? (
                                <span className="text-[#C9A96E] font-medium">{product.master_product_id}</span>
                              ) : (
                                product.sku || 'No SKU'
                              )}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-xs text-muted">{product.category}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-foreground">{formatAdminPrice(product.price, displayCurrency)}</p>
                        {product.compare_price > 0 && product.compare_price > product.price && (
                          <p className="text-[10px] text-muted line-through">{formatAdminPrice(product.compare_price, displayCurrency)}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <p className={`text-xs ${product.stock <= 0 ? 'text-red-500' : product.stock <= 5 ? 'text-yellow-600' : 'text-foreground'}`}>
                          {product.stock}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-block px-1.5 py-0.5 text-[9px] font-medium rounded ${product.is_draft ? 'bg-gray-100 text-gray-600' : product.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                            {product.is_draft ? 'Draft' : product.is_active ? 'Active' : 'Inactive'}
                          </span>
                          {product.is_featured && <span className="inline-block px-1.5 py-0.5 text-[9px] font-medium rounded bg-amber-100 text-amber-700">Featured</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button
                            onClick={() => openEdit(product)}
                            className="text-[10px] px-3 py-1.5 bg-[#1C1917] text-white hover:bg-[#2C2927] transition-colors font-medium"
                          >
                            Edit
                          </button>
                          <button onClick={() => handleDuplicate(product)} className="text-[10px] px-2 py-1.5 border border-[rgba(28,25,23,0.15)] text-muted hover:text-foreground hover:border-foreground transition-colors">
                            Copy
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="text-[10px] px-2 py-1.5 border border-red-200 text-red-400 hover:bg-red-50 transition-colors">
                            Del
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── EDIT / CREATE MODAL OVERLAY ── */}
        {showForm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.55)' }}
            onClick={(e) => { if (e.target === e.currentTarget) { setShowForm(false); setEditingProduct(null); } }}
          >
            <div
              className="bg-white w-full max-w-2xl flex flex-col shadow-2xl"
              style={{ maxHeight: '90vh' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(28,25,23,0.06)] bg-[#F8F6F2] flex-shrink-0">
                <div>
                  <h3 className="text-xs font-medium uppercase tracking-wider text-foreground">
                    {editingProduct ? `Edit Product` : 'New Product'}
                  </h3>
                  {editingProduct && (
                    <p className="text-[10px] text-muted mt-0.5 truncate max-w-xs">{editingProduct.name}</p>
                  )}
                </div>
                <button
                  onClick={() => { setShowForm(false); setEditingProduct(null); }}
                  className="text-muted hover:text-foreground text-2xl leading-none w-8 h-8 flex items-center justify-center hover:bg-[rgba(28,25,23,0.06)] transition-colors"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-[rgba(28,25,23,0.06)] flex-shrink-0 overflow-x-auto">
                {(['details', 'media', 'variants', 'seo'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    disabled={tab !== 'details' && !editingProduct}
                    className={`px-4 py-3 text-[10px] font-medium uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                      activeTab === tab ? 'border-foreground text-foreground' : 'border-transparent text-muted hover:text-foreground'
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Modal Body — scrollable */}
              <div className="p-5 overflow-y-auto flex-1">
                {/* Details Tab */}
                {activeTab === 'details' && (
                  <div className="space-y-4">
                    {/* Main image preview + upload */}
                    {editingProduct && (
                      <div className="flex items-start gap-4 p-3 bg-[#F8F6F2] border border-[rgba(28,25,23,0.08)]">
                        <div className="relative w-20 h-20 bg-[#F4F2EE] flex-shrink-0">
                          {form.image ? (
                            <Image src={form.image} alt="Main product image" fill className="object-cover" sizes="80px" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-[9px] text-muted text-center">No image</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={labelCls}>Main Image</p>
                          <input
                            ref={mainImageInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleMainImageUpload}
                            className="hidden"
                          />
                          <button
                            onClick={() => mainImageInputRef.current?.click()}
                            disabled={uploadingFile}
                            className="px-3 py-1.5 bg-[#1C1917] text-white text-[10px] font-medium uppercase tracking-wider hover:bg-[#2C2927] transition-colors disabled:opacity-60 mb-2"
                          >
                            {uploadingFile ? 'Uploading...' : '↑ Upload Image'}
                          </button>
                          <p className="text-[10px] text-muted">Or paste URL below</p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <label className={labelCls}>Product Name *</label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                          className={inputCls}
                          placeholder="Product name"
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Category</label>
                        <select
                          value={form.category}
                          onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                          className={inputCls}
                        >
                          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      {/* Master Category (relational) */}
                      <div>
                        <label className={labelCls}>Master Category</label>
                        <select
                          value={form.category_id}
                          onChange={(e) => setForm((p) => ({ ...p, category_id: e.target.value, subcategory_id: '' }))}
                          className={inputCls}
                        >
                          <option value="">— Select Master Category —</option>
                          {masterCategories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      {/* Subcategory (relational) */}
                      <div>
                        <label className={labelCls}>Subcategory</label>
                        <select
                          value={form.subcategory_id}
                          onChange={(e) => setForm((p) => ({ ...p, subcategory_id: e.target.value }))}
                          className={inputCls}
                          disabled={!form.category_id}
                        >
                          <option value="">— Select Subcategory —</option>
                          {allSubcategories
                            .filter((s) => s.parent_id === form.category_id)
                            .map((s) => (
                              <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>SKU</label>
                        <input
                          type="text"
                          value={form.sku}
                          onChange={(e) => setForm((p) => ({ ...p, sku: e.target.value }))}
                          className={inputCls}
                          placeholder="DT-001"
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Base Price (NOK) *</label>
                        <input
                          type="number"
                          value={form.price}
                          onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))}
                          className={inputCls}
                          min="0"
                        />
                        {form.price > 0 && (
                          <p className="text-[10px] text-muted mt-1">
                            {CURRENCIES.map((c) => `${c.symbol}${Math.round(form.price * c.rate).toLocaleString()} ${c.code}`).join(' · ')}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className={labelCls}>Compare Price (NOK)</label>
                        <input
                          type="number"
                          value={form.compare_price}
                          onChange={(e) => setForm((p) => ({ ...p, compare_price: Number(e.target.value) }))}
                          className={inputCls}
                          min="0"
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Sale Price (NOK)</label>
                        <input
                          type="number"
                          value={form.sale_price}
                          onChange={(e) => setForm((p) => ({ ...p, sale_price: e.target.value }))}
                          className={inputCls}
                          placeholder="Optional"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Stock</label>
                        <input
                          type="number"
                          value={form.stock}
                          onChange={(e) => setForm((p) => ({ ...p, stock: Number(e.target.value) }))}
                          className={inputCls}
                          min="0"
                        />
                      </div>
                      <div>
                        <label className={labelCls}>URL Slug</label>
                        <input
                          type="text"
                          value={form.slug}
                          onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                          className={inputCls}
                          placeholder="product-name"
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Carat Range</label>
                        <input
                          type="text"
                          value={form.carat_range}
                          onChange={(e) => setForm((p) => ({ ...p, carat_range: e.target.value }))}
                          className={inputCls}
                          placeholder="0.30ct–2.00ct"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className={labelCls}>Main Image URL</label>
                        <input
                          type="text"
                          value={form.image}
                          onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
                          className={inputCls}
                          placeholder="https://..."
                        />
                      </div>
                      <div className="col-span-2">
                        <label className={labelCls}>Tags (comma separated)</label>
                        <input
                          type="text"
                          value={form.tags}
                          onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
                          className={inputCls}
                          placeholder="diamond, ring, engagement"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className={labelCls}>Description</label>
                        <textarea
                          value={form.description}
                          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                          className={inputCls}
                          rows={4}
                          placeholder="Product description..."
                        />
                      </div>

                      {/* ── Master Catalog Fields ── */}
                      <div className="col-span-2 pt-3 border-t border-[rgba(28,25,23,0.06)]">
                        <p className="text-[10px] font-medium text-[#C9A96E] uppercase tracking-wider mb-3">Master Catalog Identity</p>
                      </div>
                      <div>
                        <label className={labelCls}>Master Product ID</label>
                        <input
                          type="text"
                          value={form.master_product_id}
                          onChange={(e) => setForm((p) => ({ ...p, master_product_id: e.target.value }))}
                          className={inputCls}
                          placeholder="DET-001"
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Master SKU</label>
                        <input
                          type="text"
                          value={form.master_sku}
                          onChange={(e) => setForm((p) => ({ ...p, master_sku: e.target.value }))}
                          className={inputCls}
                          placeholder="DET-R-001"
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Badge</label>
                        <input
                          type="text"
                          value={form.badge}
                          onChange={(e) => setForm((p) => ({ ...p, badge: e.target.value }))}
                          className={inputCls}
                          placeholder="New, Bestseller, etc."
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Page Status</label>
                        <select
                          value={form.product_page_status}
                          onChange={(e) => setForm((p) => ({ ...p, product_page_status: e.target.value }))}
                          className={inputCls}
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className={labelCls}>Short Description</label>
                        <textarea
                          value={form.short_description}
                          onChange={(e) => setForm((p) => ({ ...p, short_description: e.target.value }))}
                          className={inputCls}
                          rows={2}
                          placeholder="Brief product summary (1–2 sentences)"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className={labelCls}>H1 Heading</label>
                        <input
                          type="text"
                          value={form.h1}
                          onChange={(e) => setForm((p) => ({ ...p, h1: e.target.value }))}
                          className={inputCls}
                          placeholder="Main page heading"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className={labelCls}>Primary Keyword</label>
                        <input
                          type="text"
                          value={form.primary_keyword}
                          onChange={(e) => setForm((p) => ({ ...p, primary_keyword: e.target.value }))}
                          className={inputCls}
                          placeholder="e.g. oval halo diamond engagement ring"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className={labelCls}>AEO Direct Answer</label>
                        <textarea
                          value={form.aeo_direct_answer}
                          onChange={(e) => setForm((p) => ({ ...p, aeo_direct_answer: e.target.value }))}
                          className={inputCls}
                          rows={3}
                          placeholder="Clear factual answer about what this product is..."
                        />
                      </div>
                    </div>

                    {/* Toggles */}
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[rgba(28,25,23,0.06)]">
                      {[
                        { key: 'is_active', label: 'Active / Visible on website' },
                        { key: 'is_draft', label: 'Draft Mode (hidden)' },
                        { key: 'is_featured', label: 'Featured Product' },
                        { key: 'is_bestseller', label: 'Bestseller Badge' },
                      ].map(({ key, label }) => (
                        <label key={key} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form[key as keyof typeof form] as boolean}
                            onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.checked }))}
                            className={checkboxCls}
                          />
                          <span className="text-xs text-foreground">{label}</span>
                        </label>
                      ))}
                    </div>

                    <div className="flex gap-3 pt-3 border-t border-[rgba(28,25,23,0.06)]">
                      <button
                        onClick={handleSave}
                        disabled={saving || !form.name.trim()}
                        className="flex-1 py-3 bg-[#1C1917] text-white text-xs font-medium uppercase tracking-wider hover:bg-[#2C2927] transition-colors disabled:opacity-60"
                      >
                        {saving ? 'Saving...' : editingProduct ? '✓ Update Product' : '+ Create Product'}
                      </button>
                      {editingProduct && (
                        <button
                          onClick={() => handleToggle(editingProduct.id, 'is_active', !editingProduct.is_active)}
                          className={`px-4 py-3 border text-xs font-medium uppercase tracking-wider transition-colors ${editingProduct.is_active ? 'border-yellow-200 text-yellow-600 hover:bg-yellow-50' : 'border-green-200 text-green-600 hover:bg-green-50'}`}
                        >
                          {editingProduct.is_active ? 'Unpublish' : 'Publish'}
                        </button>
                      )}
                      {editingProduct && (
                        <button
                          onClick={() => handleDelete(editingProduct.id)}
                          className="px-4 py-3 border border-red-200 text-red-500 text-xs font-medium uppercase tracking-wider hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Media Tab */}
                {activeTab === 'media' && editingProduct && (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-[rgba(28,25,23,0.15)] p-6 text-center">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        multiple
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingFile}
                        className="px-4 py-2 bg-[#1C1917] text-white text-xs font-medium uppercase tracking-wider hover:bg-[#2C2927] transition-colors disabled:opacity-60"
                      >
                        {uploadingFile ? 'Uploading...' : '+ Upload Images / Videos'}
                      </button>
                      <p className="text-[10px] text-muted mt-2">JPG, PNG, WebP, MP4 · Max 50MB · Click an image to set as main</p>
                    </div>

                    {mediaLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="w-6 h-6 border border-foreground border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : productMedia.length === 0 ? (
                      <p className="text-xs text-muted text-center py-6">No media yet. Upload images above.</p>
                    ) : (
                      <div className="grid grid-cols-3 gap-3">
                        {productMedia.map((m) => (
                          <div key={m.id} className="relative group cursor-pointer">
                            <div className="relative aspect-square bg-[#F4F2EE]">
                              {m.media_type === 'image' ? (
                                <Image src={m.url} alt={m.alt_text || 'Product image'} fill className="object-cover" sizes="150px" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <span className="text-[10px] text-muted">VIDEO</span>
                                </div>
                              )}
                              {editingProduct.image === m.url && (
                                <div className="absolute top-1 left-1 bg-[#1C1917] text-white text-[8px] px-1.5 py-0.5 font-medium">MAIN</div>
                              )}
                            </div>
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                              <button
                                onClick={() => handleSetMainImage(m.url)}
                                className="w-full text-[9px] bg-white text-foreground px-2 py-1.5 font-medium hover:bg-[#F4F2EE] transition-colors"
                              >
                                Set as Main
                              </button>
                              <button
                                onClick={() => handleDeleteMedia(m.id)}
                                className="w-full text-[9px] bg-red-500 text-white px-2 py-1.5 font-medium hover:bg-red-600 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Variants Tab */}
                {activeTab === 'variants' && editingProduct && (
                  <div className="space-y-4">
                    <div className="bg-[#F8F6F2] p-4 space-y-3 border border-[rgba(28,25,23,0.06)]">
                      <p className={labelCls}>Add New Variant</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className={labelCls}>Diamond Type</label>
                          <select value={newVariant.diamond_type} onChange={(e) => setNewVariant((p) => ({ ...p, diamond_type: e.target.value }))} className={inputCls}>
                            {DIAMOND_TYPES.map((d) => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={labelCls}>Metal</label>
                          <select value={newVariant.metal} onChange={(e) => setNewVariant((p) => ({ ...p, metal: e.target.value }))} className={inputCls}>
                            {METALS.map((m) => <option key={m} value={m}>{m}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={labelCls}>Carat</label>
                          <select value={newVariant.carat} onChange={(e) => setNewVariant((p) => ({ ...p, carat: e.target.value }))} className={inputCls}>
                            {CARAT_OPTIONS.map((c) => <option key={c} value={c}>{c} ct</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={labelCls}>Shape</label>
                          <select value={newVariant.shape} onChange={(e) => setNewVariant((p) => ({ ...p, shape: e.target.value }))} className={inputCls}>
                            {SHAPES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={labelCls}>Setting</label>
                          <select value={newVariant.setting_type} onChange={(e) => setNewVariant((p) => ({ ...p, setting_type: e.target.value }))} className={inputCls}>
                            {SETTINGS.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={labelCls}>Ring Size</label>
                          <select value={newVariant.ring_size} onChange={(e) => setNewVariant((p) => ({ ...p, ring_size: e.target.value }))} className={inputCls}>
                            <option value="">Any</option>
                            {RING_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={labelCls}>Price (NOK)</label>
                          <input type="number" value={newVariant.price} onChange={(e) => setNewVariant((p) => ({ ...p, price: Number(e.target.value) }))} className={inputCls} min="0" />
                        </div>
                        <div>
                          <label className={labelCls}>Stock</label>
                          <input type="number" value={newVariant.stock} onChange={(e) => setNewVariant((p) => ({ ...p, stock: Number(e.target.value) }))} className={inputCls} min="0" />
                        </div>
                        <div className="col-span-2">
                          <label className={labelCls}>SKU</label>
                          <input type="text" value={newVariant.sku} onChange={(e) => setNewVariant((p) => ({ ...p, sku: e.target.value }))} className={inputCls} placeholder="Optional" />
                        </div>
                      </div>
                      <button
                        onClick={handleAddVariant}
                        disabled={variantLoading}
                        className="w-full py-2.5 bg-[#1C1917] text-white text-xs font-medium uppercase tracking-wider hover:bg-[#2C2927] transition-colors disabled:opacity-60"
                      >
                        {variantLoading ? 'Adding...' : '+ Add Variant'}
                      </button>
                    </div>

                    {productVariants.length === 0 ? (
                      <p className="text-xs text-muted text-center py-4">No variants yet. Add one above.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-[rgba(28,25,23,0.06)] bg-[#F8F6F2]">
                              <th className="text-left px-2 py-2 text-[10px] uppercase tracking-wider text-muted">Type</th>
                              <th className="text-left px-2 py-2 text-[10px] uppercase tracking-wider text-muted">Metal</th>
                              <th className="text-left px-2 py-2 text-[10px] uppercase tracking-wider text-muted">Carat</th>
                              <th className="text-left px-2 py-2 text-[10px] uppercase tracking-wider text-muted">Price</th>
                              <th className="text-left px-2 py-2 text-[10px] uppercase tracking-wider text-muted">Stock</th>
                              <th className="px-2 py-2"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {productVariants.map((v) => (
                              <tr key={v.id} className="border-b border-[rgba(28,25,23,0.04)]">
                                <td className="px-2 py-2 text-foreground">{v.diamond_type}</td>
                                <td className="px-2 py-2 text-muted">{v.metal}</td>
                                <td className="px-2 py-2 text-foreground">{v.carat}ct</td>
                                <td className="px-2 py-2 text-foreground">{formatAdminPrice(v.price, displayCurrency)}</td>
                                <td className="px-2 py-2 text-foreground">{v.stock}</td>
                                <td className="px-2 py-2">
                                  <button onClick={() => handleDeleteVariant(v.id)} className="text-[10px] text-red-400 hover:text-red-600 border border-red-200 px-1.5 py-0.5 hover:bg-red-50 transition-colors">
                                    Del
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* SEO Tab */}
                {activeTab === 'seo' && (
                  <div className="space-y-4">
                    <div>
                      <label className={labelCls}>SEO Title</label>
                      <input
                        type="text"
                        value={form.seo_title}
                        onChange={(e) => setForm((p) => ({ ...p, seo_title: e.target.value }))}
                        className={inputCls}
                        placeholder="SEO optimized title"
                        maxLength={60}
                      />
                      <p className="text-[10px] text-muted mt-1">{form.seo_title.length}/60 characters</p>
                    </div>
                    <div>
                      <label className={labelCls}>Meta Description</label>
                      <textarea
                        value={form.seo_description}
                        onChange={(e) => setForm((p) => ({ ...p, seo_description: e.target.value }))}
                        className={inputCls}
                        rows={3}
                        placeholder="Meta description for search engines"
                        maxLength={160}
                      />
                      <p className="text-[10px] text-muted mt-1">{form.seo_description.length}/160 characters</p>
                    </div>
                    <div>
                      <label className={labelCls}>URL Slug</label>
                      <input
                        type="text"
                        value={form.slug}
                        onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                        className={inputCls}
                        placeholder="product-url-slug"
                      />
                      <p className="text-[10px] text-muted mt-1">detara.store/product/{form.slug || 'product-slug'}</p>
                    </div>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="w-full py-3 bg-[#1C1917] text-white text-xs font-medium uppercase tracking-wider hover:bg-[#2C2927] transition-colors disabled:opacity-60"
                    >
                      {saving ? 'Saving...' : '✓ Save SEO Settings'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
