import React, { useRef } from "react";
import { Animated } from "react-native";

const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  export default function Animation(child) {
    return (
      fadeIn, fadeOut,
      <Animated.View style={{ opacity: fadeAnim }}>
        {child}
      </Animated.View>
    )
  }