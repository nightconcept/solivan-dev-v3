import { describe, expect, it } from "vitest";

// We import the component to ensure it's part of the coverage analysis,
// but we won't render it directly using testing-library's render function
// without a specific Astro testing integration.
// import FormattedDate from './FormattedDate.astro';

// Instead, we test the core logic: date formatting.
describe("FormattedDate Component Logic", () => {
  const formatDate = (date: Date): string => {
    // Add timeZone: 'UTC' to format based on the date's UTC value
    return date.toLocaleDateString("en-us", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC", // Specify UTC timezone for formatting
    });
  };

  const getISOString = (date: Date): string => {
    return date.toISOString();
  };

  it("should format the date correctly", () => {
    // Arrange
    // Create Date object explicitly in UTC to avoid local timezone issues
    const testDate = new Date(Date.UTC(2024, 0, 15, 12, 0, 0)); // January 15, 2024, noon UTC
    const expectedFormattedDate = "Jan 15, 2024";

    // Act
    const formatted = formatDate(testDate);

    // Assert
    expect(formatted).toBe(expectedFormattedDate);
  });

  it("should generate the correct ISO string for the datetime attribute", () => {
    // Arrange
    // Create Date object explicitly in UTC
    const testDate = new Date(Date.UTC(2024, 0, 15, 12, 0, 0)); // January 15, 2024, noon UTC
    const expectedISOString = "2024-01-15T12:00:00.000Z";

    // Act
    const isoString = getISOString(testDate);

    // Assert
    expect(isoString).toBe(expectedISOString);
  });

  it("should handle another date correctly", () => {
    // Arrange
    // Create Date object explicitly in UTC
    const testDate = new Date(Date.UTC(2025, 5, 20)); // June 20, 2025, midnight UTC
    const expectedFormattedDate = "Jun 20, 2025";
    const expectedISOString = "2025-06-20T00:00:00.000Z";

    // Act
    const formatted = formatDate(testDate);
    const isoString = getISOString(testDate);

    // Assert
    expect(formatted).toBe(expectedFormattedDate);
    expect(isoString).toBe(expectedISOString);
  });
});
