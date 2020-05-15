export const WebAPIUrl = 'http://localhost:53662/api';

export const authSettings = {
  domain: 'qandareact.auth0.com',
  client_id: 'usRPzi5NVc5IUk63uJHMk72lQPp1nZH8',
  redirect_uri: `${window.location.origin}` + '/signin-callback',
  scope: 'openid profile QandAAPI email',
  audience: 'https://qandareact'
}