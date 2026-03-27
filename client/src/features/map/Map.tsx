import GridLayout from "../../components/layout/GridLayout"

const Map = () => {
  return (
    <GridLayout id='map' className='w-full h-screen bg-primary'>
        <div id='map-container' className='col-start-1 col-span-4 row-start-2 row-span-9  '>
            <iframe width="600" height="500" className="border:0 shadow-xl" loading="lazy" allowFullScreen src="https://www.google.com/maps/embed/v1/place?q=place_id:EigxOTE1IFcgR3VhZGFsdXBlIFJkLCBNZXNhLCBBWiA4NTIwMiwgVVNBIjESLwoUChIJqfhITpcHK4cRiP13HDBPGGUQ-w4qFAoSCZc4mjopqCuHEaQRLxUItSYs&key=AIzaSyAR7XiEpmSnVko_4a9sP2XS-BmVsEBHvGo"></iframe> 
        </div>
        <div id='details-container' className=" col-start-5 col-span-3 row-start-2 row-span-7 text-white px-4 flex flex-col gap-4">
            <h2 className="text-7xl font-bold">Event Details</h2>
            <hr />
            <p className="text-3xl font-light">When & Where</p>
            <hr />
            <p className="font-light">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
    </GridLayout>
  )
}

export default Map