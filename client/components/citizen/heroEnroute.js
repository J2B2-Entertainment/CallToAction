import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },

  map: {
    height: '95%',
    width: '90%',
  },
});

export default class HeroEnroute extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          showsUserLocation={true}
          initialRegion={{
            latitude: 41.89,
            longitude: -87.64,
            latitudeDelta: 0.1,
            longitudeDelta: 0.05,
          }}
        />
      </View>
    );
  }
}
