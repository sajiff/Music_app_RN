import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  FlatList,
  Animated,
} from 'react-native';
import { Ionicons, AntDesign, Feather, Entypo } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';

import colors from '../constants/colors';
import songs from '../model/data';

const { width, height } = Dimensions.get('window');

export default function MusicPlayer() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const songSlider = useRef(null);

  const [SongIndex, setSongIndex] = useState(0);

  useEffect(() => {
    scrollX.addListener(({ value }) => {
      //console.log('scroll x : ', value);
      //console.log('device widht : ', width);
      const index = Math.round(value / width);
      setSongIndex(index);
      //console.log(index);
    });

    return () => {
      scrollX.removeAllListeners();
    };
  }, []);

  const skipToNext = () => {
    songSlider.current.scrollToOffset({
      offset: (SongIndex + 1) * width,
    });
  };

  const skipToPrevious = () => {
    songSlider.current.scrollToOffset({
      offset: (SongIndex - 1) * width,
    });
  };

  const handlePlayPauseButton = async () => {
    const playbackObj = new Audio.Sound();
    await playbackObj.loadAsync(
      {
        uri: 'https://mega.nz/file/p1MRXYTa#tBSuHXWTqWmKkSLkArrqhwZ_a6s4QJ8gyBcvtudoF-g',
      },
      { shouldPlay: true }
    );
    console.log(songs[SongIndex]);
  };

  const renderSongs = ({ index, item }) => {
    return (
      <Animated.View
        style={{ width: width, justifyContent: 'center', alignItems: 'center' }}
      >
        <View style={styles.artworkWrapper}>
          <Image source={item.image} style={styles.artowrkImg} />
        </View>
      </Animated.View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.maincontainer}>
        <View style={{ width: width }}>
          <Animated.FlatList
            ref={songSlider}
            renderItem={renderSongs}
            data={songs}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: { x: scrollX },
                  },
                },
              ],
              { useNativeDriver: true }
            )}
          />
        </View>
        <View>
          <Text style={styles.title}>{songs[SongIndex].title}</Text>
          <Text style={styles.artist}>{songs[SongIndex].artist}</Text>
        </View>
        <Slider
          style={styles.progressContainer}
          value={10}
          minimumValue={0}
          maximumValue={100}
          thumbTintColor="#FFD369"
          minimumTrackTintColor="#FFD369"
          maximumTrackTintColor="#fff"
          onSlidingComplete={() => {}}
        />
        <View style={styles.progressLabelContainer}>
          <Text style={styles.progressLabelText}>0.0</Text>
          <Text style={styles.progressLabelText}>0.0</Text>
        </View>
        <View style={styles.musicControls}>
          <TouchableOpacity onPress={skipToPrevious}>
            <Ionicons
              name="play-skip-back-outline"
              size={35}
              color={colors.colors.musicControls}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePlayPauseButton}>
            <Ionicons
              name="ios-pause-circle"
              size={75}
              color={colors.colors.musicControls}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={skipToNext}>
            <Ionicons
              name="play-skip-forward-outline"
              size={35}
              color={colors.colors.musicControls}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.bottomControls}>
          <TouchableOpacity onPress={() => {}}>
            <AntDesign
              name="hearto"
              size={30}
              color={colors.colors.bottomControls}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Feather
              name="repeat"
              size={30}
              color={colors.colors.bottomControls}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Feather
              name="share"
              size={30}
              color={colors.colors.bottomControls}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Entypo
              name="dots-three-horizontal"
              size={30}
              color={colors.colors.bottomControls}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.colors.PRIMARY,
  },
  maincontainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContainer: {
    borderTopColor: '#393E46',
    borderTopWidth: 1,
    width: width,
    alignItems: 'center',
    paddingVertical: 15,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  artworkWrapper: {
    width: 300,
    height: 350,
    marginBottom: 25,
    shadowColor: '#ccc',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
  },
  artowrkImg: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#eeee',
  },
  artist: {
    fontSize: 16,
    fontWeight: '200',
    textAlign: 'center',
    color: '#eeee',
  },
  progressContainer: {
    width: 350,
    height: 40,
    marginTop: 25,
    flexDirection: 'row',
  },
  progressLabelContainer: {
    width: 340,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabelText: {
    color: '#fff',
  },
  musicControls: {
    flexDirection: 'row',
    width: '60%',
    justifyContent: 'space-between',
    marginTop: 15,
    alignItems: 'center',
  },
});
