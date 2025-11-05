import React, { useEffect } from "react";
import { View } from "react-native";
import { Loader } from "lucide-react-native";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from "react-native-reanimated";

export default function CenteredSpinner(colors: { color?: string; w?: number; h?: number }) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(1, {
        duration: 1700, // slower rotation
        easing: Easing.linear,
      }),
      -1
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value * 360}deg` }],
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          width: 20, // same as icon size
          height: 20, // same as icon size
          justifyContent: "center",
          alignItems: "center",
        },
      ]}
    >
      <Loader
        width={colors.w ? colors.w : 20}
        height={colors.h ? colors.h : 20}
        color={colors.color ? colors.color : "#4B5563"}
      />
    </Animated.View>
  );
}
