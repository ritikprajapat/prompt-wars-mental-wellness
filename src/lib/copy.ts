/**
 * Centralized, user-facing UI copy. Keeping strings here keeps components
 * presentational and makes future localization a single-file change.
 */
export const copy = {
  app: {
    name: 'Mental Wellness',
    tagline: 'reflect, understand, and grow',
    description: 'AI mental wellness companion for NEET JEE UPSC students',
    intro:
      'Journal your day, get gentle AI insights into your patterns, and chat with a supportive companion — all in one peaceful place.',
    skipToContent: 'Skip to main content',
  },
  onboarding: {
    title: 'Welcome 👋',
    nameStep: 'What should we call you?',
    namePlaceholder: 'Your first name',
    examStep: 'Which exam are you preparing for?',
    examDateLabel: 'When is your exam?',
    concernStep: 'What brings you here today?',
    concerns: {
      stress: 'Managing stress',
      burnout: 'Avoiding burnout',
      motivation: 'Staying motivated',
    },
    next: 'Continue',
    back: 'Back',
    finish: 'Start journaling',
  },
  journal: {
    title: "Today's check-in",
    subtitle: "A few quick taps, then write whatever's on your mind.",
    examLabel: 'Exam type',
    studyHoursLabel: 'Study hours',
    moodLabel: 'Mood',
    moodHint: 'Tap the face that best matches how you feel right now.',
    stressLabel: 'Stress level',
    journalLabel: 'Journal entry',
    journalPlaceholder: "How did today feel? What's weighing on you?",
    journalHint: 'Write at least 10 characters — there are no wrong answers.',
    submit: 'Analyze my journal',
    analyzing: 'Analyzing…',
    tooShort: 'Add a little more detail (at least 10 characters).',
  },
  analysis: {
    title: 'AI analysis',
    empty:
      'Analyze your journal to receive emotional patterns, coping advice, and next steps.',
    summary: 'Summary',
    triggers: 'Stress triggers',
    patterns: 'Patterns',
    coping: 'Coping strategies',
    motivation: 'Motivation',
    burnoutRisk: 'Burnout risk',
    nextAction: 'Next action',
  },
  chat: {
    title: 'Companion chat',
    subtitle: 'Aarav listens and supports your study feelings.',
    empty: 'No messages yet — say hello to start the conversation. 💬',
    placeholder: 'Type a message…  (Enter to send, Shift+Enter for a new line)',
    send: 'Send',
    messageLabel: 'Message',
  },
  common: {
    loading: 'Loading…',
    error: 'Something went wrong. Please try again.',
    retry: 'Try again',
  },
} as const;
