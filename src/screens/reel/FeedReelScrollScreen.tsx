import { ActivityIndicator, FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View, ViewToken } from 'react-native'
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import CustomView from '../../components/global/CustomView'
import { useRoute } from '@react-navigation/native';
import { screenHeight } from '../../utils/Scaling';
import {debounce} from 'lodash';
import { useAppDispatch } from '../../redux/reduxHook';
import { fetchFeedReel } from '../../redux/actions/reelAction';
import { Colors } from '../../constants/Colors';
import Loader from '../../assets/images/loader.jpg';
import { goBack } from '../../utils/NavigationUtils';
import { RFValue } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/MaterialIcons';
import VideoItem from '../../components/reel/VideoItem';


interface FeedReelScrollScreenProps {
  data: any[];
}

const FeedReelScrollScreen:FC<FeedReelScrollScreenProps> = () => {
  const route = useRoute();
  const dispatch = useAppDispatch();
  const routeParams = route.params as FeedReelScrollScreenProps;
  const [loading, setLoading] = useState<boolean>(false);
  const [offset, setOffset] = useState<number>(0);
  const [data, setData] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [currentVisibleIndex, setCurrentVisibleIndex] = useState(0);


// viewabilityConfig defined how much part of the item is visible, we set 80 because until the 80% of part is not in the screen the its visibility will not be invoked .
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
  }).current;


  // debounce used here for lazy loading with 100ms  
  const onViewableItemsChnages = useRef(
    debounce(({viewableItems}: {viewableItems: Array<ViewToken>}) => {
        if (viewableItems.length > 0) {
          setCurrentVisibleIndex(viewableItems[0].index || 0);
        }
    },100),
  ).current;

  const removeDuplicates = (data: any) => {
    const uniqueDataMap = new Map();
    data?.forEach((item: any) => {
      if(!uniqueDataMap.has(item._id)) {
        uniqueDataMap.set(item._id, item);
      }
    });
    return Array.from(uniqueDataMap.values());
  }

  // debounce will prevent the multiple concrate apis calls, and let them perform one by one to improve the app performance
  const fetchFeed = useCallback(
    debounce( async (offset: number) => {
      if(loading || !hasMore) return;
      setLoading(true);
        try {
          const newData = await dispatch(fetchFeedReel(offset, 8));
          setOffset(offset+8);
          if(newData?.length < 8) {
            setHasMore(false);
          } 
          setData(removeDuplicates([...data,...newData]));
        } catch(error) {
          console.log("Fetch feed error ", error);
        } finally {
          setLoading(false);
        }


    }), [loading, hasMore,data, dispatch]);

  useEffect(() => {
      if (routeParams?.data) {
        setData(routeParams?.data);
        setOffset(routeParams?.data?.length);         
      }
  },[routeParams?.data]);

  const renderVideoList = useCallback(({item,index}: {item:any, index:number}) => {
    return (
    //   <View style={{backgroundColor:'gray', flex:1, height: screenHeight}} > 
    // <Image source={{uri: item?.thumbUri}}
    // style={{
    //   height: screenHeight,
    //   width: "100%",
    //   aspectRatio: 9/16,
    //   resizeMode: 'cover'
    // }}
    // />
    // </View>
    <VideoItem
    key={index}
      item={item}
      isVisible={index === currentVisibleIndex}
      preload= {Math.abs(currentVisibleIndex + 3) >= index}
    />
    ) ;
  },[currentVisibleIndex]);



  // define the item layout and viewability config things will works with the help of this 
  const getItemLayout = useCallback((data:any, index:number) => ({
      length: screenHeight,
      offset: screenHeight * index,
      index,
  }),[]);  

  const keyExtractor = useCallback((item: any) => item?._id?.toString(), []);

  const memoiedValue = useMemo(
    () => renderVideoList,
    [currentVisibleIndex, data]
  ); 

  return (
    <CustomView>
        <FlatList
            data={data || []}
            keyExtractor={keyExtractor}
            renderItem={memoiedValue}
            //2 videos will load at a time
            windowSize={2}
            // trigger function when reached at end 
            onEndReached={async () => {
              await fetchFeed(offset);
            } }
            pagingEnabled
            viewabilityConfig={viewabilityConfig}
            // disabled the bounced
            disableIntervalMomentum={true}
            // the items which got scroll over will be moved to cache and will not be re rendered
            removeClippedSubviews
            // render 2 videos per batch i mean 2 by 2
            maxToRenderPerBatch={2}
            getItemLayout={getItemLayout}
            onViewableItemsChanged={onViewableItemsChnages}
            // render one video at initial
            initialNumToRender={1}
            //when should onendreached triggered
            onEndReachedThreshold={0.1}
            // how much scrolling speed should be
            decelerationRate={'normal'}
            showsVerticalScrollIndicator = {false}
            scrollEventThrottle={16}
            ListFooterComponent={() => 
            loading ? (  <View style={styles.footer} >
                <ActivityIndicator size={'small'} color={Colors.white} />
              </View>) :
              null
            }
        />
        <Image source={Loader} style={styles.thumbnail} />
        <View style={styles.backButton}>
        <TouchableOpacity onPress={() => goBack()}>
          <Icon name="arrow-back" color="white" size={RFValue(20)} />
        </TouchableOpacity>
      </View>
    </CustomView>
  )
}

export default FeedReelScrollScreen

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 20,
    left: 10,
    zIndex: 99,
  },
  footer: {
    height: 80,
    alignItems:'center',
    justifyContent: 'center',

  },
  thumbnail: {
    position: 'absolute',
    zIndex: -2,
    aspectRatio: 9/16,
    height: screenHeight,
    width: '100%',
    alignSelf: 'center',
    right: 0,
    left: 0,
    resizeMode: 'stretch',
    top: 0,
    bottom: 0
  }
})