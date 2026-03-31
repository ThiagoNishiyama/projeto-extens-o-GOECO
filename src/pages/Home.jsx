import React from "react";
import HeroSection from "@/components/home/HeroSection";
import ProblemSection from "@/components/home/ProblemSection";
import SolutionSection from "@/components/home/SolutionSection";
import TeamSection from "@/components/home/TeamSection";
import BenefitsSection from "@/components/home/BenefitsSection";
import FooterSection from "@/components/home/FooterSection";
import EducationSection from "@/components/home/EducationSection";
import RoadmapSection from "@/components/home/RoadmapSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <EducationSection />
      <BenefitsSection />
      <RoadmapSection />
      <TeamSection />
      <FooterSection />
    </div>
  );
}