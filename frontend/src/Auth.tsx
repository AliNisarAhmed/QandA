import React, {
  createContext,
  FC,
  useState,
  useEffect,
  useContext,
} from 'react';
import createAuth0Client from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import { authSettings } from './AppSettings';

interface Auth0User {
  name: string;
  email: string;
}

interface IAuth0Context {
  isAuthenticated: boolean;
  user?: Auth0User;
  signin: () => void;
  signout: () => void;
  loading: boolean;
}

export const Auth0Context = createContext<IAuth0Context>({
  isAuthenticated: false,
  signin: () => {},
  signout: () => {},
  loading: true,
});

export const useAuth = () => useContext(Auth0Context);

const onRedirectCallback = (appState: any) =>
  window.history.replaceState(
    appState,
    document.title,
    window.location.pathname,
  );

export const AuthProvider: FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<Auth0User | undefined>(undefined);

  const [auth0Client, setAuth0Client] = useState<Auth0Client>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    initAuth0();

    async function initAuth0() {
      setLoading(true);
      const auth0FromHook = await createAuth0Client(authSettings);
      setAuth0Client(auth0FromHook);

      if (
        window.location.pathname === '/signin-callback' &&
        window.location.search.indexOf('code=') > -1
      ) {
        const { appState } = await auth0FromHook.handleRedirectCallback();
        console.log('appState', appState);
        // window.location.replace(window.location.origin);
        onRedirectCallback(appState);
      }

      const isAuthenticatedFromHook = await auth0FromHook.isAuthenticated();
      if (isAuthenticatedFromHook) {
        const user = await auth0FromHook.getUser();
        setUser(user);
      }
      setIsAuthenticated(isAuthenticatedFromHook);
      setLoading(false);
    }
  }, []);

  const value: IAuth0Context = {
    isAuthenticated,
    user,
    loading,
    signin,
    signout,
  };

  return (
    <Auth0Context.Provider value={value}>{children}</Auth0Context.Provider>
  );

  async function signin() {
    if (auth0Client) {
      await auth0Client.loginWithRedirect();
    }
  }

  function signout() {
    if (auth0Client) {
      auth0Client.logout({
        client_id: authSettings.client_id,
        returnTo: window.location.origin + '/signout-callback',
      });
    }
  }
};

export const getAccessToken = async () => {
  const auth0FromHook = await createAuth0Client(authSettings);
  const accessToken = await auth0FromHook.getTokenSilently();
  return accessToken;
};
