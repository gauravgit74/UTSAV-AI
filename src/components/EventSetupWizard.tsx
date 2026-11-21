import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Check,
  IndianRupee,
  MapPin,
  Sparkles,
  Sun,
  Moon,
  Users,
  X,
} from 'lucide-react';
import {
  EventPriority,
  EventProfile,
  EventStyle,
  EventType,
  FoodPreference,
  UserProfile,
  VenuePreference,
  WeddingFunction,
} from '../types/utsav';
import {
  calculateBudgetAllocation,
  calculateDaysRemaining,
  computeInitialPlanningProgress,
  formatEventDate,
  formatINRCompact,
  formatINRFull,
  getDefaultFunctionsForType,
  getTomorrowISO,
} from '../utils/eventUtils';

interface EventSetupWizardProps {
  user: UserProfile;
  initialEvent: EventProfile | null;
  canCancel: boolean;
  isDark: boolean;
  onToggleTheme: () => void;
  onComplete: (event: EventProfile) => void;
  onCancel?: () => void;
}

const EVENT_TYPES: EventType[] = [
  'Wedding',
  'Engagement',
  'Birthday',
  'Anniversary',
  'Corporate Event',
  'Baby Shower',
  'Other',
];

const WEDDING_FUNCTIONS: WeddingFunction[] = [
  'Haldi',
  'Mehendi',
  'Sangeet',
  'Wedding',
  'Reception',
];

const VENUE_PREFERENCES: VenuePreference[] = [
  'Banquet Hall',
  'Hotel',
  'Lawn/Outdoor',
  'Beach',
  'Heritage Property',
  'Home',
];

const POPULAR_CITIES = [
  'Udaipur',
  'Mumbai',
  'Jaipur',
  'Delhi NCR',
  'Goa',
  'Bengaluru',
];

const EVENT_STYLES: EventStyle[] = [
  'Traditional',
  'Modern',
  'Minimal',
  'Royal',
  'Boho',
  'Destination',
];

const FOOD_PREFERENCES: FoodPreference[] = ['Veg', 'Non-veg', 'Both', 'Jain'];

const EVENT_PRIORITIES: EventPriority[] = [
  'Venue',
  'Food',
  'Decor',
  'Photography',
  'Entertainment',
  'Attire',
  'Guest Experience',
];

const STEP_LABELS = [
  { step: 1, title: 'Event Details' },
  { step: 2, title: 'Date & Location' },
  { step: 3, title: 'Budget & Guests' },
  { step: 4, title: 'Preferences' },
];

