import React, { useState, useEffect } from 'react';
import { useData } from '../context/FirebaseContext';
import { getNavSettings } from '../utils/navSettings';
import HeroSection from '../components/home/HeroSection';
import ExploreBudaya from '../components/home/ExploreBudaya';
import PetaInteraktif from '../components/home/PetaInteraktif';
import BudayaPopuler from '../components/home/BudayaPopuler';
import FeaturedStory from '../components/home/FeaturedStory';
import EventBudaya from '../components/home/EventBudaya';
import KulinerKhas from '../components/home/KulinerKhas';
import KomoditasDaerah from '../components/home/KomoditasDaerah';
import CulturalQuote from '../components/home/CulturalQuote';
import CallToAction from '../components/home/CallToAction';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function HomePage() {
  const { budaya, berita, events, kuliner, kategori, kecamatan, komoditas, loading } = useData();
  const [navVis, setNavVis] = useState(() => getNavSettings());

  useEffect(() => {
    const handleChange = (e) => setNavVis(e.detail || getNavSettings());
    window.addEventListener('bu-nav-settings-changed', handleChange);
    return () => window.removeEventListener('bu-nav-settings-changed', handleChange);
  }, []);

  const isVisible = (key) => !navVis[key] || navVis[key].visible !== false;

  if (loading) {
    return <LoadingSpinner size="lg" text="Memuat Ensiklopedia Budaya Bengkulu Utara..." />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      {isVisible('jelajah') && <ExploreBudaya kategoriData={kategori} />}
      {isVisible('kecamatan') && <PetaInteraktif kecamatanData={kecamatan} budayaData={budaya} />}
      {isVisible('jelajah') && <BudayaPopuler budayaData={budaya} />}
      {isVisible('komoditas') && <KomoditasDaerah komoditasData={komoditas} />}
      {isVisible('berita') && <FeaturedStory beritaData={berita} />}
      {isVisible('event') && <EventBudaya eventsData={events} />}
      {isVisible('kuliner') && <KulinerKhas kulinerData={kuliner} />}
      <CulturalQuote />
      <CallToAction />
    </div>
  );
}
