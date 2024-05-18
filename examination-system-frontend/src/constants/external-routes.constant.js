const prefix = "http://fizmat.online";
//const prefix = "http://127.0.0.1:3000";
//const prefix = "https://stirring-creponne-aaf80f.netlify.app";
const externalRoutes = {
  help: () => `${prefix}/help`,
  contactUs: () => `${prefix}/contact-us`,
  main: () => `${prefix}`,
  socialMedia: {
    telegram: () => "https://www.telegram.com",
    linkedin: () => "https://www.linkedin.com",
    instagram: () => "https://www.instagram.com",
    twitter: () => "https: //www.twitter.com",
  },
};

export default externalRoutes;
