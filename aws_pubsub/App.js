import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { Amplify, PubSub, Auth } from 'aws-amplify'
import awsconfig from './src/aws-exports'
import { AWSIoTProvider } from '@aws-amplify/pubsub';

Amplify.configure(awsconfig)

// Apply plugin with configuration
Amplify.addPluggable(
  new AWSIoTProvider({
    aws_pubsub_region: 'ap-northeast-2',
    aws_pubsub_endpoint:
      'a2ht7rbdkt6040-ats.iot.ap-northeast-2.amazonaws.com/mqtt'
  })
);

Auth.currentCredentials().then((info) => {
  const cognitoIdentityId = info.identityId;
});

Amplify.PubSub.subscribe('myTopic').subscribe({    
  next: data => {        
    console.log('Message received:')                             
  },    
  error: error => console.error(error),    
  close: () => console.log('Done'),  
});

await Amplify.PubSub.publish('myTopic1', { msg: 'Hello to all subscribers!' });


export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
