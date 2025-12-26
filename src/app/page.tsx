'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Gift, Image as ImageIcon, ArrowRight } from 'lucide-react';
import HeroActions from '@/components/HeroActions';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)] overflow-hidden">
      {/* 
         HERO SECTION 
         Style: Minimalist Vogue Cover 
      */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-12">

            {/* Superline / Overline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center"
            >
              <span className="inline-block px-4 py-1.5 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/5 text-[var(--primary)] text-sm font-medium tracking-widest uppercase">
                Premium Wedding Platform
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="space-y-6"
            >
              <h1 className="text-6xl md:text-8xl font-serif text-[var(--foreground)] leading-[1.1] tracking-tight">
                Baxtli Kuningizni <br />
                <span className="italic text-[var(--primary)] font-light">Raqamlashtiring</span>
              </h1>
              <p className="text-xl md:text-2xl text-[var(--muted-foreground)] max-w-2xl mx-auto font-light leading-relaxed">
                Zamonaviy taklifnomalar, to'yana hisob-kitobi va unutilmas xotiralar — barchasi bitta mukammal platformada.
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <HeroActions />
            </motion.div>
          </div>
        </div>

        {/* Decorative Background Elements (Abstract shapes) */}
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[var(--primary)]/5 rounded-full blur-[100px] -translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[var(--secondary)]/20 rounded-full blur-[120px] translate-x-1/3 pointer-events-none" />

        {/* Floating Icons (Subtle) */}
        <div className="absolute top-32 right-[10%] text-[var(--primary)]/20 animate-pulse hidden lg:block"><Sparkles size={64} strokeWidth={1} /></div>
        <div className="absolute bottom-32 left-[10%] text-[var(--primary)]/10 hidden lg:block"><Heart size={84} strokeWidth={0.5} /></div>
      </section>

      {/* 
         FEATURES SECTION 
         Style: Glassmorphism Grid
      */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm relative z-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20 space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-[var(--foreground)]">
              Nima uchun Taklifnoma?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent mx-auto opacity-50" />
            <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
              Bizning texnologiyalarimiz sizning to'yingizni yanada oson va unutilmas qilish uchun yaratilgan.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Sparkles size={40} strokeWidth={1} />}
              title="AI Taklifnoma"
              description="Navoiydek so'zlovchi sun'iy intellekt siz uchun eng ta'sirli matnlarni yozib beradi."
              delay={0}
            />
            <FeatureCard
              icon={<Gift size={40} strokeWidth={1} />}
              title="QR To'yana"
              description="Mehmonlaringiz uchun qulay va xavfsiz pul o'tkazmalari. Hammasi shaffof."
              delay={0.1}
            />
            <FeatureCard
              icon={<ImageIcon size={40} strokeWidth={1} />}
              title="Media Galereya"
              description="To'y rasmlari va videolari uchun cheksiz bulutli xotira. Barchasini saqlang."
              delay={0.2}
            />
            <FeatureCard
              icon={<Heart size={40} strokeWidth={1} />}
              title="Real-time Hisobot"
              description="Mehmonlar ro'yxati va kelgan to'yanalarni jonli rejimda kuzatib boring."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* 
         WAITLIST / NEWSLETTER FOOTER 
      */}
      <footer className="py-24 border-t border-[var(--border)] px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <h3 className="text-3xl font-serif text-[var(--foreground)]">Taklifnoma</h3>
          <p className="text-[var(--muted-foreground)] max-w-md mx-auto">
            © 2025 Taklifnoma. Muhabbat bilan yaratildi.
          </p>
          <div className="flex justify-center gap-6 text-[var(--muted-foreground)] text-sm uppercase tracking-widest">
            <a href="#" className="hover:text-[var(--primary)] transition-colors">Biz haqimizda</a>
            <a href="#" className="hover:text-[var(--primary)] transition-colors">Yordam</a>
            <a href="#" className="hover:text-[var(--primary)] transition-colors">Maxfiylik</a>
          </div>
        </div>

        {/* Footer Ambient Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-[var(--primary)]/5 blur-[80px] pointer-events-none" />
      </footer>
    </main>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
    >
      <Card hoverEffect className="h-full p-8 flex flex-col items-center text-center space-y-6 bg-white/60">
        <div className="w-16 h-16 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] mb-2">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-serif text-[var(--foreground)] mb-3">{title}</h3>
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed font-light">
            {description}
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
