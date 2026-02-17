export interface BabyProfile {
    id: string;
    user_id: string;
    name: string;
    birth_date: string; // ISO date string YYYY-MM-DD
    gender: 'boy' | 'girl' | 'neutral';
    relationship: string;
    created_at?: string;
}

export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    image_url: string;
    category_id: string;
    category: string; // Name
    stock: number;
    slug: string;
    colors?: string[];
    sizes?: string[];
    images?: string[];
    specifications?: Record<string, string>;

    // Phase 13 Extensions
    min_age_months?: number;
    max_age_months?: number;
    certifications?: string[]; // JSONB array
}
