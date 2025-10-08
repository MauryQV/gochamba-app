import { StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { Pressable } from "react-native";

import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";

import { Link } from "expo-router";

export default function TabOneScreen() {
  const router = useRouter();
  const signout = async () => {
    try {
      await GoogleSignin.signOut();
      router.push("/");
      console.log("signed out");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Onesd</Text>
      <Link href="/">
        <Text>Go to Login</Text>
      </Link>
      <Pressable onPress={signout}>
        <Text>Sign out </Text>
      </Pressable>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
