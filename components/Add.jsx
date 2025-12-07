import { Svg, Path } from "react-native-svg";

export default function Add({ size = 36, color = "white" }) {
  return (
    <Svg
      width={size}
      height={size}
      fill="none"
      stroke={color}
      viewBox="0 0 24 24"
      strokeWidth={1.5}
    >
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </Svg>
  );
}
