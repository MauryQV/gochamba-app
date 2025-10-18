import React, { useEffect } from "react";
import { View } from "react-native";
import { Loader } from "lucide-react-native";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from "react-native-reanimated";

export default function CenteredSpinner() {
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
      <Loader width={20} height={20} color="#4B5563" />
    </Animated.View>
  );
}
