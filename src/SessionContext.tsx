import React from 'react';

const SessionContext = React.createContext({
  website: '',
  cookies: {},
  setSession: (website: string, cookies: any) => {},
});

export default SessionContext;

