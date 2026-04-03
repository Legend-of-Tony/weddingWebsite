import GridLayout from "../../components/layout/GridLayout";
import FormImage from "../../assets/formImage.jpeg";
import RSVPButton from "../../components/ui/RSVPButton";
import GuestAutocomplete from "../../components/ui/GuestAutocomplete";
import { useRsvpForm } from "./useRsvpForm.ts";

const Rsvp = () => {
  const {
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
  } = useRsvpForm();

  if (submitted) {
    return (
      <GridLayout id="rsvp" className="w-full bg-secondary">
        <div className="order-1 flex min-h-[50vh] flex-col items-center justify-center px-6 py-16 text-center text-accent lg:col-span-4 lg:min-h-screen lg:px-12">
          <h1 className="mb-6 text-5xl lg:text-6xl">Thank You</h1>
          <p className="max-w-lg text-2xl">Your RSVP has been submitted successfully.</p>
        </div>

        <div
          style={{ backgroundImage: `url(${FormImage})` }}
          className="order-2 min-h-[50vh] bg-cover bg-center lg:col-span-4 lg:min-h-screen"
        />
      </GridLayout>
    );
  }

  return (
    <GridLayout id="rsvp" className="w-full bg-secondary">
      <div className="order-1 flex min-h-[50vh] flex-col justify-start px-6 py-12 text-accent lg:col-span-4 lg:min-h-screen lg:px-12 lg:py-20">
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col">
          <h1 className="pt-4 text-center text-6xl lg:text-left lg:text-7xl">
            VIP SECTION
          </h1>

          <p className="mt-3 text-center text-3xl font-light lg:text-left lg:text-4xl">
            RSVP NOW
          </p>

          <form onSubmit={handleSubmit} className="mt-10 grid w-full gap-6 pb-8">
            <div className="grid gap-2">
              <label htmlFor="guestName" className="text-accent">
                Name
              </label>
              <GuestAutocomplete
                value={guestName}
                onChange={handleGuestNameChange}
                onSelect={handleGuestSelect}
              />
              {selectedGuest && (
                <p className="text-xs text-green-300">
                  Selected: {selectedGuest.name}
                </p>
              )}
            </div>

            {selectedGuest && selectedGuest.has_plus_one === 1 && (
              <div className="grid gap-2">
                <label htmlFor="plusOneName" className="text-accent">
                  What is the name of your plus one?
                </label>
                <input
                  id="plusOneName"
                  type="text"
                  value={additionalGuestNames[0] ?? ""}
                  onChange={(e) =>
                    handleAdditionalGuestNameChange(0, e.target.value)
                  }
                  className="rounded-xl bg-white px-4 py-2 outline-none"
                />
              </div>
            )}

            {selectedGuest && selectedGuest.has_plus_one === 0 && (
              <>
                <div className="grid gap-2">
                  <label htmlFor="partySize" className="text-accent">
                    How many guests are in your party?
                  </label>
                  <input
                    id="partySize"
                    type="text"
                    inputMode="numeric"
                    value={partySize}
                    onChange={(e) => handlePartySizeChange(e.target.value)}
                    className="rounded-xl bg-white px-4 py-2 outline-none"
                  />
                </div>

                {additionalGuestNames.length > 0 &&
                  additionalGuestNames.map((value, index) => (
                    <div className="grid gap-2" key={`extra-guest-${index}`}>
                      <label className="text-accent">Guest {index + 2} Name</label>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) =>
                          handleAdditionalGuestNameChange(index, e.target.value)
                        }
                        className="rounded-xl bg-white px-4 py-2 outline-none"
                      />
                    </div>
                  ))}
              </>
            )}

            <div className="grid gap-2">
              <label htmlFor="attending" className="text-accent">
                Will you be attending?
              </label>
              <RSVPButton value={attendance} onChange={setAttendance} />
            </div>

            {error && <p className="text-sm text-red-300">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded bg-primary px-4 py-2 font-bold text-white hover:bg-accent hover:text-primary disabled:opacity-60"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>

      <div
        style={{ backgroundImage: `url(${FormImage})` }}
        className="order-2 min-h-[50vh] bg-cover bg-center lg:col-span-4 lg:min-h-screen"
      />
    </GridLayout>
  );
};

export default Rsvp;
