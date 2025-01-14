import { useQuery } from '@apollo/client'
import { Link, Outlet, useLocation, useParams } from 'react-router-dom'
import { Div, Flex } from 'honorable'
import { Tab } from 'pluralsh-design-system'

import RepositoryContext from '../../contexts/RepositoryContext'

import useBreadcrumbs from '../../hooks/useBreadcrumbs'

import { LoopingLogo } from '../utils/AnimatedLogo'

import { Breadcrumbs } from '../Breadcrumbs'

import RepositoryHeader from './RepositoryHeader'

import { REPOSITORY_QUERY } from './queries'

function Repository() {
  const { id } = useParams()
  const { pathname } = useLocation()
  const { data } = useQuery(REPOSITORY_QUERY, {
    variables: {
      repositoryId: id,
    },
  })

  useBreadcrumbs(data && [
    { url: '/marketplace', text: 'Marketplace' },
    { url: `/repository/${data.repository.id}`, text: data.repository.name },
  ])

  if (!data) {
    return (
      <Flex
        // These mp values are to align the looping logo with the previous looping logo.
        // Reload the page on /repository/foo to see it in action.
        pt={24.25}
        ml={-5}
        align="center"
        justify="center"
      >
        <LoopingLogo />
      </Flex>
    )
  }

  const { repository } = data

  return (
    <RepositoryContext.Provider value={repository}> {/* Provide the repository to children */}
      <Flex
        height="100%"
        maxHeight="100%"
        direction="column"
        overflowY="hidden"
      >
        <Flex
          paddingVertical={18}
          marginLeft="xlarge"
          marginRight="xlarge"
          paddingLeft="xsmall"
          paddingRight="xsmall"
          borderBottom="1px solid border"
        >
          <Breadcrumbs />
        </Flex>
        <RepositoryHeader flexShrink={0} />
        <Flex
          flexGrow={1}
          height={0}
        >
          <Flex
            paddingVertical="medium"
            paddingLeft="xlarge"
            paddingRight="large"
            width={128 + 64 + 32}
            flexShrink={0}
            direction="column"
          >
            <Div
              pt={1}
              borderRight="1px solid border"
            />
            <Link
              to={`/repository/${id}`}
              style={{ textDecoration: 'none' }}
            >
              <Tab
                vertical
                active={pathname === `/repository/${id}`}
                textDecoration="none"
              >
                Description
              </Tab>
            </Link>
            <Link
              to={`/repository/${id}/packages`}
              style={{ textDecoration: 'none' }}
            >

              <Tab
                vertical
                active={pathname.startsWith(`/repository/${id}/packages`)}
                textDecoration="none"
              >
                Packages
              </Tab>
            </Link>
            {repository.installation && repository.oauthSettings && (
              <Link
                to={`/repository/${id}/oidc`}
                style={{ textDecoration: 'none' }}
              >

                <Tab
                  vertical
                  active={pathname.startsWith(`/repository/${id}/oidc`)}
                  textDecoration="none"
                >
                  OpenID Connect
                </Tab>
              </Link>
            )}
            <Link
              to={`/repository/${id}/tests`}
              style={{ textDecoration: 'none' }}
            >

              <Tab
                vertical
                active={pathname.startsWith(`/repository/${id}/tests`)}
                textDecoration="none"
              >
                Tests
              </Tab>
            </Link>
            <Link
              to={`/repository/${id}/deployments`}
              style={{ textDecoration: 'none' }}
            >

              <Tab
                vertical
                active={pathname.startsWith(`/repository/${id}/deployments`)}
                textDecoration="none"
              >
                Deployments
              </Tab>
            </Link>
            {repository?.artifacts?.length > 0 && (
              <Link
                to={`/repository/${id}/artifacts`}
                style={{ textDecoration: 'none' }}
              >
                <Tab
                  vertical
                  active={pathname.startsWith(`/repository/${id}/artifacts`)}
                  textDecoration="none"
                >
                  Artifacts
                </Tab>
              </Link>
            )}
            {!!repository.editable && (
              <Link
                to={`/repository/${id}/edit`}
                style={{ textDecoration: 'none' }}
              >
                <Tab
                  vertical
                  active={pathname.startsWith(`/repository/${id}/edit`)}
                  textDecoration="none"
                >
                  Edit
                </Tab>
              </Link>
            )}
            <Div
              flexGrow={1}
              borderRight="1px solid border"
            />
          </Flex>
          <Div
            flexGrow={1}
            paddingTop="large"
            paddingRight="large"
            paddingBottom="xlarge"
            height="100%"
            maxHeight="100%"
            overflowY="auto"
          >
            <Outlet />
          </Div>
        </Flex>
      </Flex>
    </RepositoryContext.Provider>
  )
}

export default Repository
