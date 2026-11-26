import { getPanchang, getFestivals } from "@/lib/api";
import CitySelect from "@/components/CitySelect";
import WelcomeHero from "@/components/home/WelcomeHero";
import QuickActions from "@/components/home/QuickActions";
import PanchangSection from "@/components/home/PanchangSection";
import UpcomingVrats from "@/components/home/UpcomingVrats";
import HoroscopeSection from "@/components/home/HoroscopeSection";
import UpcomingEvents from "@/components/home/UpcomingEvents";

export default async function HomePage() {
  const [panchangResult, festivalsResult] = await Promise.allSettled([
    getPanchang("Jaipur"),
    getFestivals(),
  ]);

  
  const panchang =
    panchangResult.status === "fulfilled" ? panchangResult.value : null;
  const festivals =
    festivalsResult.status === "fulfilled" && Array.isArray(festivalsResult.value)
      ? festivalsResult.value.slice(0, 3)
      : [];

 

  return (
    <main className="min-h-screen bg-[#FFFCF5] text-[#3F211B]">
      <div className="mx-auto w-full max-w-[1440px] space-y-10 px-4 py-5 sm:space-y-12 sm:px-6 sm:py-8 lg:px-10">
        <WelcomeHero  citySelect={<CitySelect initialCity={panchang?.city || "Jaipur"} />} />
        <QuickActions />
        <PanchangSection panchang={panchang} festivals={festivals} />
        <UpcomingVrats />
        <HoroscopeSection />
        <UpcomingEvents />
        <p className="pb-5 text-center text-xs leading-6 text-[#92766A] sm:text-sm">
          पंचांग और शुभ समय स्थान एवं परंपरा के अनुसार अलग-अलग हो सकते हैं।
          महत्वपूर्ण धार्मिक निर्णय से पहले स्थानीय पंचांग से पुष्टि करें।
        </p>
      </div>
    </main>
  );
}
