import type { Metadata } from 'next';
import SinhagadHeritageViewer from '@/components/sinhagad/SinhagadHeritageViewer';

export const metadata: Metadata = {
  title: 'Sinhagad Fort 3D Digital Reconstruction | Pune Darwaza & Terrain | Explore Pune',
  description:
    'Experience an independent, geographically accurate 3D heritage reconstruction of Sinhagad Fort (Kondhana). Explore Pune Darwaza and Sahyadri terrain in first person.',
  keywords: [
    'Sinhagad Fort 3D',
    'Pune Darwaza 3D',
    'Sinhagad Heritage Reconstruction',
    'Maratha Fort Architecture 3D',
    'Copernicus DEM Sinhagad',
    'Explore Pune 3D',
  ],
  openGraph: {
    title: 'Sinhagad Fort 3D Digital Reconstruction | Explore Pune',
    description:
      'Walk through the historical three-gate sequence of Pune Darwaza and the Sahyadri basalt cliffs at Sinhagad Fort in full 3D.',
    images: ['/images/places/sinhagad-fort.jpg'],
  },
};

export default function SinhagadPage() {
  return (
    <main className="w-full min-h-[calc(100vh-72px)] overflow-hidden bg-slate-950">
      <SinhagadHeritageViewer />
    </main>
  );
}
