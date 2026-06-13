import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import JournalForm from "@/components/JournalForm";

const mockOnAnalysis = jest.fn();
const mockOnSaveEntries = jest.fn();

describe("JournalForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("disables submit button until journal text is present", () => {
    render(
      <JournalForm
        onAnalysis={mockOnAnalysis}
        onSaveEntries={mockOnSaveEntries}
      />,
    );
    const button = screen.getByRole("button", { name: /analyze journal/i });
    expect(button).toBeDisabled();
  });

  it("enables submit when journal has text", async () => {
    render(
      <JournalForm
        onAnalysis={mockOnAnalysis}
        onSaveEntries={mockOnSaveEntries}
      />,
    );
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "Today was productive." } });

    const button = screen.getByRole("button", { name: /analyze journal/i });
    expect(button).not.toBeDisabled();
  });
});
