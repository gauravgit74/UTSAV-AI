import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  ChevronDown,
  Menu,
  Check,
  Sun,
  Moon,
  Calendar,
  Pencil,
  Plus,
} from 'lucide-react';
import { EventProfile, NotificationItem, UserProfile } from '../types/utsav';
import { formatEventDate } from '../utils/eventUtils';

interface TopBarProps {
  user: UserProfile;
  events: EventProfile[];
  selectedEvent: EventProfile;
  onSelectEvent: (eventId: string) => void;
  onEditEvent: () => void;
  onCreateNewEvent: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onOpenMobileSidebar: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  user,
  events,
  selectedEvent,
  onSelectEvent,
  onEditEvent,
  onCreateNewEvent,
  notifications,
  onMarkAllRead,
  onOpenMobileSidebar,
  isDark,
  onToggleTheme,
}) => {
  const [eventMenuOpen, setEventMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const eventMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;
  const firstName = user.name.trim().split(/\s+/)[0] || 'Guest';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        eventMenuRef.current &&
        !eventMenuRef.current.contains(e.target as Node)
      ) {
        setEventMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEventMenuOpen(false);
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-[#EFE4D8] dark:border-[#2B2023] bg-[#FFFBF5]/90 dark:bg-[#140F11]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-8">
        {/* Left: Mobile trigger + Greeting & Subtitle */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            aria-label="Open navigation menu"
            className="flex md:hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#EADFD4] dark:border-[#34272A] bg-white dark:bg-[#1E1719] text-[#24161A] dark:text-[#F9F2EC] hover:border-[#E8A317] transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <h2 className="font-serif text-lg sm:text-xl font-semibold tracking-tight text-[#24161A] dark:text-[#F9F2EC] truncate">
              Good morning, {firstName}
            </h2>
            <p className="text-xs sm:text-sm text-[#7A6369] dark:text-[#B4A2A7] truncate">
              Let&apos;s bring your celebration together.
            </p>
          </div>
        </div>

        {/* Right: Event Selector + Notifications + Theme Toggle */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Event Selector */}
          <div className="relative" ref={eventMenuRef}>
            <button
              type="button"
              onClick={() => {
                setEventMenuOpen((prev) => !prev);
                setNotifOpen(false);
              }}
              aria-expanded={eventMenuOpen}
              aria-haspopup="listbox"
              className="flex h-10 items-center gap-2 rounded-xl border border-[#E8DCD0] dark:border-[#35282B] bg-white dark:bg-[#1E1719] px-3 sm:px-3.5 text-sm font-medium text-[#24161A] dark:text-[#F9F2EC] shadow-[0_1px_2px_rgba(36,22,26,0.04)] hover:border-[#E8A317]/70 dark:hover:border-[#E8A317]/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A317]"
            >
              <Calendar className="h-4 w-4 shrink-0 text-[#7A1F3D] dark:text-[#E8A317]" />
              <span className="max-w-[120px] sm:max-w-[200px] truncate whitespace-nowrap">
                {selectedEvent.eventName}
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-[#866E74] dark:text-[#A39196] transition-transform duration-150 ${
                  eventMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {eventMenuOpen && (
              <div
                role="listbox"
                aria-label="Select active event"
                className="absolute right-0 mt-2 w-72 sm:w-80 origin-top-right rounded-2xl border border-[#EAE0D5] dark:border-[#36282C] bg-white dark:bg-[#1E1719] p-1.5 shadow-xl z-40"
              >
                <div className="flex items-center justify-between px-3 py-2 border-b border-[#F3EAE0] dark:border-[#2E2225]">
                  <p className="text-xs font-medium text-[#7D666C] dark:text-[#A9969B]">
                    Your celebrations
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setEventMenuOpen(false);
                      onEditEvent();
                    }}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#7A1F3D] dark:text-[#E8A317] hover:underline"
                  >
                    <Pencil className="h-3 w-3" />
                    <span>Edit Event</span>
                  </button>
                </div>

                <div className="py-1 space-y-0.5 max-h-60 overflow-y-auto">
                  {events.map((ev) => {
                    const isSelected = ev.id === selectedEvent.id;
                    return (
                      <button
                        key={ev.id}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          onSelectEvent(ev.id);
                          setEventMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                          isSelected
                            ? 'bg-[#F8E1E7]/65 text-[#7A1F3D] dark:bg-[#321B24] dark:text-[#F9F2EC]'
                            : 'text-[#24161A] dark:text-[#EAE0D9] hover:bg-[#FAF3EB] dark:hover:bg-[#271E21]'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {ev.eventName}
                          </p>
                          <p className="text-xs text-[#7D666C] dark:text-[#A39196] truncate">
                            {ev.city} · {formatEventDate(ev.eventDate)}
                          </p>
                        </div>
                        {isSelected && (
                          <Check className="h-4 w-4 shrink-0 text-[#7A1F3D] dark:text-[#E8A317]" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="border-t border-[#F3EAE0] dark:border-[#2E2225] pt-1 mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEventMenuOpen(false);
                      onCreateNewEvent();
                    }}
                    className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-[#5A474C] dark:text-[#D5C6CA] hover:bg-[#FAF3EB] hover:text-[#7A1F3D] dark:hover:bg-[#271E21] dark:hover:text-[#E8A317] transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Create new event</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => {
                setNotifOpen((prev) => !prev);
                setEventMenuOpen(false);
              }}
              aria-label="Notifications"
              aria-expanded={notifOpen}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#E8DCD0] dark:border-[#35282B] bg-white dark:bg-[#1E1719] text-[#533F45] dark:text-[#DED2D5] shadow-[0_1px_2px_rgba(36,22,26,0.04)] hover:border-[#E8A317]/70 dark:hover:border-[#E8A317]/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A317]"
            >
              <Bell className="h-[18px] w-[18px]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#7A1F3D] dark:bg-[#E8A317] px-1 text-[10px] font-semibold text-white dark:text-[#1F1416] tabular-nums">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 origin-top-right rounded-2xl border border-[#EAE0D5] dark:border-[#36282C] bg-white dark:bg-[#1E1719] shadow-xl z-40 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#F3EAE0] dark:border-[#2E2225]">
                  <span className="text-sm font-semibold text-[#24161A] dark:text-[#F9F2EC]">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={onMarkAllRead}
                      className="text-xs font-medium text-[#7A1F3D] dark:text-[#E8A317] hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="divide-y divide-[#F5EDE4] dark:divide-[#2B2023] max-h-80 overflow-y-auto">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`px-4 py-3 transition-colors ${
                        item.unread
                          ? 'bg-[#FFF9F0] dark:bg-[#241A1D]'
                          : 'bg-transparent'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-[#24161A] dark:text-[#F9F2EC]">
                          {item.title}
                        </p>
                        <span className="text-[11px] text-[#8A7278] dark:text-[#A39196] whitespace-nowrap shrink-0 tabular-nums">
                          {item.time}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-[#6E585E] dark:text-[#B4A2A7] leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E8DCD0] dark:border-[#35282B] bg-white dark:bg-[#1E1719] text-[#533F45] dark:text-[#E8A317] shadow-[0_1px_2px_rgba(36,22,26,0.04)] hover:border-[#E8A317]/70 dark:hover:border-[#E8A317]/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A317]"
          >
            {isDark ? (
              <Sun className="h-[18px] w-[18px]" />
            ) : (
              <Moon className="h-[18px] w-[18px]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
