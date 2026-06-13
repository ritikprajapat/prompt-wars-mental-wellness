import { render, screen } from "@testing-library/react";
import PatternChart from "@/components/PatternChart";
import type { JournalEntry } from "@/lib/types";

let seq = 0;
const entry = (over: Partial<JournalEntry> = {}): JournalEntry => ({
  id: `entry-${seq++}`,
  examType: "NEET",
  mood: 4,
  stress: 2,
  studyHours: 5,
  journal: "ok",
  date: "2026-06-13T10:00:00.000Z",
  ...over,
});

describe("PatternChart", () => {
  it("shows an empty state when there are no entries", () => {
    render(<PatternChart entries={[]} />);
    expect(screen.getByText(/no entries yet/i)).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("renders a row per entry when entries exist", () => {
    render(<PatternChart entries={[entry({ mood: 5 }), entry({ mood: 1 })]} />);
    expect(screen.getByRole("table")).toBeInTheDocument();
    // 2 data rows + 1 header row
    expect(screen.getAllByRole("row")).toHaveLength(3);
  });
});
