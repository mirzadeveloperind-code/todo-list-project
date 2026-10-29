# To-Do List App - API Planning

## Objective

Plan REST API endpoints for a To-Do List application
using React.js, Node.js, and Express.js.

## 1. Create a Task

- Method: POST
- Endpoint: /api/tasks
- Purpose: Add a new task.
- Request body: title, description
- Success status: 201 Created

## 2. Get All Tasks

- Method: GET
- Endpoint: /api/tasks
- Purpose: Retrieve all tasks.
- Success status: 200 OK

## 3. Get a Single Task

- Method: GET
- Endpoint: /api/tasks/:id
- Purpose: Retrieve one task by its ID.
- Success status: 200 OK

## 4. Update a Task

- Method: PUT
- Endpoint: /api/tasks/:id
- Purpose: Update task details.
- Success status: 200 OK

## 5. Mark a Task Complete

- Method: PATCH
- Endpoint: /api/tasks/:id/complete
- Purpose: Change task completion status.
- Success status: 200 OK

## 6. Delete a Task

- Method: DELETE
- Endpoint: /api/tasks/:id
- Purpose: Delete a task by its ID.
- Success status: 204 No Content

## Unique Task ID

The server will generate a unique ID for every task.

## Error Handling

- 400: Invalid request data
- 404: Task not found
- 500: Internal server error

## Conclusion

These six endpoints support creating, reading,
updating, completing, and deleting tasks.
