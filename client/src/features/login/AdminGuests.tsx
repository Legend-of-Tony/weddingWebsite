import { useCallback, useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL as string;

type GuestFilter =
  | "all"
  | "rsvpd"
  | "not-rsvpd"
  | "with-plus-ones"
  | "plus-ones";

type GuestApiRow = {
  id: number;
  name: string;
  is_coming: number | null;
  has_plus_one?: number;
  primary_guest_name?: string;
};

type GuestApiResponse = {
  rows: GuestApiRow[];
  total: number;
  page: number;
  pageSize: number;
};

const FILTER_OPTIONS: Array<{ value: GuestFilter; label: string }> = [
  { value: "all", label: "All guests" },
  { value: "rsvpd", label: "Guests who RSVP'd" },
  { value: "not-rsvpd", label: "Guests who have not RSVP'd" },
  { value: "with-plus-ones", label: "Guests with plus ones" },
  { value: "plus-ones", label: "Plus ones" },
];

const formatRsvpStatus = (isComing: number | null) => {
  if (isComing === 1) {
    return "Attending";
  }

  if (isComing === 0) {
    return "Not attending";
  }

  return "No RSVP";
};

const getRowKey = (filter: GuestFilter, id: number) => `${filter}-${id}`;

const AdminGuests = () => {
  const [rows, setRows] = useState<GuestApiRow[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<GuestFilter>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingRowKey, setEditingRowKey] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftStatus, setDraftStatus] = useState<string>("pending");
  const [savingRowKey, setSavingRowKey] = useState<string | null>(null);
  const [newGuestName, setNewGuestName] = useState("");
  const [newGuestHasPlusOne, setNewGuestHasPlusOne] = useState(false);
  const [isCreatingGuest, setIsCreatingGuest] = useState(false);
  const [updatingPlusOneId, setUpdatingPlusOneId] = useState<number | null>(null);
  const [deletingGuestId, setDeletingGuestId] = useState<number | null>(null);

  const loadGuests = useCallback(
    async (signal?: AbortSignal) => {
      const params = new URLSearchParams({
        filter,
        page: String(page),
      });

      const trimmedSearch = search.trim();

      if (trimmedSearch) {
        params.set("search", trimmedSearch);
      }

      setLoading(true);
      setError("");

      try {
        const res = await fetch(`${API_URL}/admin/guests?${params.toString()}`, {
          credentials: "include",
          signal,
          cache: "no-store",
        });

        const data = (await res.json()) as GuestApiResponse & { error?: string };

        if (!res.ok) {
          throw new Error(data.error || "Failed to load guests.");
        }

        setRows(data.rows);
        setTotal(data.total);
        setPage(data.page);
        setPageSize(data.pageSize);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        const message = err instanceof Error ? err.message : "Failed to load guests.";
        setError(message);
        setRows([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [filter, page, search]
  );

  useEffect(() => {
    const controller = new AbortController();

    loadGuests(controller.signal);

    return () => controller.abort();
  }, [loadGuests]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = total === 0 ? 0 : Math.min(page * pageSize, total);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleFilterChange = (value: GuestFilter) => {
    setFilter(value);
    setPage(1);
  };

  const startEditing = (row: GuestApiRow) => {
    setEditingRowKey(getRowKey(filter, row.id));
    setDraftName(row.name);
    setDraftStatus(
      row.is_coming === null ? "pending" : row.is_coming === 1 ? "attending" : "not-attending"
    );
    setError("");
  };

  const cancelEditing = () => {
    setEditingRowKey(null);
    setDraftName("");
    setDraftStatus("pending");
  };

  const handleSave = async (row: GuestApiRow) => {
    const rowKey = getRowKey(filter, row.id);
    const trimmedName = draftName.trim();

    if (!trimmedName) {
      setError(filter === "plus-ones" ? "Plus one name is required." : "Guest name is required.");
      return;
    }

    const normalizedStatus =
      draftStatus === "attending" ? 1 : draftStatus === "not-attending" ? 0 : null;

    setSavingRowKey(rowKey);
    setError("");

    try {
      const endpoint =
        filter === "plus-ones"
          ? `${API_URL}/admin/guests/plus-ones/${row.id}`
          : `${API_URL}/admin/guests/${row.id}`;

      const res = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: trimmedName,
          is_coming: normalizedStatus,
        }),
      });

      const data = (await res.json()) as {
        error?: string;
        guest?: GuestApiRow;
      };

      if (!res.ok) {
        throw new Error(data.error || "Failed to save changes.");
      }

      setRows((currentRows) =>
        currentRows.map((currentRow) =>
          currentRow.id === row.id
            ? {
                ...currentRow,
                name: trimmedName,
                is_coming: normalizedStatus,
              }
            : currentRow
        )
      );

      cancelEditing();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save changes.";
      setError(message);
    } finally {
      setSavingRowKey(null);
    }
  };

  const handleCreateGuest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = newGuestName.trim();

    if (!trimmedName) {
      setError("Guest name is required.");
      return;
    }

    setIsCreatingGuest(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/admin/guests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: trimmedName,
          has_plus_one: newGuestHasPlusOne ? 1 : 0,
        }),
      });

      const data = (await res.json()) as {
        error?: string;
        guest?: GuestApiRow;
      };

      if (!res.ok) {
        throw new Error(data.error || "Failed to create guest.");
      }

      setNewGuestName("");
      setNewGuestHasPlusOne(false);

      const createdGuest = data.guest;

      if (page === 1 && filter === "all" && !search.trim() && createdGuest) {
        setRows((currentRows) => [createdGuest, ...currentRows].slice(0, pageSize));
        setTotal((currentTotal) => currentTotal + 1);
      } else {
        setPage(1);
        setFilter("all");
        setSearch("");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create guest.";
      setError(message);
    } finally {
      setIsCreatingGuest(false);
    }
  };

  const handlePlusOneToggle = async (row: GuestApiRow) => {
    if (filter === "plus-ones") {
      return;
    }

    setUpdatingPlusOneId(row.id);
    setError("");

    try {
      const nextValue = row.has_plus_one ? 0 : 1;
      const res = await fetch(`${API_URL}/admin/guests/${row.id}/plus-one`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          has_plus_one: nextValue,
        }),
      });

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        throw new Error(data.error || "Failed to update plus-one access.");
      }

      if (filter === "with-plus-ones" && nextValue === 0) {
        setRows((currentRows) => currentRows.filter((currentRow) => currentRow.id !== row.id));
        setTotal((currentTotal) => Math.max(0, currentTotal - 1));
        return;
      }

      setRows((currentRows) =>
        currentRows.map((currentRow) =>
          currentRow.id === row.id
            ? {
                ...currentRow,
                has_plus_one: nextValue,
              }
            : currentRow
        )
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update plus-one access.";
      setError(message);
    } finally {
      setUpdatingPlusOneId(null);
    }
  };

  const handleDeleteGuest = async (row: GuestApiRow) => {
    if (filter === "plus-ones") {
      return;
    }

    const confirmed = window.confirm(`Delete ${row.name} from the guest list?`);

    if (!confirmed) {
      return;
    }

    setDeletingGuestId(row.id);
    setError("");

    try {
      const res = await fetch(`${API_URL}/admin/guests/${row.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete guest.");
      }

      setRows((currentRows) => currentRows.filter((currentRow) => currentRow.id !== row.id));
      setTotal((currentTotal) => Math.max(0, currentTotal - 1));

      if (editingRowKey === getRowKey(filter, row.id)) {
        cancelEditing();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete guest.";
      setError(message);
    } finally {
      setDeletingGuestId(null);
    }
  };

  const tableLabel = filter === "plus-ones" ? "Plus Ones" : "Guests";

  return (
    <div className="min-h-screen bg-stone-100 px-4 py-10 text-primary sm:px-8">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.08)] sm:p-8">
        <div className="mb-8 flex flex-col gap-6">
          <div>
            <h1 className="mb-2 text-4xl text-secondary sm:text-5xl">Guest Dashboard</h1>
            <p className="font-sans text-sm text-primary/70 sm:text-base">
              Search your list, filter by RSVP activity, create new guests, and
              manage plus-one access in one place.
            </p>
          </div>

          <form
            onSubmit={handleCreateGuest}
            className="rounded-[1.5rem] border border-black/10 bg-stone-50 p-5"
          >
            <div className="mb-3">
              <h2 className="text-2xl text-secondary">Add Guest</h2>
              <p className="font-sans text-sm text-primary/65">
                Create a new guest and decide whether they can bring a plus one.
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
              <label className="flex-1">
                <span className="mb-2 block font-sans text-sm font-medium uppercase tracking-[0.2em] text-primary/60">
                  Guest name
                </span>
                <input
                  type="text"
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                  placeholder="Add a guest name"
                  className="w-full rounded-full border border-black/15 bg-white px-5 py-3 font-sans text-base outline-none transition focus:border-secondary"
                />
              </label>

              <label className="flex items-center gap-3 rounded-full border border-black/15 bg-white px-5 py-3 font-sans text-sm text-primary lg:min-w-56">
                <input
                  type="checkbox"
                  checked={newGuestHasPlusOne}
                  onChange={(e) => setNewGuestHasPlusOne(e.target.checked)}
                  className="h-4 w-4 accent-secondary"
                />
                Allow plus one
              </label>

              <button
                type="submit"
                disabled={isCreatingGuest}
                className="rounded-full bg-secondary px-6 py-3 font-sans text-sm font-medium uppercase tracking-[0.18em] text-white transition hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCreatingGuest ? "Adding..." : "Add guest"}
              </button>
            </div>
          </form>

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex-1">
              <span className="mb-2 block font-sans text-sm font-medium uppercase tracking-[0.2em] text-primary/60">
                Search
              </span>
              <input
                type="search"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search guests by name"
                className="w-full rounded-full border border-black/15 bg-stone-50 px-5 py-3 font-sans text-base outline-none transition focus:border-secondary"
              />
            </label>

            <label className="sm:w-72">
              <span className="mb-2 block font-sans text-sm font-medium uppercase tracking-[0.2em] text-primary/60">
                Filter
              </span>
              <select
                value={filter}
                onChange={(e) => handleFilterChange(e.target.value as GuestFilter)}
                className="w-full rounded-full border border-black/15 bg-stone-50 px-5 py-3 font-sans text-base outline-none transition focus:border-secondary"
              >
                {FILTER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="overflow-hidden rounded-[1.5rem] border border-black/10">
          <table className="w-full table-fixed border-collapse">
            <colgroup>
              <col className="w-[72%]" />
              <col className="w-[28%]" />
            </colgroup>

            <thead className="bg-secondary text-left text-white">
              <tr>
                <th className="px-5 py-4 font-sans text-xs font-semibold uppercase tracking-[0.24em]">
                  {tableLabel}
                </th>
                <th className="px-5 py-4 font-sans text-xs font-semibold uppercase tracking-[0.24em]">
                  RSVP Status
                </th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {loading ? (
                <tr>
                  <td colSpan={2} className="px-5 py-10 text-center font-sans text-primary/60">
                    Loading guests...
                  </td>
                </tr>
              ) : null}

              {!loading && error ? (
                <tr>
                  <td colSpan={2} className="px-5 py-10 text-center font-sans text-secondary">
                    {error}
                  </td>
                </tr>
              ) : null}

              {!loading && !error && rows.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-5 py-10 text-center font-sans text-primary/60">
                    No guests matched that search.
                  </td>
                </tr>
              ) : null}

              {!loading && !error
                ? rows.map((row) => (
                    <tr key={`${filter}-${row.id}`} className="border-t border-black/8">
                      <td className="px-5 py-4 align-top">
                        {editingRowKey === getRowKey(filter, row.id) ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={draftName}
                              onChange={(e) => setDraftName(e.target.value)}
                              className="w-full rounded-full border border-black/15 bg-stone-50 px-4 py-2 font-sans text-base outline-none transition focus:border-secondary"
                            />
                            {filter === "plus-ones" && row.primary_guest_name ? (
                              <div className="font-sans text-sm text-primary/55">
                                Linked to {row.primary_guest_name}
                              </div>
                            ) : null}
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => handleSave(row)}
                                disabled={
                                  savingRowKey === getRowKey(filter, row.id) ||
                                  deletingGuestId === row.id
                                }
                                className="rounded-full bg-secondary px-4 py-2 font-sans text-sm text-white transition hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {savingRowKey === getRowKey(filter, row.id) ? "Saving..." : "Save"}
                              </button>
                              <button
                                type="button"
                                onClick={cancelEditing}
                                disabled={
                                  savingRowKey === getRowKey(filter, row.id) ||
                                  deletingGuestId === row.id
                                }
                                className="rounded-full border border-black/15 px-4 py-2 font-sans text-sm text-primary transition hover:border-primary"
                              >
                                Cancel
                              </button>
                              {filter !== "plus-ones" ? (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteGuest(row)}
                                  disabled={
                                    savingRowKey === getRowKey(filter, row.id) ||
                                    deletingGuestId === row.id
                                  }
                                  className="rounded-full border border-red-300 px-4 py-2 font-sans text-sm text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  {deletingGuestId === row.id ? "Deleting..." : "Delete"}
                                </button>
                              ) : null}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="font-sans text-base font-medium text-primary">
                              {row.name}
                            </div>
                            {filter === "plus-ones" && row.primary_guest_name ? (
                              <div className="font-sans text-sm text-primary/55">
                                Linked to {row.primary_guest_name}
                              </div>
                            ) : null}
                            {filter !== "plus-ones" ? (
                              <div className="flex flex-wrap items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handlePlusOneToggle(row)}
                                  disabled={updatingPlusOneId === row.id}
                                  className={`rounded-full px-3 py-1 font-sans text-xs uppercase tracking-[0.18em] transition ${
                                    row.has_plus_one
                                      ? "bg-accent text-primary"
                                      : "border border-black/15 text-primary hover:border-secondary hover:text-secondary"
                                  } disabled:cursor-not-allowed disabled:opacity-60`}
                                >
                                  {updatingPlusOneId === row.id
                                    ? "Saving..."
                                    : row.has_plus_one
                                      ? "Has plus one"
                                      : "No plus one"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => startEditing(row)}
                                  className="rounded-full border border-black/15 px-3 py-1 font-sans text-xs uppercase tracking-[0.18em] text-primary transition hover:border-secondary hover:text-secondary"
                                >
                                  Edit
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => startEditing(row)}
                                className="rounded-full border border-black/15 px-3 py-1 font-sans text-xs uppercase tracking-[0.18em] text-primary transition hover:border-secondary hover:text-secondary"
                              >
                                Edit
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 align-top">
                        {editingRowKey === getRowKey(filter, row.id) ? (
                          <select
                            value={draftStatus}
                            onChange={(e) => setDraftStatus(e.target.value)}
                            className="w-full rounded-full border border-black/15 bg-stone-50 px-4 py-2 font-sans text-sm text-primary outline-none transition focus:border-secondary"
                          >
                            <option value="pending">No RSVP</option>
                            <option value="attending">Attending</option>
                            <option value="not-attending">Not attending</option>
                          </select>
                        ) : (
                          <span className="inline-flex rounded-full bg-stone-100 px-3 py-1 font-sans text-sm text-primary">
                            {formatRsvpStatus(row.is_coming)}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex flex-col gap-4 border-t border-black/10 pt-5 font-sans sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-primary/65">
            Showing {startItem}-{endItem} of {total} {tableLabel.toLowerCase()}
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1 || loading}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-black/15 bg-white text-xl text-primary transition hover:border-secondary hover:text-secondary disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous page"
            >
              ←
            </button>

            <span className="min-w-24 text-center text-sm text-primary/75">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page >= totalPages || loading}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-black/15 bg-white text-xl text-primary transition hover:border-secondary hover:text-secondary disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next page"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminGuests;
