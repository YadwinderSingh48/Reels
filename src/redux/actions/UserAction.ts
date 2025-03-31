import axios from "axios";
import { AppAxios } from "../ApiConfig";
import { setUser } from "../reducers/userSlice";
import { CHECK_USERNAME, REGISTER } from "../API";
import { token_storage } from "../storage";
import { resetAndNavigate } from "../../utils/NavigationUtils";
import Toast from 'react-native-toast-message';

// refetch the user action defined... can be used to refetch user after the token refresh
//1️⃣ dispatch in the parameter
//This is passed automatically by Redux Thunk when the function runs. eg dispatch(refetchUser())

interface registerData {
    id_token: string;
    provider: string;
    name: string;
    email: string;
    username: string;
    userImage: string;
    bio: string;
  }
  
export const refetchUser = () => async (dispatch: any) => {
    
    try {
        const res = await AppAxios.get('/user/profile');
        await dispatch(setUser(res.data.user));
    } catch (error) {
        console.log("REFETCH USER -->", error);
    }
};

export const checkUsernameAvailability =
  (username: string) => async (dispatch: any) => {
    try {
      const res = await axios.post(CHECK_USERNAME, {
        username,
      });
      return res.data.available;
    } catch (error: any) {
      console.log('CHECK USERNAME ERROR ->', error);
      return null;
    }
  };

  export const register = (data: registerData) => async (dispatch: any) => {
    try {
      const res = await axios.post(REGISTER, data);
      token_storage.set('access_token', res.data.tokens.access_token);
      token_storage.set('refresh_token', res.data.tokens.refresh_token);
      await dispatch(setUser(res.data.user));
      resetAndNavigate('BottomTab');
    } catch (error: any) {
      Toast.show({
        type: 'normalToast',
        props: {
          msg: 'There was an error, try again later',
        },
      });
    console.log('REGISTER ERROR ->', error);
    }
  };
