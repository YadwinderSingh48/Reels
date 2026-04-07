import { NavigationContainer } from "@react-navigation/native";
import { FC } from "react";
import MainNavigator from "./MainNavigator";
import { navigationRef } from "../utils/NavigationUtils";

const config = {
  screens: {
    UserProfileScreen: '/user/:username',
    ReelScrollScreen: '/reel/:id',
  },
};

const linking = {
  prefixes: ['reels://', 'https://reels.com', 'http://localhost:3000',"https://reels-server-ot2h.onrender.com"],
  config,
};


const Navigation:FC = () => {
    return (
        <NavigationContainer linking={linking} ref={navigationRef} >
            <MainNavigator />
        </NavigationContainer>
    )
};


export default Navigation;