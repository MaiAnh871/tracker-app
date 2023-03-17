import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';

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

export default function App() {
  const [message, setMessage] = useState({ lat: 0, long: 0 });
  const [region, setRegion] = useState({
    latitude: 21.030332,
    longitude: 105.781966,
    latitudeDelta: 0.001922,
    longitudeDelta: 0.001421
  })
  
  const onRegionChange = newRegion => {
    setRegion(newRegion);
  };

  useEffect(() => {
    let subscription;
    Amplify.PubSub.subscribe('$aws/things/real-time-tracking/shadow/get/accepted').subscribe({    
      next: data => {      
        /*
        Type of message:
        {
        "message": {
          "lat": "22",
          "long": "24"
          }
        }
*/  
        console.log('Message received:', data.value.message);
        setMessage(data.value.message);
      },
      error: error => console.error(error),    
      close: () => console.log('Done'),  
    });
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      {
        message && (
          <View>
            <Text>Latitude: {message.lat}</Text>
            <Text>Longitude: {message.long}</Text>
          </View>
        )
      }
      <MapView 
        style={styles.map}
        region={region}
        onRegionChange={onRegionChange}
        showsUserLocation={true}
      >
        {message && (
          <Marker
            coordinate={{ latitude : parseFloat(message.lat), longitude : parseFloat(message.long) }}
            title="Real-time tracking"
            description="The location of your asset in real-time"
          />
        )}
      </MapView>
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
  map: {
    width: '100%',
    height: '100%',
  },
});