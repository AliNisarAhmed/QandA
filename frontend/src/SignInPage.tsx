import React, { FC, useContext } from 'react';
import { Page } from './Page';
import { StatusText } from './Styles';
import { Auth0Context } from './Auth';

type SignInAction = 'signin' | 'signin-callback';

interface IProps {
  action: SignInAction;
}

export const SignInPage: FC<IProps> = ({ action }) => {
  const { signin } = useContext(Auth0Context);

  console.log('sign in page');

  if (action === 'signin') {
    signin();
  }

  return (
    <Page title="Sign In">
      <StatusText>Signin In...</StatusText>
    </Page>
  );
};
