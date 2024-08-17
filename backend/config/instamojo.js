import Instamojo from 'instamojo-nodejs';

// Initialize Instamojo with API keys
Instamojo.setKeys(process.env.INSTAMOJO_API_KEY, process.env.INSTAMOJO_AUTH_TOKEN);

// Enable sandbox mode (set to false in production)
Instamojo.isSandboxMode(true);

export default Instamojo;
