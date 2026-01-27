import dynamic from 'next/dynamic';
import Footer from '@/components/Footer';

const ClientPage = dynamic(() => import('./ClientPage'), {
  ssr: false,
});

export default function Page() {
  return (
    <>
      <ClientPage />
      <Footer />
    </>
  );
}
