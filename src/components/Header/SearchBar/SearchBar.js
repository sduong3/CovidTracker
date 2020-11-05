import React, { useContext }  from 'react';
import { SearchContext } from '../../../SearchContext';


const SearchBar = (props) => {
  const user = useContext(SearchContext);

  return (
      <div className="input-group mb-3">
                <input
                  value={props.address}
                  onChange={e => props.onChange(e)}
                  className="form-control border-0 shadow-0 bg-gray-200"
                  id="search_search"
                  placeholder="Enter an Address, City, State or ZIP Code"
                  aria-label="Search"/>
                <div className="input-group-append">
                  <button onClick={props.updateLocations} className="btn btn-secondary" type="reset">Search</button>
                </div>
        </div>
  );
}

export default SearchBar;