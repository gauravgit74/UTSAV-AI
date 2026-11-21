import { useEffect, useMemo, useRef, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { ShubhPromptBox } from './components/ShubhPromptBox';
import { EventOverview } from './components/EventOverview';
import { FeatureCards } from './components/FeatureCards';
import { ModulePreviewModal } from './components/ModulePreviewModal';
import { LoginScreen } from './components/LoginScreen';
import { EventSetupWizard } from './components/EventSetupWizard';
import {
  buildFeatureCards,
  buildInitialNotifications,
  buildSuggestionChips,
} from './data/mockUtsavData';
import {
  EventProfile,
  FeatureCardItem,
  NavSectionId,
  NotificationItem,
  UserProfile,
} from './types/utsav';
import {
  clearUserProfile,
  loadAllEventProfiles,
  loadEventProfile,
  loadUserProfile,
  saveEventProfile,
  saveUserProfile,
  setActiveEventProfile,
} from './utils/eventUtils';

type WizardMode = 'create' | 'edit' | null;

export default function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() =>
    loadUserProfile()
  );
  const [eventsList, setEventsList] = useState<EventProfile[]>(() =>
    loadAllEventProfiles()
  );
  const [activeEvent, setActiveEvent] = useState<EventProfile | null>(() =>
    loadEventProfile()
  );
  const [wizardMode, setWizardMode] = useState<WizardMode>(null);

  const [activeNav, setActiveNav] = useState<NavSectionId>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const initial = loadEventProfile();
    return initial ? buildInitialNotifications(initial) : [];
  });

  const [prompt, setPrompt] = useState('');
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  const [modalSection, setModalSection] = useState<NavSectionId | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const suggestionChips = useMemo(
    () => (activeEvent ? buildSuggestionChips(activeEvent) : []),
    [activeEvent]
  );

  const featureCards = useMemo(
    () => (activeEvent ? buildFeatureCards(activeEvent) : []),
    [activeEvent]
  );

  const handleLoginSuccess = (profile: UserProfile) => {
    saveUserProfile(profile);
    setUserProfile(profile);
  };

  const handleSignOut = () => {
    clearUserProfile();
    setUserProfile(null);
    setModalSection(null);
    setWizardMode(null);
    setActiveNav('dashboard');
  };

  const handleWizardComplete = (savedEvent: EventProfile) => {
    const updatedList = saveEventProfile(savedEvent);
    setEventsList(updatedList);
    setActiveEvent(savedEvent);
    setNotifications(buildInitialNotifications(savedEvent));
    setWizardMode(null);
    setActiveNav('dashboard');
    setModalSection(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectEvent = (eventId: string) => {
    const found = eventsList.find((item) => item.id === eventId);
    if (!found) return;
    setActiveEventProfile(found);
    setActiveEvent(found);
    setNotifications(buildInitialNotifications(found));
    setPrompt('');
  };

  const handleOpenEditWizard = () => {
    setModalSection(null);
    setWizardMode('edit');
  };

  const handleOpenCreateWizard = () => {
    setModalSection(null);
    setWizardMode('create');
  };

  const handleSelectNav = (id: NavSectionId) => {
    setActiveNav(id);
    if (id === 'dashboard') {
      setModalSection(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (id === 'shubh-ai') {
      setModalSection(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      requestAnimationFrame(() => {
        promptInputRef.current?.focus();
      });
      return;
    }
    setModalSection(id);
  };

  const handleSelectFeatureCard = (card: FeatureCardItem) => {
    setActiveNav(card.id);
    setModalSection(card.id);
  };

  const handleUsePromptInShubh = (promptText: string) => {
    setPrompt(promptText);
    setActiveNav('shubh-ai');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    requestAnimationFrame(() => {
      promptInputRef.current?.focus();
    });
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  // 1. Login gate when user is not logged in
  if (!userProfile) {
    return (
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
      />
    );
  }

  // 2. Event setup wizard when user has no event, or is creating/editing an event
  if (!activeEvent || wizardMode !== null) {
    return (
      <EventSetupWizard
        key={wizardMode === 'edit' && activeEvent ? `edit-${activeEvent.id}` : 'create-new'}
        user={userProfile}
        initialEvent={wizardMode === 'edit' ? activeEvent : null}
        canCancel={Boolean(activeEvent)}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        onComplete={handleWizardComplete}
        onCancel={() => setWizardMode(null)}
      />
    );
  }

  // 3. Main Utsav AI Workspace
  return (
    <div className="min-h-screen flex bg-[#FFFBF5] text-[#24161A] dark:bg-[#140F11] dark:text-[#F9F2EC] transition-colors duration-200">
      <Sidebar
        user={userProfile}
        activeNav={activeNav}
        onSelectNav={handleSelectNav}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar
          user={userProfile}
          events={eventsList}
          selectedEvent={activeEvent}
          onSelectEvent={handleSelectEvent}
          onEditEvent={handleOpenEditWizard}
          onCreateNewEvent={handleOpenCreateWizard}
          notifications={notifications}
          onMarkAllRead={handleMarkAllRead}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          isDark={isDark}
          onToggleTheme={() => setIsDark((prev) => !prev)}
        />

        <main className="flex-1 px-4 sm:px-8">
          <ShubhPromptBox
            prompt={prompt}
            onChangePrompt={setPrompt}
            inputRef={promptInputRef}
            chips={suggestionChips}
            activeEvent={activeEvent}
          />

          <EventOverview
            event={activeEvent}
            onEditEvent={handleOpenEditWizard}
            onInspectModule={(sectionId) => {
              setActiveNav(sectionId);
              setModalSection(sectionId);
            }}
          />

          <FeatureCards
            cards={featureCards}
            onSelectCard={handleSelectFeatureCard}
          />
        </main>
      </div>

      <ModulePreviewModal
        activeSection={modalSection}
        featureCards={featureCards}
        selectedEvent={activeEvent}
        user={userProfile}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        onEditEvent={handleOpenEditWizard}
        onCreateNewEvent={handleOpenCreateWizard}
        onSignOut={handleSignOut}
        onClose={() => {
          setModalSection(null);
          setActiveNav('dashboard');
        }}
        onUsePromptInShubh={handleUsePromptInShubh}
      />
    </div>
  );
}
