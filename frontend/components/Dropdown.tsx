import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
  Dimensions,
} from "react-native";

// Enable LayoutAnimation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface DropdownProps {
  label?: string;
  placeholder?: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  className?: string;
}

export default function Dropdown({
  label,
  placeholder = "Seleccione una opción",
  value,
  options,
  onSelect,
  className = "",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const animatedRotation = useState(new Animated.Value(0))[0];
  const triggerRef = useRef<View | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number; maxHeight: number }>({
    top: 0,
    left: 0,
    width: 0,
    maxHeight: 0,
  });

  const openDropdown = () => {
    // Measure trigger position to anchor the dropdown right below (or above if needed)
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      const { height: windowHeight } = Dimensions.get("window");
      const spaceBelow = windowHeight - (y + height);
      const desiredMax = Math.min(256, Math.floor(windowHeight * 0.5));

      let top: number;
      let maxHeight: number;
      if (spaceBelow >= desiredMax + 16) {
        // Enough space to show below
        top = y + height + 8;
        maxHeight = desiredMax;
      } else {
        // Show above with the max possible height
        maxHeight = Math.max(120, Math.min(desiredMax, Math.floor(y - 16)));
        top = Math.max(8, y - maxHeight - 8);
      }

      setDropdownPos({ top, left: Math.max(8, x), width, maxHeight });

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      Animated.timing(animatedRotation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      setIsOpen(true);
    });
  };

  const closeDropdown = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Animated.timing(animatedRotation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  };

  const handleSelect = (item: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    Animated.timing(animatedRotation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();

    onSelect(item);
    setIsOpen(false);
  };

  const rotation = animatedRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View className={className}>
      {label && <Text className="text-gray-700 text-sm font-medium mb-2">{label}</Text>}

      <View ref={triggerRef} collapsable={false}>
        <TouchableOpacity
          onPress={toggleDropdown}
          className="w-full h-12 bg-white rounded-lg px-4 border border-gray-300 flex-row items-center justify-between"
          activeOpacity={0.7}
        >
          <Text className={value ? "text-black" : "text-gray-400"}>{value || placeholder}</Text>
          <Animated.Text className="text-gray-400 text-lg" style={{ transform: [{ rotate: rotation }] }}>
            ▼
          </Animated.Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>
        <TouchableWithoutFeedback onPress={closeDropdown}>
          <View className="flex-1 bg-black/30">
            <TouchableWithoutFeedback>
              <View
                style={{
                  position: "absolute",
                  top: dropdownPos.top,
                  left: dropdownPos.left,
                  width: dropdownPos.width,
                  maxHeight: dropdownPos.maxHeight,
                }}
                className="bg-white rounded-lg border border-gray-300 shadow-lg overflow-hidden"
              >
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  nestedScrollEnabled
                  keyboardShouldPersistTaps="handled"
                >
                  {options.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleSelect(item)}
                      className={`px-4 py-3 ${
                        index !== options.length - 1 ? "border-b border-gray-100" : ""
                      } ${item === value ? "bg-blue-50" : ""}`}
                      activeOpacity={0.7}
                    >
                      <Text className={`${item === value ? "text-blue-600 font-semibold" : "text-black"}`}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
