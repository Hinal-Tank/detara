import type { Metadata } from 'next';
import { generateProductMetadata } from './metadata';

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return generateProductMetadata(slug);
}

export default function ProductLayout({ children }: Props) {
  return <>{children}</>;
}
