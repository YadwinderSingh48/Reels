import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useAppDispatch, useApSelector } from '../../redux/reduxHook'
import { selectUser } from '../../redux/reducers/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { refetchUser } from '../../redux/actions/UserAction'
import { RFValue } from 'react-native-responsive-fontsize'
import { Colors } from '../../constants/Colors';
import CustomText from '../global/CustomText'
import { RootState } from '../../redux/store'



interface StatsDisplayProps {
    title: string;
    value: string;
  }
  const StatsDisplay: React.FC<StatsDisplayProps> = ({title, value}) => {
    return (
      <View style={styles.statsContainer}>
        <CustomText style={styles.title}>{title}</CustomText>
        <CustomText style={styles.value}>{value}</CustomText>
      </View>
    );
  };



const StatsContainer = () => {
    const user = useSelector((state:RootState) => state.user.user);
    console.log("user ", user)
    const dispatch = useAppDispatch();

    const fetchUser = async () => {
        await dispatch(refetchUser());
    };


  return (
    <View style={styles.container}>
      <StatsDisplay title="Followers" value={user?.followersCount} />
      <View style={styles.divider} />
      <StatsDisplay title="Reels" value={user?.reelsCount} />
      <View style={styles.divider} />
      <StatsDisplay title="Following" value={user?.followingCount} />
    </View>
  )
}

export default StatsContainer;

const styles = StyleSheet.create({
    container: {
        top: -350,
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
      },
      statsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      title: {
        fontSize: RFValue(30),
      },
      value: {
        fontSize: RFValue(60),
      },
      divider: {
        height: '100%',
        backgroundColor: Colors.disabled,
        width: 3,
        marginHorizontal: 80,
      },
})