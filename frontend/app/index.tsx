import { Link, useRouter } from "expo-router";
import { Eye, EyeOff, Loader } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useGoogleAuth } from "./register/hooks/_use_google_auth";
import { useLogin } from "./register/hooks/_use_login";
export default function IndexScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleRegistration = () => {
    router.push("/register/choose-method");
  };
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const router = useRouter();
  const { handleGoogleSignIn, isSubmitting } = useGoogleAuth();
  const { handleLogin, isSubmitting: isLoginSubmitting, errors, setErrors } = useLogin();

  const handleLoginEvent = async () => {
    let hasError = false;

    if (!email) {
      setEmailError(true);
      hasError = true;
    } else {
      setEmailError(false);
    }

    if (!password) {
      setPasswordError(true);
      hasError = true;
      if (hasError) {
        setErrors("Debe llenar los campos");
        return;
      }
    } else if (password.length < 6) {
      setPasswordError(true);
      setErrors("La contraseña debe tener al menos 6 caracteres");
      return;
    } else {
      setPasswordError(false);
    }

    if (hasError) {
      setErrors("Debe llenar los campos");
      return;
    }

    await handleLogin(email, password);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) {
      setEmailError(false);
    }
    if (errors) {
      setErrors("");
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) {
      setPasswordError(false);
    }
    if (errors) {
      setErrors("");
    }
  };

  return (
    <View className="flex-1 bg-white relative">
      <View className="absolute bottom-0 right-0">
        <View className="w-40 h-40 bg-blue-600 rounded-full absolute -bottom-20 -right-10"></View>
        <View className="w-32 h-32 bg-orange-500 rounded-full absolute -bottom-16 right-20"></View>
      </View>

      <View className={`flex-1 justify-center px-8 ${isVisible ? "opacity-100" : "opacity-0"}`}>
        <View className="mb-16">
          <Text className="text-5xl font-black text-black text-center mb-16">GoChamba</Text>
          <Text className="text-3xl font-semibold text-black mb-2">Iniciar Sesión</Text>
        </View>

        <View className="space-y-6">
          <View className="mb-4">
            <Text className="text-gray-700 text-sm font-medium mb-2">Email</Text>
            <TextInput
              keyboardType="email-address"
              className={`w-full h-12 bg-gray-50 rounded-lg px-4 text-black border ${emailError ? "border-red-500" : "border-gray-200"}`}
              placeholder=""
              value={email}
              onChangeText={handleEmailChange}
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text className="text-gray-700 text-sm font-medium mb-2">Contraseña</Text>
            <View className="relative">
              <TextInput
                secureTextEntry={!showPassword}
                className={`w-full h-12 bg-gray-50 rounded-lg px-4 pr-12 text-black border ${passwordError ? "border-red-500" : "border-gray-200"}`}
                placeholder=""
                value={password}
                onChangeText={handlePasswordChange}
              />
              <TouchableOpacity className="absolute right-3 top-3" onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <Eye size={20} color="#9CA3AF" /> : <EyeOff size={20} color="#9CA3AF" />}
              </TouchableOpacity>
            </View>
          </View>
          {errors && <Text className="text-red-500 text-sm mt-2">{errors}</Text>}

          <View className="items-end mt-2">
            <TouchableOpacity>
              <Text className="text-gray-500 text-sm">¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className={`mt-8 w-full h-12 bg-blue-600 rounded-lg flex items-center justify-center ${
              isLoginSubmitting ? "opacity-80" : ""
            }`}
            onPress={handleLoginEvent}
            disabled={isLoginSubmitting}
          >
            {isLoginSubmitting ? (
              <View className="flex-row items-center">
                <Loader size={20} color="white" className="animate-spin" />
              </View>
            ) : (
              <Text className="text-white font-semibold text-base">Ingresar</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row items-center my-8">
            <View className="flex-1 h-px bg-gray-200"></View>
            <Text className="mx-4 text-gray-500 text-sm">o</Text>
            <View className="flex-1 h-px bg-gray-200"></View>
          </View>

          <TouchableOpacity
            onPress={handleGoogleSignIn}
            className={`w-full h-12 bg-white border border-gray-200 rounded-lg flex-row items-center justify-center ${
              isSubmitting ? "opacity-80" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader size={20} color="#4B5563" className="animate-spin" />
            ) : (
              <>
                <Image
                  source={require("./../assets/logo-google.png")}
                  style={{ width: 20, height: 20, marginRight: 8 }}
                />
                <Text className="text-gray-700 font-medium">Continuar con Google</Text>
              </>
            )}
          </TouchableOpacity>

          <View className="flex-row items-center justify-center mt-8">
            <Text className="text-gray-600">¿No tienes una cuenta? </Text>
            <TouchableOpacity onPress={handleRegistration}>
              <Text className="text-orange-500 font-semibold">Regístrate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
