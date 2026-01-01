import { notFound } from 'next/navigation';
import ProductForm from './product-form';

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

type TProductViewPageProps = {
  productId: string;
};

export default async function ProductViewPage({
  productId
}: TProductViewPageProps) {
  let product: Product | null = null;
  let pageTitle = 'Create New Product';

  if (productId !== 'new') {
    // No mock fetch; if server provides products, fetch here.
    // For now, show 404 for non-new until API exists.
    notFound();
  }

  return <ProductForm initialData={product} pageTitle={pageTitle} />;
}
