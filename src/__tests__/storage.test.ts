import { getEntries, saveEntry, clearEntries } from "@/lib/storage";
import type { JournalEntry } from "@/lib/types";

describe("storage helpers", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("saves and retrieves entries", () => {
    const entry: JournalEntry = {
      id: "1",
      examType: "NEET",
      mood: 3,
      stress: 2,
      studyHours: 4,
      journal: "Test",
      date: "2026-06-13",
    };
    saveEntry(entry);
    expect(getEntries()).toEqual([entry]);
  });

  it("clears entries", () => {
    const entry: JournalEntry = {
      id: "1",
      examType: "JEE",
      mood: 3,
      stress: 2,
      studyHours: 4,
      journal: "test",
      date: "2026-06-13",
    };
    saveEntry(entry);
    clearEntries();
    expect(getEntries()).toEqual([]);
  });
});
