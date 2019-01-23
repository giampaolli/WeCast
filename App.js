import { createStackNavigator, createAppContainer } from "react-navigation";

import Feed from './src/screen/Feed';
import Player from './src/screen/Player'

const AppNavigator = createStackNavigator({
    Feed: {
      screen: Feed
    },
    Player: {
      screen: Player,
    }
  },
  {
    initialRouteName: "Feed"
  });

export default createAppContainer(AppNavigator);
