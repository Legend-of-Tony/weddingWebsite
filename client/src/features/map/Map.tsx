import GridLayout from "../../components/layout/GridLayout"

const Map = () => {
  return (
    <GridLayout id='map' className='w-full bg-primary'>
        <div id='map-container' className='order-2 lg:order-1 lg:col-start-1 lg:col-span-4 lg:row-start-2 lg:row-span-7  '>
            <iframe  className=" w-full h-[50vh] lg:h-full border:0 shadow-xl" loading="lazy" allowFullScreen src="https://www.google.com/maps/embed/v1/place?q=place_id:EigxOTE1IFcgR3VhZGFsdXBlIFJkLCBNZXNhLCBBWiA4NTIwMiwgVVNBIjESLwoUChIJqfhITpcHK4cRiP13HDBPGGUQ-w4qFAoSCZc4mjopqCuHEaQRLxUItSYs&key=AIzaSyAR7XiEpmSnVko_4a9sP2XS-BmVsEBHvGo"></iframe> 
        </div>
        <div id='details-container' className=" order-1 lg:order-2 lg:col-start-5 lg:col-span-3 lg:row-start-2 lg:row-span-7 text-white lg:px-4 px-8 lg:pt-0 pt-10  flex flex-col gap-4 h-[50vh]">
            <h2 className="text-5xl lg:text-7xl font-bold">Event Details</h2>
            <hr />
            <p className="text-xl lg:text-3xl font-light">When & Where</p>
            <hr />
            <p className=" font-extralight lg:font-light">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
    </GridLayout>
  )
}

export default Map