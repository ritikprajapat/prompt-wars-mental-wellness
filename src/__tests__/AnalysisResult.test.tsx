import { render, screen } from '@testing-library/react';
import AnalysisResult from '@/components/AnalysisResult';

describe('AnalysisResult', () => {
  it('renders empty state when no analysis', () => {
    render(<AnalysisResult analysis={null} />);
    expect(screen.getByText(/Analyze your journal/i)).toBeInTheDocument();
  });

  it('displays risk level badge for high risk', () => {
    const analysis = {
      summary: 'You seem overwhelmed.',
      dominantEmotion: 'anxiety',
      riskLevel: 'high' as const,
      stressTriggers: ['Time pressure'],
      patterns: ['Procrastination'],
      copingStrategies: ['Break tasks down'],
      motivationalMessage: 'You can do this.',
      nextAction: 'Take a 5-minute break',
    };

    render(<AnalysisResult analysis={analysis} />);
    expect(screen.getByText('high')).toBeInTheDocument();
  });
});
