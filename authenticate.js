// client.js

function initiateAuthentication() {
    // Make an HTTP request to the server to initiate Twitter authentication
    function initiateAuthentication() {
        // Make an HTTP request to the server to initiate Twitter authentication
        axios.get('https://authenthicatebot.azurewebsites.net/initiate-authentication')
            .then(response => {
                console.log("Initiating authentication...");
                console.log(response.data);
                // Handle success if needed
            })
            .catch(error => {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.error("Response status:", error.response.status);
                    console.error("Response data:", error.response.data);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.error("No response received. Request:", error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.error("Error setting up the request:", error.message);
                }
                // Handle error if needed
            });
    }
}
    