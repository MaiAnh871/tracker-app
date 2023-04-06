import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import MapView from 'react-native-maps';
import { Polyline, Marker } from 'react-native-maps';

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
  const [message, setMessage] = useState('');
  const [region, setRegion] = useState({
    latitude: 21.030212,
    longitude: 105.781917,
    latitudeDelta: 0.001922,
    longitudeDelta: 0.001421
  })
  
  const [startLocation, setStartLocation] = useState(null);
  const [polylineCoords, setPolylineCoords] = useState([]);

  const onRegionChange = newRegion => {
    setRegion(newRegion);
  };

  useEffect(() => {
    let subscription;
    Amplify.PubSub.subscribe('tracker/data').subscribe({    
      next: data => {      
        /*
        Type of message:
        {
        "message": {
          "lat": "21.030332",
          "long": "105.781966"
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

  useEffect(() => {
    if (message) {
      setRegion({
        latitude: parseFloat(message.lat),
        longitude: parseFloat(message.long),
        latitudeDelta: 0.001922,
        longitudeDelta: 0.001421
      });

      const newCoords = [
        ...polylineCoords,
        {
          latitude: parseFloat(message.lat),
          longitude: parseFloat(message.long)
        }
      ];

      if (startLocation === null) {
        setStartLocation(newCoords[0]);
      }

      setPolylineCoords(newCoords);
    }
  }, [message]);

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
        style = {styles.map}
        region = {region}
        onRegionChange = {onRegionChange}
      >
        {polylineCoords.length > 0 &&
          (
            <Polyline
              coordinates={polylineCoords}
              strokeColor="#000"
              strokeWidth={2}
            />
          )
        }
        {message && (
          <Marker
            coordinate = {{ 
              latitude : parseFloat(message.lat), 
              longitude : parseFloat(message.long) 
            }}
            title = "Real-time tracking"
            description = "The location of your asset in real-time"
          />
        )}
        {
          startLocation && (
            <Marker
              coordinate = {startLocation}
              title = "Start Location"
              description = "The location where tracking started"
            />
          )
        }
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
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
});