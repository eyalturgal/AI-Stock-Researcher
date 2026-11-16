"use client";
// Runs in the browser because it reacts to a click.

// The button that switches between the dark and light themes.
//
// How theming works on this site:
// 1. The <html> tag carries data-theme="dark" or data-theme="light".
// 2. globals.css gives every color a different value for each theme.
// 3. This button flips that one attribute and saves the choice in the
//    browser (localStorage), so the next visit starts in the same theme.
export function ThemeToggle() {
  function switchTheme() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Saving can fail in private browsing. The switch still works for
      // this visit, it just won't be remembered.
    }
  }

  return (
    <button
      type="button"
      onClick={switchTheme}
      aria-label="Switch between dark and light theme"
      title="Switch theme"
      className="glass-button size-9 border-line p-0"
    >
      {/* Sun: shown in the dark theme, because pressing brings the light. */}
      <svg
        className="only-dark size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      {/* Moon: shown in the light theme. */}
      <svg
        className="only-light size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z" />
      </svg>
    </button>
  );
}
