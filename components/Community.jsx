import React from "react";
import { Svg, Circle, Path } from "react-native-svg";

export default function Community({
  color = "currentColor",
  size = 26,
  strokeWidth = 1.5,
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
    >
      {/* Heads */}
      <Circle cx="12" cy="7.2" r="2.2" stroke={color} />
      <Circle cx="6.3" cy="9.2" r="1.6" stroke={color} />
      <Circle cx="17.7" cy="9.2" r="1.6" stroke={color} />

      {/* Shoulders / bodies */}
      <Path
        d="M4.2 18c1.4-2 4-3.5 7.8-3.5s6.4 1.5 7.8 3.5"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3.2 15.5c.8-1 2-1.7 3.4-1.7"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20.8 15.5c-.8-1-2-1.7-3.4-1.7"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
