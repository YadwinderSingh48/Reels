import { StyleSheet, Text, View } from 'react-native'
import React, { FC, memo, useCallback, useEffect, useState } from 'react'
import { screenHeight, screenWidth } from '../../utils/Scaling';
import { useDispatch } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import Loader from '../../assets/images/loader.jpg';
import Video from 'react-native-video';
import convertToProyUrl from 'react-native-video-cache';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../constants/Colors';
import LottieView from 'lottie-react-native';
import DoubleTabAnim from '../../assets/animations/heart.json';


interface VideoItemProps {
    item: any;
    isVisible: boolean;
    preload: boolean;
}

const VideoItem: FC<VideoItemProps> = ({ item, isVisible, preload }) => {
    const dispatch = useDispatch();

    const [paused, setPaused] = useState<string | null>(null);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
    const [showLikeAnimation, setShowLikeAnimation] = useState(false);
    const isFocused = useIsFocused();


    const handleTogglePlay = useCallback(() => {
        let currentState = !paused ? 'paused' : 'play';
        setIsPaused(!isPaused);
        setPaused(currentState);
        setTimeout(() => {
          if (currentState === 'play') setPaused(null);
        }, 700);
      }, [paused, isPaused]);

    const handleDoubleTapLike = useCallback(() => {
            setShowLikeAnimation(true);
            setTimeout(() => {
                setShowLikeAnimation(false)
            }, 1200);
    },[]);

    const singleTap = Gesture.Tap().maxDuration(250).onStart(() => {
        handleTogglePlay();
    }).runOnJS(true);

    const doubleTap = Gesture.Tap().maxDuration(250).numberOfTaps(2).onStart(() => {
        handleDoubleTapLike();
    }).runOnJS(true);

    useEffect(() => {
        setIsPaused(!isPaused);
        if (!isVisible) {
            setPaused(null);
            setVideoLoaded(false);
        }
    }, [isVisible]);

    useEffect(() => {
        if (!isFocused) {
            setIsPaused(true);
        }
        if (isFocused && isVisible) {
            setIsPaused(false);
        }
    }, [isFocused]);



    const handleVideoLoad = () => {
        setVideoLoaded(true)
    }


    return (
        <View style={styles.container} >
            <GestureHandlerRootView style={{ flex: 1 }} >
                <GestureDetector gesture={Gesture.Exclusive(doubleTap, singleTap)} >
                <View style={styles.videoContainer} >
                    {
                        !videoLoaded && (
                            <FastImage
                                source={{ uri: item?.thumbUri, priority: FastImage.priority.high }}
                                style={styles.videoContainer}
                                defaultSource={Loader}
                                resizeMode='cover'
                            />
                        )
                    }

                    {
                        isVisible || preload ? (
                            <Video
                                poster={item?.thumbUri}
                                posterResizeMode='cover'
                                source={
                                    isVisible || preload ?
                                        { uri: convertToProyUrl(item?.videoUri) }
                                        : undefined
                                }
                                bufferConfig={{
                                    maxBufferMs: 3000,
                                    minBufferMs: 25000,
                                    bufferForPlaybackMs: 2500,
                                    bufferForPlaybackAfterRebufferMs: 2500
                                }}
                                ignoreSilentSwitch='ignore'
                                playWhenInactive={false}
                                playInBackground={false}
                                useTextureView={false}
                                controls={false}
                                disableFocus={true}
                                style={styles.videoContainer}
                                paused={isPaused}
                                repeat={true}
                                hideShutterView
                                minLoadRetryCount={5}
                                resizeMode='cover'
                                onReadyForDisplay={handleVideoLoad}

                            />
                        ) : null
                    }
                </View>
                </GestureDetector>
            </GestureHandlerRootView>

            {
                showLikeAnimation && (
                    <View style={styles.lottieContainer} >
                        <LottieView style={styles.lottie} source={DoubleTabAnim} autoPlay loop={false} />
                        </View>
                )
            }

            {
                paused !== null &&
                <View style={styles.playPauseButton} >
                    <View style={styles.shadow} pointerEvents='none' >
                        <Icon name={paused==='paused' ? 'pause' : 'play-arrow'} size={40} color={Colors.white} />
                    </View>
                </View>
            }

        </View>
    )
}

const areEqual = (prevProps: VideoItemProps, nextProps: VideoItemProps) => {
    return (
      prevProps?.item?._id === nextProps?.item?._id &&
      prevProps?.isVisible === nextProps?.isVisible
    );
  };
  
export default memo(VideoItem, areEqual);

const styles = StyleSheet.create({
    container: {
        height: screenHeight,
        width: screenWidth,
        flexGrow: 1,
        flex: 1,
    },
    playPauseButton: {
        position: 'absolute',
        top: '47%',
        bottom: 0,
        left: '44%',
        opacity: 0.7,
    },
    shadow: {
        zIndex: -1,
    },
    lottieContainer: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    lottie: {
        width: '100%',
        height: '100%',
    },
    videoContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        height: screenHeight,
        aspectRatio: 9 / 16,
        flex: 1,
        zIndex: -1,
    },
})