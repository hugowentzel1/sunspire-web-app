import { ReactNode } from 'react';
import { ScaleIn, Rise, FadeIn } from './motion';

interface LushHeroProps {
  title: string;
  subtitle: string;
  badges: string[];
  addressSlot: ReactNode;
  ctaSlot: ReactNode;
}

export function LushHero({ title, subtitle, badges, addressSlot, ctaSlot }: LushHeroProps) {
  return (
    <div className="relative overflow-hidden py-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-app"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-orange-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
      
      <div className="container-premium relative z-10">
        <div className="text-center space-premium">
          {/* Top Emblem */}
          <ScaleIn delay={0.2}>
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[var(--brand)] to-[var(--brand-2)] rounded-full flex items-center justify-center shadow-[0_20px_60px_rgba(255,122,61,0.3)]">
              <span className="text-4xl">☀️</span>
            </div>
          </ScaleIn>

          {/* Title & Subtitle */}
          <Rise delay={0.4}>
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-black text-premium leading-tight">
                {title}
              </h1>
              <p className="text-xl lg:text-2xl text-muted-premium max-w-3xl mx-auto leading-relaxed">
                {subtitle}
              </p>
            </div>
          </Rise>

          {/* Trust Badges */}
          <FadeIn delay={0.6}>
            <div className="flex flex-wrap justify-center gap-3">
              {badges.map((badge, index) => (
                <div key={index} className="chip">
                  <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></div>
                  {badge}
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Address Input Card */}
          <Rise delay={0.8}>
            <div className="glass rounded-[22px] p-8 max-w-2xl mx-auto">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-premium mb-3">
                    Enter your address
                  </label>
                  {addressSlot}
                </div>
                {ctaSlot}
              </div>
            </div>
          </Rise>
        </div>
      </div>
    </div>
  );
}
