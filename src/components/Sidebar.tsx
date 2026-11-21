import React from 'react';
import {
  LayoutDashboard,
  CalendarHeart,
  Landmark,
  Users,
  MailOpen,
  Camera,
  Wallet,
  Clock3,
  User,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from 'lucide-react';
import { GENERATED_IMAGES } from '../data/mockUtsavData';
import { NavSectionId, UserProfile } from '../types/utsav';

interface SidebarProps {
  user: UserProfile;
  activeNav: NavSectionId;
  onSelectNav: (id: NavSectionId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: NavSectionId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PRIMARY_NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'events', label: 'My Events', icon: CalendarHeart },
  { id: 'venues', label: 'Venues & Places', icon: Landmark },
  { id: 'manpower', label: 'Manpower & Services', icon: Users },
  { id: 'invitations', label: 'Invitations & Guests', icon: MailOpen },
  { id: 'photos', label: 'Photos & Memories', icon: Camera },
  { id: 'budget', label: 'Budget & Payments', icon: Wallet },
  { id: 'timeline', label: 'Timeline', icon: Clock3 },
];

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  activeNav,
  onSelectNav,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const handleSelect = (id: NavSectionId) => {
    onSelectNav(id);
    onCloseMobile();
  };

  const sidebarContent = (isMobileDrawer: boolean) => {
    const isCompact = collapsed && !isMobileDrawer;

    return (
      <div className="flex h-full flex-col justify-between bg-[#FFFDF9] dark:bg-[#191315] border-r border-[#EDE2D6] dark:border-[#2F2427] transition-colors duration-200">
        {/* Top: Logo + Collapse */}
        <div>
          <div
            className={`flex items-center ${
              isCompact ? 'justify-center px-3' : 'justify-between px-4'
            } h-16 border-b border-[#F2E9DF] dark:border-[#2B2023]`}
          >
            <button
              type="button"
              onClick={() => handleSelect('dashboard')}
              className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A317] rounded-lg p-1"
              title="Utsav AI"
            >
              {/* Custom geometric lotus / celebration emblem */}
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
                  <path d="M7 18.5c3.2 1.4 6.8 1.4 10 0" className="text-[#E8A317]" stroke="currentColor" />
                </svg>
              </div>
              {!isCompact && (
                <span className="font-serif text-xl font-semibold tracking-tight text-[#24161A] dark:text-[#F9F2EC] whitespace-nowrap">
                  Utsav <span className="text-[#7A1F3D] dark:text-[#E8A317]">AI</span>
                </span>
              )}
            </button>

            {isMobileDrawer ? (
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="Close navigation menu"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6B545A] hover:bg-[#F8E1E7]/60 hover:text-[#7A1F3D] dark:text-[#B9A7AC] dark:hover:bg-[#2B2023] dark:hover:text-[#F9F2EC] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              !isCompact && (
                <button
                  type="button"
                  onClick={onToggleCollapse}
                  aria-label="Collapse sidebar"
                  title="Collapse sidebar"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#7B646A] hover:bg-[#F5EDE4] hover:text-[#24161A] dark:text-[#A9969B] dark:hover:bg-[#281E21] dark:hover:text-[#F9F2EC] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A317]"
                >
                  <PanelLeftClose className="h-4 w-4" />
                </button>
              )
            )}
          </div>

          {isCompact && !isMobileDrawer && (
            <div className="flex justify-center pt-3">
              <button
                type="button"
                onClick={onToggleCollapse}
                aria-label="Expand sidebar"
                title="Expand sidebar"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#7B646A] hover:bg-[#F5EDE4] hover:text-[#24161A] dark:text-[#A9969B] dark:hover:bg-[#281E21] dark:hover:text-[#F9F2EC] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A317]"
              >
                <PanelLeftOpen className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Separated & Prominently Highlighted Shubh AI */}
          <div className={isCompact ? 'px-2.5 pt-3 pb-2' : 'px-3 pt-4 pb-2'}>
            <button
              type="button"
              onClick={() => handleSelect('shubh-ai')}
              title="Shubh AI"
              className={`group relative w-full flex items-center ${
                isCompact ? 'justify-center px-0 py-2.5' : 'justify-between px-3.5 py-2.5'
              } rounded-xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A317] ${
                activeNav === 'shubh-ai'
                  ? 'bg-gradient-to-r from-[#7A1F3D] to-[#611730] text-[#FFFBF5] border-[#7A1F3D] shadow-sm'
                  : 'bg-gradient-to-r from-[#F8E1E7]/85 via-[#FDF3DF]/85 to-[#FFF7E6] dark:from-[#361A25] dark:via-[#2C1B21] dark:to-[#292018] text-[#7A1F3D] dark:text-[#F7D7DF] border-[#E8A317]/40 dark:border-[#E8A317]/35 hover:border-[#E8A317] hover:shadow-sm'
              }`}
            >
              <span className="flex items-center gap-2.5 min-w-0">
                <span
                  aria-hidden="true"
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-sm font-semibold transition-transform duration-200 group-hover:scale-105 ${
                    activeNav === 'shubh-ai'
                      ? 'bg-[#E8A317] text-[#24161A]'
                      : 'bg-[#E8A317]/20 text-[#B87A00] dark:bg-[#E8A317]/25 dark:text-[#F4B942]'
                  }`}
                >
                  ✦
                </span>
                {!isCompact && (
                  <span className="text-sm font-semibold tracking-tight whitespace-nowrap truncate">
                    Shubh AI
                  </span>
                )}
              </span>
              {!isCompact && (
                <span
                  className={`text-[11px] font-medium whitespace-nowrap ${
                    activeNav === 'shubh-ai'
                      ? 'text-[#F8E1E7]'
                      : 'text-[#8D5A12] dark:text-[#E8A317]'
                  }`}
                >
                  Planner
                </span>
              )}
            </button>
          </div>

          {/* Primary Navigation */}
          <nav
            aria-label="Primary navigation"
            className={`${isCompact ? 'px-2.5' : 'px-3'} py-2 space-y-0.5`}
          >
            {PRIMARY_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  title={isCompact ? item.label : undefined}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full flex items-center ${
                    isCompact ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2.5'
                  } rounded-xl text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A317] ${
                    isActive
                      ? 'bg-[#F8E1E7]/75 text-[#7A1F3D] dark:bg-[#321B24] dark:text-[#F8E1E7]'
                      : 'text-[#5A474C] hover:bg-[#F6EFE7] hover:text-[#24161A] dark:text-[#BEB0B3] dark:hover:bg-[#241B1E] dark:hover:text-[#F9F2EC]'
                  }`}
                >
                  <Icon
                    className={`h-[18px] w-[18px] shrink-0 transition-colors ${
                      isActive
                        ? 'text-[#7A1F3D] dark:text-[#E8A317]'
                        : 'text-[#877176] dark:text-[#968388]'
                    }`}
                  />
                  {!isCompact && (
                    <span className="whitespace-nowrap truncate">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Profile & Settings */}
        <div
          className={`${
            isCompact ? 'px-2.5' : 'px-3'
          } py-3 border-t border-[#F2E9DF] dark:border-[#2B2023] space-y-1`}
        >
          <button
            type="button"
            onClick={() => handleSelect('profile')}
            title={isCompact ? `Profile — ${user.name}` : undefined}
            className={`w-full flex items-center ${
              isCompact ? 'justify-center px-0 py-2' : 'gap-3 px-2.5 py-2'
            } rounded-xl text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A317] ${
              activeNav === 'profile'
                ? 'bg-[#F8E1E7]/75 text-[#7A1F3D] dark:bg-[#321B24] dark:text-[#F8E1E7]'
                : 'hover:bg-[#F6EFE7] dark:hover:bg-[#241B1E]'
            }`}
          >
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-[#E6D8CB] dark:border-[#3D2E32] bg-[#F8E1E7] dark:bg-[#321B24] flex items-center justify-center">
              <img
                src={GENERATED_IMAGES.avatarGaurav}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <User className="h-4 w-4 text-[#7A1F3D] dark:text-[#F8E1E7] -z-10 absolute" />
            </div>
            {!isCompact && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[#24161A] dark:text-[#F9F2EC] truncate leading-tight">
                  Profile
                </p>
                <p className="text-xs text-[#7D666C] dark:text-[#A39196] truncate">
                  {user.name}
                </p>
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleSelect('settings')}
            title={isCompact ? 'Settings' : undefined}
            className={`w-full flex items-center ${
              isCompact ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2.5'
            } rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A317] ${
              activeNav === 'settings'
                ? 'bg-[#F8E1E7]/75 text-[#7A1F3D] dark:bg-[#321B24] dark:text-[#F8E1E7]'
                : 'text-[#5A474C] hover:bg-[#F6EFE7] hover:text-[#24161A] dark:text-[#BEB0B3] dark:hover:bg-[#241B1E] dark:hover:text-[#F9F2EC]'
            }`}
          >
            <Settings className="h-[18px] w-[18px] shrink-0 text-[#877176] dark:text-[#968388]" />
            {!isCompact && <span className="whitespace-nowrap">Settings</span>}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop persistent collapsible sidebar */}
      <aside
        className={`hidden md:block shrink-0 transition-[width] duration-200 ease-out ${
          collapsed ? 'w-[76px]' : 'w-[260px]'
        }`}
      >
        <div className="sticky top-0 h-screen">{sidebarContent(false)}</div>
      </aside>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative z-10 w-[272px] max-w-[82vw] h-full shadow-2xl">
            {sidebarContent(true)}
          </aside>
        </div>
      )}
    </>
  );
};
