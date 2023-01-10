# Prerequisites
Before you begin, make sure you have the following installed:
- Node.js v14.x or later
- npm v6.14.4 or later
- git v2.14.1 or later

## Sign up for an AWS account
If you don't already have an AWS account, you'll need to create one in order to follow the steps outlined in this tutorial.

## Install and configure the Amplify CLI

```bash
npm install -g @aws-amplify/cli
```

Now it's time to setup the Amplify CLI. Configure Amplify by running the following command:

```bash
amplify configure
```
`amplify configure` will ask you to sign into the AWS Console.

Amplify CLI will then ask you to copy and paste the accessKeyId and the secretAccessKey from your newly created IAM user to connect with Amplify CLI.

Successfully set up the new user.

# Set up fullstack project
To get started, initialize a new React Native project.
```bash
npm install -g expo-cli  
npx create-expo-app amplified_todo
cd amplified_todo
```

## Run your app
To run your React Native app, you can follow the below step:
```bash
npx expo start
```

## Initialize a new backend
With the app running, it's time to set up Amplify and create the backend services to support the app.
Open a **new terminal**. From the **project directory**:
```bash
amplify init
```
When you initialize Amplify you'll be prompted for some information about the app, with the option to accept recommended values.

### Note
Notice whether there is a file `./src/aws-export` or not.

## Install Amplify Libraries
The aws-amplify package is the main library for working with Amplify Libraries in your projects:
```bash
npm install aws-amplify
```
### Error
image.png

### How to fix?
- Remove node_modules folder
- ```npm install```

Now, no more red error. Reinstall the Amplify library:
```bash
npm install aws-amplify
```

## Set up front end
Next, configure Amplify so it can interact with backend services.

Open App.js and add the following lines of code at the top of the file below the last import:
```javascript
import { Amplify } from 'aws-amplify'
import awsconfig from './src/aws-exports'

Amplify.configure(awsconfig)
```
Now your project is set up and you can begin adding new features.

## Run your app
To run your React Native app, you can follow the below step:
```bash
npx expo start
```

### Error
```bash
Some dependencies are incompatible with the installed expo version:
@react-native-community/netinfo@9.3.7 - expected version: 9.3.5
Your project may not work correctly until you install the correct versions of the packages.
```

### How to fix?
```bash
npx expo install @react-native-community/netinfo@9.3.5
```

# Generate model files
With the basic setup complete, you can now model the data your application will work with. Amplify DataStore persists the modeled data on your local device and can even synchronize to a backend API without writing any additional code. These models are specified as GraphQL schemas.

## Create the GraphQL API
To create a GraphQL API, use the Amplify add command:
```bash
amplify add api
```
```
? Please select from one of the below mentioned services:
  > GraphQL
? Here is the GraphQL API that we will create. Select a setting to edit or continue:
  > Continue
? Choose a schema template:
  > Single object with fields (e.g., “Todo” with ID, name, description)
```


## Create data model
- Navigate to the AWS Amplify Studio, select To-do list option in the quickstart section with React Native then click on Get started.
- On the Data modeling screen, you should see your Todo data model.

### Add the isComplete Boolean field
- Start by clicking Add a field under the Todo model.
- Set the Field name of this field to isComplete
- For the Type of this field, select Boolean
- In the inspector panel to the right, select Is required to make this field required

## Generate the models locally
- Click Next: Test locally in your app on the Data modeling screen to proceed
- Install Amplify CLI to pull the data model
    - You should have already installed the Amplify CLI in a previous step
    - Copy and run the command shown in your project root. This command will initialize your current project with Amplify as well as generate the data models you will be using locally

    ```bash
    amplify pull --sandboxId <UUID>
    ```
    Eg:
    ```bash
    amplify pull --sandboxId f9ea43aa-ba0d-4151-92a6-3e283f1d7c8a
    ```

### Error
```bash
Failed to pull sandbox app.
ENOENT: no such file or directory, open '\amplified_todo\amplify\backend\api\amplifyDatasource\schema.graphql'
```

### How to fix?

## Edit local model
```javascript
type Todo @model @auth(rules: [{ allow: public }]) {
    id: ID!
    name: String!
    description: String
    isComplete: Boolean!
}
```

To deploy the API, you can use the Amplify `push` command:
```bash
amplify push
```
```
? Are you sure you want to continue? Y

? Do you want to generate code for your newly created GraphQL API? Y
? Choose the code generation language target: javascript (or your preferred language target)
? Enter the file name pattern of graphql queries, mutations and subscriptions src/graphql/**/*.js
? Do you want to generate/update all possible GraphQL operations - queries, mutations and subscriptions? Y
? Enter maximum statement depth [increase from default if your schema is deeply nested]: 2
```

### Expect output
```bash
Successfully generated models. Generated models can be found in E:\amplified_todo\src


GraphQL endpoint: https://7q3skrwywndrjlee3ct2263tfm.appsync-api.ap-northeast-1.amazonaws.com/graphql
GraphQL API KEY: da2-62v3juhxhnfyzb53f5oqcozp4e

GraphQL transformer version: 2
```

Now the API has been deployed and you can start using it.

To view the deployed services in your project at any time, go to Amplify Console by running the Amplify `console` command:
```
amplify console
```

# Integrate in your app
In this section you’ll integrate Amplify DataStore with your app, and learn to use the generated data model to create, update, query, and delete Todo items by building an app. 

