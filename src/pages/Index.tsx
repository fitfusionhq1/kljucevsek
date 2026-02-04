import HeroSection from '@/components/HeroSection';
import CountdownSection from '@/components/CountdownSection';
import EventDetails from '@/components/EventDetails';
import GiftRegistry from '@/components/GiftRegistry';
import RSVPSection from '@/components/RSVPSection';
import Footer from '@/components/Footer';
import GallerySection from "@/components/GallerySection";
const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <CountdownSection />
      <GallerySection />
      <EventDetails />
      <GiftRegistry />
      <RSVPSection />
      <Footer />
    </div>
  );
};

export default Index;