export const EventSetupWizard: React.FC<EventSetupWizardProps> = ({
  user,
  initialEvent,
  canCancel,
  isDark,
  onToggleTheme,
  onComplete,
  onCancel,
}) => {
  const isEditing = Boolean(initialEvent);
  const tomorrowISO = useMemo(() => getTomorrowISO(), []);

  const [step, setStep] = useState(1);

  // Step 1
  const [eventType, setEventType] = useState<EventType>(
    initialEvent?.eventType ?? 'Wedding'
  );
  const [eventName, setEventName] = useState(initialEvent?.eventName ?? '');
  const [hostNames, setHostNames] = useState(
    initialEvent?.hostNames ?? (user.authMode === 'guest' ? '' : user.name)
  );
  const [functionsCount, setFunctionsCount] = useState<number>(
    initialEvent?.functionsCount ?? 3
  );
  const [weddingFunctions, setWeddingFunctions] = useState<WeddingFunction[]>(
    initialEvent?.weddingFunctions ?? getDefaultFunctionsForType('Wedding')
  );

  // Step 2
  const [eventDate, setEventDate] = useState(initialEvent?.eventDate ?? '');
  const [city, setCity] = useState(initialEvent?.city ?? '');
  const [venuePreference, setVenuePreference] = useState<VenuePreference>(
    initialEvent?.venuePreference ?? 'Heritage Property'
  );

  // Step 3
  const [totalBudget, setTotalBudget] = useState<number>(
    initialEvent?.totalBudget ?? 1500000
  );
  const [guestCount, setGuestCount] = useState<number>(
    initialEvent?.guestCount ?? 200
  );

  // Step 4
  const [eventStyle, setEventStyle] = useState<EventStyle>(
    initialEvent?.eventStyle ?? 'Royal'
  );
  const [foodPreference, setFoodPreference] = useState<FoodPreference>(
    initialEvent?.foodPreference ?? 'Both'
  );
  const [priorities, setPriorities] = useState<EventPriority[]>(
    initialEvent?.priorities ?? ['Venue', 'Food', 'Decor']
  );
  const [notes, setNotes] = useState(initialEvent?.notes ?? '');

  const [error, setError] = useState<string | null>(null);

  const daysRemaining = useMemo(
    () => calculateDaysRemaining(eventDate),
    [eventDate]
  );

  const budgetPerGuest = useMemo(() => {
    if (!guestCount || guestCount <= 0 || !totalBudget || totalBudget <= 0) {
      return 0;
    }
    return Math.round(totalBudget / guestCount);
  }, [totalBudget, guestCount]);

  const liveBudgetSplit = useMemo(
    () => calculateBudgetAllocation(totalBudget, eventType, priorities),
    [totalBudget, eventType, priorities]
  );

  const handleSelectEventType = (nextType: EventType) => {
    setEventType(nextType);
    if (nextType === 'Wedding') {
      if (weddingFunctions.length === 0) {
        const defaults = getDefaultFunctionsForType('Wedding');
        setWeddingFunctions(defaults);
        setFunctionsCount(defaults.length);
      }
    } else {
      setWeddingFunctions([]);
      if (functionsCount > 2 && !initialEvent) {
        setFunctionsCount(1);
      }
    }
    setError(null);
  };

  const toggleWeddingFunction = (fn: WeddingFunction) => {
    setWeddingFunctions((prev) => {
      const exists = prev.includes(fn);
      const next = exists ? prev.filter((item) => item !== fn) : [...prev, fn];
      if (next.length > 0) {
        setFunctionsCount(next.length);
      }
      return next;
    });
    setError(null);
  };

  const togglePriority = (priority: EventPriority) => {
    setError(null);
    setPriorities((prev) => {
      if (prev.includes(priority)) {
        return prev.filter((p) => p !== priority);
      }
      if (prev.length >= 3) {
        setError('You can select up to 3 top priorities. Deselect one to swap.');
        return prev;
      }
      return [...prev, priority];
    });
  };

  const validateStep = (targetStep: number): boolean => {
    setError(null);
    if (targetStep === 1) {
      if (!eventName.trim()) {
        setError('Please enter an event name.');
        return false;
      }
      if (!hostNames.trim()) {
        setError('Please enter the host name(s).');
        return false;
      }
      if (!functionsCount || functionsCount < 1) {
        setError('Number of functions/days must be at least 1.');
        return false;
      }
      if (eventType === 'Wedding' && weddingFunctions.length === 0) {
        setError('Please select at least one wedding function.');
        return false;
      }
      return true;
    }

    if (targetStep === 2) {
      if (!eventDate) {
        setError('Please select an event date.');
        return false;
      }
      if (calculateDaysRemaining(eventDate) <= 0) {
        setError('Event date must be in the future (from tomorrow onwards).');
        return false;
      }
      if (!city.trim()) {
        setError('Please enter a city for the event.');
        return false;
      }
      return true;
    }

    if (targetStep === 3) {
      if (!totalBudget || totalBudget < 10000) {
        setError('Please enter a total budget of at least ₹10,000.');
        return false;
      }
      if (!guestCount || guestCount < 1) {
        setError('Expected guest count must be at least 1.');
        return false;
      }
      return true;
    }

    if (targetStep === 4) {
      if (priorities.length === 0) {
        setError('Please select at least 1 priority (up to 3).');
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;
    setStep((prev) => Math.min(4, prev + 1));
  };

  const handleBack = () => {
    setError(null);
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    const progress = computeInitialPlanningProgress({
      weddingFunctions: eventType === 'Wedding' ? weddingFunctions : [],
      notes,
      priorities,
    });

    const nowISO = new Date().toISOString();
    const completedEvent: EventProfile = {
      id: initialEvent?.id ?? `event-${Date.now()}`,
      eventType,
      eventName: eventName.trim(),
      hostNames: hostNames.trim(),
      functionsCount,
      weddingFunctions: eventType === 'Wedding' ? weddingFunctions : [],
      eventDate,
      city: city.trim(),
      venuePreference,
      totalBudget,
      guestCount,
      budgetPerGuest,
      eventStyle,
      foodPreference,
      priorities,
      notes: notes.trim(),
      budgetAllocation: liveBudgetSplit,
      completionPercent: initialEvent?.completionPercent ?? progress.completionPercent,
      completedMilestones:
        initialEvent?.completedMilestones ?? progress.completedMilestones,
      totalMilestones: initialEvent?.totalMilestones ?? progress.totalMilestones,
      createdAt: initialEvent?.createdAt ?? nowISO,
      updatedAt: nowISO,
    };

    onComplete(completedEvent);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFBF5] text-[#24161A] dark:bg-[#140F11] dark:text-[#F9F2EC] transition-colors duration-200">
      {/* Header */}
      <header className="border-b border-[#EFE4D8] dark:border-[#2B2023] bg-[#FFFBF5]/90 dark:bg-[#140F11]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4 sm:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#7A1F3D] to-[#561329] text-[#FFFBF5] shadow-sm">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 3c2.2 3.2 2.2 6.8 0 10-2.2-3.2-2.2-6.8 0-10Z" />
                <path d="M12 13c3.5-2.6 6.8-2.2 8.5.4-2.8 1.9-6.2 1.8-8.5-.4Z" />
                <path d="M12 13c-3.5-2.6-6.8-2.2-8.5.4 2.8 1.9 6.2 1.8 8.5-.4Z" />
                <path
                  d="M7 18.5c3.2 1.4 6.8 1.4 10 0"
                  className="text-[#E8A317]"
                  stroke="currentColor"
                />
              </svg>
            </div>
            <div>
              <span className="font-serif text-lg font-semibold tracking-tight">
                Utsav <span className="text-[#7A1F3D] dark:text-[#E8A317]">AI</span>
              </span>
              <p className="text-[11px] text-[#7A6369] dark:text-[#A9969B]">
                {isEditing ? 'Update celebration blueprint' : 'Celebration setup'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {canCancel && onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#E5D8CB] dark:border-[#35282B] px-3 text-xs font-medium text-[#5A474C] dark:text-[#D3C4C8] hover:border-[#7A1F3D] hover:text-[#7A1F3D] dark:hover:border-[#E8A317] dark:hover:text-[#F9F2EC] transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                <span>Cancel</span>
              </button>
            )}
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E8DCD0] dark:border-[#35282B] bg-white dark:bg-[#1E1719] text-[#533F45] dark:text-[#E8A317] hover:border-[#E8A317] transition-colors"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Wizard Container */}
      <main className="flex-1 px-4 py-8 sm:px-8 sm:py-10">
        <div className="mx-auto max-w-3xl">
          {/* Progress Indicator */}
          <div className="mb-7">
            <div className="flex items-center justify-between gap-2 mb-3">
              <p className="text-xs font-medium text-[#7A1F3D] dark:text-[#E8A317] tabular-nums">
                Step {step} of 4 · {STEP_LABELS[step - 1].title}
              </p>
              <p className="text-xs text-[#7D666C] dark:text-[#A9969B] tabular-nums">
                {Math.round((step / 4) * 100)}% complete
              </p>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {STEP_LABELS.map((item) => {
                const isDone = item.step < step;
                const isCurrent = item.step === step;
                return (
                  <button
                    key={item.step}
                    type="button"
                    disabled={item.step > step}
                    onClick={() => {
                      if (item.step < step) {
                        setError(null);
                        setStep(item.step);
                      }
                    }}
                    className={`group flex flex-col items-start gap-1.5 text-left ${
                      item.step < step ? 'cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    <div
                      className={`h-1.5 w-full rounded-full transition-colors duration-200 ${
                        isCurrent
                          ? 'bg-[#E8A317]'
                          : isDone
                          ? 'bg-[#7A1F3D] dark:bg-[#E8A317]/65'
                          : 'bg-[#EDE2D6] dark:bg-[#2F2427]'
                      }`}
                    />
                    <span
                      className={`hidden sm:inline text-xs truncate ${
                        isCurrent
                          ? 'font-semibold text-[#24161A] dark:text-[#F9F2EC]'
                          : isDone
                          ? 'font-medium text-[#7A1F3D] dark:text-[#D5C6CA]'
                          : 'text-[#9A858A] dark:text-[#79686D]'
                      }`}
                    >
                      {item.step}. {item.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Wizard Card */}
          <form
            onSubmit={handleFinish}
            className="rounded-3xl border border-[#EAE0D5] dark:border-[#322528] bg-white dark:bg-[#1B1416] p-6 sm:p-8 shadow-[0_14px_40px_rgba(36,22,26,0.06)] dark:shadow-[0_14px_40px_rgba(0,0,0,0.4)]"
          >
            {/* STEP 1: EVENT DETAILS */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#24161A] dark:text-[#F9F2EC]">
                    {isEditing
                      ? 'Refine your celebration details'
                      : 'Tell us about your celebration'}
                  </h1>
                  <p className="mt-1.5 text-sm text-[#6B545A] dark:text-[#B4A2A7]">
                    Start with the occasion, hosts, and how many functions you&apos;re planning.
                  </p>
                </div>

                {/* Event Type */}
                <div>
                  <label className="block text-xs font-medium text-[#5A474C] dark:text-[#D5C6CA] mb-2.5">
                    Event type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {EVENT_TYPES.map((type) => {
                      const active = eventType === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => handleSelectEventType(type)}
                          className={`rounded-xl border px-3 py-2.5 text-xs sm:text-sm font-medium text-left transition-all ${
                            active
                              ? 'border-[#7A1F3D] bg-[#F8E1E7]/75 text-[#7A1F3D] dark:border-[#E8A317] dark:bg-[#321B24] dark:text-[#F9F2EC]'
                              : 'border-[#EAE0D5] dark:border-[#332629] bg-[#FFFDF9] dark:bg-[#221A1D] text-[#4E3B40] dark:text-[#D3C4C8] hover:border-[#E8A317]'
                          }`}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Event Name & Host Names */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="wizard-event-name"
                      className="block text-xs font-medium text-[#5A474C] dark:text-[#D5C6CA] mb-1.5"
                    >
                      Event name
                    </label>
                    <input
                      id="wizard-event-name"
                      type="text"
                      value={eventName}
                      onChange={(e) => {
                        setEventName(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="e.g. Aarav & Meera's Wedding"
                      className="w-full h-11 rounded-xl border border-[#E5D8CB] dark:border-[#382B2E] bg-[#FFFDF9] dark:bg-[#221A1D] px-3.5 text-sm text-[#24161A] dark:text-[#F9F2EC] placeholder:text-[#A38E93] dark:placeholder:text-[#7E6D72] focus:border-[#E8A317] focus:outline-none focus:ring-3 focus:ring-[#E8A317]/15"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="wizard-host-names"
                      className="block text-xs font-medium text-[#5A474C] dark:text-[#D5C6CA] mb-1.5"
                    >
                      Host names
                    </label>
                    <input
                      id="wizard-host-names"
                      type="text"
                      value={hostNames}
                      onChange={(e) => {
                        setHostNames(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="e.g. Potdar & Kulkarni Families"
                      className="w-full h-11 rounded-xl border border-[#E5D8CB] dark:border-[#382B2E] bg-[#FFFDF9] dark:bg-[#221A1D] px-3.5 text-sm text-[#24161A] dark:text-[#F9F2EC] placeholder:text-[#A38E93] dark:placeholder:text-[#7E6D72] focus:border-[#E8A317] focus:outline-none focus:ring-3 focus:ring-[#E8A317]/15"
                    />
                  </div>
                </div>

                {/* Number of Functions / Days */}
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#EFE4D8] dark:border-[#2F2427] bg-[#FFF9F0] dark:bg-[#221A1D] p-4">
                  <div>
                    <label
                      htmlFor="wizard-functions-count"
                      className="text-sm font-medium text-[#24161A] dark:text-[#F9F2EC]"
                    >
                      Number of functions / days
                    </label>
                    <p className="text-xs text-[#7A6369] dark:text-[#A9969B]">
                      Used to structure your timeline and vendor shifts.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setFunctionsCount((prev) => Math.max(1, prev - 1))
                      }
                      aria-label="Decrease functions count"
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E5D8CB] dark:border-[#382B2E] bg-white dark:bg-[#1B1416] text-base font-medium hover:border-[#E8A317]"
                    >
                      −
                    </button>
                    <input
                      id="wizard-functions-count"
                      type="number"
                      min={1}
                      max={15}
                      value={functionsCount}
                      onChange={(e) =>
                        setFunctionsCount(
                          Math.max(1, Math.min(15, Number(e.target.value) || 1))
                        )
                      }
                      className="h-10 w-16 rounded-xl border border-[#E5D8CB] dark:border-[#382B2E] bg-white dark:bg-[#1B1416] text-center text-sm font-semibold tabular-nums focus:border-[#E8A317] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFunctionsCount((prev) => Math.min(15, prev + 1))
                      }
                      aria-label="Increase functions count"
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E5D8CB] dark:border-[#382B2E] bg-white dark:bg-[#1B1416] text-base font-medium hover:border-[#E8A317]"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Wedding Functions Selection */}
                {eventType === 'Wedding' && (
                  <div>
                    <label className="block text-xs font-medium text-[#5A474C] dark:text-[#D5C6CA] mb-2.5">
                      Select wedding functions
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {WEDDING_FUNCTIONS.map((fn) => {
                        const selected = weddingFunctions.includes(fn);
                        return (
                          <button
                            key={fn}
                            type="button"
                            onClick={() => toggleWeddingFunction(fn)}
                            className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs sm:text-sm font-medium transition-all ${
                              selected
                                ? 'border-[#7A1F3D] bg-[#7A1F3D] text-[#FFFBF5] dark:border-[#E8A317] dark:bg-[#E8A317] dark:text-[#1D1316]'
                                : 'border-[#EAE0D5] dark:border-[#332629] bg-[#FFFDF9] dark:bg-[#221A1D] text-[#4E3B40] dark:text-[#D3C4C8] hover:border-[#E8A317]'
                            }`}
                          >
                            {selected && <Check className="h-3.5 w-3.5" />}
                            <span>{fn}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: DATE & LOCATION */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#24161A] dark:text-[#F9F2EC]">
                    When and where are we celebrating?
                  </h1>
                  <p className="mt-1.5 text-sm text-[#6B545A] dark:text-[#B4A2A7]">
                    Pick your target date, city, and preferred venue setting.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="wizard-event-date"
                      className="block text-xs font-medium text-[#5A474C] dark:text-[#D5C6CA] mb-1.5"
                    >
                      Event date
                    </label>
                    <input
                      id="wizard-event-date"
                      type="date"
                      min={tomorrowISO}
                      value={eventDate}
                      onChange={(e) => {
                        setEventDate(e.target.value);
                        if (error) setError(null);
                      }}
                      className="w-full h-11 rounded-xl border border-[#E5D8CB] dark:border-[#382B2E] bg-[#FFFDF9] dark:bg-[#221A1D] px-3.5 text-sm text-[#24161A] dark:text-[#F9F2EC] tabular-nums focus:border-[#E8A317] focus:outline-none focus:ring-3 focus:ring-[#E8A317]/15"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="wizard-city"
                      className="block text-xs font-medium text-[#5A474C] dark:text-[#D5C6CA] mb-1.5"
                    >
                      City
                    </label>
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A7278]" />
                      <input
                        id="wizard-city"
                        type="text"
                        value={city}
                        onChange={(e) => {
                          setCity(e.target.value);
                          if (error) setError(null);
                        }}
                        placeholder="e.g. Udaipur"
                        className="w-full h-11 rounded-xl border border-[#E5D8CB] dark:border-[#382B2E] bg-[#FFFDF9] dark:bg-[#221A1D] pl-10 pr-3.5 text-sm text-[#24161A] dark:text-[#F9F2EC] placeholder:text-[#A38E93] dark:placeholder:text-[#7E6D72] focus:border-[#E8A317] focus:outline-none focus:ring-3 focus:ring-[#E8A317]/15"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick City Suggestions */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-[#8A7278] dark:text-[#9D8A8F]">
                    Popular cities:
                  </span>
                  {POPULAR_CITIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setCity(c);
                        if (error) setError(null);
                      }}
                      className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                        city === c
                          ? 'border-[#7A1F3D] bg-[#F8E1E7]/75 text-[#7A1F3D] dark:border-[#E8A317] dark:bg-[#321B24] dark:text-[#F9F2EC]'
                          : 'border-[#EAE0D5] dark:border-[#332629] text-[#5A474C] dark:text-[#C5B5B9] hover:border-[#E8A317]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>

                {/* Live Countdown Preview */}
                {eventDate && (
                  <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#EFE4D8] dark:border-[#2F2427] bg-[#FFF9F0] dark:bg-[#221A1D] p-4">
                    <div className="flex items-center gap-3">
                      <CalendarClock className="h-5 w-5 text-[#7A1F3D] dark:text-[#E8A317] shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-[#7A6369] dark:text-[#A9969B]">
                          Live event countdown
                        </p>
                        <p className="text-sm font-medium text-[#24161A] dark:text-[#F9F2EC]">
                          {formatEventDate(eventDate)}
                        </p>
                      </div>
                    </div>
                    <p
                      className={`font-serif text-xl font-semibold tabular-nums ${
                        daysRemaining > 0
                          ? 'text-[#7A1F3D] dark:text-[#E8A317]'
                          : 'text-[#B3261E] dark:text-[#F28B82]'
                      }`}
                    >
                      {daysRemaining > 0
                        ? `${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} left`
                        : 'Select a future date'}
                    </p>
                  </div>
                )}

                {/* Venue Preference */}
                <div>
                  <label className="block text-xs font-medium text-[#5A474C] dark:text-[#D5C6CA] mb-2.5">
                    Venue preference
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {VENUE_PREFERENCES.map((venue) => {
                      const active = venuePreference === venue;
                      return (
                        <button
                          key={venue}
                          type="button"
                          onClick={() => setVenuePreference(venue)}
                          className={`rounded-xl border px-3.5 py-3 text-xs sm:text-sm font-medium text-left transition-all ${
                            active
                              ? 'border-[#7A1F3D] bg-[#F8E1E7]/75 text-[#7A1F3D] dark:border-[#E8A317] dark:bg-[#321B24] dark:text-[#F9F2EC]'
                              : 'border-[#EAE0D5] dark:border-[#332629] bg-[#FFFDF9] dark:bg-[#221A1D] text-[#4E3B40] dark:text-[#D3C4C8] hover:border-[#E8A317]'
                          }`}
                        >
                          {venue}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: BUDGET & GUESTS */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#24161A] dark:text-[#F9F2EC]">
                    Shape your budget &amp; guest list
                  </h1>
                  <p className="mt-1.5 text-sm text-[#6B545A] dark:text-[#B4A2A7]">
                    Adjust your target spend in INR and guest count to calculate per-guest allocation automatically.
                  </p>
                </div>

                {/* Total Budget Slider + Editable Numerical Input */}
                <div className="rounded-2xl border border-[#EFE4D8] dark:border-[#2F2427] bg-[#FFF9F0] dark:bg-[#221A1D] p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <label
                        htmlFor="wizard-budget-number"
                        className="text-sm font-medium text-[#24161A] dark:text-[#F9F2EC]"
                      >
                        Total budget (INR)
                      </label>
                      <p className="text-xs text-[#7A6369] dark:text-[#A9969B]">
                        Compact estimate: {formatINRCompact(totalBudget)}
                      </p>
                    </div>
                    <div className="relative">
                      <IndianRupee className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A1F3D] dark:text-[#E8A317]" />
                      <input
                        id="wizard-budget-number"
                        type="number"
                        min={10000}
                        step={25000}
                        value={totalBudget || ''}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setTotalBudget(Number.isNaN(val) ? 0 : Math.max(0, val));
                          if (error) setError(null);
                        }}
                        className="h-11 w-44 rounded-xl border border-[#E5D8CB] dark:border-[#382B2E] bg-white dark:bg-[#1B1416] pl-9 pr-3 text-right text-sm font-semibold tabular-nums focus:border-[#E8A317] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <input
                      type="range"
                      aria-label="Total budget slider"
                      min={100000}
                      max={10000000}
                      step={50000}
                      value={Math.min(10000000, Math.max(100000, totalBudget))}
                      onChange={(e) => {
                        setTotalBudget(Number(e.target.value));
                        if (error) setError(null);
                      }}
                      className="w-full accent-[#7A1F3D] dark:accent-[#E8A317] cursor-pointer"
                    />
                    <div className="mt-1 flex justify-between text-[11px] text-[#8A7278] dark:text-[#9D8A8F] tabular-nums">
                      <span>₹1L</span>
                      <span>₹25L</span>
                      <span>₹50L</span>
                      <span>₹75L</span>
                      <span>₹1 Cr+</span>
                    </div>
                  </div>
                </div>

                {/* Expected Guest Count + Real-time Per Guest Readout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-[#EAE0D5] dark:border-[#322528] bg-[#FFFDF9] dark:bg-[#221A1D] p-4">
                    <label
                      htmlFor="wizard-guest-count"
                      className="flex items-center gap-2 text-xs font-medium text-[#5A474C] dark:text-[#D5C6CA] mb-2"
                    >
                      <Users className="h-4 w-4 text-[#7A1F3D] dark:text-[#E8A317]" />
                      <span>Expected guest count</span>
                    </label>
                    <input
                      id="wizard-guest-count"
                      type="number"
                      min={1}
                      max={10000}
                      value={guestCount || ''}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setGuestCount(Number.isNaN(val) ? 0 : Math.max(0, val));
                        if (error) setError(null);
                      }}
                      className="w-full h-11 rounded-xl border border-[#E5D8CB] dark:border-[#382B2E] bg-white dark:bg-[#1B1416] px-3.5 text-base font-semibold tabular-nums focus:border-[#E8A317] focus:outline-none"
                    />
                  </div>

                  <div className="rounded-2xl border border-[#EAE0D5] dark:border-[#322528] bg-[#FAF4EC] dark:bg-[#241B1E] p-4 flex flex-col justify-center">
                    <span className="text-xs font-medium text-[#7A6369] dark:text-[#B09EA3]">
                      Budget per guest (live)
                    </span>
                    <p className="mt-1 font-serif text-2xl font-semibold text-[#7A1F3D] dark:text-[#E8A317] tabular-nums">
                      {formatINRFull(budgetPerGuest)}
                    </p>
                    <p className="mt-0.5 text-xs text-[#6E585E] dark:text-[#A39196] tabular-nums">
                      Across {guestCount || 0} guests
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: PREFERENCES */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#24161A] dark:text-[#F9F2EC]">
                    Style, dining &amp; top priorities
                  </h1>
                  <p className="mt-1.5 text-sm text-[#6B545A] dark:text-[#B4A2A7]">
                    Help Shubh tailor your budget allocation and vendor recommendations.
                  </p>
                </div>

                {/* Event Style */}
                <div>
                  <label className="block text-xs font-medium text-[#5A474C] dark:text-[#D5C6CA] mb-2">
                    Event style
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {EVENT_STYLES.map((style) => {
                      const active = eventStyle === style;
                      return (
                        <button
                          key={style}
                          type="button"
                          onClick={() => setEventStyle(style)}
                          className={`rounded-xl border px-3.5 py-2.5 text-xs sm:text-sm font-medium text-left transition-all ${
                            active
                              ? 'border-[#7A1F3D] bg-[#F8E1E7]/75 text-[#7A1F3D] dark:border-[#E8A317] dark:bg-[#321B24] dark:text-[#F9F2EC]'
                              : 'border-[#EAE0D5] dark:border-[#332629] bg-[#FFFDF9] dark:bg-[#221A1D] text-[#4E3B40] dark:text-[#D3C4C8] hover:border-[#E8A317]'
                          }`}
                        >
                          {style}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Food Preference */}
                <div>
                  <label className="block text-xs font-medium text-[#5A474C] dark:text-[#D5C6CA] mb-2">
                    Food preference
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {FOOD_PREFERENCES.map((food) => {
                      const active = foodPreference === food;
                      return (
                        <button
                          key={food}
                          type="button"
                          onClick={() => setFoodPreference(food)}
                          className={`rounded-xl border px-3.5 py-2.5 text-xs sm:text-sm font-medium transition-all ${
                            active
                              ? 'border-[#7A1F3D] bg-[#F8E1E7]/75 text-[#7A1F3D] dark:border-[#E8A317] dark:bg-[#321B24] dark:text-[#F9F2EC]'
                              : 'border-[#EAE0D5] dark:border-[#332629] bg-[#FFFDF9] dark:bg-[#221A1D] text-[#4E3B40] dark:text-[#D3C4C8] hover:border-[#E8A317]'
                          }`}
                        >
                          {food}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Top 3 Priorities */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-[#5A474C] dark:text-[#D5C6CA]">
                      Select your top 3 priorities
                    </label>
                    <span className="text-xs text-[#7A1F3D] dark:text-[#E8A317] tabular-nums">
                      {priorities.length}/3 selected
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {EVENT_PRIORITIES.map((priority) => {
                      const rankIndex = priorities.indexOf(priority);
                      const isSelected = rankIndex >= 0;
                      return (
                        <button
                          key={priority}
                          type="button"
                          onClick={() => togglePriority(priority)}
                          className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs sm:text-sm font-medium transition-all ${
                            isSelected
                              ? 'border-[#7A1F3D] bg-[#7A1F3D] text-[#FFFBF5] dark:border-[#E8A317] dark:bg-[#E8A317] dark:text-[#1D1316]'
                              : 'border-[#EAE0D5] dark:border-[#332629] bg-[#FFFDF9] dark:bg-[#221A1D] text-[#4E3B40] dark:text-[#D3C4C8] hover:border-[#E8A317]'
                          }`}
                        >
                          {isSelected && (
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-[11px] font-semibold tabular-nums">
                              {rankIndex + 1}
                            </span>
                          )}
                          <span>{priority}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label
                    htmlFor="wizard-notes"
                    className="block text-xs font-medium text-[#5A474C] dark:text-[#D5C6CA] mb-1.5"
                  >
                    Additional notes (optional)
                  </label>
                  <textarea
                    id="wizard-notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Share any rituals, venue constraints, or special guest needs..."
                    className="w-full rounded-xl border border-[#E5D8CB] dark:border-[#382B2E] bg-[#FFFDF9] dark:bg-[#221A1D] p-3.5 text-sm text-[#24161A] dark:text-[#F9F2EC] placeholder:text-[#A38E93] dark:placeholder:text-[#7E6D72] focus:border-[#E8A317] focus:outline-none focus:ring-3 focus:ring-[#E8A317]/15"
                  />
                </div>
              </div>
            )}

            {/* Inline Validation Message */}
            {error && (
              <p
                role="alert"
                className="mt-5 text-xs font-medium text-[#B3261E] dark:text-[#F28B82]"
              >
                {error}
              </p>
            )}

            {/* Navigation Footer */}
            <div className="mt-8 flex items-center justify-between gap-3 border-t border-[#F2E8DD] dark:border-[#2E2225] pt-5">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#E5D8CB] dark:border-[#382B2E] px-4 text-sm font-medium text-[#5A474C] dark:text-[#D3C4C8] hover:border-[#E8A317] hover:text-[#24161A] dark:hover:text-[#F9F2EC] transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#7A1F3D] dark:bg-[#E8A317] px-5 text-sm font-medium text-[#FFFBF5] dark:text-[#1D1316] hover:bg-[#641730] dark:hover:bg-[#D49212] transition-colors shadow-sm"
                >
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#7A1F3D] dark:bg-[#E8A317] px-6 text-sm font-medium text-[#FFFBF5] dark:text-[#1D1316] hover:bg-[#641730] dark:hover:bg-[#D49212] transition-colors shadow-sm"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>
                    {isEditing ? 'Save Event Changes' : 'Create My Event'}
                  </span>
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