## Boilerplate UI
### App.js
```javascript
import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { Amplify } from 'aws-amplify';
import awsconfig from './src/aws-exports';
import Home from './src/Home';

Amplify.configure(awsconfig);

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar />
      <Home />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
});
```

### Home.js
Next, you will create a Home component for your app which will implement most of the CRUD functionality for your app. Create a new file Home.js at location src/Home.js. Here, you have total four components defined:
- Header: Simple Header component with Title.
- AddModal: Used for displaying a Modal when a new Todo needs to be added.
- TodoList: Used for displaying the list of Todos.
- Home: Default component that wraps all the above component and a Button for adding a new Todo item.

Go ahead and run your code now and you should see an app with empty todolist and a floating action button but not much else.

## Manipulating data
### Creating a Todo
The Add Todo floating action button opens up a Modal to add todos. But, right now, the form does nothing when the Save button is pressed. Let’s fix that by having it save a Todo to DataStore.

Open the Home.js file and update the `addTodo()` function in the `AddTodoModal` component.

If you try to add todos using the form now, it should successfully close the form when pressing the Save button. But your Todo list is still empty even if you restart the app! After initializing your todos as an empty list, you aren't currently updating it again. You will remedy that in the next step.

#### Error
You will see a console error when you run your app "Datastore - Data won't synchronize".

#### How to fix?
This is expected and will be fixed in a future step once you connect your app to the cloud.

### Querying for Todos and Observing Updates in Real-Time
You also want to observe updates to those items as they are added, updated, or removed.

This can be achieved with `DataStore.observeQuery()`. `observeQuery()` will return a Stream of query snapshots. Each snapshot will contain the current list of items, as well as boolean value to indicate if DataStore's sync process has completed.

You will use the `useEffect()` hook of `TodoList` component to list the todo items. `useEffect()` can be used to perform side effects in function components.

If you restart your app now, you should see that newly added todos will start showing up on the list. The items look like they can be check off and marked as completed, but when pressed, they don’t seem to do anything right now. Let’s learn how to update existing data.

### Updating a Todo
Updating an existing data entry looks a lot like creating a new one. It’s important to note, however, that models in DataStore are **immutable**. So, to update a record you must use a model’s `copyOf` function rather than manipulating its properties directly.

Update the `setComplete` function in the `TodoList` component.

You’re almost done here but what if you want to delete an item from your todo list? We’ll go over how to do that next.

### Deleting a Todo
Deleting an existing data entry is even easier than updating one since you don’t need to copy the instance to delete it.

Update the `deleteTodo()` function in the `TodoList` component.

Now you have a fully featured CRUD application that saves and retrieves data on the local device, which means this app **works without an AWS account or even an internet connection**. Next, you'll connect it to AWS and make sure the data is available in the cloud.

# Connect to the cloud
## Deploy your Amplify sandbox backend
Return to the sandbox link you kept handy from earlier. It should look something like the following.
```
https://sandbox.amplifyapp.com/deploy/<UUID>
```

#### Log in or create a new AWS account
If you don’t have an AWS account, you will need to create one first:

- Select Create an AWS account
- Once you have an account, select Login to deploy to AWS
- When logged in, you will be taken to the Amplify Console

#### Create app backend
- Give your app a name. We went with `amplifiedtodo`.
- Click Confirm deployment
- Enable Amplify Studio.
- Select Backend Environment.
- Click **Launch Studio**.

##### Error
```
An error occurred while fetching the app backend: Missing credentials in config, if using AWS_CONFIG_FILE, set AWS_SDK_LOAD_CONFIG=1
```

##### How to fix?
```bash
> set AWS_ACCESS_KEY_ID="your_key_id"
> set AWS_SECRET_ACCESS_KEY="your_secret_key"
```
## Deploy data model
Click Save and Deploy.
Wait form some minutes.
Step 1: Successfully deployed data model
Step 2: Pull latest client config
```bash
amplify pull --appId dc6jwhgktw8g3 --envName dev
```

After Deploy, `Welcome back to amplifiedtodo's
dev environment`.

## Add Authentication
Since your Todo model specifies an `@auth` directive, you do need to first add authentication.

### Deploy authentication
- Select Authentication from the sidebar
- Click Save and deploy with the default configuration
- Click Confirm deployment when prompted

### Update local project with deployed environment
- After deployment, click on Local setup instructions at the top of Amplify Studio.
- Copy the command for pulling the updated environment and run it in your local project
Eg:
```
amplify pull --appId dc6jwhgktw8g3 --envName dev
```
- Update your app code

#### Error
```
× There was an error initializing your environment.
� Could not initialize platform for 'dev': Inaccessible host: `amplify-amplifiedtodo-dev-220448-deployment.s3.ap-northeast-1.amazonaws.com' at port `undefined'. Thi
s service may not be available in the `ap-northeast-1' region.
```

#### How to fix?
Internet check!

## Verifying cloud sync
### Inspec data
Select Content from the Amplify Studio sidebar. If you have added todos from your app, you should see them show up as part of the results!

### Create data
Synchronization is bi-directional. Try creating a Todo entry from the Content screen in Amplify Studio:
- Click Create todo
- Fill in the form
  - name: Sync app to cloud
  - description: This was created remotely!
  - isComplete: false (unchecked)
- Click Save Todo on the form to save the new entry