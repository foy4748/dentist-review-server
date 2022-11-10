# Dentist Review
## SERVER SIDE REPO

## Links
- Live Website: [Netlify](https://p-hero-foy4748-assignment-11.netlify.app/)
- CLIENT Repo: [Github](https://github.com/foy4748/dentist-review)
- SERVER Repo: [Github](https://github.com/foy4748/dentist-review-server)
- Requirements: [Github](https://github.com/ProgrammingHero1/Service-Review-Assignment/blob/main/task_description.md)

# API Documentation

## authGuard Middleware
- Need the "authtoken" at the Request Headers.
- Verified Token will allow to execute next controller.
- Failed verification will send ERROR resonponse

## GET API END POINTS

### /auth
- Token Signing API end point.
- Expects "uid" at headers.
- Signs the "uid" to generate JWT
- Sends the token as "authtoken" as response.

### /services
- Expects "limit" at headers, for limited response.
- If "limit" not found at headers, sends Services sorted by time.

### /service/:id
- Sends a single Service.

### /comments
- Expects "service\_id" at headers.
- Sends service specific reviews.

### /my-comments
- AuthGuarded: True
- Expectes "uid" at headers.
- Sends User specific reviews.

### /my-comments/:id
- AuthGuarded: True
- Expectes "uid" at headers. "service\_id" in query params.
- Sends User specific single review.

## POST API END POINTS

### /comments
- AuthGuarded: True
- Expectes "service\_id" at headers.
- Sends the latest review's id as "insertedId" in response.

### /services
- AuthGuarded: True
- Sends the latest service's id as "insertedId" in response.

## PATCH API END POINTS

### /my-comments/:id
- AuthGuarded: True
- Updates some fields of a specific review.

### DELETE API END POINTS
- AuthGuarded: True
- Deletes a specific review of a specific user.


# Used Stack

## Front End
- React
    - Context API
    - Conditional Rendering
    - Render Props

- React-Router DOM
    - Navigation
    - Private / Protected Route
    - Redirect to previous page

- React-Bootstrap
- React-Hot-Toast
- React-Photo-View

## Back End
- Firebase (for authentication)
- NodeJS
- ExpressJS
- MongoDB Driver Package
- JWT (for authorization)

## Database
- MongoDB
