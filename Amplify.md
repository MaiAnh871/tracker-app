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

```bash
import React, { useState, useEffect } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
} from 'react-native';
import { DataStore } from 'aws-amplify';
import { Todo } from './models';

const Header = () => (
  <View style={styles.headerContainer}>
    <Text style={styles.headerTitle}>My Todo List</Text>
  </View>
);

const AddTodoModal = ({ modalVisible, setModalVisible }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  async function addTodo() {
    //to be filled in a later step
  }

  function closeModal() {
    setModalVisible(false);
  }

  return (
    <Modal
      animationType="fade"
      onRequestClose={closeModal}
      transparent
      visible={modalVisible}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalInnerContainer}>
          <Pressable onPress={closeModal} style={styles.modalDismissButton}>
            <Text style={styles.modalDismissText}>X</Text>
          </Pressable>
          <TextInput
            onChangeText={setName}
            placeholder="Name"
            style={styles.modalInput}
          />
          <TextInput
            onChangeText={setDescription}
            placeholder="Description"
            style={styles.modalInput}
          />
          <Pressable onPress={addTodo} style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Save Todo</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const TodoList = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    //to be filled in a later step
  }, []);

  async function deleteTodo(todo) {
    //to be filled in a later step
  }

  async function setComplete(updateValue, todo) {
    //to be filled in a later step
  }

  const renderItem = ({ item }) => (
    <Pressable
      onLongPress={() => {
        deleteTodo(item);
      }}
      onPress={() => {
        setComplete(!item.isComplete, item);
      }}
      style={styles.todoContainer}
    >
      <Text>
        <Text style={styles.todoHeading}>{item.name}</Text>
        {`\n${item.description}`}
      </Text>
      <Text
        style={[styles.checkbox, item.isComplete && styles.completedCheckbox]}
      >
        {item.isComplete ? '✓' : ''}
      </Text>
    </Pressable>
  );

  return (
    <FlatList
      data={todos}
      keyExtractor={({ id }) => id}
      renderItem={renderItem}
    />
  );
};

const Home = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Header />
      <TodoList />
      <Pressable
        onPress={() => {
          setModalVisible(true);
        }}
        style={[styles.buttonContainer, styles.floatingButton]}
      >
        <Text style={styles.buttonText}>+ Add Todo</Text>
      </Pressable>
      <AddTodoModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#4696ec',
    paddingTop: Platform.OS === 'ios' ? 44 : 0,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    paddingVertical: 16,
    textAlign: 'center',
  },
  todoContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 2,
    elevation: 4,
    flexDirection: 'row',
    marginHorizontal: 8,
    marginVertical: 4,
    padding: 8,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  todoHeading: {
    fontSize: 20,
    fontWeight: '600',
  },
  checkbox: {
    borderRadius: 2,
    borderWidth: 2,
    fontWeight: '700',
    height: 20,
    marginLeft: 'auto',
    textAlign: 'center',
    width: 20,
  },
  completedCheckbox: {
    backgroundColor: '#000',
    color: '#fff',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    padding: 16,
  },
  buttonContainer: {
    alignSelf: 'center',
    backgroundColor: '#4696ec',
    borderRadius: 99,
    paddingHorizontal: 8,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 44,
    elevation: 6,
    shadowOffset: {
      height: 4,
      width: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  modalInnerContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    justifyContent: 'center',
    padding: 16,
  },
  modalInput: {
    borderBottomWidth: 1,
    marginBottom: 16,
    padding: 8,
  },
  modalDismissButton: {
    marginLeft: 'auto',
  },
  modalDismissText: {
    fontSize: 20,
    fontWeight: '700',
  },
});

export default Home;
```
Go ahead and run your code now and you should see an app with empty todolist and a floating action button but not much else.




