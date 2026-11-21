import React, { useEffect } from 'react';
import { X, ArrowRight, Sun, Moon, Landmark, Pencil, Plus, LogOut } from 'lucide-react';
import { GENERATED_IMAGES } from '../data/mockUtsavData';
import {
  EventProfile,
  FeatureCardItem,
  NavSectionId,
  UserProfile,
} from '../types/utsav';
import {
  calculateDaysRemaining,
  formatEventDate,
  formatINRCompact,
  formatINRFull,
} from '../utils/eventUtils';

interface ModulePreviewModalProps {
  activeSection: NavSectionId | null;
  featureCards: FeatureCardItem[];
  selectedEvent: EventProfile;
  user: UserProfile;
  isDark: boolean;
  onToggleTheme: () => void;
  onEditEvent: () => void;
  onCreateNewEvent: () => void;
  onSignOut: () => void;
  onClose: () => void;
  onUsePromptInShubh: (promptText: string) => void;
}

export const ModulePreviewModal: React.FC<ModulePreviewModalProps> = ({
  activeSection,
  featureCards,
  selectedEvent,
  user,
  isDark,
  onToggleTheme,
  onEditEvent,
  onCreateNewEvent,
  onSignOut,
  onClose,
  onUsePromptInShubh,
}) => {
  useEffect(() => {
    if (!activeSection) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [activeSection, onClose]);

  if (!activeSection) return null;

  const matchedFeature = featureCards.find((c) => c.id === activeSection);
  const daysLeft = Math.max(0, calculateDaysRemaining(selectedEvent.eventDate));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="fixed inset-0 bg-[#1B1014]/50 backdrop-blur-[3px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-[#EAE0D5] dark:border-[#382B2E] bg-[#FFFBF5] dark:bg-[#1B1416] text-[#24161A] dark:text-[#F9F2EC] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-[#EFE4D8] dark:border-[#2E2225] px-6 py-4">
          <div className="min-w-0">
            <h3
              id="modal-title"
              className="font-serif text-xl font-semibold truncate"
            >
              {matchedFeature
                ? matchedFeature.title
                : activeSection === 'events'
                ? 'My Events'
                : activeSection === 'profile'
                ? 'Planner Profile'
                : 'Workspace Settings'}
            </h3>
            <p className="text-xs text-[#7A6369] dark:text-[#A9969B] truncate">
              {selectedEvent.eventName} · {selectedEvent.city}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#7A6369] hover:bg-[#F5ECE2] hover:text-[#24161A] dark:text-[#A9969B] dark:hover:bg-[#2A2023] dark:hover:text-[#F9F2EC] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {matchedFeature ? (
            <>
              {matchedFeature.image && (
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-[#EDE2D6] dark:border-[#322528] bg-[#F6ECE1] dark:bg-[#261D20]">
                  <img
                    src={matchedFeature.image}
                    alt={matchedFeature.imageAlt || matchedFeature.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 -z-10 flex items-center justify-center">
                    <Landmark className="h-8 w-8 text-[#7A1F3D]/40" />
                  </div>
                </div>
              )}

              <p className="text-sm text-[#5A474C] dark:text-[#C5B5B9] leading-relaxed">
                {matchedFeature.description}
              </p>

              {/* Show full auto-calculated budget allocation inside Budget & Payments */}
              {matchedFeature.id === 'budget' ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-medium text-[#7A6369] dark:text-[#A9969B]">
                    <span>Automatic budget allocation</span>
                    <span className="tabular-nums">
                      Total: {formatINRFull(selectedEvent.totalBudget)} ({formatINRFull(selectedEvent.budgetPerGuest)} / guest)
                    </span>
                  </div>
                  <div className="divide-y divide-[#EFE4D8] dark:divide-[#2D2124] rounded-xl border border-[#EAE0D5] dark:border-[#322528] bg-white dark:bg-[#22191C]">
                    {selectedEvent.budgetAllocation.map((row) => (
                      <div
                        key={row.category}
                        className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm"
                      >
                        <span className="font-medium text-[#24161A] dark:text-[#F9F2EC]">
                          {row.category}
                        </span>
                        <span className="text-xs text-[#6E585E] dark:text-[#B09EA3] tabular-nums">
                          {row.percentage}% · {formatINRFull(row.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-[#EFE4D8] dark:divide-[#2D2124] rounded-xl border border-[#EAE0D5] dark:border-[#322528] bg-white dark:bg-[#22191C]">
                  {matchedFeature.highlights.map((row) => (
                    <div
                      key={row.label}
                      className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"
                    >
                      <span className="font-medium text-[#24161A] dark:text-[#F9F2EC]">
                        {row.label}
                      </span>
                      <span className="text-xs text-[#6E585E] dark:text-[#B09EA3] tabular-nums">
                        {row.detail}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-[#E5D8CB] dark:border-[#35282B] px-4 py-2 text-sm font-medium text-[#5A474C] dark:text-[#D3C4C8] hover:bg-[#F5ECE2] dark:hover:bg-[#281F22] transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUsePromptInShubh(matchedFeature.suggestedPrompt);
                    onClose();
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#7A1F3D] dark:bg-[#E8A317] px-4 py-2 text-sm font-medium text-[#FFFBF5] dark:text-[#1D1316] hover:bg-[#641730] dark:hover:bg-[#D49212] transition-colors"
                >
                  <span>Ask Shubh AI about this</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : activeSection === 'events' ? (
            <div className="space-y-4">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-[#EDE2D6] dark:border-[#322528] bg-[#F6ECE1] dark:bg-[#261D20]">
                <img
                  src={GENERATED_IMAGES.venueUdaipur}
                  alt={selectedEvent.eventName}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="space-y-1.5">
                <p className="font-serif text-xl font-semibold">
                  {selectedEvent.eventName}
                </p>
                <p className="text-sm text-[#6E585E] dark:text-[#B4A2A7]">
                  {selectedEvent.eventType} · Hosted by {selectedEvent.hostNames}
                </p>
                <p className="text-xs text-[#7A6369] dark:text-[#A9969B] tabular-nums">
                  {formatEventDate(selectedEvent.eventDate)} ({daysLeft} days left) · {selectedEvent.city} · {selectedEvent.venuePreference}
                </p>
              </div>

              <div className="divide-y divide-[#EFE4D8] dark:divide-[#2D2124] rounded-xl border border-[#EAE0D5] dark:border-[#322528] bg-white dark:bg-[#22191C] text-xs">
                <div className="flex justify-between px-4 py-2.5">
                  <span className="text-[#7A6369] dark:text-[#A9969B]">Budget &amp; Guests</span>
                  <span className="font-medium tabular-nums">
                    {formatINRCompact(selectedEvent.totalBudget)} · {selectedEvent.guestCount} guests ({formatINRFull(selectedEvent.budgetPerGuest)}/guest)
                  </span>
                </div>
                <div className="flex justify-between px-4 py-2.5">
                  <span className="text-[#7A6369] dark:text-[#A9969B]">Style &amp; Dining</span>
                  <span className="font-medium">
                    {selectedEvent.eventStyle} · {selectedEvent.foodPreference}
                  </span>
                </div>
                <div className="flex justify-between px-4 py-2.5">
                  <span className="text-[#7A6369] dark:text-[#A9969B]">Top Priorities</span>
                  <span className="font-medium">
                    {selectedEvent.priorities.join(', ')}
                  </span>
                </div>
                {selectedEvent.weddingFunctions.length > 0 && (
                  <div className="flex justify-between px-4 py-2.5">
                    <span className="text-[#7A6369] dark:text-[#A9969B]">Functions</span>
                    <span className="font-medium">
                      {selectedEvent.weddingFunctions.join(' · ')}
                    </span>
                  </div>
                )}
              </div>

              {selectedEvent.notes && (
                <p className="rounded-xl border border-[#EAE0D5] dark:border-[#322528] bg-[#FFF9F0] dark:bg-[#221A1D] p-3 text-xs text-[#5A474C] dark:text-[#C5B5B9]">
                  Notes: {selectedEvent.notes}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onCreateNewEvent();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5D8CB] dark:border-[#35282B] px-3.5 py-2 text-xs font-medium hover:border-[#E8A317] transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Create New Event</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEditEvent();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#7A1F3D] dark:bg-[#E8A317] px-4 py-2 text-xs font-medium text-[#FFFBF5] dark:text-[#1D1316] hover:bg-[#641730] dark:hover:bg-[#D49212] transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  <span>Edit Event</span>
                </button>
              </div>
            </div>
          ) : activeSection === 'profile' ? (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <img
                  src={GENERATED_IMAGES.avatarGaurav}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="h-16 w-16 rounded-full object-cover border border-[#E5D8CB] dark:border-[#382B2E]"
                />
                <div>
                  <p className="font-serif text-lg font-semibold">{user.name}</p>
                  <p className="text-sm text-[#6E585E] dark:text-[#B4A2A7]">
                    {user.email}
                  </p>
                  <p className="mt-1 text-xs text-[#7A1F3D] dark:text-[#E8A317]">
                    {user.authMode === 'guest' ? 'Guest session · Saved locally' : 'Planner account · Saved locally'}
                  </p>
                </div>
              </div>

              <div className="flex justify-end border-t border-[#EFE4D8] dark:border-[#2E2225] pt-4">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSignOut();
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#E5D8CB] dark:border-[#382B2E] px-4 py-2 text-xs font-medium text-[#7A1F3D] dark:text-[#F29FB6] hover:bg-[#F8E1E7]/60 dark:hover:bg-[#321B24] transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-[#EAE0D5] dark:border-[#322528] bg-white dark:bg-[#22191C] p-4">
                <div>
                  <p className="text-sm font-medium">Appearance</p>
                  <p className="text-xs text-[#6E585E] dark:text-[#B09EA3]">
                    Switch between warm ivory light mode and evening dark mode.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onToggleTheme}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#E5D8CB] dark:border-[#382B2E] bg-[#FFFBF5] dark:bg-[#191315] px-3.5 py-2 text-xs font-medium hover:border-[#E8A317] transition-colors"
                >
                  {isDark ? (
                    <>
                      <Sun className="h-4 w-4 text-[#E8A317]" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4 text-[#7A1F3D]" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
