**To run the project :**

1. Copy `.env.example` to `.env`
2. Run `npm install`
3. Start in development mode `start:dev`
4. Start in development mode `start:prod`

## Usage

- **Users**
    - [Get list](#get-users)
    - [Get one](#get-user)
    - [Create](#create-user)
    - [Update](#update-user)
    - [Delete](#delete-user)

    

**Get Users**
----

`GET` **/api/users**

Returns the list of all users
* **Success response** - `200 OK`

```json
[
  {
    "id": "fa7a2d74-92e3-4b5e-b6c2-b3f86d523596",
    "name": "User1",
    "age": 25,
    "hobbies": [
      "jogging",
      "mountain biking"
    ]
  },
  {
    "id": "98bb6146-7a45-4e67-9bbf-ad3a493930d3",
    "name": "User2",
    "age": 30,
    "hobbies": [
      "tennis",
      "hiking"
    ]
  }
]
   ```
---

**Get User**
----

`GET` **/api/users/:id**

Returns one user by their id

id: [userId]
* **Success response** - `200 OK`

```json
{
  "id": "98bb6146-7a45-4e67-9bbf-ad3a493930d3",
  "name": "User2",
  "age": 30,
  "hobbies": [
    "tennis",
    "hiking"
  ]
}
   ```
---

**Create user**
---
`POST` **/api/users**

Creates a new user
- id: [userId]

* **Success response** - `201 OK`

* **Headers**
    - **Content-Type:** `application/json` [required]
  

* **Body**
  - name: <`string`> `required`
  - age: <`number`> `required`
  - hobbies — <`string[] | []`> `required`
  ```json
    {
      "name": "Billy",
      "age": 17,
      "hobbies": ["basketball"]
    }
  ```
---

**Update user**
---
`PUT` **/api/users/:id**

Updates a user by their id
- id: [userId]

* **Success response** - `200 OK`

* **Headers**

    - **Content-Type:** `application/json` [required]
  
---
* **Body**

  - name: <`string`> `required`
  - age: <`number`> `required`
  - hobbies — <`string[] | []`> `required`
  
  ```json
    {
        "name": "Lofi",
        "age": 15,
        "hobbies": [
            "music",
            "programming",
            "cats"
        ]
    }
  ```
---

**Delete user**
---


`DELETE` **/api/users/:id**

Deletes a user by their id

- id: [userId]
* **Success response** - `204 OK`

* **Headers**

    - **Content-Type:** `application/json` [required]

---
