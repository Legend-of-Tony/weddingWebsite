import GridLayout from "../../components/layout/GridLayout"


const Hero = () => {
  return (
    <GridLayout id='hero'className='w-full h-screen bg-gray-200 p-4'>
        <section className='w-1/2 min-h-auto p-4 flex flex-col items-center justify-center text-center bg-amber-700 col-start-4 row-start-4 col-span-4 row-span-4'>
            <h1>You're Invited!</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </section>
    </GridLayout>
  )
}

export default Hero