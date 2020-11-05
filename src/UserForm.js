import React, { useContext } from 'react';
import { SearchContext } from './SearchContext';

const Form = () => {
  const user = useContext(SearchContext);

  return (
    <div className="user-form">

      {/* Change user's location in context */}
      <div className="input-item">
        <label className="label">Update Location: </label>
        <input
          className="input"
          onChange={e => user.setLocation(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Form;
