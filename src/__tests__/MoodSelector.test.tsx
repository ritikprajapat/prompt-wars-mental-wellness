import { render, screen, fireEvent } from '@testing-library/react';
import MoodSelector from '@/components/MoodSelector';

describe('MoodSelector', () => {
  it('renders 5 radio buttons and selects correctly', () => {
    const onChange = jest.fn();
    render(<MoodSelector value={3} onChange={onChange} />);

    const options = screen.getAllByRole('radio');
    expect(options).toHaveLength(5);
    expect(options[2]).toHaveAttribute('aria-checked', 'true');

    const lastOption = options[4];
    expect(lastOption).toBeDefined();
    fireEvent.click(lastOption as HTMLElement);
    expect(onChange).toHaveBeenCalledWith(5);
  });
});
