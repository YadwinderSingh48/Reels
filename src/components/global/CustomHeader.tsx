import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { FC } from 'react'
import { goBack } from '../../utils/NavigationUtils';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../constants/Colors';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomText from './CustomText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
    title: string;
    onInfoPress?: () => void;
}
const CustomHeader:FC<HeaderProps> = ({title, onInfoPress}) => {
  const {top} = useSafeAreaInsets();
  return (
    <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 5,
        paddingTop:top
    }} >
      <TouchableOpacity onPress={()=>goBack()} >
                <Icon name='keyboard-backspace' color={Colors.text} size={RFValue(20)} />
      </TouchableOpacity>
        <CustomText variant='h4'>{title}</CustomText>
        <TouchableOpacity onPress={onInfoPress} >
                <Icon name='information-outline' color={Colors.disabled} size={RFValue(20)} />
      </TouchableOpacity>
    </View>
  )
}

export default CustomHeader

const styles = StyleSheet.create({})