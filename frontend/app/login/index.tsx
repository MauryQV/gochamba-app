import { Link } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function IndexScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      // Handle login logic here
    }, 2000);
  };

  return (
    <View style={styles.container}>
      {/* Decorative circles at bottom */}
      <View style={styles.circlesContainer}>
        <View style={styles.blueCircle}></View>
        <View style={styles.orangeCircle}></View>
      </View>

      <View style={[styles.content, isVisible ? styles.visible : styles.hidden]}>
        <View style={styles.header}>
          <Text style={styles.logo}>GoChamba</Text>
          <Text style={styles.title}>Iniciar Sesión</Text>
        </View>

        <View style={styles.form}>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              keyboardType="email-address"
              style={styles.input}
              placeholder=""
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                secureTextEntry={!showPassword}
                style={styles.inputPassword}
                placeholder=""
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <Eye size={20} color="#9CA3AF" /> : <EyeOff size={20} color="#9CA3AF" />}
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <View style={styles.forgotPassword}>
            <TouchableOpacity>
              <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <Link href="/" asChild>
            <TouchableOpacity
              style={[styles.loginButton, isLoading ? styles.loginButtonDisabled : null]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={styles.loadingContent}>
                  <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.loginButtonText}>Ingresando...</Text>
                </View>
              ) : (
                <Text style={styles.loginButtonText}>Ingresar</Text>
              )}
            </TouchableOpacity>
          </Link>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.divider} />
          </View>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>¿No tienes una cuenta? </Text>
            <TouchableOpacity>
              <Text style={styles.signUpLink}>Regístrate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
  },
  circlesContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  blueCircle: {
    width: 160,
    height: 160,
    backgroundColor: "#2563EB",
    borderRadius: 80,
    position: "absolute",
    bottom: -80,
    right: -40,
  },
  orangeCircle: {
    width: 128,
    height: 128,
    backgroundColor: "#F97316",
    borderRadius: 64,
    position: "absolute",
    bottom: -64,
    right: 80,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
  header: {
    marginBottom: 32,
    alignItems: "center",
  },
  logo: {
    fontSize: 40,
    fontWeight: "900",
    color: "#000",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
  },
  form: {
    marginTop: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  input: {
    width: "100%",
    height: 48,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    color: "#000",
  },
  passwordWrapper: {
    position: "relative",
  },
  inputPassword: {
    width: "100%",
    height: 48,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingRight: 48,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    color: "#000",
  },
  eyeButton: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  forgotPassword: {
    alignItems: "flex-end",
    marginTop: 4,
  },
  forgotPasswordText: {
    color: "#6B7280",
    fontSize: 12,
  },
  loginButton: {
    marginTop: 32,
    width: "100%",
    height: 48,
    backgroundColor: "#2563EB",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonDisabled: {
    opacity: 0.8,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 32,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#6B7280",
    fontSize: 12,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
  },
  signUpText: {
    color: "#4B5563",
  },
  signUpLink: {
    color: "#F97316",
    fontWeight: "600",
  },
});
