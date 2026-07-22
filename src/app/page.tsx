import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSlider from "@/components/HeroSlider";
import DimensionShowcase from "@/components/DimensionShowcase";
import ZoomStatement from "@/components/ZoomStatement";
import FrameDetail from "@/components/FrameDetail";
import WarrantyBadge from "@/components/WarrantyBadge";
import InstagramReels from "@/components/InstagramReels";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-white text-[var(--color-primary)]">
      <Header />

      <main className="flex-1">
        <HeroSlider />

        {/* Brand statement — scroll-driven zoom through the headline into a
            material texture. Comes right after the hero so the emotional
            "why we exist" hook lands before the functional "how it works"
            demo — and so page order matches nav order (브랜드 앞, 맞춤 제작
            다음). See ZoomStatement.tsx for the pin/scale mechanics. */}
        <ZoomStatement />

        {/* Dimension showcase — autoplaying width/depth/height video. */}
        <DimensionShowcase />

        {/* Material detail — pinned video that starts paused and plays once
            the visitor scrolls in, with three detail callouts staggered on
            top. See FrameDetail.tsx for the pin/play mechanics. */}
        <FrameDetail />

        {/* Warranty trust badge — big count-up statement bridging the
            material detail section and the Instagram proof section. */}
        <WarrantyBadge />

        {/* Instagram reels — official oEmbed widget, real posts from
            instagram.com/indeup.kr. */}
        <InstagramReels />
      </main>

      <Footer />
    </div>
  );
}
