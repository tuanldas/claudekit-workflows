"use client";

import { useId } from "react";
import { uiStrings } from "@/i18n/translations";
import { useLocale } from "@/i18n/language-context";
import { Input } from "@/components/ui";

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
      <Input
        id={id}
        name="workflow-search"
        type="search"
        inputMode="search"
        autoComplete="off"
        spellCheck={false}
        placeholder={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        leadingIcon={
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="9" r="6" />
            <path d="m17 17-3.5-3.5" />
          </svg>
        }
      />
    </div>
  );
}
