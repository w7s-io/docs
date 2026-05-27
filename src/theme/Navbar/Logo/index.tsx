import React from 'react';

const W7S_LOGO = 'https://github.com/w7s-io.png';

export default function NavbarLogo(): React.ReactNode {
  return (
    <a className="navbar__brand" href="https://www.w7s.io/">
      <img className="navbar__logo-avatar" src={W7S_LOGO} alt="W7S logo" />
      <b className="navbar__title text--truncate">W7S</b>
    </a>
  );
}
