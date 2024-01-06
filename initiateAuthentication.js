// initiateAuthentication.js

function initiateAuthentication() {
    console.log("Initiating authentication...");
    
    // Make an HTTP request to the server to initiate Twitter authentication
    axios.get('/initiate-authentication')
      .then(response => {
        console.log("Authentication initiated successfully:");
        console.log(response.data);
        // Handle success if needed
      })
      .catch(error => {
        console.error("Error initiating authentication:", error);
        // Handle error if needed
      });
  }
  