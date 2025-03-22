import { Animated, StyleSheet, Text, View } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { Colors } from '../../constants/Colors'
import LOGO from '../../assets/images/logo_t.png';
import CustomText from '../../components/global/CustomText';
import { FONTS } from '../../constants/Fonts';

const SplashScreen:FC = () => {
    const [isStop,setIsStop] = useState<boolean>(false);
    const scale = new Animated.Value(1);
  useEffect(() => {
      const breathingEffect = Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scale,{
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          })
        ]),
      );
      if(!isStop) {
        breathingEffect.start();
      };

      return () => breathingEffect.stop();

  },[isStop])

  return (
    <View style={styles.container} >
      <View style={styles.imageContainer} >
          <Animated.Image
                source={LOGO}
                style= {{
                  width: '60%',
                  height: '25%',
                  resizeMode: 'contain',
                  transform: [{scale}]
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

})