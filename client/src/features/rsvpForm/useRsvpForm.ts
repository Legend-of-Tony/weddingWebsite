import { useCallback, useState } from "react";
import type { Guest } from "./types";
import { API_URL } from "../../config/api";

export const useRsvpForm = () => {
  const [guestName, setGuestName] = useState("");
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

  const [partySize, setPartySize] = useState("1");
  const [additionalGuestNames, setAdditionalGuestNames] = useState<string[]>([]);

  const [attendance, setAttendance] = useState<"yes" | "no" | null>(null);

  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearDependentFields = useCallback(() => {
    setPartySize("1");
    setAdditionalGuestNames([]);
    setAttendance(null);
    setError("");
  }, []);

  const handleGuestNameChange = useCallback(
    (value: string) => {
      setGuestName(value);
      setError("");

      // only clear full selection if input is emptied
      if (!value.trim()) {
        setSelectedGuest(null);
        clearDependentFields();
      }
    },
    [clearDependentFields]
  );

  const handleGuestSelect = useCallback((guest: Guest) => {
    setGuestName(guest.name);
    setSelectedGuest(guest);
    setAttendance(null);
    setError("");

    if (guest.has_plus_one === 1) {
      setPartySize("2");
      setAdditionalGuestNames([""]);
    } else {
      setPartySize("1");
      setAdditionalGuestNames([]);
    }
  }, []);

  const handlePartySizeChange = useCallback((value: string) => {
    if (value === "") {
      setPartySize("");
      setAdditionalGuestNames([]);
      return;
    }

    if (!/^\d+$/.test(value)) return;

    const parsed = Math.max(1, Math.min(10, Number(value)));
    setPartySize(String(parsed));

    const extraCount = parsed - 1;

    setAdditionalGuestNames((prev) => {
      const next = [...prev];

      if (next.length > extraCount) {
        return next.slice(0, extraCount);
      }

      while (next.length < extraCount) {
        next.push("");
      }

      return next;
    });
  }, []);

  const handleAdditionalGuestNameChange = useCallback(
    (index: number, value: string) => {
      setAdditionalGuestNames((prev) =>
        prev.map((name, i) => (i === index ? value : name))
      );
    },
    []
  );

  const findExactGuestByName = useCallback(async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return null;

    const res = await fetch(
      `${API_URL}/guests/search?q=${encodeURIComponent(trimmed)}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error("Failed to verify guest name.");
    }

    const results: Guest[] = await res.json();

    return (
      results.find(
        (guest) => guest.name.trim().toLowerCase() === trimmed.toLowerCase()
      ) ?? null
    );
  }, []);

  const validate = useCallback(
    (guest: Guest | null) => {
      if (!guest?.id) {
        return "Please select a valid guest from the list.";
      }

      if (!attendance) {
        return "Please choose whether you will be attending.";
      }

      if (attendance === "no") {
        return "";
      }

      const parsedPartySize = Number(partySize || "0");
      const trimmedExtraNames = additionalGuestNames.map((name) => name.trim());

      if (guest.has_plus_one === 0 && parsedPartySize < 1) {
        return "Party size must be at least 1.";
      }

      if (guest.has_plus_one === 1 && !trimmedExtraNames[0]) {
        return "Please enter the name of your plus one.";
      }

      if (trimmedExtraNames.some((name) => !name)) {
        return "Please complete all guest names.";
      }

      const normalized = [guest.name, ...trimmedExtraNames].map((name) =>
        name.trim().toLowerCase()
      );

      if (new Set(normalized).size !== normalized.length) {
        return "Duplicate guest names are not allowed.";
      }

      return "";
    },
    [attendance, partySize, additionalGuestNames]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError("");
      setIsSubmitting(true);

      try {
        let guestForSubmit = selectedGuest;

        if (
          !guestForSubmit ||
          guestForSubmit.name.trim().toLowerCase() !==
            guestName.trim().toLowerCase()
        ) {
          guestForSubmit = await findExactGuestByName(guestName);
        }

        if (guestForSubmit) {
          setSelectedGuest(guestForSubmit);
          setGuestName(guestForSubmit.name);
        }

        const validationError = validate(guestForSubmit);
        if (validationError) {
          setError(validationError);
          return;
        }

        if (!guestForSubmit || !attendance) {
          setError("Please complete the form.");
          return;
        }

        const payload = {
          guestId: guestForSubmit.id,
          isComing: attendance === "yes" ? 1 : 0,
          partySize: Number(partySize || "1"),
          additionalGuests:
            attendance === "yes"
              ? additionalGuestNames
                  .map((name) => name.trim())
                  .filter(Boolean)
                  .map((name) => ({
                    id: null,
                    name,
                  }))
              : [],
        };

        console.log("Submitting guest:", guestForSubmit);
        console.log("Submitting payload:", payload);

        const res = await fetch(`${API_URL}/rsvp`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const contentType = res.headers.get("content-type");

        if (!contentType || !contentType.includes("application/json")) {
          const text = await res.text();
          throw new Error(text || `Request failed with status ${res.status}`);
        }

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Failed to submit RSVP.");
        }

        setSubmitted(true);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      additionalGuestNames,
      attendance,
      findExactGuestByName,
      guestName,
      partySize,
      selectedGuest,
      validate,
    ]
  );

  return {
    guestName,
    selectedGuest,
    attendance,
    partySize,
    additionalGuestNames,
    error,
    submitted,
    isSubmitting,
    setAttendance,
    handleGuestNameChange,
    handleGuestSelect,
    handlePartySizeChange,
    handleAdditionalGuestNameChange,
    handleSubmit,
  };
};
