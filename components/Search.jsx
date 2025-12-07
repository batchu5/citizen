import { Svg, Path } from "react-native-svg";

export default function Search() {
  return (
    <Svg 
      width={18} 
      height={18} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="#737373"
    >
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </Svg>
  );
}
