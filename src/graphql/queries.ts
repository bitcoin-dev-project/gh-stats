export const ISSUES = `
query ($username: String!){
    user(login: $username) {
      issueComments(last: 100) {
        nodes {
          issue {
            author{
              login
              avatarUrl
            }
            comments(orderBy: {field: UPDATED_AT, direction: ASC } ){
              totalCount
            }
          }
          body
          repository {
            url
            owner{
              login
              avatarUrl
            }
          }
          url
          createdAt
          author {
            login
          }
        }
      }
    }
}
`

export const PULL_REQUESTS = `
query ($username: String!){
    user(login: $username) {
      pullRequests(last:100){
        edges{
          node{
            title
            repository{
              url
              owner{
                login
                avatarUrl
              }
            }
            author{
              avatarUrl
            }
            totalCommentsCount
            merged
            mergedAt
            closed
            url
            closedAt
            createdAt
            mergedBy{
              login
            }
          }
        }
      }
    }
  }
  `

export const FETCH_RANGED_PRS = `query contributions($username: String!, $startDate: DateTime!, $endDate: DateTime!, $endCursor: String) {
  user(login: $username) {
    contributionsCollection(from: $startDate, to: $endDate) {
      contributionYears
      pullRequestContributions(first: 100, after: $endCursor){
        pageInfo{
          hasNextPage
          startCursor
          endCursor
        }
        nodes {
          pullRequest {
            title
            repository {
              url
              owner {
                login
                avatarUrl
              }
            }
            author {
              avatarUrl
            }
            totalCommentsCount
            merged
            mergedAt
            closed
            url
            closedAt
            createdAt
            mergedBy {
              login
            }
          }
        }
      }
    }
  }
}`

export const FETCH_RANGED_COMMENTS = `query ($username: String!, $endCursor: String) {
  user(login: $username) {
    issueComments(first: 100, orderBy: {field: UPDATED_AT, direction: DESC}, after: $endCursor) {
      pageInfo {
        hasNextPage
        startCursor
        endCursor
      }
      nodes {
        issue {
          author {
            login
            avatarUrl
          }
          comments(orderBy: {field: UPDATED_AT, direction: ASC}) {
            totalCount
          }
        }
        body
        repository {
          url
          owner {
            login
            avatarUrl
          }
        }
        url
        createdAt
        author {
          login
        }
      }
    }
  }
}`

export const FETCH_CONTRIBUTION_YEARS = `query contributionsYears($username: String!) {
  user(login: $username) {
    contributionsCollection{
      contributionYears
    }
  }
}`
