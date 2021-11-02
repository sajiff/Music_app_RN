import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';

import MusicPlayer from './component/MusicPlayer';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#222831" />
      <MusicPlayer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
