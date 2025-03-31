import { Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { FC, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import CustomSafeAreaView from '../../components/global/CustomSafeAreaView';
import CustomHeader from '../../components/global/CustomHeader';
import { Colors } from '../../constants/Colors';
import { FONTS } from '../../constants/Fonts';
import GradientButton from '../../components/global/GradientButton';
import { goBack } from '../../utils/NavigationUtils';
import { useUpload } from '../../components/uploadservice/uploadContext';

interface uriDataProps {
    thumb_uri: string;
    file_uri: string;
}
const UploadReelScreen:FC = () => {
    const route = useRoute();
    const item = route.params as uriDataProps ;
    const [caption,setCaption] = useState<string>('');
    const {startUpload} = useUpload();

  return (
    <CustomSafeAreaView>
        <CustomHeader title='Upload' />
                <ScrollView contentContainerStyle={styles.container} >
                    <View style={styles.flexDirectionRow} >
                        <Image source={{uri: item.thumb_uri}} style={styles.img} />
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={caption}
                            placeholderTextColor={Colors.border}
                            onChangeText={setCaption}
                            placeholder='Enter your caption here.....'
                            multiline={true}
                            numberOfLines={8}
                        />
                    </View>

                    <GradientButton
                            text='Upload'
                            iconName='upload'
                            onPress={() => {
                                startUpload(item?.thumb_uri, item?.file_uri, caption);
                                goBack();
                            }}
                    />
                </ScrollView>
    </CustomSafeAreaView>
  )
}

export default UploadReelScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 5,
        paddingHorizontal: 0,
        margin: 30,
        alignItems: 'center'
    },
    flexDirectionRow: {
        flexDirection: 'row',
        alignItems:'center',
        // justifyContent: 'center'
        gap: 20
    },
    img: {
        width: '25%',
        height: 150,
        borderRadius: 10,
        resizeMode: 'cover'
    },
    input: {
        height: 150,
        borderColor: 'gray',
        borderWidth: 1,
        color:  Colors.text,
        borderRadius: 5,
        fontFamily: FONTS.Medium,
        padding: 10,
        marginVertical: 10,
        width: "68%"
    },
    textArea: {
        height: 150,
        textAlignVertical: 'top',

    }
})