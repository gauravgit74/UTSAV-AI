import {
  BudgetCategoryAllocation,
  EventPriority,
  EventProfile,
  EventType,
  UserProfile,
  WeddingFunction,
} from '../types/utsav';

const USER_PROFILE_KEY = 'userProfile';
const EVENT_PROFILE_KEY = 'eventProfile';
const EVENT_PROFILES_LIST_KEY = 'eventProfiles';

export function getTomorrowISO(): string {
  const now = new Date();
  const tomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const day = String(tomorrow.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateDaysRemaining(eventDateStr: string): number {
  if (!eventDateStr) return 0;
  const parts = eventDateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return 0;

  const [year, month, day] = parts;
  const targetMidnight = new Date(year, month - 1, day);
  const now = new Date();
  const todayMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const diffMs = targetMidnight.getTime() - todayMidnight.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function formatEventDate(eventDateStr: string): string {
  if (!eventDateStr) return 'Date TBD';
  const parts = eventDateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return eventDateStr;
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatINRCompact(amount: number): string {
  if (!Number.isFinite(amount) || amount <= 0) return '₹0';
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `₹${cr.toFixed(2).replace(/\.?0+$/, '')} Cr`;
  }
  if (amount >= 100000) {
    const lakhs = amount / 100000;
    return `₹${lakhs.toFixed(1).replace(/\.0$/, '')}L`;
  }
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export function formatINRFull(amount: number): string {
  if (!Number.isFinite(amount) || amount <= 0) return '₹0';
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export function getDefaultFunctionsForType(
  eventType: EventType
): WeddingFunction[] {
  if (eventType === 'Wedding') {
    return ['Haldi', 'Sangeet', 'Wedding'];
  }
  return [];
}

export function calculateBudgetAllocation(
  totalBudget: number,
  eventType: EventType,
  priorities: EventPriority[]
): BudgetCategoryAllocation[] {
  const baseWeights: Record<string, number> =
    eventType === 'Corporate Event'
      ? {
          Venue: 32,
          Food: 28,
          Decor: 12,
          Entertainment: 12,
          Photography: 8,
          'Guest Experience': 8,
        }
      : {
          Venue: 28,
          Food: 26,
          Decor: 16,
          Photography: 10,
          Entertainment: 8,
          Attire: 7,
          'Guest Experience': 5,
        };

  // Boost user's top 3 priorities slightly while keeping total = 100%
  const adjusted: Record<string, number> = { ...baseWeights };
  priorities.forEach((p, idx) => {
    if (adjusted[p] !== undefined) {
      adjusted[p] += idx === 0 ? 5 : idx === 1 ? 3 : 2;
    }
  });

  const weightSum = Object.values(adjusted).reduce((sum, v) => sum + v, 0);
  const entries = Object.entries(adjusted);

  let runningPct = 0;
  let runningAmount = 0;

  return entries.map(([category, weight], index) => {
    const isLast = index === entries.length - 1;
    const percentage = isLast
      ? Math.max(1, 100 - runningPct)
      : Math.round((weight / weightSum) * 100);
    const amount = isLast
      ? Math.max(0, totalBudget - runningAmount)
      : Math.round((totalBudget * percentage) / 100);

    runningPct += percentage;
    runningAmount += amount;

    return {
      category,
      percentage,
      amount,
    };
  });
}

export function computeInitialPlanningProgress(event: {
  weddingFunctions: WeddingFunction[];
  notes: string;
  priorities: EventPriority[];
}): { completionPercent: number; completedMilestones: number; totalMilestones: number } {
  const baseTasks = 8 + (event.weddingFunctions.length > 0 ? event.weddingFunctions.length : 2);
  let completed = 2; // Event brief & budget allocation locked
  if (event.priorities.length > 0) completed += 1;
  if (event.notes.trim().length > 0) completed += 1;
  const pct = Math.min(100, Math.round((completed / baseTasks) * 100));
  return {
    completionPercent: pct,
    completedMilestones: completed,
    totalMilestones: baseTasks,
  };
}

// LocalStorage persistence helpers
export function loadUserProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(USER_PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserProfile;
    if (!parsed || typeof parsed.name !== 'string') return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
}

export function clearUserProfile(): void {
  localStorage.removeItem(USER_PROFILE_KEY);
}

export function loadEventProfile(): EventProfile | null {
  try {
    const raw = localStorage.getItem(EVENT_PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as EventProfile;
    if (!parsed || typeof parsed.eventName !== 'string') return null;
    return parsed;
  } catch {
    return null;
  }
}

export function loadAllEventProfiles(): EventProfile[] {
  try {
    const rawList = localStorage.getItem(EVENT_PROFILES_LIST_KEY);
    const active = loadEventProfile();
    if (!rawList) {
      return active ? [active] : [];
    }
    const parsed = JSON.parse(rawList) as EventProfile[];
    if (!Array.isArray(parsed)) {
      return active ? [active] : [];
    }
    if (active && !parsed.some((e) => e.id === active.id)) {
      return [active, ...parsed];
    }
    return parsed;
  } catch {
    const active = loadEventProfile();
    return active ? [active] : [];
  }
}

export function saveEventProfile(event: EventProfile): EventProfile[] {
  localStorage.setItem(EVENT_PROFILE_KEY, JSON.stringify(event));
  const existing = loadAllEventProfiles();
  const idx = existing.findIndex((item) => item.id === event.id);
  const updatedList =
    idx >= 0
      ? existing.map((item, i) => (i === idx ? event : item))
      : [event, ...existing];
  localStorage.setItem(EVENT_PROFILES_LIST_KEY, JSON.stringify(updatedList));
  return updatedList;
}

export function setActiveEventProfile(event: EventProfile): void {
  localStorage.setItem(EVENT_PROFILE_KEY, JSON.stringify(event));
}
