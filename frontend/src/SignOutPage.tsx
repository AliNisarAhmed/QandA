import React from 'react';
import { StatusText } from './Styles';
import { Page } from './Page';
import { useAuth } from './Auth';

interface IProps {
  action: SignOutAction;
}

type SignOutAction = 'signout' | 'signout-callback';

export const SignOutPage: React.FC<IProps> = ({ action }) => {
  let message = 'Signing out...';

  const { signout } = useAuth();

  if (action === 'signout') {
    signout();
  } else {
    message = 'You successfully signed out!';
  }

  return (
    <Page title="Sign out">
      <StatusText>{message}</StatusText>
    </Page>
  );
};
