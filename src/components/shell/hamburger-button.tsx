"use client";

interface Props {
  onClick: () => void;
  label: string;
}

export function HamburgerButton({ onClick, label }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded text-gray-700 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-1 focus-visible:outline-none lg:hidden dark:text-gray-200 dark:hover:bg-gray-800"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>
  );
}
