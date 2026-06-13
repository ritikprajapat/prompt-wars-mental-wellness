import { render, screen } from '@testing-library/react';
import Badge from '@/components/ui/Badge';

describe('Badge', () => {
  it.each([
    ['low', 'emerald'],
    ['moderate', 'amber'],
    ['high', 'rose'],
  ])('applies a risk-appropriate tone for %s', (label, tone) => {
    render(<Badge label={label} />);
    const badge = screen.getByText(label);
    expect(badge.className).toContain(tone);
  });

  it('falls back to a neutral tone for unknown labels', () => {
    render(<Badge label="unknown" />);
    expect(screen.getByText('unknown').className).toContain('violet');
  });
});
