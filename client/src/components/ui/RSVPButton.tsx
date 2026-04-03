type RSVPButtonProps = {
  value: "yes" | "no" | null;
  onChange: (value: "yes" | "no") => void;
};

const RSVPButton = ({ value, onChange }: RSVPButtonProps) => {
  return (
    <div className="flex rounded-full overflow-hidden bg-white w-fit">
      <button
        type="button"
        onClick={() => onChange("yes")}
        className={`px-8 py-2 font-semibold ${
          value === "yes" ? "bg-neutral-700 text-white" : "bg-white text-black"
        }`}
      >
        YES
      </button>

      <button
        type="button"
        onClick={() => onChange("no")}
        className={`px-8 py-2 font-semibold ${
          value === "no" ? "bg-neutral-700 text-white" : "bg-white text-black"
        }`}
      >
        NO
      </button>
    </div>
  );
};

export default RSVPButton;