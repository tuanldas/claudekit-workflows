"use client";

import { useId } from "react";
import { uiStrings } from "@/i18n/translations";
import { useLocale } from "@/i18n/language-context";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const { locale } = useLocale();
  const id = useId();
  const label = uiStrings.searchPlaceholder[locale];

  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <svg
        className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="2"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        id={id}
        name="workflow-search"
        type="search"
        inputMode="search"
        autoComplete="off"
        spellCheck={false}
        placeholder={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 py-2 pr-4 pl-10 text-sm text-gray-700 placeholder-gray-400 transition-colors focus-visible:border-orange-300 focus-visible:ring-2 focus-visible:ring-orange-100 focus-visible:outline-none"
      />
    </div>
  );
}
