type RSVPButtonProps = {
  value: "yes" | "no" | null;
  onChange: (value: "yes" | "no") => void;
};

const RSVPButton = ({ value, onChange }: RSVPButtonProps) => {
  return (
    <fieldset
      id="attending"
      className="relative z-30 flex w-fit touch-manipulation overflow-hidden rounded-full bg-white"
    >
      <legend className="sr-only">Will you be attending?</legend>

      <label
        className={`flex min-h-11 cursor-pointer touch-manipulation items-center px-8 py-3 font-semibold ${
          value === "yes" ? "bg-neutral-700 text-white" : "bg-white text-black"
        }`}
      >
        <input
          type="radio"
          name="attendance"
          value="yes"
          checked={value === "yes"}
          onChange={() => onChange("yes")}
          className="sr-only"
        />
        <span>YES</span>
      </label>

      <label
        className={`flex min-h-11 cursor-pointer touch-manipulation items-center px-8 py-3 font-semibold ${
          value === "no" ? "bg-neutral-700 text-white" : "bg-white text-black"
        }`}
      >
        <input
          type="radio"
          name="attendance"
          value="no"
          checked={value === "no"}
          onChange={() => onChange("no")}
          className="sr-only"
        />
        <span>NO</span>
      </label>
    </fieldset>
  );
};

export default RSVPButton;
