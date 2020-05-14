import React, {
  createContext,
  useContext,
  FC,
  useState,
  useEffect,
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
        await auth0FromHook.handleRedirectCallback();
        window.location.replace(window.location.origin);
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
    signin: () => getAuth0ClientFromState().loginWithRedirect(),
    signout: () =>
      getAuth0ClientFromState().logout({
        client_id: authSettings.client_id,
        returnTo: window.location.origin + '/signout-callback',
      }),
  };

  return (
    <Auth0Context.Provider value={value}>{children}</Auth0Context.Provider>
  );

  async function getAccessToken() {
    const auth0FromHook = await createAuth0Client(authSettings);
    const accessToken = await auth0FromHook.getTokenSilently();
    return accessToken;
  }

  function getAuth0ClientFromState() {
    if (auth0Client === undefined) {
      throw new Error('Auth0 client not set');
    }
    return auth0Client;
  }
};
