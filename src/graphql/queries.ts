export const ISSUES = `
query ($username: String!){
    user(login: $username) {
      issueComments(last: 100) {
        nodes {
          issue {
            author{
              login
            }
          }
          body
          repository {
            url
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
