"use client";
import Preloader from "@/components/Preloader";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Header from "@/components/Header";
import PrivateMenu from "@/components/PrivateMenu";
import WhatsAppButton from "@/components/WhatsAppButton";
import GateScene from "@/components/GateScene";
import ArrivalSection from "@/components/ArrivalSection";
import TowerSection from "@/components/TowerSection";
import PlanPanel from "@/components/PlanPanel";
import PlanPill from "@/components/PlanPill";
import EnquiryModal from "@/components/EnquiryModal";
import WhyCity from "@/components/sections/WhyCity";
import Everyday from "@/components/sections/Everyday";
import Amenities from "@/components/sections/Amenities";
import Wellness from "@/components/sections/Wellness";
import Nothing from "@/components/sections/Nothing";
import HomeComing from "@/components/sections/HomeComing";
import Neighbourhood from "@/components/sections/Neighbourhood";
import Walkthrough from "@/components/sections/Walkthrough";
import Wordmark from "@/components/sections/Wordmark";
import Enquiry from "@/components/sections/Enquiry";

export default function Home() {
  return (
    <main>
      <div className="grain" aria-hidden />
      <Preloader />
      <SmoothScroll />
      <CustomCursor />
      <Header />
      <PrivateMenu />

      {/* Stage 1–3 */}
      <GateScene />
      <ArrivalSection />
      <TowerSection />

      {/* Stage 4 → story */}
      <WhyCity />
      <Everyday />
      <Amenities />
      <Wellness />
      <Nothing />
      <HomeComing />
      <Neighbourhood />
      <Walkthrough />
      <Wordmark />
      <Enquiry />

      {/* floating layers */}
      <PlanPanel />
      <PlanPill />
      <EnquiryModal />
      <WhatsAppButton />
    </main>
  );
}
