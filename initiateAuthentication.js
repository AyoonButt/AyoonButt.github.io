// initiateAuthentication.js

function initiateAuthentication() {
  axios.get('/initiate-authentication/')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Check for 204 response (No Content)
      if (response.status === 204) {
        console.log('Twitter authentication URL saved successfully.');
        // Proceed with redirection logic (assuming the URL is now in the JSON file)
        retrieveTwitterAuthUrlAndRedirect();
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    })
    .catch(error => {
      console.error('Error initiating authentication:', error);
      // Handle the error appropriately, e.g., display an error message to the user
    });
}

function retrieveTwitterAuthUrlAndRedirect() {
  // Read the Twitter auth URL from the JSON file
  fetch('/data/twitterAuthUrl') // Replace with the correct path
    .then(response => response.json())
    .then(data => {
      const twitterAuthUrl = data.twitterAuthUrl;
      if (twitterAuthUrl) {
        window.location.href = twitterAuthUrl;
      } else {
        console.error('Twitter authentication URL not found in the JSON file.');
        // Handle the error appropriately, e.g., display an error message to the user
      }
    })
    .catch(error => {
      console.error('Error retrieving Twitter auth URL from JSON file:', error);
      // Handle the error appropriately, e.g., display an error message to the user
    });
}