import { useEffect, useState } from "react";

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

  useEffect(() => {
    const controller = new AbortController();
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

    fetch(`${API_URL}/admin/guests?${params.toString()}`, {
      credentials: "include",
      signal: controller.signal,
    })
      .then(async (res) => {
        const data = (await res.json()) as GuestApiResponse & { error?: string };

        if (!res.ok) {
          throw new Error(data.error || "Failed to load guests.");
        }

        return data;
      })
      .then((data) => {
        setRows(data.rows);
        setTotal(data.total);
        setPage(data.page);
        setPageSize(data.pageSize);
      })
      .catch((err: Error) => {
        if (err.name === "AbortError") {
          return;
        }

        setError(err.message);
        setRows([]);
        setTotal(0);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => controller.abort();
  }, [filter, page, search]);

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

      const data = (await res.json()) as { error?: string };

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

  const tableLabel = filter === "plus-ones" ? "Plus Ones" : "Guests";

  return (
    <div className="min-h-screen bg-stone-100 px-4 py-10 text-primary sm:px-8">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.08)] sm:p-8">
        <div className="mb-8 flex flex-col gap-5">
          <div>
            <h1 className="mb-2 text-4xl text-secondary sm:text-5xl">Guest Dashboard</h1>
            <p className="font-sans text-sm text-primary/70 sm:text-base">
              Search your list, filter by RSVP activity, and browse guests 15 at a
              time.
            </p>
          </div>

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
                                disabled={savingRowKey === getRowKey(filter, row.id)}
                                className="rounded-full bg-secondary px-4 py-2 font-sans text-sm text-white transition hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {savingRowKey === getRowKey(filter, row.id) ? "Saving..." : "Save"}
                              </button>
                              <button
                                type="button"
                                onClick={cancelEditing}
                                disabled={savingRowKey === getRowKey(filter, row.id)}
                                className="rounded-full border border-black/15 px-4 py-2 font-sans text-sm text-primary transition hover:border-primary"
                              >
                                Cancel
                              </button>
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
                            <button
                              type="button"
                              onClick={() => startEditing(row)}
                              className="rounded-full border border-black/15 px-3 py-1 font-sans text-xs uppercase tracking-[0.18em] text-primary transition hover:border-secondary hover:text-secondary"
                            >
                              Edit
                            </button>
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
