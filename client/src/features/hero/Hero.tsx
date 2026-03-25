import GridLayout from "../../components/layout/GridLayout"
import HeroImage from '../../assets/heroImage.jpeg';


const Hero = () => {
  return (
    <GridLayout id='hero' style={{ backgroundImage: `url(${HeroImage})` }} className='w-full h-screen bg-cover bg-center bg-top p-4'>
        <section  className='w-1/2 min-h-auto p-4 flex flex-col items-center justify-center text-center col-start-4 row-start-4 col-span-4 row-span-4'>
            <h1>You're Invited!</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </section>
    </GridLayout>
  )
}

export default Hero