module.exports = ({ env }) => ({
    // Enable users-permissions plugin
    'users-permissions': {
      enabled: true,
      config: {
        jwt: {
          expiresIn: '7d',  
        },
      },
    },
  });
  