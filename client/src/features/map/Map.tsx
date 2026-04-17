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
        className="order-2 lg:order-1 lg:col-start-1 lg:col-span-4 lg:row-start-2 lg:row-span-7  "
      >
        <iframe
          className=" w-full h-[50vh] lg:h-full border:0 shadow-xl"
          loading="lazy"
          allowFullScreen
          src="https://www.google.com/maps/embed/v1/place?q=place_id:EigxOTE1IFcgR3VhZGFsdXBlIFJkLCBNZXNhLCBBWiA4NTIwMiwgVVNBIjESLwoUChIJqfhITpcHK4cRiP13HDBPGGUQ-w4qFAoSCZc4mjopqCuHEaQRLxUItSYs&key=AIzaSyAR7XiEpmSnVko_4a9sP2XS-BmVsEBHvGo"
        ></iframe>
      </div>
      <div
        id="details-container"
        className=" order-1 lg:order-2 lg:col-start-5 lg:col-span-3 lg:row-start-2 lg:row-span-7 text-white lg:px-4 px-8 lg:pt-0 pt-10  flex flex-col gap-4 h-[50vh]"
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
          <li>
            All black cocktail attire
            <img
              src={attireExample}
              alt="All black cocktail attire example"
              className="my-5 block w-full max-w-36 rounded-lg object-cover shadow-lg"
            />
          </li>
        </ul>
        <h3 className="mt-auto text-l font-light lg:text-xl lg:mt-5">
          Contact Lucas with any questions: (602) 573-5553
        </h3>
      </div>
    </GridLayout>
  );
};

export default Map;
