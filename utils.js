function generateCodeVerifier() {
    return base64URLEncode(require('crypto').randomBytes(32));
  }
  
  function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
  
  function base64URLEncode(str) {
    return str.toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }
  
  function sha256(buffer) {
    return require('crypto').createHash('sha256').update(buffer).digest();
  }
  
  function sendAuthorizationDataToBot({ code, codeVerifier, state }) {
    const botServerEndpoint = 'https://twitterbot-ayoonbutt.azurewebsites.net/authorize';
  
    axios.post(botServerEndpoint, { code, codeVerifier, state })
      .then(response => {
        console.log(response.data);
        // Handle success if needed
      })
      .catch(error => {
        console.error(error);
        // Handle error if needed
      });
  }
  
  module.exports = { generateCodeVerifier, generateRandomString, base64URLEncode, sha256, sendAuthorizationDataToBot };
  