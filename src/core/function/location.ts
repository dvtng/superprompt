export default {
  name: "location",
  dataTypes: [],
  fn: async () => {
    return new Promise<GeolocationCoordinates>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((position) => {
        const { coords } = position;
        resolve({
          latitude: coords.latitude,
          longitude: coords.longitude,
          altitude: coords.altitude,
          accuracy: coords.accuracy,
          altitudeAccuracy: coords.altitudeAccuracy,
          heading: coords.heading,
          speed: coords.speed,
        });
      }, reject);
    });
  },
};
