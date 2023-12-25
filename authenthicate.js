// client.js

function initiateAuthentication() {
    // Make an HTTP request to the server to initiate Twitter authentication
    axios.get('/initiate-authentication')
      .then(response => {
        console.log(response.data);
        // Handle success if needed
      })
      .catch(error => {
        console.error(error);
        // Handle error if needed
      });
  }
  