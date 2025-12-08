import Svg, { Path } from "react-native-svg";
import { View } from "react-native";
export default function BuildingIcon() {
  return (
    <View style={{color : "#4e7dfeff", marginRight: 2}}>
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="40"
        height="40"
        color="#4e7dfeff"
        fill="none"
        stroke="#4e7dfeff"
        stroke-width="1.5"
        stroke-linecap="round"
      >
        <Path d="M2 22H22" />
        <Path d="M18 9H14C11.518 9 11 9.518 11 12V22H21V12C21 9.518 20.482 9 18 9Z" />
        <Path d="M15 22H3V5C3 2.518 3.518 2 6 2H12C14.482 2 15 2.518 15 5V9" />
        <Path d="M3 6H6M3 10H6M3 14H6" />
        <Path d="M15 13H17M15 16H17" />
        <Path d="M16 22L16 19" />
      </Svg>
    </View>
  );
}
