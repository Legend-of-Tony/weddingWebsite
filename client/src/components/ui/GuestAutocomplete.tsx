import { useEffect, useState } from 'react';

type Guest = {
  id: number;
  name: string;
};

type GuestAutocompleteProps = {
  value: string;
  onChange: (value: string) => void;
};

const API_URL = import.meta.env.VITE_API_URL;

const GuestAutocomplete = ({ value, onChange }: GuestAutocompleteProps) => {
  const [matches, setMatches] = useState<Guest[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchGuests = async () => {
      if (!value.trim()) {
        setMatches([]);
        setShowDropdown(false);
        return;
      }

    try {
      const res = await fetch(
        `${API_URL}/guests/search?q=${encodeURIComponent(value)}`
      );

      const data = await res.json();

      setMatches(data);
      setShowDropdown(data.length > 0); // 👈 key line
    } catch (error) {
      console.error(error);
      setMatches([]);
      setShowDropdown(false);
    }
  };

    const timeout = setTimeout(fetchGuests, 200);
    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          if (matches.length > 0) setShowDropdown(true);
        }}
        autoComplete="off"
        className="bg-white rounded-xl px-4 w-full"
      />

      {showDropdown && matches.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {matches.map((guest) => (
            <li
                key={guest.id}
                onClick={() => {
                onChange(guest.name);
                setMatches([]);          // 👈 add this
                setShowDropdown(false);  // 👈 keep this
                }}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
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