import React, { FC, useEffect } from 'react';
import { Page } from './Page';
import { StatusText } from './Styles';
import { useAuth } from './Auth';
import { RouteComponentProps } from 'react-router-dom';

type SignInAction = 'signin' | 'signin-callback';

interface IProps extends RouteComponentProps {
  action: SignInAction;
}

export const SignInPage: FC<IProps> = ({ action, history }) => {
  const { signin, isAuthenticated } = useAuth();

  console.log('sign in page');

  if (action === 'signin') {
    signin();
  }

  useEffect(() => {
    if (isAuthenticated) {
      history.push('/');
    }
  }, [isAuthenticated, history]);

  return (
    <Page title="Sign In">
      <StatusText>Signin In...</StatusText>
    </Page>
  );
};
