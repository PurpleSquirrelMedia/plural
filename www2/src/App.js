import 'react-toggle/style.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'
import { IntercomProvider } from 'react-use-intercom'
import { Grommet } from 'grommet'
import { theme } from 'pluralsh-design-system'
import merge from 'lodash.merge'

import { client } from './helpers/client'
import { INTERCOM_APP_ID } from './constants'
import { DEFAULT_THEME as oldTheme } from './theme'

// import Plural from './components/Plural'
import Invite from './components/Invite'
import { Login, PasswordlessLogin, Signup } from './components/users/MagicLogin'
import { PasswordReset, ResetPassword } from './components/users/PasswordReset'
import { OAuthConsent } from './components/oidc/OAuthConsent'
import { EmailConfirmed } from './components/users/EmailConfirmation'
import { OAuthCallback } from './components/users/OAuthCallback'

function App() {
  return (
    <ApolloProvider client={client}>
      <IntercomProvider appId={INTERCOM_APP_ID}>
        <Grommet
          full
          theme={merge({}, oldTheme, theme)}
        >
          <BrowserRouter>
            <Routes>
              <Route
                path="/reset-password/:id"
                element={<ResetPassword />}
              />
              <Route
                exact
                path="/password-reset"
                element={<PasswordReset />}
              />
              <Route
                path="/confirm-email/:id"
                element={<EmailConfirmed />}
              />
              <Route
                path="/invite/:inviteId"
                element={<Invite />}
              />
              <Route
                path="/passwordless-login/:token"
                element={<PasswordlessLogin />}
              />
              {/*
              <Route
                exact
                path="/oauth/callback/github/shell"
                element={<Plural />}
              />
               */}
              <Route
                path="/oauth/callback/:service"
                element={<OAuthCallback />}
              />
              <Route
                exact
                path="/login"
                element={<Login />}
              />
              <Route
                exact
                path="/signup"
                element={<Signup />}
              />
              <Route
                exact
                path="/oauth/consent"
                element={<OAuthConsent />}
              />
              {/*
              <Route
                path="/"
                element={<Plural />}
              />
               */}
            </Routes>
          </BrowserRouter>
        </Grommet>
      </IntercomProvider>
    </ApolloProvider>
  )
}

export default App
