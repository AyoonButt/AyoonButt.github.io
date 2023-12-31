// client.js

function initiateAuthentication() {
    // Make an HTTP request to the server to initiate Twitter authentication
    axios.get('https://authenthicatebot.azurewebsites.net/initiate-authentication')
    .then(response => {
        console.log("Initiating authentication...");
        console.log(response.data);
        // Handle success if needed
    })
    .catch(error => {
        console.error(error);
        // Handle error if needed
    });
}

  