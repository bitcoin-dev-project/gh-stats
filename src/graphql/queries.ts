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
