// initiateAuthentication.js

function initiateAuthentication() {
    axios.get('/initiate-authentication')
        .then(response => {
            // Log the response to the console
            console.log(response.data);

            // Continue with your logic here, including redirection
            window.location.href = response.data;
        })
        .catch(error => {
            // Handle errors as needed
            console.error('Error initiating authentication:', error.message);
        });
}
