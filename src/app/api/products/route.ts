import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category_id') || null;
    const subcategoryId = searchParams.get('subcategory_id') || null;
    const searchQuery = searchParams.get('search') || null;
    const featured = searchParams.get('featured') || null;
    const bestseller = searchParams.get('bestseller') || null;
    const limit = searchParams.get('limit') || null;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('[products] Missing Supabase env vars');
      return NextResponse.json({ products: [] }, { status: 500 });
    }

    const headers = {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    };

    // Build query — always filter by is_active=true
    let queryStr = `select=*&is_active=eq.true&order=created_at.asc`;

    // Relational filtering: subcategory_id takes priority, then category_id
    if (subcategoryId) {
      queryStr += `&subcategory_id=eq.${encodeURIComponent(subcategoryId)}`;
    } else if (categoryId) {
      queryStr += `&category_id=eq.${encodeURIComponent(categoryId)}`;
    }

    if (featured === 'true') {
      queryStr += `&is_featured=eq.true`;
    }
    if (bestseller === 'true') {
      queryStr += `&is_bestseller=eq.true`;
    }
    if (limit) {
      queryStr += `&limit=${parseInt(limit, 10)}`;
    }

    const res = await fetch(
      `${supabaseUrl}/rest/v1/products?${queryStr}`,
      { headers, cache: 'no-store' }
    );

    if (!res.ok) {
      console.error('[products] Query failed:', res.status, res.statusText);
      return NextResponse.json({ products: [] }, { status: 500 });
    }

    let products: any[] = await res.json();
    if (!Array.isArray(products)) products = [];

    // Search filter — applied in-memory after DB fetch
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      products = products.filter((p: any) =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.master_product_id && p.master_product_id.toLowerCase().includes(q)) ||
        (p.master_sku && p.master_sku.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.slug && p.slug.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({ products });
  } catch (error) {
    console.error('[products] API route error:', error);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}
