import type { Metadata } from 'next';
import { SinhagadExperienceContainer } from '@/components/games/sinhagad/SinhagadExperienceContainer';

export const metadata: Metadata = {
  title: 'Sinhagad Fort 3D Walkable Simulation & 2D Exploration | Explore Pune',
  description:
    'Real architectural 3D reconstruction and walkable simulation of Sinhagad Fort (Kondhana), Pune, Maharashtra. Built to true metric scale based on official archaeological records and GIS data.',
  keywords: [
    'Sinhagad Fort 3D Simulation',
    'Sinhagad Walkable 3D Tour',
    'Pune Darwaza 3D',
    'Kalyan Darwaza 3D',
    'Tanaji Kada 3D',
    'Devtake Cisterns',
    'Explore Pune Sinhagad 3D',
    'Maratha Fort Architecture 3D',
    'Sinhagad Archaeological Reconstruction',
  ],
  openGraph: {
    title: 'Sinhagad Fort 3D Walkable Simulation | Explore Pune',
    description:
      'Step into the authentic 17th-century Maratha hill citadel of Sinhagad. Walk through Pune Darwaza, explore the battlements, and examine historical landmarks in full 3D metric scale.',
    images: ['/images/places/sinhagad-fort.jpg'],
  },
};

export default function SinhagadExperiencePage() {
  return <SinhagadExperienceContainer />;
}
