const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    servers:[
      {
        url: 'http://localhost:3000/'
      }
    ],
    info: {
      title: 'User API',
      version: '1.0.0',
      description: 'API for managing users'
    }
  },
  apis: [`${__dirname}\\config\\*.js`]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = swaggerDocs;
/**
 * @swagger
 * paths:
 *  /api/v1/users:
 *    post:
 *      summery: Create a user.
 *      tags:
 *          - Users
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *      responses:
 *        "201":
 *          description: User created successfully.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                  user:
 *                    type: object
 *                    properties:
 *                      _id:
 *                          type: string
 *                      username:
 *                          type: string
 *                      email:
 *                          type: string
 *        "500":
 *          description: Error creating user
 *          content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                    error:
 *                      type: object
 *        "400":
 *          description: User already exists.
 *          content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *    get:
 *      summery: Retrieve all users.
 *      tags:
 *         - Users
 *      responses:
 *       "200":
 *          content:
 *             application/json:
 *               schema:
 *                  type: array
 *                  items:
 *                      types: object
 *                      properties:
 *                          _id:
 *                              type: string
 *                          username:
 *                              type: string
 *                          email:
 *                              type: string
 *                          createdAt:
 *                              type: string
 *       "500":
 *          description: Error retrieving users
 *          content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                    error:
 *                      type: object
 *  /api/v1/users/{id}:
 *    get:
 *      summery: Retrieve a user.
 *      tags:
 *        - Users
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: UUID of the user to retrieve.
 *      responses:
 *        "200":
 *           content:
 *             application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    username:
 *                      type: string
 *                    email:
 *                      type: string
 *                    createdAt:
 *                      type: string
 *        "404":
 *           description: User not found.
 *           content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                     message:
 *                        type: string
 *        "500":
 *           description: Error retrieving a user.
 *           content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                     message:
 *                        type: string
 *                     error:
 *                        type: object
 *    put:
 *      summery: Update a user.
 *      tags:
 *        - Users
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: UUID of the user to update.
 *      requestBody:
 *         content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  username:
 *                    type: string
 *                  email:
 *                    type: string
 *      responses:
 *        "200":
 *           content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                     message:
 *                        type: string
 *                     user:
 *                        type: object
 *                        properties:
 *                          username:
 *                             type: string
 *                          email:
 *                              type: string
 *                          createdAt:
 *                              type: string
 *        "404":
 *           description: User not found.
 *           content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                     message:
 *                        type: string
 *        "500":
 *           description: Error retrieving a user.
 *           content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                     message:
 *                        type: string
 *                     error:
 *                        type: object
 *    delete:
 *      summery: Delete a user.
 *      tags:
 *        - Users
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: UUID of the user to delete.
 *      responses:
 *        "204":
 *           content:
 *             application/json:
 *                schema:
 *                   type: object
 *                   properties:
 *                      message:
 *                        type: string
 *        "404":
 *           content:
 *             application/json:
 *                schema:
 *                   type: object
 *                   properties:
 *                      message:
 *                         type: string
 *        "500":
 *           content:
 *              application/json:
 *                 schema:
 *                    type: object
 *                    properties:
 *                       message:
 *                          type: string
 *                       error:
 *                          type: object
 * components:
 *    schemas:
 *       User:
 *         type: object
 *         properties:
 *            username:
 *               type: string
 *            password:
 *               type: string
 *            email:
 *               type: string
 *         required:
 *            - username
 *            - password
 *            - email
 *
 */
