import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import awsconfig from './src/aws-exports';
import { Amplify, PubSub } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub';
import AWS from 'aws-sdk';
import { Auth } from 'aws-amplify';

AWS.config.update({region: 'ap-northeast-2'});

Amplify.configure(awsconfig)

Amplify.addPluggable(
  new AWSIoTProvider({
    aws_pubsub_region: 'ap-northeast-2',
    aws_pubsub_endpoint:
      'wss://a2ht7rbdkt6040-ats.iot.ap-northeast-2.amazonaws.com/mqtt'
  })
);

Auth.currentCredentials().then((info) => {
  const cognitoIdentityId = info.identityId;
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
