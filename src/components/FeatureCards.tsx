import React from 'react';
import {
  Landmark,
  Users,
  MailOpen,
  Camera,
  Wallet,
  CalendarDays,
  ArrowUpRight,
} from 'lucide-react';
import { FeatureCardItem, NavSectionId } from '../types/utsav';

interface FeatureCardsProps {
  cards: FeatureCardItem[];
  onSelectCard: (card: FeatureCardItem) => void;
}

const ICON_MAP: Record<NavSectionId, React.ComponentType<{ className?: string }>> = {
  venues: Landmark,
  manpower: Users,
  invitations: MailOpen,
  photos: Camera,
  budget: Wallet,
  timeline: CalendarDays,
  dashboard: Landmark,
  events: CalendarDays,
  'shubh-ai': Landmark,
  profile: Users,
  settings: CalendarDays,
};

export const FeatureCards: React.FC<FeatureCardsProps> = ({
  cards,
  onSelectCard,
}) => {
  return (
    <section
      aria-labelledby="features-heading"
      className="mx-auto max-w-5xl pb-12"
    >
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h2
          id="features-heading"
          className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-[#24161A] dark:text-[#F9F2EC]"
        >
          Everything for your event, in one place.
        </h2>
        <span className="text-xs sm:text-sm text-[#7A6369] dark:text-[#B09EA3]">
          Click any workspace module to preview
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {cards.map((card) => {
          const Icon = ICON_MAP[card.id];

          const iconWellStyles =
            card.accent === 'marigold'
              ? 'bg-[#FDF1D6] text-[#9E6800] dark:bg-[#332510] dark:text-[#F2B84B]'
              : card.accent === 'maroon'
              ? 'bg-[#F8E1E7] text-[#7A1F3D] dark:bg-[#361A25] dark:text-[#F39DB4]'
              : 'bg-[#FAEAF0] text-[#8E2A4B] dark:bg-[#2F1D26] dark:text-[#F8C7D4]';

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => onSelectCard(card)}
              className="group relative flex flex-col justify-between rounded-2xl border border-[#EAE0D5] dark:border-[#322528] bg-white dark:bg-[#1D1618] p-5 sm:p-6 text-left transition-all duration-200 hover:-translate-y-1 hover:border-[#E8A317]/80 hover:shadow-[0_12px_28px_rgba(122,31,61,0.08)] dark:hover:shadow-[0_12px_28px_rgba(0,0,0,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A317]"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${iconWellStyles}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-[#A99298] dark:text-[#7D6B70] opacity-70 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#7A1F3D] dark:group-hover:text-[#E8A317] group-hover:opacity-100" />
                </div>

                <h3 className="mt-4 font-serif text-lg font-semibold text-[#24161A] dark:text-[#F9F2EC]">
                  {card.title}
                </h3>

                <p className="mt-1.5 text-sm text-[#634E54] dark:text-[#B8A7AC] leading-relaxed">
                  {card.description}
                </p>
              </div>

              <p className="mt-4 pt-3.5 border-t border-[#F4ECE3] dark:border-[#2C2124] text-xs font-medium text-[#856D73] dark:text-[#9E8B90]">
                {card.meta}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
};
