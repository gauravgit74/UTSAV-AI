import {
  EventProfile,
  FeatureCardItem,
  NotificationItem,
  SuggestionChip,
} from '../types/utsav';
import {
  calculateDaysRemaining,
  formatEventDate,
  formatINRCompact,
  formatINRFull,
} from '../utils/eventUtils';

export const GENERATED_IMAGES = {
  avatarGaurav: '/src/assets/images/avatar_gaurav_1795259553260.jpg',
  venueUdaipur: '/src/assets/images/venue_udaipur_courtyard_1795259553951.jpg',
  cateringFeast: '/src/assets/images/catering_feast_table_1795259553947.jpg',
  invitationSeal: '/src/assets/images/invitation_wax_seal_1795259554712.jpg',
};

export function buildSuggestionChips(event: EventProfile): SuggestionChip[] {
  const budgetText = formatINRCompact(event.totalBudget);
  const dateText = formatEventDate(event.eventDate);
  const functionsText =
    event.weddingFunctions.length > 0
      ? event.weddingFunctions.join(', ')
      : `${event.functionsCount} ${event.functionsCount === 1 ? 'session' : 'sessions'}`;

  return [
    {
      id: 'plan-wedding',
      label: 'Plan my wedding',
      prompt: `Plan ${event.eventName} (${event.eventType}) in ${event.city} on ${dateText} for ${event.guestCount} guests with a ${event.eventStyle.toLowerCase()} theme across ${functionsText} under ${budgetText}.`,
    },
    {
      id: 'find-venue',
      label: 'Find the perfect venue',
      prompt: `Shortlist ${event.venuePreference.toLowerCase()} venues in ${event.city} for ${event.guestCount} guests on ${dateText} matching a ${event.eventStyle.toLowerCase()} aesthetic.`,
    },
    {
      id: 'catering-manpower',
      label: 'Organise catering & manpower',
      prompt: `Arrange ${event.foodPreference} catering for ${event.guestCount} guests in ${event.city}, plus hospitality stewards, photography, and sound crew.`,
    },
    {
      id: 'create-invitation',
      label: 'Create an invitation',
      prompt: `Design a ${event.eventStyle.toLowerCase()} digital invitation for ${event.eventName} hosted by ${event.hostNames} on ${dateText} with RSVP tracking.`,
    },
    {
      id: 'manage-budget',
      label: 'Manage my event budget',
      prompt: `Optimize my ${budgetText} budget (${formatINRFull(event.budgetPerGuest)} per guest) prioritizing ${event.priorities.join(', ') || 'Venue & Food'}.`,
    },
    {
      id: 'build-timeline',
      label: 'Build my timeline',
      prompt: `Create a ${Math.max(1, calculateDaysRemaining(event.eventDate))}-day planning checklist and run sheet for ${event.eventName} (${functionsText}).`,
    },
  ];
}

