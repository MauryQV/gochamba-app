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
import { ChevronDown } from "lucide-react-native";

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
  error?: boolean;
}

export default function Dropdown({
  label,
  placeholder = "Seleccione una opción",
  value,
  options,
  onSelect,
  className = "",
  error = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const animatedRotation = useState(new Animated.Value(0))[0];
  const triggerRef = useRef<any>(null); // native view ref
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number; maxHeight: number }>({
    top: 0,
    left: 0,
    width: 0,
    maxHeight: 0,
  });

  const openDropdown = () => {
    // ensure measure happens after layout
    if (!triggerRef.current || !triggerRef.current.measureInWindow) {
      // fallback: open centered on screen
      const { width: w, height: h } = Dimensions.get("window");
      setDropdownPos({ top: h / 3, left: 16, width: w - 32, maxHeight: Math.floor(h * 0.5) });
      Animated.timing(animatedRotation, { toValue: 1, duration: 200, useNativeDriver: true }).start();
      setIsOpen(true);
      return;
    }

    // measure native coordinates
    triggerRef.current.measureInWindow((x: number, y: number, width: number, height: number) => {
      const { height: windowHeight, width: windowWidth } = Dimensions.get("window");
      const spaceBelow = windowHeight - (y + height);
      const desiredMax = Math.min(400, Math.floor(windowHeight * 0.5)); // slightly larger allowed
      let top: number;
      let maxHeight: number;

      if (spaceBelow >= desiredMax + 8) {
        // enough space below
        top = y + height + 8;
        maxHeight = desiredMax;
      } else {
        // open above (try)
        maxHeight = Math.max(120, Math.min(desiredMax, Math.floor(y - 16)));
        top = Math.max(8, y - maxHeight - 8);
      }

      // ensure left + width fit inside window with some margin
      const left = Math.max(8, Math.min(x, windowWidth - width - 8));

      setDropdownPos({ top, left, width, maxHeight });

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
    if (isOpen) closeDropdown();
    else openDropdown();
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
      {label && <Text style={{ color: "#374151", fontSize: 13, fontWeight: "500", marginBottom: 8 }}>{label}</Text>}

      {/* trigger button: keep ref on a native view */}
      <View ref={triggerRef} collapsable={false}>
        <TouchableOpacity
          onPress={toggleDropdown}
          activeOpacity={0.7}
          style={{
            width: "100%",
            height: 48,
            backgroundColor: "#fff",
            borderRadius: 12,
            paddingHorizontal: 16,
            borderWidth: 1,
            borderColor: error ? "#EF4444" : "#D1D5DB",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: value ? "#000" : "#9CA3AF" }}>{value || placeholder}</Text>
          <Animated.View style={{ transform: [{ rotate: rotation }] }}>
            <ChevronDown color="#9CA3AF" size={20} />
          </Animated.View>
        </TouchableOpacity>
      </View>

      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>
        <TouchableWithoutFeedback onPress={closeDropdown}>
          <View style={{ flex: 1 }}>
            {/* stop propagation on inner area */}
            <TouchableWithoutFeedback>
              <View
                style={{
                  position: "absolute",
                  top: dropdownPos.top + 30,
                  left: dropdownPos.left,
                  width: dropdownPos.width,
                  maxHeight: dropdownPos.maxHeight,
                }}
              >
                <View
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "#E5E7EB",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.08,
                    shadowRadius: 12,
                    elevation: 8,
                    overflow: "hidden",
                  }}
                >
                  <ScrollView
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{
                      paddingVertical: 4,
                    }}
                    style={{
                      maxHeight: dropdownPos.maxHeight,
                    }}
                  >
                    {options.map((item, index) => {
                      const isSelected = item === value;
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => handleSelect(item)}
                          activeOpacity={0.7}
                          style={{
                            paddingVertical: 12, // <-- important: larger vertical padding
                            paddingHorizontal: 16,
                            borderBottomWidth: index !== options.length - 1 ? 1 : 0,
                            borderBottomColor: "#F3F4F6",
                            backgroundColor: isSelected ? "#EFF6FF" : "transparent",
                          }}
                        >
                          <Text
                            style={{
                              color: isSelected ? "#1E40AF" : "#111827",
                              fontWeight: isSelected ? "600" : "400",
                            }}
                          >
                            {item}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
