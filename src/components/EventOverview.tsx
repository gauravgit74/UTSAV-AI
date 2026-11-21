import React from 'react';
import {
  CalendarClock,
  IndianRupee,
  Users,
  CheckSquare,
  Pencil,
} from 'lucide-react';
import { EventProfile } from '../types/utsav';
import {
  calculateDaysRemaining,
  formatEventDate,
  formatINRCompact,
  formatINRFull,
} from '../utils/eventUtils';

interface EventOverviewProps {
  event: EventProfile;
  onEditEvent: () => void;
  onInspectModule: (
    sectionId: 'timeline' | 'budget' | 'invitations' | 'events'
  ) => void;
}

export const EventOverview: React.FC<EventOverviewProps> = ({
  event,
  onEditEvent,
  onInspectModule,
}) => {
  const daysRemaining = Math.max(0, calculateDaysRemaining(event.eventDate));
  const formattedDate = formatEventDate(event.eventDate);

  return (
    <section
      aria-labelledby="overview-heading"
      className="mx-auto max-w-5xl pb-10"
    >
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2
            id="overview-heading"
            className="font-serif text-lg sm:text-xl font-semibold text-[#24161A] dark:text-[#F9F2EC]"
          >
            Event overview
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6369] dark:text-[#B09EA3]">
            {event.eventName} · {event.city} · {formattedDate}
          </p>
        </div>

        <button
          type="button"
          onClick={onEditEvent}
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#E5D8CB] dark:border-[#35282B] bg-white dark:bg-[#1D1618] px-3.5 text-xs font-medium text-[#7A1F3D] dark:text-[#E8A317] hover:border-[#E8A317] hover:bg-[#FFF9EE] dark:hover:bg-[#261D20] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A317] whitespace-nowrap shrink-0"
        >
          <Pencil className="h-3.5 w-3.5" />
          <span>Edit Event</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Upcoming Event Countdown */}
        <button
          type="button"
          onClick={() => onInspectModule('events')}
          className="group rounded-2xl border border-[#EAE0D5] dark:border-[#322528] bg-white dark:bg-[#1D1618] p-4.5 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-[#E8A317]/80 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A317]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#7A6369] dark:text-[#B09EA3]">
              Event countdown
            </span>
            <CalendarClock className="h-4 w-4 text-[#7A1F3D] dark:text-[#E8A317]" />
          </div>
          <p className="mt-2.5 font-serif text-2xl font-semibold text-[#24161A] dark:text-[#F9F2EC] tabular-nums">
            {daysRemaining} {daysRemaining === 1 ? 'Day' : 'Days'}
          </p>
          <p className="mt-1 text-xs text-[#6E585E] dark:text-[#A39196] truncate">
            {formattedDate} · {event.eventType}
          </p>
        </button>

        {/* Total Event Budget */}
        <button
          type="button"
          onClick={() => onInspectModule('budget')}
          className="group rounded-2xl border border-[#EAE0D5] dark:border-[#322528] bg-white dark:bg-[#1D1618] p-4.5 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-[#E8A317]/80 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A317]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#7A6369] dark:text-[#B09EA3]">
              Total event budget
            </span>
            <IndianRupee className="h-4 w-4 text-[#B87A00] dark:text-[#E8A317]" />
          </div>
          <p className="mt-2.5 font-serif text-2xl font-semibold text-[#24161A] dark:text-[#F9F2EC] tabular-nums">
            {formatINRCompact(event.totalBudget)}
          </p>
          <p className="mt-1 text-xs text-[#6E585E] dark:text-[#A39196] tabular-nums truncate">
            {formatINRFull(event.budgetPerGuest)} / guest · {event.budgetAllocation.length} splits
          </p>
        </button>

        {/* Guest Count */}
        <button
          type="button"
          onClick={() => onInspectModule('invitations')}
          className="group rounded-2xl border border-[#EAE0D5] dark:border-[#322528] bg-white dark:bg-[#1D1618] p-4.5 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-[#E8A317]/80 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A317]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#7A6369] dark:text-[#B09EA3]">
              Guest count
            </span>
            <Users className="h-4 w-4 text-[#7A1F3D] dark:text-[#F29FB6]" />
          </div>
          <p className="mt-2.5 font-serif text-2xl font-semibold text-[#24161A] dark:text-[#F9F2EC] tabular-nums">
            {event.guestCount}
          </p>
          <p className="mt-1 text-xs text-[#6E585E] dark:text-[#A39196] truncate">
            {event.foodPreference} · {event.venuePreference}
          </p>
        </button>

        {/* Planning Completion */}
        <button
          type="button"
          onClick={() => onInspectModule('timeline')}
          className="group rounded-2xl border border-[#EAE0D5] dark:border-[#322528] bg-white dark:bg-[#1D1618] p-4.5 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-[#E8A317]/80 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A317]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#7A6369] dark:text-[#B09EA3]">
              Planning completion
            </span>
            <CheckSquare className="h-4 w-4 text-[#B87A00] dark:text-[#E8A317]" />
          </div>
          <div className="mt-2.5 flex items-baseline justify-between gap-2">
            <p className="font-serif text-2xl font-semibold text-[#24161A] dark:text-[#F9F2EC] tabular-nums">
              {event.completionPercent}%
            </p>
            <span className="text-xs text-[#6E585E] dark:text-[#A39196] tabular-nums">
              {event.completedMilestones}/{event.totalMilestones} tasks
            </span>
          </div>
          <div
            className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#F3E9DD] dark:bg-[#2F2427]"
            role="progressbar"
            aria-valuenow={event.completionPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Planning completion percentage"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#7A1F3D] to-[#E8A317] transition-all duration-300"
              style={{ width: `${event.completionPercent}%` }}
            />
          </div>
        </button>
      </div>
    </section>
  );
};
