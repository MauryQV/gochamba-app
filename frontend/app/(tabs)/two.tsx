import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import {
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  Lock,
  Shield,
  ShieldCheck,
  History,
  Hammer,
  Settings,
  MousePointerClick,
  User,
  Bell,
  Globe,
  Moon,
  LogOut,
  ChevronRight,
  X,
  AlertCircle,
} from "lucide-react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  showBadge?: boolean;
  badgeText?: string;
  badgeColor?: string;
  onPress: () => void;
}

const MenuItem = ({ icon, title, subtitle, showBadge, badgeText, badgeColor, onPress }: MenuItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    className="bg-gray-50 rounded-2xl px-4 py-4 flex-row items-center mb-3 border border-gray-200"
    activeOpacity={0.7}
  >
    <View className="w-10 h-10 bg-blue-600 rounded-xl items-center justify-center mr-4">{icon}</View>
    <View className="flex-1">
      <Text className="text-gray-900 text-base font-interSemiBold">{title}</Text>
      {subtitle && (
        <View className="flex-row items-center mt-1">
          {showBadge && (
            <View className={`rounded-full px-2 py-0.5 mr-2 ${badgeColor || "bg-red-500"}`}>
              <Text className="text-white text-xs font-interMedium">{badgeText}</Text>
            </View>
          )}
          <Text className="text-gray-500 text-sm font-interRegular">{subtitle}</Text>
        </View>
      )}
    </View>
    <ChevronRight size={20} color="#9CA3AF" />
  </TouchableOpacity>
);

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section = ({ title, children }: SectionProps) => (
  <View className="mb-6">
    <Text className="text-gray-700 text-sm font-poppinsSemiBold mb-3 px-1">{title}</Text>
    {children}
  </View>
);

export default function TwoScreen() {
  const router = useRouter();

  const signout = async () => {
    try {
      await GoogleSignin.signOut();
      router.push("/");
      console.log("signed out");
    } catch (error) {
      alert("Error: Intente de nuevo");
      console.error("Error signing out: ", error);
    }
  };
  const handleRegisterasWorker = () => {
    router.push("/register-worker");
  };
  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <Section title="Administrar cuenta">
          <MenuItem icon={<User size={22} color="white" />} title="Perfil" onPress={() => console.log("Perfil")} />
          <MenuItem
            icon={<Hammer size={22} color="white" />}
            title="Registrarse como trabajador"
            onPress={() => handleRegisterasWorker()}
          />

          {/* <MenuItem
            icon={<ArrowUpFromLine size={22} color="white" />}
            title="Withdraw"
            onPress={() => console.log("Withdraw")}
          /> */}
        </Section>

        <Section title="Seguridad">
          {/* <MenuItem
            icon={<Lock size={22} color="white" />}
            title="PIN code and biometrics"
            onPress={() => console.log("PIN code")}
          /> */}
          {/* <MenuItem
            icon={<ShieldCheck size={22} color="white" />}
            title="Authenticator"
            subtitle="Not enabled"
            showBadge={true}
            badgeText="✕"
            badgeColor="bg-red-500"
            onPress={() => console.log("Authenticator")}
          /> */}
          <MenuItem
            icon={<Shield size={22} color="white" />}
            title="Configuración de seguridad"
            subtitle="Confirmar email"
            showBadge={true}
            badgeText="⚠"
            badgeColor="bg-orange-500"
            onPress={() => console.log("Security settings")}
          />
          {/* <MenuItem
            icon={<History size={22} color="white" />}
            title="Historial de inicio de sesión"
            onPress={() => console.log("Historial de inicio de sesión")}
          /> */}
        </Section>

        {/* <Section title="Bet settings">
          <MenuItem
            icon={<Settings size={22} color="white" />}
            title="Bet settings"
            onPress={() => console.log("Bet settings")}
          />
          <MenuItem
            icon={<MousePointerClick size={22} color="white" />}
            title="One-click bet"
            onPress={() => console.log("One-click bet")}
          />
        </Section> */}

        <Section title="App settings">
          <MenuItem
            icon={<Bell size={22} color="white" />}
            title="Notifications"
            onPress={() => console.log("Notifications")}
          />
          {/* <MenuItem
            icon={<Globe size={22} color="white" />}
            title="Language"
            subtitle="English"
            onPress={() => console.log("Language")}
          />
          <MenuItem
            icon={<Moon size={22} color="white" />}
            title="Dark mode"
            subtitle="Enabled"
            onPress={() => console.log("Dark mode")}
          /> */}
        </Section>

        <TouchableOpacity
          onPress={signout}
          className="bg-red-600 rounded-2xl px-4 py-4 flex-row items-center justify-center mb-8"
          activeOpacity={0.8}
        >
          <LogOut size={22} color="white" strokeWidth={3} />
          <Text className="text-white text-base font-poppinsBold ml-3">Sign out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
