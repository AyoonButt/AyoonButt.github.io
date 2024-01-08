// initiateAuthentication.js

axios.get('/initiate-authentication', { responseType: 'text' })
  .then(response => {
    // Handle the HTML response here
    console.log(response.data);
  })
  .catch(error => {
    // Handle errors as needed
  });
