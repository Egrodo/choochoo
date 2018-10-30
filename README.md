ChooChoo is an app for MTA riders to find out when the next train will be arriving at their nearby station(s).
The userflow goes like so:
  Initial setup includes a welcome screen and an input box to select your station. I'll have an endpoint on the backend that I can debounce requests to to match stop_name's with stop_id's. I'll need to update my station data every week or so.
  Then I'll have to find a way to display to display / identify each incoming train in the case of multiple lines per station. I'll allow the user to filter for their specific station. This can be a default paramter on the backend.
  Every 45 seconds I'll update the display with a new request to the backend. Ideally, the data should look like this:
  {
    
  }