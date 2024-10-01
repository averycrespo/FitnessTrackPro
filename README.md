# [Fitness Track Pro]

## What Works:
- Fitness Track Pro (FTP) is PWA capable of tracking and maintaining user's workouts.
- FTP is installable app allowing users to add workouts and exercises items to them.
- The app maintains the user's personal bests (highest weight) achieved on exercises. 
- FTP has a secured login procedure to keep your records to yourself. 

## Doesn't Work
- Offline functionality does not work for adding/removing workouts and items.

## Authentication / Authorization
- Data such as users, workouts, workout items, exercises, and personal bests, are stored in a database.
- Users contain unique ids, usernames, passwords, and salts.
- Passwords are properly hashed and use salts. 
- Exercises have a unquie id and a name.
- Personal bests have ids matching a user for ownership, a name, and a weight. 
- Workouts have a unique id to distinguish each other, another id matching for ownership, a name, and a date.
- Workout items have names, weights, sets, and reps. 
- Pages have GET api calls to ensure a logged in user. 
- If the user somehow manages to access one of these pages, actions like adding or deleting have Middleware for authenticating actions. 
- Users have a set session time until they have to log back in.

## All Pages:
### Login:
- Has two fields for username and password.
- Page has a link to a sign up page where the user can create their own unique account. 

### Signup:
- Sign up has 3 fields for username, password, and confirming their password.
- Upon verification of unique username and matching passwords users will be redirected towards the login page.
- There is also a link if the user does not wish to sign up that can redirect them back to the login page. 

### View Workouts:
- Psuedo-homepage shows the user's unique workouts that they have recorded in the past. 
- Each Workout's name is a redirect to its own specifc workout in the Edit Workout page. 
- Users are given to buttons for functionality of adding and removing workouts.
- Add (+ symbol) prompts the user for the name and the date of their workout.
- Remove is done by selecting the squares to the respective left side of the individual workout objects then using Remove (🗑 trash symbol). 
- Contains Personal Best (PR) button to redirect user to their unique personal records.
- Contains a logout button button to sign out and direct user to the login screen. 

### Edit Workouts:
- Allows adding (+ symbol) of workout items to the specific workout. 
- Drop down for the select exercise they are choosing and 3 other fields for number of sets, reps, and weight.
- Submit button will add workout item to workout.  
- Allows Removal (🗑 trash symbol) of workout items to the specific workout
- Home button redirects user back to View Workouts page and does not save additions or removals.
- Save button will save any changes made to the workout.  

### Personal Bests:
- Displays user's unique personal bests for each exercise item that they have completed. 
- Home button in top left corner directs user back to View Workouts page. 
- Search bar allows user to specifically search for a certain exercise by name. 
- This page updates everytime a new weight has been recorded from the edit workout page. 

## Caching Strategy 
Given that our project uses Vite + React we opted for VitePWA plugin to do all of the caching for us. Especially since our app uses .jsx componenets, this would be the optimal solution as it would automatically cache the resources that were being used during runtime. 

## API Endpoints
| Method | Route | Description |
| ----- | ---- | --- | 
| POST | /workout/  | Create a new workout and return object  | 
| POST | /exercise/  | Creates a new exercise and returns new exercise object | 
| POST | /user/ | Creates a new user and returns new user object | 
| POST | /user/login | Registers provided user and authorizes user | 
| POST | /user/logout | Unregisters user | 
| DELETE | /workout/:workoutId | Delete object and return its values and valid status | 
| DELETE | /workout/:itemId | Delete deletes a specfic exercise item and returns | 
| DELETE | /exercise/:exerciseId | Deletes an exercise by id and returns success | 
| DELETE | /user/:userId | Deletes a user by Id and returns success |
| PUT | /exercise/:exerciseId | Edits pre-existing exercise and returns new object |
| PUT | /workout/:workoutId | Edit a pre-existing workout and return new object  | 
| PUT | /workout//item/:itemId | Edits a specific workout item | 
| GET | /workout/ | Retrieves an array of all workouts in the system |
| GET | /workout/:workoutId | Retrieves a specific workout by its Id  |
| GET | /exercise/ | Retrieves all exercises | 
| GET | /exercise/:exerciseId | Gets an exercise by Id | 
| GET | /exercise/:usr_id | Gets all exercises for a user | 
| GET | /workout/ | Get workout list of JSON objects  | 
| GET | /workout/item/:itemId | Get an individual item by id | 
| GET | /workout/item/:userId | Retrieves all workout items in the system for a user |
| GET | /workout/item/:workoutId | Get workout element by id |
| GET | /user/current | Gets currently user logged in |
| PATCH | /exercise/:exerciseId/users/:userId | Updates exercise best object for a user | 

#### ER Diagram


### Team Member Contributions 

#### [Kevin Gallagher]
Milestone 1:
* Initial file setup 
* Created exerciseAPI endpoint
* Created workoutItemAPI endpoint
* Implemented React library
* Designed new color scheme
* Implemented Login component
* Implemented viewWorkout component
* Implemented personalBests component

Milestone 2: 
* Fixed Docker
* Initial file setup 
* Implemented database, schema, tables, database connection.
* Created ER diagram of database schema.
* Finished login and user authentication.
* Created DAOs for all APIs {exercise, user, workout, workoutItem}
* Mounted APIs with Routes.js
* Implemented User API
* Implemented Workout API

Final Project: 
* Completed viewWorkouts page.
* Completed editWorkouts page. 
* Implemented removal of workouts on viewWorkouts page. 
* Implemented buttons for seamless navigation across app.
* Enhanced UI for front-end (Signup, Login, PersonalBests).
* Designed and implemented editWorkout's "Add Workout Item" feature.
* Corrected database connection.
* Fixed DAOs for all APIs.


#### [Avery Crespo]

Milestone 1:
* Created userAPI endpoint
* Created workoutAPI endpoint
* Documented API endpoints on README
* Implemented welcomePage component
* Implemented addWorkout component

Milestone 2:
* Created and implemented Signup page
* Contributed to login functionality.
* Completed personalBests functionality. 
* Implemented workoutItem API.
* Made adjustments to User API.
* Restructured Query calls. 
* Fixed Database Connection.

Final:
* Started implementation of editWorkouts allowing modifying New Date and a New Workout name.
* Installed Service Worker and cached resources.
* Designed Favicon and Webmanifest. 
* Developed PWA functionality.
* Modified workoutAPI.
* Implemented Search Feature for Personal Bests.
* Implemented add workout on viewWorkouts page. 
* Added function to change Workout date to configure for SQL Table.
* Started implementing offline page and functionality.

#### Milestone Effort Contribution
Milestone     | Kevin Gallagher | Avery Crespo | 
------------- | ------------- | -------------- | 
Milestone 1   | 55%           | 45%            |
Milestone 2   | 50%           | 50%            | 
Final         | 50%           | 50%            |
------------- | ------------- | -------------  |
TOTAL:        | 155%          | 145%           | 
