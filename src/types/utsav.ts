export type NavSectionId =
  | 'dashboard'
  | 'events'
  | 'venues'
  | 'manpower'
  | 'invitations'
  | 'photos'
  | 'budget'
  | 'timeline'
  | 'shubh-ai'
  | 'profile'
  | 'settings';

export type EventType =
  | 'Wedding'
  | 'Engagement'
  | 'Birthday'
  | 'Anniversary'
  | 'Corporate Event'
  | 'Baby Shower'
  | 'Other';

export type WeddingFunction =
  | 'Haldi'
  | 'Mehendi'
  | 'Sangeet'
  | 'Wedding'
  | 'Reception';

export type VenuePreference =
  | 'Banquet Hall'
  | 'Hotel'
  | 'Lawn/Outdoor'
  | 'Beach'
  | 'Heritage Property'
  | 'Home';

export type EventStyle =
  | 'Traditional'
  | 'Modern'
  | 'Minimal'
  | 'Royal'
  | 'Boho'
  | 'Destination';

export type FoodPreference = 'Veg' | 'Non-veg' | 'Both' | 'Jain';

export type EventPriority =
  | 'Venue'
  | 'Food'
  | 'Decor'
  | 'Photography'
  | 'Entertainment'
  | 'Attire'
  | 'Guest Experience';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  authMode: 'email' | 'guest';
  createdAt: string;
}

export interface BudgetCategoryAllocation {
  category: string;
  percentage: number;
  amount: number;
}

export interface EventProfile {
  id: string;
  eventType: EventType;
  eventName: string;
  hostNames: string;
  functionsCount: number;
  weddingFunctions: WeddingFunction[];
  eventDate: string; // YYYY-MM-DD
  city: string;
  venuePreference: VenuePreference;
  totalBudget: number; // INR
  guestCount: number;
  budgetPerGuest: number;
  eventStyle: EventStyle;
  foodPreference: FoodPreference;
  priorities: EventPriority[];
  notes: string;
  budgetAllocation: BudgetCategoryAllocation[];
  completionPercent: number;
  completedMilestones: number;
  totalMilestones: number;
  createdAt: string;
  updatedAt: string;
}

export interface SuggestionChip {
  id: string;
  label: string;
  prompt: string;
}

export interface FeatureCardItem {
  id: NavSectionId;
  title: string;
  description: string;
  meta: string;
  accent: 'marigold' | 'maroon' | 'blush';
  image?: string;
  imageAlt?: string;
  highlights: { label: string; detail: string }[];
  suggestedPrompt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  detail: string;
  time: string;
  unread: boolean;
}
