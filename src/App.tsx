import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FirewoodCarousel } from './components/FirewoodCarousel';
import { StereCalculator } from './components/StereCalculator';
import { Catalog } from './components/Catalog';
import { TrustAndLogistics } from './components/TrustAndLogistics';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { InvoiceModal } from './components/InvoiceModal';
import { TrackingModal } from './components/TrackingModal';
import { TrackOrderSearchModal } from './components/TrackOrderSearchModal';
import { AuthModal } from './components/AuthModal';
import { UserDashboardModal } from './components/UserDashboardModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { BespokeNotification } from './components/BespokeNotification';

const MainLayout: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLength, setSelectedLength] = useState('all');
  const [isOrderLookupOpen, setIsOrderLookupOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
      {/* Bespoke Luxury Notification System */}
      <BespokeNotification />

      {/* Header */}
      <Header
        onOpenOrderLookup={() => setIsOrderLookupOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main E-commerce View */}
      <main className="flex-1">
        {/* Direct Hero Banner */}
        <Hero
          onSelectLength={(len) => setSelectedLength(len)}
          selectedLength={selectedLength}
        />

        {/* Dynamic Firewood Lots Carousel */}
        <FirewoodCarousel />

        {/* Interactive Stere Calculator */}
        <StereCalculator onSelectLength={(len) => setSelectedLength(len)} />

        {/* Central Products Catalog */}
        <Catalog
          selectedLength={selectedLength}
          setSelectedLength={setSelectedLength}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Established Credibility, Moffett Logistics & Reviews */}
        <TrustAndLogistics />
      </main>

      {/* FAQ Section */}
      <FaqSection />

      {/* Footer */}
      <Footer onNavigate={() => {}} />

      {/* Modals & Flow Components */}
      <CartDrawer />
      <CheckoutModal />
      <InvoiceModal />
      <TrackingModal />
      <TrackOrderSearchModal
        isOpen={isOrderLookupOpen}
        onClose={() => setIsOrderLookupOpen(false)}
      />
      <AuthModal />
      <UserDashboardModal />
      <ProductDetailModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
