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
    <div className="relative z-[100]">
      <input
        id={id}
        name={id}
        type="text"
        value={value}
        placeholder={placeholder}
        autoComplete="name"
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
        className="relative z-[100] w-full touch-manipulation rounded-xl bg-white px-4 py-3 text-base text-primary outline-none"
      />

      {open && results.length > 0 && value.trim() && (
        <ul className="absolute z-[110] mt-1 max-h-72 w-full overflow-y-auto rounded-xl bg-white shadow-2xl">
          {results.map((guest) => (
            <li
              key={guest.id}
              onPointerDown={(e) => {
                e.preventDefault();
                onChange(guest.name);
                onSelect(guest);
                setOpen(false);
              }}
              className="min-h-11 cursor-pointer px-4 py-3 text-primary hover:bg-gray-100"
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
