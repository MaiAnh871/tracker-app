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

