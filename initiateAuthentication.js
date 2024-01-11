// initiateAuthentication.js

function initiateAuthentication() {
    // Make a GET request to fetch the Twitter authentication URL from the server
    axios.get('/initiate-authentication/', { maxRedirects: 0 })  // Set maxRedirects to 0 to handle redirects manually
        .then(response => {
            // Since maxRedirects is 0, the response will not follow redirects automatically
            // Check if the response has a 'location' header indicating a redirect
            if (response.headers && response.headers.location) {
                const redirectUrl = response.headers.location;

                // Function to redirect manually
                function redirectToTwitter() {
                    window.location.href = redirectUrl;
                }

                // Add event listener to the button for redirection
                document.getElementById('authButton').addEventListener('click', redirectToTwitter);
            } else {
                // Handle the case where the response is not a redirect
                console.error('Unexpected response:', response);
            }
        })
        .catch(error => {
            // Handle errors, including network errors, if any
            console.error('Error initiating Twitter authentication:', error);
        });
}
