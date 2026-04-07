import { Alert, Animated, Linking, StyleSheet, Text, View } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { Colors } from '../../constants/Colors'
import LOGO from '../../assets/images/logo_t.png';
import CustomText from '../../components/global/CustomText';
import { FONTS } from '../../constants/Fonts';
import { jwtDecode } from 'jwt-decode';
import { token_storage } from '../../redux/storage';
import { navigate, resetAndNavigate } from '../../utils/NavigationUtils';
import { refreshToken } from '../../redux/ApiConfig';
import { useAppDispatch } from '../../redux/reduxHook';
import { refetchUser } from '../../redux/actions/UserAction';
import { extractTypeAndId } from '../../utils/dateUtils';
import { getReelById } from '../../redux/actions/reelAction';

interface JwtDecoded {
  exp: number;
}

const SplashScreen: FC = () => {
  const [isStop, setIsStop] = useState<boolean>(false);
  const scale = new Animated.Value(1);
  const dispatch = useAppDispatch();

  const tokenCheck = async () => {
    const access_token = token_storage.getString('access_token') as string;
    const refresh_token = token_storage.getString('refresh_token') as string;

    if (access_token) {
      const decodedAccessToken = jwtDecode<JwtDecoded>(access_token);
      const decodedRefreshToken = jwtDecode<JwtDecoded>(refresh_token);
      const currentTime = Date.now() / 1000;

      if (decodedRefreshToken?.exp < currentTime) {
        resetAndNavigate('LoginScreen');
        Alert.alert("Session Exxpired", "Your session has been expired, Please try again later.");
        return false;
      }

      if (decodedRefreshToken?.exp < currentTime) {
        try {
          refreshToken();
          //dispatch(refetchUser()) in the component
          // This is how we actually call the function and trigger the Redux action.
          dispatch(refetchUser());
        } catch (error) {
          console.log("Error ", error);
          Alert.alert("Something Went Wrong", "An error occured, Please try again later");
          return false;
        }
      }

      resetAndNavigate('BottomTab');
      return true;
    }

    resetAndNavigate('LoginScreen');
    return false;

  };

  const handleNoUrlCase = (deepLinkType: string) => {
    if (deepLinkType !== 'RESUME') {
      resetAndNavigate('BottomTab')
    }
  };

  const handleUserCase = (deepLinkType: string, id: string) => {
    if (deepLinkType !== 'RESUME') {
      resetAndNavigate('BottomTab')
    }
    navigate("UserProfileScreen", { username: id })
  }

  const handleDefaultCase = (deepLinkType: string) => {
    if (deepLinkType !== 'RESUME') {
      resetAndNavigate('BottomTab')
    }
  }

  const handleDeepLinks = async (event: any, deepLinkType: string) => {
    const isTokenValid = await tokenCheck();
    if (!isTokenValid) return;

    const { url } = event;
    if (!url) {
      handleNoUrlCase(deepLinkType);
    }
    console.log("url ",url)
    const { type, id } = extractTypeAndId(url);

    switch (type) {
      case 'reel':
       const getReel = await dispatch(getReelById(id, deepLinkType));
       console.log("getreal ",getReel)
       if(getReel?._id) {
        console.log("got reel", getReel.id)
        if (deepLinkType !== 'RESUME') {
          console.log("reseting to tabs ", getReel.id)
        resetAndNavigate('BottomTab');
      }
      console.log("navigating to reels ", getReel.id)
      navigate('FeedReelScrollScreen', {
        data: [getReel],
        index: 0,
      });
       }
        break;
      case 'user':
        handleUserCase(deepLinkType, id);
        break;
      default:
        handleDefaultCase(deepLinkType);
        break;
    }
  }

  useEffect(() => {
    Linking.getInitialURL().then(url => {
      handleDeepLinks({ url }, 'CLOSE')
    });

    Linking.addEventListener('url', event => handleDeepLinks(event, 'RESUME'))
  }, [])

  useEffect(() => {
    const breathingEffect = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ]),
    );
    if (!isStop) {
      breathingEffect.start();
    };

    return () => breathingEffect.stop();

  }, [isStop])

  return (
    <View style={styles.container} >
      <View style={styles.imageContainer} >
        <Animated.Image
          source={LOGO}
          style={{
            width: '60%',
            height: '25%',
            resizeMode: 'contain',
            transform: [{ scale }]
          }}
        />
        <CustomText children={'Reels'} fontFamily={FONTS.Reelz} variant='h3' />
      </View>

    </View>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

});