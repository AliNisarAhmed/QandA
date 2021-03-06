/** @jsx jsx */

import React, { lazy, Suspense } from 'react';

import { Provider } from 'react-redux';

import { configureStore, history } from './Store';

import { css, jsx } from '@emotion/core';
import { fontFamily, fontSize, gray2 } from './Styles';

import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import { HeaderWithRouter as Header } from './Header';
import HomePage from './HomePage';
import { SearchPage } from './SearchPage';
import { SignInPage } from './SignInPage';
import { NotFoundPage } from './NotFoundPage';
import { QuestionPage } from './QuestionPage';
import { SignOutPage } from './SignOutPage';
import { AuthProvider } from './Auth';
import { AuthorizedPage } from './AuthorizedPage';
import { ConnectedRouter } from 'connected-react-router';

const AskPage = lazy(() => import('./AskPage'));

const App: React.FC = () => {
  const store = configureStore();

  return (
    <AuthProvider>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <div
            css={css`
              font-family: ${fontFamily};

              font-size: ${fontSize};

              color: ${gray2};
            `}
          >
            <Header />

            <Switch>
              <Redirect from="/home" to="/" />

              <Route exact path="/" component={HomePage} />

              <Route path="/search" component={SearchPage} />

              <Route path="/ask" component={AskPage}>
                <Suspense
                  fallback={
                    <div
                      css={css`
                        margin-top: 100px;
                        text-align: center;
                      `}
                    >
                      Loading...
                    </div>
                  }
                >
                  <AuthorizedPage>
                    <AskPage />
                  </AuthorizedPage>
                </Suspense>
              </Route>

              <Route
                path="/signin"
                render={(props) => <SignInPage action="signin" {...props} />}
              />

              <Route
                path="/signin-callback"
                render={(props) => (
                  <SignInPage action="signin-callback" {...props} />
                )}
              />

              <Route
                path="/signout"
                render={() => <SignOutPage action="signout" />}
              />

              <Route
                path="/signout-callback"
                render={() => <SignOutPage action="signout-callback" />}
              />

              <Route path="/questions/:questionId" component={QuestionPage} />

              <Route component={NotFoundPage} />
            </Switch>
          </div>
        </ConnectedRouter>
      </Provider>
    </AuthProvider>
  );
};

export default App;
