import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';

const renderSuggestion = suggestion => <span>{suggestion.stop_name}</span>;

function Typeahead(props) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const lastRequestId = null;

  const loadSuggestions = query => {
    if (lastRequestId !== null) {
      // Cancel last request.
      clearTimeout(lastRequestId);
    }

    setLoading(true);

    // Make request and populate options.
    fetch(`http://localhost:3001/searchStops?query=${query}`)
      .then(data => data.json())
      .then(data => {
        // TODO: If the data has multiple stop_id's, present them as different options.
        setLoading(false);
        setOptions(data);
        console.log(data);
      });
  };

  return (
    <>
      <Autosuggest
        suggestions={options}
        onSuggestionsFetchRequested={({ value }) => loadSuggestions(value)}
        onSuggestionsClearRequested={() => setOptions([])}
        getSuggestionValue={suggestion => suggestion.stop_name}
        renderSuggestion={renderSuggestion}
        inputProps={{ ...props }}
      />
      <div>
        <strong>Status: {loading ? 'Loading...' : 'Type to load suggestions'}</strong>
      </div>
    </>
  );
}

export default Typeahead;
