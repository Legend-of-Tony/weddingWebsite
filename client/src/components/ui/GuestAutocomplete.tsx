import { useEffect, useState } from "react";
import type { Guest } from "../../features/rsvpForm/types";
import { API_URL } from "../../config/api";

type GuestAutocompleteProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (guest: Guest) => void;
  placeholder?: string;
};

const GuestAutocomplete = ({
  id,
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
    <div className="relative z-20">
      <input
        id={id}
        name={id}
        type="text"
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        autoCapitalize="words"
        autoCorrect="off"
        spellCheck={false}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          setTimeout(() => setOpen(false), 100);
        }}
        className="relative z-20 w-full touch-manipulation rounded-xl bg-white px-4 py-3 text-base text-primary outline-none"
      />

      {open && results.length > 0 && value.trim() && (
        <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-xl bg-white shadow-lg">
          {results.map((guest) => (
            <li
              key={guest.id}
              onPointerDown={(e) => {
                e.preventDefault();
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
