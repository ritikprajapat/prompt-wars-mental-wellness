import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import JournalForm from '@/components/JournalForm';
import type { UserProfile } from '@/lib/types';

const mockOnAnalysis = jest.fn();
const mockOnSaveEntries = jest.fn();
const mockOnMoodStressChange = jest.fn();
const profile: UserProfile = {
  name: 'Riya',
  examType: 'NEET',
  examDate: '2026-07-30',
  primaryConcern: 'stress',
};

describe('JournalForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderForm = () =>
    render(
      <JournalForm
        profile={profile}
        entries={[]}
        onAnalysis={mockOnAnalysis}
        onSaveEntries={mockOnSaveEntries}
        onMoodStressChange={mockOnMoodStressChange}
      />
    );

  it('disables submit button until journal text is present', () => {
    renderForm();
    const button = screen.getByRole('button', { name: /analyze/i });
    expect(button).toBeDisabled();
  });

  it('enables submit when journal has text', async () => {
    renderForm();
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Today was productive.' } });

    const button = screen.getByRole('button', { name: /analyze/i });
    await waitFor(() => expect(button).not.toBeDisabled());
  });
});
