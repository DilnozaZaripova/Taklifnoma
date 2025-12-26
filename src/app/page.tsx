'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Gift, Image as ImageIcon } from 'lucide-react';
import HeroActions from '@/components/HeroActions';

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <h1 className="text-5xl md:text-7xl font-serif text-[var(--foreground)] leading-tight">
                Baxtli Kuningizni
                <br />
                <span className="text-[var(--primary)]">Raqamlashtiring</span>
              </h1>
              <p className="text-lg md:text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto">
                To'y taklifnomasi, to'yana va xotiralar – barchasi bitta platformada.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <HeroActions />
            </motion.div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 text-[var(--primary)]/20 hidden md:block">
          <Sparkles size={48} />
        </div>
        <div className="absolute bottom-20 right-10 text-[var(--primary)]/20 hidden md:block">
          <Heart size={48} />
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-[var(--foreground)]">
              Nima uchun Taklifnoma?
            </h2>
            <div className="w-20 h-1 bg-[var(--primary)] mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Sparkles className="text-[var(--primary)]" size={32} />}
              title="AI Taklifnoma"
              description="Gemini AI sizning eng hissiy taklifnomangizni yaratadi."
            />
            <FeatureCard
              icon={<Gift className="text-[var(--primary)]" size={32} />}
              title="QR To'yana"
              description="Xavfsiz va shaffof pul sovg'alari yig'ish."
            />
            <FeatureCard
              icon={<ImageIcon className="text-[var(--primary)]" size={32} />}
              title="Media Galereya"
              description="Har bir mehmon nigohidagi lahzalar."
            />
            <FeatureCard
              icon={<Heart className="text-[var(--primary)]" size={32} />}
              title="Real-time Hisobot"
              description="Statistikani dashboarddan kuzating."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[var(--border)] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-serif text-[var(--primary)] mb-2">Taklifnoma</h3>
          <p className="text-sm text-[var(--muted-foreground)]">
            © 2025 Taklifnoma. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </footer>
    </main>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="bg-white p-6 rounded-2xl shadow-md border border-[var(--border)] hover:shadow-lg transition-all duration-300 h-full">
        <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-serif text-[var(--foreground)] mb-2">{title}</h3>
        <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
