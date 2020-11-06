import React from 'react';

const SearchBar = (props) => {

  return (
      <div className="input-group mb-3">
                <input
                  value={props.address}
                  onChange={e => props.onChange(e)}
                  className="form-control border-0 shadow-0 bg-gray-200"
                  id="search_search"
                  placeholder="Enter a City or State in the United States"
                  aria-label="Search"/>
                <div className="input-group-append">
                  <button onClick={props.updateLocations} className="btn btn-secondary" type="reset">Search</button>
                </div>
        </div>
  );
}

export default SearchBar;
