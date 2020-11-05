import React from 'react';
import Logo from './Logo/Logo';
import SearchBar from './SearchBar/SearchBar';
import classes from './Header.module.css';

const Header = (props) => {
  return (
    <header className={classes.Navbar}>
      <Logo title="Covid Tracker"/>
      <SearchBar
        updateLocations={props.updateLocations}
        onChange={props.onChange}
        address={props.address}/>
    </header>
  );
}

export default Header;
