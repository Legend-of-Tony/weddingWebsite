import { useEffect, useState } from "react";
import type { Guest } from "../../features/rsvpForm/types";

type GuestAutocompleteProps = {
  value: string;
  onChange: (value: string) => void;
  onSelect: (guest: Guest) => void;
  placeholder?: string;
};

const API_URL = import.meta.env.VITE_API_URL as string;

const GuestAutocomplete = ({
  value,
  onChange,
  onSelect,
  placeholder,
}: GuestAutocompleteProps) => {
  const [results, setResults] = useState<Guest[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!value.trim()) {
      setResults([]);
      return;
    }

    let cancelled = false;

    const run = async () => {
      try {
        const res = await fetch(
          `${API_URL}/guests/search?q=${encodeURIComponent(value)}`,
          { cache: "no-store" }
        );

        if (!res.ok) {
          throw new Error("Failed to search guests.");
        }

        const data: Guest[] = await res.json();

        if (!cancelled) {
          setResults(data);
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setResults([]);
        }
      }
    };

    const timeout = setTimeout(run, 200);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [value]);

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          setTimeout(() => setOpen(false), 100);
        }}
        className="bg-white rounded-xl px-4 py-2 w-full outline-none"
      />

      {open && results.length > 0 && value.trim() && (
        <ul className="absolute z-10 mt-1 w-full bg-white rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {results.map((guest) => (
            <li
              key={guest.id}
              onMouseDown={() => {
                onChange(guest.name);
                onSelect(guest);
                setOpen(false);
              }}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-primary"
            >
              {guest.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GuestAutocomplete;