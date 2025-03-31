import { FlatList, ImageBackground, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import GlobalBg from '../../assets/images/globebg.jpg';
import { screenHeight, screenWidth } from '../../utils/Scaling';
import { fetchFeedReel } from '../../redux/actions/reelAction';
import { useAppDispatch } from '../../redux/reduxHook';
import ReelItemCard from './ReelItemCard';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated,{useAnimatedStyle, useSharedValue} from 'react-native-reanimated';
import StatsContainer from './StatsContainer';
import { navigate } from '../../utils/NavigationUtils';

function clamp(val: any, min:any, max:any) {
    return Math.min(Math.max(val,min),  max);
}

const GlobalFeed = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    const translateY = useSharedValue(0);
    const translateX = useSharedValue(0);
    const prevTranslationY = useSharedValue(0);
    const prevTranslationX = useSharedValue(0);
    const zoomScale = useSharedValue(1);
    const zoomStartScale = useSharedValue(0);



    const fetchFeed = async () => {
        setLoading(true);
        const data = await dispatch(fetchFeedReel(0, 16));
        console.log("data ", data)
        setData(data);
        setLoading(false);
    };

    const pinch = Gesture.Pinch()
    .onStart(() => {
      zoomStartScale.value = zoomScale.value;
    })
    .onUpdate(event => {
      zoomScale.value = clamp(
        zoomStartScale.value * event.scale,
        0.3,
        Math.min(screenWidth / 100, screenHeight / 100),
      );
    })
    .runOnJS(true);

  const pan = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      prevTranslationX.value = translateX.value;
      prevTranslationY.value = translateY.value;
    })
    .onUpdate(event => {
      const maxTranslateX = screenWidth - 10;
      const maxTranslateY = screenHeight / 2 - 50;

      translateX.value = clamp(
        prevTranslationX.value + event.translationX,
        -maxTranslateX,
        maxTranslateX,
      );
      translateY.value = clamp(
        prevTranslationY.value + event.translationY,
        -maxTranslateY,
        maxTranslateY,
      );
    })
    .runOnJS(true);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {scale: zoomScale.value},
        {
          translateX: translateX.value,
        },
        {translateY: translateY.value},
      ],
    };
  });



    useEffect(() => {
        fetchFeed();
    }, []);


    const moveToFirst = async (arr:any[], index: number) => {
                    await arr.unshift(arr.splice(index,1)[0]);
                    return arr
    }

    const renderItem = ({ item, index }: { item: any, index: number }) => {
        const verticalShift = index % 2 === 0 ? -20 : 20;
        return (
            <Animated.View style={{ transform: [{ translateY: verticalShift }] }} >
                <ReelItemCard item={item} loading={loading} onPressReel={async () => {
                    const copyArray = Array.from(data);
                    const result = await moveToFirst(copyArray, index);
                    navigate('FeedReelScrollScreen', {
                        data: result
                    })
                }} />
            </Animated.View>
        )
    }

    return (
        <GestureHandlerRootView style={{flex: 1}} >
            <GestureDetector gesture={Gesture.Simultaneous(pan, pinch )} >
        <ImageBackground
            source={GlobalBg}
            style={{ flex: 1, zIndex: 0 }}
            resizeMode='cover'
        >

            <Animated.View style={[styles.container, animatedStyle]}  >
                            <StatsContainer />
                <View style={styles.gridContainer} >
                    {
                        loading ? (
                            <FlatList
                                data={Array.from({ length: 26 })}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => index.toString()}
                                numColumns={4}
                                pinchGestureEnabled
                                scrollEnabled={false}
                                contentContainerStyle={styles.flatlist}
                            />
                        ) : (
                            <FlatList
                                data={data}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => index.toString()}
                                numColumns={4}
                                pinchGestureEnabled
                                scrollEnabled={false}
                                contentContainerStyle={styles.flatlist}
                            />
                        )
                    }
                </View>
            </Animated.View>

        </ImageBackground>
        </GestureDetector>
        </GestureHandlerRootView>
    )
}

export default GlobalFeed

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    gridContainer: {
        width: screenWidth * 5,
        height: screenHeight * 2.9,
        justifyContent: 'center',
        alignItems: 'center',
    },
    flatlist: {
        paddingVertical: 20,
        alignSelf: 'center',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'

    }
})