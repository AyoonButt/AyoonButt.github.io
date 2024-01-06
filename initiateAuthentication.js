// initiateAuthentication.js

function initiateAuthentication() {
    // Make an HTTP request to the server to initiate Twitter authentication
    axios.get('/initiate-authentication')
      .catch(error => {
        console.error('Error initiating authentication:', error.message);
        // Handle the error appropriately
      });
  }
  