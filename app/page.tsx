import dynamic from 'next/dynamic';

const ClientPage = dynamic(() => import@/app/ClientPageClientPage'), {
  ssr: false,
});

export default function Page() {
  return (
    <>
      <ClientPage />
       /    
  );
  );
}
