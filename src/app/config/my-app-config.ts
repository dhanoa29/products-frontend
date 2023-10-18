export default {
  //Open Id Connect configuration
  oidc: {
    clientId: '0oablzbr39lJ5IUVx5d7',
    issuer: 'https://dev-32205262.okta.com',
    redirectUri: 'http://localhost:4200/login/callback',
    scopes: ['openid', 'profile', 'email'],
  },
};
