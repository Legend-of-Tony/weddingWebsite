import { useState } from "react";
import Logo from "../../assets/website_logo.png";
import GridLayout from "./GridLayout";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen((current) => !current);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <GridLayout className="pointer-events-none fixed top-0 right-0 w-auto h-screen p-10 z-50">
      <div className="pointer-events-auto col-start-9 col-span-1 row-start-1 row-span-1 flex flex-col items-end">
        <a href="#hero">
          <img
            src={Logo}
            alt="logo"
            className="h-20 w-20 drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]"
          />
        </a>
      </div>
      <div className="pointer-events-auto col-start-9 col-span-1 row-start-8 row-span-1 flex flex-col items-end gap-3">
        <div
          id="mobile-nav"
          className={`flex flex-col items-end overflow-hidden rounded-2xl border border-white/10 bg-primary/55 shadow-xl backdrop-blur-sm transition-all duration-300 ease-out lg:hidden ${
            isMenuOpen
              ? "max-h-80 translate-y-0 opacity-100"
              : "max-h-0 translate-y-4 opacity-0"
          }`}
        >
          <ul className="flex flex-col items-end px-3 py-2">
            <li>
              <a href="#map" onClick={handleLinkClick}>
                <button className="btn-primary text-xl font-semibold drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]">
                  DETAILS
                </button>
                <hr className="text-white  w-full" />
              </a>
            </li>
            <li>
              <a href="#donate" onClick={handleLinkClick}>
                <button className="btn-primary text-xl font-semibold drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]">
                  GIFTS
                </button>
                <hr className="text-white  w-full" />
              </a>
            </li>
            <li>
              <a href="#rsvp" onClick={handleLinkClick}>
                <button className="btn-primary text-xl font-semibold drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]">
                  RSVP
                </button>
                <hr className="text-white  w-full" />
              </a>
            </li>
          </ul>
        </div>

        <button
          type="button"
          onClick={handleMenuToggle}
          className="btn-primary text-xl font-semibold drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)] lg:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
        >
          {isMenuOpen ? "CLOSE" : "MENU"}
        </button>
        <hr className="w-24 text-white lg:hidden" />

        <ul className="hidden lg:flex lg:flex-col lg:items-end">
          <li>
            <a href="#map">
              <button className="btn-primary drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)] lg:text-4xl lg:font-extralight">
                DETAILS
              </button>
              <hr className="text-white  w-full" />
            </a>
          </li>
          <li>
            <a href="#donate">
              <button className="btn-primary drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)] lg:text-4xl lg:font-extralight">
                GIFTS
              </button>
              <hr className="text-white  w-full" />
            </a>
          </li>
          <li>
            <a href="#rsvp">
              <button className="btn-primary drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)] lg:text-4xl lg:font-extralight">
                RSVP
              </button>
              <hr className="text-white  w-full" />
            </a>
          </li>
        </ul>
      </div>
    </GridLayout>
  );
};

export default Navbar;
