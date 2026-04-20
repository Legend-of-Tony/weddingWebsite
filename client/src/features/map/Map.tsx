import GridLayout from "../../components/layout/GridLayout";
import attireExample from "../../assets/attire_example.jpeg";

const Map = () => {
  return (
    <GridLayout
      id="map"
      className="w-full bg-primary lg:h-screen lg:grid-rows-9"
    >
      <div
        id="map-container"
        className="order-2 lg:order-1 lg:col-start-1 lg:col-span-4 lg:row-start-2 lg:row-span-7"
      >
        <iframe
          className="h-[50vh] w-full border:0 shadow-xl lg:h-full"
          loading="lazy"
          allowFullScreen
          src="https://www.google.com/maps/embed/v1/place?q=place_id:EigxOTE1IFcgR3VhZGFsdXBlIFJkLCBNZXNhLCBBWiA4NTIwMiwgVVNBIjESLwoUChIJqfhITpcHK4cRiP13HDBPGGUQ-w4qFAoSCZc4mjopqCuHEaQRLxUItSYs&key=AIzaSyAR7XiEpmSnVko_4a9sP2XS-BmVsEBHvGo"
        ></iframe>
      </div>
      <div
        id="details-container"
        className="order-1 flex min-h-[50vh] flex-col gap-4 px-8 py-10 text-white lg:order-2 lg:col-start-5 lg:col-span-3 lg:row-start-2 lg:row-span-7 lg:h-full lg:px-4 lg:py-0"
      >
        <h2 className="text-5xl lg:text-7xl font-bold">COME AND JOIN US</h2>
        <hr />
        <p className="text-xl lg:text-3xl font-light">
          Villa Tuscana Reception Hall
        </p>
        <hr />
        <ul className=" font-extralight lg:font-light list-disc">
          <li>Saturday, October 24th</li>
          <li>4:30PM - 12AM</li>
          <li>No plus ones unless already discussed</li>
          <li>NO CHILDREN besides immediate family</li>
          <li>
            All black cocktail attire
            <img
              src={attireExample}
              alt="All black cocktail attire example"
              className="my-2 block w-full max-w-28 rounded-lg object-cover shadow-lg lg:max-w-36"
            />
          </li>
        </ul>
        <h3 className="mt-6 text-lg font-light lg:mt-auto lg:text-xl">
          Contact Lucas with any questions: (602) 573-5553
        </h3>
      </div>
    </GridLayout>
  );
};

export default Map;
