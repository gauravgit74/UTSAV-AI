import React, { useRef, useState } from 'react';
import {
  Paperclip,
  ArrowUp,
  X,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';
import { EventProfile, SuggestionChip } from '../types/utsav';
import { formatINRCompact } from '../utils/eventUtils';

interface AttachmentFile {
  id: string;
  name: string;
  size: string;
}

interface ShubhPromptBoxProps {
  prompt: string;
  onChangePrompt: (value: string) => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  chips: SuggestionChip[];
  activeEvent: EventProfile;
}

const SAMPLE_ATTACHMENTS: AttachmentFile[] = [
  { id: 'att-moodboard', name: 'Event_Moodboard.pdf', size: '2.4 MB' },
  { id: 'att-guests', name: 'Guest_List_Draft.csv', size: '184 KB' },
];

export const ShubhPromptBox: React.FC<ShubhPromptBoxProps> = ({
  prompt,
  onChangePrompt,
  inputRef,
  chips,
  activeEvent,
}) => {
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [attachMenuOpen, setAttachMenuOpen] = useState(false);
  const [submittedPreview, setSubmittedPreview] = useState<{
    query: string;
    attachedNames: string[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChipClick = (chip: SuggestionChip) => {
    onChangePrompt(chip.prompt);
    setSubmittedPreview(null);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const handleAddSampleAttachment = (file: AttachmentFile) => {
    setAttachments((prev) =>
      prev.some((item) => item.id === file.id) ? prev : [...prev, file]
    );
    setAttachMenuOpen(false);
  };

  const handleLocalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    const nextFiles: AttachmentFile[] = Array.from(fileList).map((f, idx) => ({
      id: `local-${Date.now()}-${idx}`,
      name: f.name,
      size: `${Math.max(1, Math.round(f.size / 1024))} KB`,
    }));
    setAttachments((prev) => [...prev, ...nextFiles]);
    setAttachMenuOpen(false);
    e.target.value = '';
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed) {
      inputRef.current?.focus();
      return;
    }
    setSubmittedPreview({
      query: trimmed,
      attachedNames: attachments.map((a) => a.name),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <section
      aria-labelledby="hero-headline"
      className="mx-auto max-w-4xl pt-6 pb-8 sm:pt-10 sm:pb-10 text-center"
    >
      {/* Hero Headline & Subheadline */}
      <div className="mx-auto max-w-2xl">
        <div className="mb-3 inline-flex items-center gap-2 text-xs font-medium tracking-wide text-[#7A1F3D] dark:text-[#E8A317]">
          <span aria-hidden="true">✦</span>
          <span>Shubh AI Workspace</span>
        </div>

        <h1
          id="hero-headline"
          className="font-serif text-3xl sm:text-5xl font-semibold tracking-tight text-[#24161A] dark:text-[#F9F2EC] leading-[1.14] text-balance"
        >
          Every celebration begins with an idea.
        </h1>

        <p className="mt-3.5 text-base sm:text-lg text-[#6B545A] dark:text-[#BFB0B4] leading-relaxed text-balance">
          Tell Shubh what you&apos;re planning. We&apos;ll help you bring every detail together.
        </p>
      </div>

      {/* Large AI-style Prompt Input Box */}
      <form
        onSubmit={handleSubmit}
        className="relative mx-auto mt-7 max-w-3xl text-left"
      >
        <div className="rounded-2xl border border-[#E5D8CB] dark:border-[#382B2E] bg-white dark:bg-[#1E1719] shadow-[0_8px_30px_rgba(36,22,26,0.06)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition-all duration-200 focus-within:border-[#E8A317] dark:focus-within:border-[#E8A317] focus-within:ring-4 focus-within:ring-[#E8A317]/15">
          {/* Attached files preview row */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 px-4 pt-3.5">
              {attachments.map((file) => (
                <div
                  key={file.id}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#EDE0D4] dark:border-[#382B2E] bg-[#FFF8EE] dark:bg-[#281F22] px-2.5 py-1.5 text-xs text-[#24161A] dark:text-[#F9F2EC]"
                >
                  <FileText className="h-3.5 w-3.5 text-[#7A1F3D] dark:text-[#E8A317] shrink-0" />
                  <span className="max-w-[180px] truncate font-medium">
                    {file.name}
                  </span>
                  <span className="text-[#8A7278] dark:text-[#9D8A8F] tabular-nums">
                    {file.size}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(file.id)}
                    aria-label={`Remove ${file.name}`}
                    className="ml-0.5 rounded p-0.5 text-[#7D666C] hover:bg-[#F8E1E7] hover:text-[#7A1F3D] dark:text-[#A39196] dark:hover:bg-[#3A282D] dark:hover:text-[#F9F2EC]"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="px-4 pt-4 pb-2 sm:px-5 sm:pt-4.5">
            <label htmlFor="shubh-prompt-input" className="sr-only">
              Tell us about your event
            </label>
            <textarea
              ref={inputRef}
              id="shubh-prompt-input"
              rows={3}
              value={prompt}
              onChange={(e) => onChangePrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tell us about your event..."
              className="w-full resize-none bg-transparent text-base text-[#24161A] dark:text-[#F9F2EC] placeholder:text-[#9C868B] dark:placeholder:text-[#867479] focus:outline-none leading-relaxed"
            />
          </div>

          {/* Bottom Toolbar: Attachment + Send */}
          <div className="flex items-center justify-between gap-3 px-3.5 pb-3.5 pt-1 sm:px-4">
            <div className="relative flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleLocalFileChange}
                className="hidden"
                aria-hidden="true"
              />
              <button
                type="button"
                onClick={() => setAttachMenuOpen((prev) => !prev)}
                aria-label="Attach files or moodboards"
                aria-expanded={attachMenuOpen}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#EDE2D6] dark:border-[#34272A] bg-[#FAF4EC] dark:bg-[#261D20] px-3 text-xs sm:text-sm font-medium text-[#5A474C] dark:text-[#D7C8CC] hover:border-[#E8A317] hover:text-[#24161A] dark:hover:text-[#F9F2EC] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A317] whitespace-nowrap shrink-0"
              >
                <Paperclip className="h-4 w-4 text-[#7A1F3D] dark:text-[#E8A317]" />
                <span>Attach</span>
              </button>

              {attachMenuOpen && (
                <div className="absolute left-0 bottom-12 z-30 w-64 rounded-2xl border border-[#EAE0D5] dark:border-[#382B2E] bg-white dark:bg-[#1E1719] p-1.5 shadow-xl">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-[#24161A] dark:text-[#F9F2EC] hover:bg-[#FAF3EB] dark:hover:bg-[#281F22] transition-colors"
                  >
                    <ImageIcon className="h-4 w-4 text-[#7A1F3D] dark:text-[#E8A317]" />
                    <span>Upload moodboard or guest sheet</span>
                  </button>
                  <div className="my-1 border-t border-[#F3EAE0] dark:border-[#2E2225]" />
                  <p className="px-3 py-1 text-[11px] font-medium text-[#8B757A] dark:text-[#9D8A8F]">
                    Quick demo files
                  </p>
                  {SAMPLE_ATTACHMENTS.map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handleAddSampleAttachment(sample)}
                      className="w-full flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-xs text-[#4F3B40] dark:text-[#D5C6CA] hover:bg-[#FAF3EB] dark:hover:bg-[#281F22] transition-colors"
                    >
                      <span className="truncate">{sample.name}</span>
                      <span className="text-[11px] text-[#8B757A] shrink-0 tabular-nums">
                        {sample.size}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {prompt.trim().length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    onChangePrompt('');
                    setSubmittedPreview(null);
                  }}
                  className="px-2.5 py-1.5 text-xs font-medium text-[#8A7278] hover:text-[#7A1F3D] dark:text-[#9D8A8F] dark:hover:text-[#F9F2EC] transition-colors whitespace-nowrap"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-xs text-[#9C868B] dark:text-[#8E7C81]">
                Press Enter to preview
              </span>
              <button
                type="submit"
                aria-label="Send prompt to Shubh AI"
                className={`inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A317] whitespace-nowrap shrink-0 ${
                  prompt.trim().length > 0
                    ? 'bg-[#7A1F3D] text-[#FFFBF5] hover:bg-[#641730] dark:bg-[#E8A317] dark:text-[#1D1316] dark:hover:bg-[#D49212] shadow-sm'
                    : 'bg-[#E8A317]/90 text-[#24161A] hover:bg-[#E8A317]'
                }`}
              >
                <span>Ask Shubh</span>
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Suggestion Chips */}
      <div
        aria-label="Planning prompt suggestions"
        className="mx-auto mt-4 flex max-w-3xl flex-wrap items-center justify-center gap-2"
      >
        {chips.map((chip) => {
          const isSelected = prompt.trim() === chip.prompt.trim();
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => handleChipClick(chip)}
              className={`rounded-xl border px-3.5 py-2 text-xs sm:text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A317] whitespace-nowrap ${
                isSelected
                  ? 'border-[#7A1F3D] bg-[#F8E1E7]/75 text-[#7A1F3D] dark:border-[#E8A317] dark:bg-[#321B24] dark:text-[#F9F2EC]'
                  : 'border-[#EAE0D5] dark:border-[#332629] bg-white/80 dark:bg-[#1C1517] text-[#4E3B40] dark:text-[#D3C4C8] hover:border-[#E8A317] hover:bg-[#FFF9EE] dark:hover:border-[#E8A317]/70 dark:hover:bg-[#251C1F]'
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* Frontend-only Interactive Brief Preview (appears on submit) */}
      {submittedPreview && (
        <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-[#E8D9CA] dark:border-[#392B2F] bg-[#FFFDF9] dark:bg-[#1D1618] p-5 text-left shadow-sm transition-all">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-[#7A1F3D] dark:text-[#E8A317] shrink-0" />
              <div>
                <h3 className="font-serif text-base font-semibold text-[#24161A] dark:text-[#F9F2EC]">
                  Draft Brief for {activeEvent.eventName}
                </h3>
                <p className="text-xs text-[#7D666C] dark:text-[#A8969B]">
                  Shubh workspace preview · {activeEvent.city} · {activeEvent.guestCount} guests
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSubmittedPreview(null)}
              aria-label="Dismiss preview"
              className="rounded-lg p-1.5 text-[#7D666C] hover:bg-[#F5EDE4] hover:text-[#24161A] dark:text-[#A39196] dark:hover:bg-[#2A2023] dark:hover:text-[#F9F2EC]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-3 text-sm text-[#3F2D32] dark:text-[#E4D8D2] leading-relaxed">
            &ldquo;{submittedPreview.query}&rdquo;
          </p>

          {submittedPreview.attachedNames.length > 0 && (
            <p className="mt-2 text-xs text-[#7A1F3D] dark:text-[#E8A317]">
              Included files: {submittedPreview.attachedNames.join(' · ')}
            </p>
          )}

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-[#F2E8DD] dark:border-[#2E2225] pt-4 text-xs">
            <div>
              <p className="font-semibold text-[#24161A] dark:text-[#F9F2EC]">
                1. Venue Match
              </p>
              <p className="mt-0.5 text-[#6E585E] dark:text-[#B4A2A7]">
                Targeting {activeEvent.venuePreference.toLowerCase()} venues in {activeEvent.city} for {activeEvent.guestCount} guests.
              </p>
            </div>
            <div>
              <p className="font-semibold text-[#24161A] dark:text-[#F9F2EC]">
                2. Dining &amp; Crew
              </p>
              <p className="mt-0.5 text-[#6E585E] dark:text-[#B4A2A7]">
                {activeEvent.foodPreference} catering across {activeEvent.functionsCount}{' '}
                {activeEvent.functionsCount === 1 ? 'function' : 'functions'} in a {activeEvent.eventStyle.toLowerCase()} style.
              </p>
            </div>
            <div>
              <p className="font-semibold text-[#24161A] dark:text-[#F9F2EC]">
                3. Budget Alignment
              </p>
              <p className="mt-0.5 text-[#6E585E] dark:text-[#B4A2A7]">
                Structured around {formatINRCompact(activeEvent.totalBudget)} prioritizing{' '}
                {activeEvent.priorities.slice(0, 2).join(' & ') || 'your top goals'}.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
