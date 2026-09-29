import React from 'react';
import { useData } from '../context/FirebaseContext';
import HeroSection from '../components/home/HeroSection';
import ExploreBudaya from '../components/home/ExploreBudaya';
import PetaInteraktif from '../components/home/PetaInteraktif';
import BudayaPopuler from '../components/home/BudayaPopuler';
import FeaturedStory from '../components/home/FeaturedStory';
import EventBudaya from '../components/home/EventBudaya';
import KulinerKhas from '../components/home/KulinerKhas';
import CulturalQuote from '../components/home/CulturalQuote';
import CallToAction from '../components/home/CallToAction';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function HomePage() {
  const { budaya, berita, events, kuliner, kategori, kecamatan, loading } = useData();

  if (loading) {
    return <LoadingSpinner size="lg" text="Memuat Ensiklopedia Budaya Bengkulu Utara..." />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <ExploreBudaya kategoriData={kategori} />
      <PetaInteraktif kecamatanData={kecamatan} budayaData={budaya} />
      <BudayaPopuler budayaData={budaya} />
      <FeaturedStory beritaData={berita} />
      <EventBudaya eventsData={events} />
      <KulinerKhas kulinerData={kuliner} />
      <CulturalQuote />
      <CallToAction />
    </div>
  );
}
