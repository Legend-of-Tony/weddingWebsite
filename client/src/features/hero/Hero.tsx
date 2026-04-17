import GridLayout from "../../components/layout/GridLayout";
import HeroImage from "../../assets/heroImage.webp";

const Hero = () => {
  return (
    <GridLayout
      id="hero"
      style={{ backgroundImage: `url(${HeroImage})` }}
      className="w-full bg-cover bg-top p-4 lg:h-screen lg:grid-rows-9"
    >
      <section className=" min-h-auto p-4 flex flex-col items-center justify-center text-center lg:col-start-3 row-start-4 lg:col-span-4 row-span-4 text-white">
        <h1 className="text-8xl font-title">YOU'RE INVITED</h1>
      </section>
    </GridLayout>
  );
};

export default Hero;
