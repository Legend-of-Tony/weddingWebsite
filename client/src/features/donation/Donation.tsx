import GridLayout from "../../components/layout/GridLayout";
import DonationImage from "../../assets/zelle_qr.png";

const Donation = () => {
  return (
    <GridLayout
      id="donate"
      className="w-full bg-primary px-6 py-16 text-white lg:h-screen lg:px-12"
    >
      <div className="col-span-full flex min-h-full flex-col items-center justify-center gap-6 text-center">
        <h1 className="text-5xl text-accent lg:text-7xl">Honeymoon Fund</h1>
        <p className="max-w-3xl text-2xl font-light lg:text-4xl">
          No gifts are necessary, but if you would like to contribute to our
          honeymoon fund, we would greatly appreciate it.
        </p>
        <a
          href="https://enroll.zellepay.com/qr-codes?data=eyJuYW1lIjoiSkFTTUlORSIsInRva2VuIjoiNjAyMzAzNDQ3NCJ9"
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block"
        >
          <img
            src={DonationImage}
            alt="Zelle QR code for the honeymoon fund"
            className="w-full max-w-64 rounded-2xl bg-white p-3 shadow-xl lg:max-w-72"
          />
        </a>
        <a
          href="https://enroll.zellepay.com/qr-codes?data=eyJuYW1lIjoiSkFTTUlORSIsInRva2VuIjoiNjAyMzAzNDQ3NCJ9"
          target="_blank"
          rel="noreferrer"
          className="text-xl font-light underline underline-offset-4 lg:text-2xl"
        >
          Zelle Now
        </a>
      </div>
    </GridLayout>
  );
};

export default Donation;
