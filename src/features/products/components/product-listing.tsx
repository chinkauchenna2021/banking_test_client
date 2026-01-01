import { searchParamsCache } from '@/lib/searchparams';
import { ProductTable } from './product-tables';
import { columns } from './product-tables/columns';

// Temporary type until server products API is implemented
export type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  photo_url?: string;
  created_at?: string;
  updated_at?: string;
};

type ProductListingPage = {};

export default async function ProductListingPage({}: ProductListingPage) {
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');
  const categories = searchParamsCache.get('category');

  // No mock data. Display empty state when no server endpoint is available.
  const totalProducts = 0;
  const products: Product[] = [];

  return (
    <ProductTable
      data={products}
      totalItems={totalProducts}
      columns={columns}
    />
  );
}
