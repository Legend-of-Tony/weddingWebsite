type RSVPButtonProps = {
  value: "yes" | "no" | null;
  onChange: (value: "yes" | "no") => void;
};

const RSVPButton = ({ value, onChange }: RSVPButtonProps) => {
  return (
    <div id="attending" className="relative z-30 flex w-fit touch-manipulation overflow-hidden rounded-full bg-white">
      <button
        type="button"
        onClick={() => onChange("yes")}
        onPointerDown={(e) => {
          e.preventDefault();
          onChange("yes");
        }}
        className={`touch-manipulation px-8 py-3 font-semibold ${
          value === "yes" ? "bg-neutral-700 text-white" : "bg-white text-black"
        }`}
      >
        YES
      </button>

      <button
        type="button"
        onClick={() => onChange("no")}
        onPointerDown={(e) => {
          e.preventDefault();
          onChange("no");
        }}
        className={`touch-manipulation px-8 py-3 font-semibold ${
          value === "no" ? "bg-neutral-700 text-white" : "bg-white text-black"
        }`}
      >
        NO
      </button>
    </div>
  );
};

export default RSVPButton;
