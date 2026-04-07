import { Platform, Share, StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { FC, memo, useCallback, useEffect, useMemo, useState } from 'react'
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
import ReelItem from './ReelItem';
import { toggleLikeReel } from '../../redux/actions/likeAction';
import { useAppDispatch, useAppSelector } from '../../redux/reduxHook';
import { selectLikedReel } from '../../redux/reducers/likeSlice';
import { selectComments } from '../../redux/reducers/commentSlice';
import { SheetManager } from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


interface VideoItemProps {
    item: Reel;
    isVisible: boolean;
    preload: boolean;
}
const STATUSBAR_HEIGHT = StatusBar.currentHeight || 0;

const VideoItem: FC<VideoItemProps> = ({ item, isVisible, preload }) => {
    const dispatch = useAppDispatch();
    const [paused, setPaused] = useState<string | null>(null);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
    const [showLikeAnimation, setShowLikeAnimation] = useState(false);
    const isFocused = useIsFocused();
    const likedReels = useAppSelector(selectLikedReel);
    const commentsCounts = useAppSelector(selectComments);

    const {top,bottom}=useSafeAreaInsets();
    console.log("topbottom",top,bottom, STATUSBAR_HEIGHT)

    const reelMeta = useMemo(() => {
        return {
            isLiked:
                likedReels?.find((ritem: any) => ritem.id === item._id)?.isLiked ??
                item?.isLiked,
            likesCount:
                likedReels?.find((ritem: any) => ritem.id === item._id)?.likesCount ??
                item?.likesCount,
        };
    }, [likedReels, item?._id]);

    const commentMeta = useMemo(() => {
        return (
            commentsCounts?.find((ritem: any) => ritem.reelId === item._id)
                ?.commentsCount ?? item?.commentsCount
        );
    }, [commentsCounts, item?._id]);

    const handleLikeReel = async () => {
        await dispatch(
            toggleLikeReel(item._id, reelMeta?.likesCount, reelMeta?.isLiked),
        );
    };

    const handleShareReel = () => {
        const reelUrl = `${Platform.OS == 'android' ? 'https://reels-server-ot2h.onrender.com' : 'reels:/'
            }/share/reel/${item._id}`;
        const message = `Hey, Checkout this reel: ${reelUrl}`;
        Share.share({
            message: message,
        })
            .then(res => {
                console.log('Share Result', res);
            })
            .catch(error => {
                console.log('Share Error', error);
            });
    };

    const handleTogglePlay = useCallback(() => {
        let currentState = !paused ? 'paused' : 'play';
        setIsPaused(!isPaused);
        setPaused(currentState);
        setTimeout(() => {
            if (currentState === 'play') setPaused(null);
        }, 700);
    }, [paused, isPaused]);

    const handleDoubleTapLike = useCallback(() => {
        if (!reelMeta?.isLiked) {
            handleLikeReel()
        }
        setShowLikeAnimation(true);

        setTimeout(() => {
            setShowLikeAnimation(false)
        }, 1200);
    }, [reelMeta]);

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

    const emptyFunction = () => { };
    return (
        <View style={[styles.container,{height:screenHeight}]} >
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
                                        minBufferMs: 2500,
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
                                    onError={(error)=>console.log(
                                        "video error ",error
                                    )}
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
                        <Icon name={paused === 'paused' ? 'pause' : 'play-arrow'} size={40} color={Colors.white} />
                    </View>
                </View>
            }
            <ReelItem user={item?.user} description={item?.caption} likes={reelMeta?.likesCount || 0} comments={commentMeta}
                onLike={handleLikeReel} onComment={() => {
                    SheetManager.show('comment-sheet', {
                        payload: {
                            id: item?._id,
                            user: item?.user,
                            commentsCount: item.commentsCount,
                        },
                    });
                }} onShare={handleShareReel} onLongPress={emptyFunction} isLiked={reelMeta?.isLiked}
                onLongPressLike={() => {
                    SheetManager.show('like-sheet', {
                        payload: {
                            entityId: item?._id,
                            type: 'reel',
                        },
                    });
                }}
            />
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
        height: screenHeight+STATUSBAR_HEIGHT,
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