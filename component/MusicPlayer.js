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
  const [PlaybackObj, setPlaybackObj] = useState(null);
  const [SoundObj, setSoundObj] = useState(null);
  const [PlayBackPosition, setPlayBackPosition] = useState(null);
  const [PlayBackDuration, setPlayBackDuration] = useState(null);

  useEffect(() => {
    scrollX.addListener(({ value }) => {
      //console.log('scroll x : ', value);
      //console.log('device widht : ', width);
      const index = Math.round(value / width);
      setSongIndex(index);
    });

    return () => {
      scrollX.removeAllListeners();
    };
  }, []);

  const skipToNext = () => {
    console.log(SoundObj);
    PlaybackObj?.setStatusAsync({ shouldPlay: false });
    setSoundObj(null);
    songSlider.current.scrollToOffset({
      offset: (SongIndex + 1) * width,
    });
    if (PlaybackObj && SongIndex + 1 !== songs.length) {
      console.log('done');
      PlaybackObj?.unloadAsync();
      playNext();
    }
  };

  const playNext = async () => {
    const status = await PlaybackObj.loadAsync(
      {
        uri: songs[SongIndex + 1].url,
      },
      { shouldPlay: true }
    );
    setSoundObj(status);
    return;
  };

  const skipToPrevious = () => {
    PlaybackObj?.setStatusAsync({ shouldPlay: false });
    setSoundObj(null);
    songSlider.current.scrollToOffset({
      offset: (SongIndex - 1) * width,
    });

    console.log(SongIndex - 1);
    if (PlaybackObj && SongIndex - 1 >= 0) {
      PlaybackObj?.unloadAsync();
      playPrevious();
    }
  };

  const playPrevious = async () => {
    const status = await PlaybackObj.loadAsync(
      {
        uri: songs[SongIndex - 1].url,
      },
      { shouldPlay: true }
    );
    setSoundObj(status);
    return;
  };

  const handlePlayPauseButton = async () => {
    //playing audio for the first time
    if (SoundObj === null) {
      console.log('first time');
      const playbackObj = new Audio.Sound();

      const status = await playbackObj.loadAsync(
        {
          uri: songs[SongIndex].url,
        },
        { shouldPlay: true }
      );
      setPlaybackObj(playbackObj);
      setSoundObj(status);
      playbackObj.setOnPlaybackStatusUpdate(onPlayBackStatusUpdate);
      return;
    }

    //pause audio
    if (SoundObj.isLoaded && SoundObj.isPlaying) {
      console.log('pause');
      const status = await PlaybackObj.setStatusAsync({ shouldPlay: false });
      setSoundObj(status);
      return;
    }

    //resume audio
    if (SoundObj.isLoaded && !SoundObj.isPlaying) {
      console.log('resume');
      const status = await PlaybackObj.playAsync();
      setSoundObj(status);
      return;
    }

    //select another audio

    //console.log(status);
  };

  const onPlayBackStatusUpdate = (playbackStatus) => {
    if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
      setPlayBackPosition(playbackStatus.positionMillis);
      setPlayBackDuration(playbackStatus.durationMillis);
    }
    if (playbackStatus.didJustFinish) {
      setTimeout(() => {
        console.log(SoundObj);
        skipToNext();
      }, 3000);
    }
  };

  const renderSongs = ({ index, item }) => {
    return (
      <Animated.View
        style={{
          width: width,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View style={styles.artworkWrapper}>
          <Image source={item.image} style={styles.artowrkImg} />
        </View>
      </Animated.View>
    );
  };

  const calculateSeekBar = () => {
    if (PlayBackPosition !== null && PlayBackDuration !== null) {
      return PlayBackPosition;
    }
    return 0;
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
          value={calculateSeekBar()}
          minimumValue={0}
          maximumValue={PlayBackDuration}
          thumbTintColor="#FFD369"
          minimumTrackTintColor="#FFD369"
          maximumTrackTintColor="#fff"
          onSlidingComplete={() => {}}
        />
        <View style={styles.progressLabelContainer}>
          <Text style={styles.progressLabelText}>
            {Math.floor(PlayBackPosition / 60000)}:
            {((PlayBackPosition % 60000) / 1000).toFixed(0)}
          </Text>
          <Text style={styles.progressLabelText}>
            {Math.floor(PlayBackDuration / 60000)}:
            {((PlayBackDuration % 60000) / 1000).toFixed(0)}
          </Text>
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
              name={
                SoundObj?.isPlaying ? 'ios-pause-circle' : 'ios-play-circle'
              }
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
    width: width * 0.7,
    height: width * 0.8,
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
    width: width * 0.9,
    height: 40,
    marginTop: 25,
    flexDirection: 'row',
  },
  progressLabelContainer: {
    width: width * 0.8,
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