export function buildFeatureCards(event: EventProfile): FeatureCardItem[] {
  const daysRemaining = calculateDaysRemaining(event.eventDate);
  const formattedDate = formatEventDate(event.eventDate);
  const topAllocations = event.budgetAllocation.slice(0, 3).map((item) => ({
    label: item.category,
    detail: `${item.percentage}% · ${formatINRFull(item.amount)}`,
  }));

  return [
    {
      id: 'venues',
      title: 'Places & Venues',
      description:
        'Discover venues based on capacity, location, budget and event type.',
      meta: `${event.venuePreference} · ${event.city} · ${event.guestCount} guests`,
      accent: 'marigold',
      image: GENERATED_IMAGES.venueUdaipur,
      imageAlt: 'Heritage sandstone courtyard lit with marigold garlands and lanterns',
      highlights: [
        {
          label: 'Preferred setting',
          detail: `${event.venuePreference} in ${event.city}`,
        },
        {
          label: 'Capacity target',
          detail: `${event.guestCount} guests · ${event.eventStyle} aesthetic`,
        },
        {
          label: 'Estimated venue budget',
          detail: formatINRFull(
            event.budgetAllocation.find((b) => b.category === 'Venue')?.amount ??
              Math.round(event.totalBudget * 0.28)
          ),
        },
      ],
      suggestedPrompt: `Find top ${event.venuePreference.toLowerCase()} options in ${event.city} for ${event.guestCount} guests on ${formattedDate}.`,
    },
    {
      id: 'manpower',
      title: 'Manpower & Services',
      description:
        'Find catering, DJs, bouncers, magicians, photographers and event staff.',
      meta: `${event.foodPreference} catering · ${event.functionsCount} ${
        event.functionsCount === 1 ? 'function' : 'functions'
      }`,
      accent: 'maroon',
      image: GENERATED_IMAGES.cateringFeast,
      imageAlt: 'Candlelit celebration banquet table with marigold floral arrangements',
      highlights: [
        {
          label: 'Culinary direction',
          detail: `${event.foodPreference} menu for ${event.guestCount} plates`,
        },
        {
          label: 'Key vendor priorities',
          detail: event.priorities.join(' · ') || 'Catering & Hospitality',
        },
        {
          label: 'Estimated catering spend',
          detail: formatINRFull(
            event.budgetAllocation.find((b) => b.category === 'Food')?.amount ??
              Math.round(event.totalBudget * 0.26)
          ),
        },
      ],
      suggestedPrompt: `Recommend ${event.foodPreference} caterers, photographers, and event staff in ${event.city} for ${event.guestCount} guests.`,
    },
    {
      id: 'invitations',
      title: 'Invitations & Guests',
      description:
        'Create beautiful invitations, share them and manage RSVPs.',
      meta: `${event.guestCount} invited · ${event.eventStyle} suite`,
      accent: 'blush',
      image: GENERATED_IMAGES.invitationSeal,
      imageAlt: 'Warm ivory handmade invitation card with maroon wax seal and dried marigold petals',
      highlights: [
        { label: 'Hosted by', detail: event.hostNames },
        {
          label: 'Guest list target',
          detail: `${event.guestCount} guests · ${event.foodPreference} dining`,
        },
        {
          label: 'Functions covered',
          detail:
            event.weddingFunctions.length > 0
              ? event.weddingFunctions.join(', ')
              : `${event.functionsCount} celebration ${
                  event.functionsCount === 1 ? 'event' : 'events'
                }`,
        },
      ],
      suggestedPrompt: `Draft a ${event.eventStyle.toLowerCase()} invitation card wording for ${event.eventName} hosted by ${event.hostNames}.`,
    },
    {
      id: 'photos',
      title: 'Photos & Memories',
      description:
        'Create event galleries and make photos easily accessible to guests.',
      meta: `${
        event.weddingFunctions.length > 0
          ? event.weddingFunctions.length
          : event.functionsCount
      } ceremony albums ready`,
      accent: 'marigold',
      highlights: [
        {
          label: 'Curated album folders',
          detail:
            event.weddingFunctions.length > 0
              ? event.weddingFunctions.join(' · ')
              : event.eventName,
        },
        {
          label: 'Guest QR photo share',
          detail: `Ready for ${event.guestCount} attendees`,
        },
        {
          label: 'Style direction',
          detail: `${event.eventStyle} candid & editorial coverage`,
        },
      ],
      suggestedPrompt: `Set up photo sharing galleries and shot lists for ${event.eventName}.`,
    },
    {
      id: 'budget',
      title: 'Budget & Payments',
      description:
        'Track expenses, payments and budget allocations.',
      meta: `${formatINRCompact(event.totalBudget)} total · ${formatINRFull(
        event.budgetPerGuest
      )} / guest`,
      accent: 'maroon',
      highlights:
        topAllocations.length > 0
          ? topAllocations
          : [
              {
                label: 'Total budget',
                detail: formatINRFull(event.totalBudget),
              },
            ],
      suggestedPrompt: `Review my ${formatINRCompact(
        event.totalBudget
      )} budget breakdown for ${event.eventName} and suggest milestone payment dates.`,
    },
    {
      id: 'timeline',
      title: 'Timeline & Planning',
      description:
        'Manage tasks, deadlines and the complete event schedule.',
      meta: `${Math.max(0, daysRemaining)} days left · ${formattedDate}`,
      accent: 'blush',
      highlights: [
        {
          label: 'Target celebration date',
          detail: `${formattedDate} (${Math.max(0, daysRemaining)} days away)`,
        },
        {
          label: 'Milestone progress',
          detail: `${event.completedMilestones} of ${event.totalMilestones} milestones completed`,
        },
        {
          label: 'Top focus areas',
          detail: event.priorities.join(' · ') || 'Venue & Guest Experience',
        },
      ],
      suggestedPrompt: `Build a ${Math.max(
        1,
        daysRemaining
      )}-day planning timeline for ${event.eventName} in ${event.city}.`,
    },
  ];
}

export function buildInitialNotifications(
  event: EventProfile
): NotificationItem[] {
  const days = Math.max(0, calculateDaysRemaining(event.eventDate));
  return [
    {
      id: 'n1',
      title: `${event.eventName} workspace ready`,
      detail: `Budget allocation across ${event.budgetAllocation.length} categories has been generated for ${formatINRCompact(
        event.totalBudget
      )}.`,
      time: 'Just now',
      unread: true,
    },
    {
      id: 'n2',
      title: `${days} days until ${formatEventDate(event.eventDate)}`,
      detail: `Top priorities set to ${
        event.priorities.join(', ') || 'Venue & Food'
      } in ${event.city}.`,
      time: 'Today',
      unread: true,
    },
    {
      id: 'n3',
      title: `${event.venuePreference} shortlisting`,
      detail: `Ask Shubh AI to match ${event.venuePreference.toLowerCase()} spaces for ${event.guestCount} guests.`,
      time: 'Today',
      unread: false,
    },
  ];
}
