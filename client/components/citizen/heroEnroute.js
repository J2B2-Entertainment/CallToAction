import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import RetroMapStyles from '../assets/mapStyle.json';
import { ENV_PATH } from '../../secrets';

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
  imageMarker: {
    width: 30,
    height: 30,
    borderRadius: 17.5,
  },
});

const HeroEnroute = ({ hero, incidentCoords, initialHeroCoords }) => {
  const markers = [
    {
      lat: hero.lat,
      lon: hero.lon,
      image: { uri: ENV_PATH + '/' + hero.heroImage },
    },
    {
      lat: incidentCoords.lat,
      lon: incidentCoords.lon,
      image: require('../assets/marker.png'),
    },
  ];

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        customMapStyle={RetroMapStyles}
        style={styles.map}
        showsUserLocation={true}
        followsUserLocation={true}
        initialRegion={{
          latitude: incidentCoords.lat, //41.89,
          longitude: incidentCoords.lon, //-87.64,
          latitudeDelta:
            Math.abs(initialHeroCoords.lat - incidentCoords.lat) * 2 * 1.1, //0.1,
          longitudeDelta:
            Math.abs(initialHeroCoords.lon - incidentCoords.lon) * 2 * 1.1, //0.05,
        }}
        region={{
          latitude: incidentCoords.lat, //41.89,
          longitude: incidentCoords.lon, //-87.64,
          latitudeDelta:
            Math.abs(initialHeroCoords.lat - incidentCoords.lat) * 2 * 1.1, //0.1,
          longitudeDelta:
            Math.abs(initialHeroCoords.lon - incidentCoords.lon) * 2 * 1.1, //0.05,
        }}
      >
        {markers.map((marker, id) => (
          <Marker
            key={id}
            coordinate={{
              latitude: marker.lat, //hero.lat
              longitude: marker.lon, //hero.lon
            }}
          >
            <View>
              <Image source={marker.image} style={styles.imageMarker} />
            </View>
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

export default HeroEnroute;
