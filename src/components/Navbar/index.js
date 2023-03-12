import React from "react";
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  // NavBtn,
  // NavBtnLink,
} from "./NavbarElements.js";

const Navbar = () => {
  return (
    <>
      <Nav>
        <Bars />

        <NavMenu>
          <NavLink to="/">
            This is the webapp name
          </NavLink>
          <NavLink to="/disease">
            Disease
          </NavLink>
          <NavLink to="/gene">
            Gene
          </NavLink>
          <NavLink to="/variant">
            Variant
          </NavLink>
          <NavLink to="/drug">
            Drug
          </NavLink>
          <NavLink to="/evidence">
            Evidence
          </NavLink>
          {/* <NavLink to="/sign-up" activeStyle>
            Sign Up
          </NavLink> */}
          {/* Second Nav */}
          {/* <NavBtnLink to='/sign-in'>Sign In</NavBtnLink> */}
        </NavMenu>
        {/* <NavBtn>
          <NavBtnLink to="/signin">Sign In</NavBtnLink>
        </NavBtn> */}
      </Nav>
    </>
  );
};

export default Navbar;
