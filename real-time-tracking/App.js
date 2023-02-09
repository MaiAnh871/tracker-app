import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { Amplify, PubSub } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub';
import awsconfig from './src/aws-exports'

Amplify.configure(awsconfig)

Amplify.addPluggable(
  new AWSIoTProvider({
    aws_pubsub_region: 'ap-northeast-2',
    aws_pubsub_endpoint:
      'wss://a2ht7rbdkt6040-ats.iot.ap-northeast-2.amazonaws.com/mqtt'
  })
);

//Subscription
Amplify.PubSub.subscribe('$aws/things/real-time-tracking/shadow/get/accepted').subscribe({    
  next: data => {        
    console.log('Message received:', data);     
  },
  error: error => console.error(error),    
  close: () => console.log('Done'),  
});

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
