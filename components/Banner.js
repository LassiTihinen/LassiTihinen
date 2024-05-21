import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Banner = ({ appName }) => {
  return (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>{appName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: 'black',
    padding: 10,
    marginBottom: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  bannerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Banner;