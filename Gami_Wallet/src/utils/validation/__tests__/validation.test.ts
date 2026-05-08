import { isValidEmail, validatePassword, validateFullName } from "../index";

describe("isValidEmail", () => {
  describe("accepts valid addresses", () => {
    test.each([
      "user@example.com",
      "first.last@example.co.uk",
      "user+tag@example.com",
      "u_n.a-m+e@sub.example.io",
      "USER@EXAMPLE.COM",
      "  trim.me@example.com  ", // implementation trims
      "x@x.io",
    ])("%s", (email) => {
      expect(isValidEmail(email)).toBe(true);
    });
  });

  describe("rejects invalid addresses", () => {
    test.each([
      "",
      "no-at-sign.com",
      "@no-local.com",
      "missing-domain@",
      "two@@example.com",
      "spaces in@example.com",
      "trailing-dot@example.",
      "user@.example.com",
      "user@-example.com",
      "user@example-.com",
    ])("%s", (email) => {
      expect(isValidEmail(email)).toBe(false);
    });
  });

  it("returns false for non-string input", () => {
    // The function guards against undefined/null at runtime even though
    // its TS signature forbids them; assert that defence here.
    expect(isValidEmail(undefined as unknown as string)).toBe(false);
    expect(isValidEmail(null as unknown as string)).toBe(false);
    expect(isValidEmail(123 as unknown as string)).toBe(false);
  });
});

describe("validatePassword", () => {
  it("returns the required-message for empty input", () => {
    expect(validatePassword("")).toBe("Password is required");
  });

  it("returns the length-message when shorter than 8 chars", () => {
    expect(validatePassword("short")).toBe(
      "Password must be at least 8 characters"
    );
    // exactly 7 chars - still too short
    expect(validatePassword("1234567")).toBe(
      "Password must be at least 8 characters"
    );
  });

  it("returns null for an 8-character password (boundary)", () => {
    expect(validatePassword("12345678")).toBeNull();
  });

  it("returns null for a long valid password", () => {
    expect(validatePassword("a-perfectly-fine-password")).toBeNull();
  });
});

describe("validateFullName", () => {
  it("requires a non-empty name", () => {
    expect(validateFullName("")).toBe("Full name is required");
  });

  it("rejects whitespace-only names", () => {
    expect(validateFullName("   ")).toBe("Full name is required");
  });

  it("requires at least 2 characters after trimming", () => {
    expect(validateFullName("A")).toBe(
      "Full name must be at least 2 characters"
    );
    expect(validateFullName("  A  ")).toBe(
      "Full name must be at least 2 characters"
    );
  });

  it("returns null for valid names", () => {
    expect(validateFullName("Jo")).toBeNull();
    expect(validateFullName("Jane Doe")).toBeNull();
    expect(validateFullName("  Trim Me  ")).toBeNull();
  });
});
