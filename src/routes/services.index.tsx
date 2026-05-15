import { createFileRoute, Link } from '@tanstack/react-router';
import { useLangStore } from '@/store/langStore';
import { useContentStore } from '@/store/contentStore';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Gift, Star, Camera, Music, Cake } from 'lucide-react';

export const Route = createFileRoute('/services/')({ component: ServicesPage });

const STICKER_COLORS = ['bg-coral', 'bg-sun', 'bg-grass', 'bg-sky'] as const;
const TAPE_COLORS = ['washi-coral', '', 'washi-grass', 'washi-sky'] as const;
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  photo: <Camera size={16} />,
  music: <Music size={16} />,
  cake: <Cake size={16} />,
  gift: <Gift size={16} />,
  default: <Sparkles size={16} />,
};

function ServicesPage() {
  const { lang } = useLangStore();
  const { translations } = useContentStore();
  const t = translations[lang];
  const services = (t.services || []) as any[];

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-grass/20 via-cream to-sun/15 border-b-[3px] border-ink/10 px-4 md:px-10 pt-16 pb-14">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(45,51,74,.05) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-grass/15 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-sun/25 blur-2xl" />
        
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-5"
          >
            <span className="self-start inline-block px-4 py-2 bg-grass text-white border-[3px] border-ink rounded-xl text-xs font-black uppercase tracking-wider shadow-sticker -rotate-2">
              {lang === 'ka' ? 'დამატებითი' : 'Extra Magic'}
            </span>
            
            <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-ink leading-[0.85]">
              {t.ui.services || (lang === 'ka' ? 'სერვისები' : 'Services')}
              <span className="text-grass">!</span>
            </h1>
            
            <div className="h-3 w-40 bg-coral rounded-full -rotate-1 border-[2px] border-ink" />
            
            <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed">
              {t.ui.servicesDesc || (lang === 'ka'
                ? 'ფოტო, ვიდეო, დეკორაცია და სხვა სერვისები თქვენი დღესასწაულის უნიკალურობისთვის'
                : 'Photo, video, decoration and other services to make your celebration unique')}
            </p>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-3 mt-2">
              <div className="inline-flex items-center gap-2 bg-white border-[3px] border-ink rounded-2xl px-4 py-2 shadow-sticker">
                <Gift size={18} className="text-grass" />
                <span className="font-bold text-ink">{services.length} {lang === 'ka' ? 'სერვისი' : 'Services'}</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-white border-[3px] border-ink rounded-2xl px-4 py-2 shadow-sticker">
                <Star size={18} className="text-sun fill-sun" />
                <span className="font-bold text-ink">{lang === 'ka' ? 'პრემიუმ ხარისხი' : 'Premium Quality'}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-12 md:py-16">
        {services.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {services.map((s: any, index: number) => (
              <ServiceCard key={s.id} service={s} index={index} lang={lang} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-white border-[3px] border-ink rounded-3xl shadow-sticker-md">
              <Gift size={48} className="mx-auto text-grass mb-4" />
              <h3 className="font-display text-2xl text-ink mb-2">
                {lang === 'ka' ? 'სერვისები მალე დაემატება' : 'Services coming soon'}
              </h3>
              <p className="text-sm text-muted-foreground font-medium">
                {lang === 'ka' ? 'გთხოვთ, მოგვიანებით ეწვიოთ' : 'Please visit us later'}
              </p>
            </div>
          </div>
        )}

        {/* CTA Section */}
        {services.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16 bg-sky border-[3px] border-ink rounded-[2rem] shadow-sticker-xl p-8 md:p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '20px 20px' }} />
            <div className="relative">
              <h2 className="font-display text-3xl md:text-4xl text-white mb-3">
                {lang === 'ka' ? 'გჭირდებათ რამე განსაკუთრებული?' : 'Need something special?'}
              </h2>
              <p className="text-white/90 font-medium mb-6 max-w-md mx-auto">
                {lang === 'ka' 
                  ? 'დაგვიკავშირდით და ჩვენი გუნდი დაგეხმარებათ თქვენი დღესასწაულის უნიკალურ გაფორმებაში!'
                  : 'Contact us and our team will help create your unique celebration!'}
              </p>
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 bg-white text-ink border-[3px] border-ink rounded-2xl px-6 py-3 font-display text-lg shadow-sticker press"
              >
                {lang === 'ka' ? 'დაჯავშნა' : 'Book Now'}
                <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function ServiceCard({ service, index, lang }: { service: any; index: number; lang: string }) {
  const tilt = index % 2 === 0 ? 'hover:-rotate-1' : 'hover:rotate-1';
  const colorClass = STICKER_COLORS[index % STICKER_COLORS.length];
  const tapeClass = TAPE_COLORS[index % TAPE_COLORS.length];
  const categoryIcon = CATEGORY_ICONS[service.iconType || 'default'] || CATEGORY_ICONS.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to="/services/$serviceId" params={{ serviceId: service.id }}>
        <div className={`group relative bg-white border-[3px] border-ink rounded-3xl overflow-hidden shadow-sticker-md transition-all duration-300 ${tilt} hover:shadow-sticker-lg hover:-translate-y-2`}>
          {/* Washi tape decoration */}
          <div className={`washi ${tapeClass} absolute -top-3 left-8 -rotate-6 rounded-sm z-10`} />
          
          {/* Image container */}
          <div className="relative aspect-[4/5] overflow-hidden">
            <img
              src={service.image}
              alt={service.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
            
            {/* Category badge */}
            <div className="absolute top-5 left-5">
              <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 ${colorClass} text-white border-[2px] border-ink rounded-xl text-[11px] font-black uppercase tracking-wider shadow-sticker`}>
                {categoryIcon}
                {service.category}
              </span>
            </div>
            
            {/* Content at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
              <h3 className="font-display text-2xl md:text-3xl text-white leading-tight mb-2 group-hover:text-sun transition-colors">
                {service.name}
              </h3>
              
              <p className="text-white/80 text-sm font-medium line-clamp-2 mb-4 leading-relaxed">
                {service.description}
              </p>
              
              {/* Footer with price and action */}
              <div className="flex items-end justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-xs text-white/60 font-bold uppercase tracking-wider mb-0.5">
                    {lang === 'ka' ? 'ფასი' : 'Price'}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-4xl text-sun">{service.price}</span>
                    <span className="text-white/70 font-bold">GEL</span>
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white border-[3px] border-ink text-ink shadow-sticker group-hover:bg-grass group-hover:text-white transition-colors">
                    <ArrowRight size={22} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
