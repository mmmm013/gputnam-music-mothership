import dynamic from 'next/dynamic';

const MipInner = dynamic(
  () => import('../components/MipInner'),
  { ssr: false }
);

export default function UruPage() {
  return <MipInner />;
}
