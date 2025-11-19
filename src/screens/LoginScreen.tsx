import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';
import { verifyLogin } from '../api/auth';
import { icons } from '../assets';
import { login } from '../redux/slices/authSlice';
import { colors } from '../utils/colors';

export default function LoginScreen({ navigation, route }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const domain = route.params?.domain || '';

  const emailScale = useRef(new Animated.Value(1)).current;
  const passwordScale = useRef(new Animated.Value(1)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleEmailFocus = () => {
    setEmailFocused(true);
    Animated.spring(emailScale, {
      toValue: 1.02,
      useNativeDriver: true,
    }).start();
  };

  const handleEmailBlur = () => {
    setEmailFocused(false);
    Animated.spring(emailScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePasswordFocus = () => {
    setPasswordFocused(true);
    Animated.spring(passwordScale, {
      toValue: 1.02,
      useNativeDriver: true,
    }).start();
  };

  const handlePasswordBlur = () => {
    setPasswordFocused(false);
    Animated.spring(passwordScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleLoginPress = async () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    // Add your login logic here
    let object = {
      domain: domain,
      user: '',
      code: email,
      screen: '',
      token: '',
      key: '',
      stamp: '',
      company: '',
      isEmbeddedLogin: false,
      appToken: '',
      employeeAccessSignature: '',
      password: password,
      session: '',
    };
    console.log(object, 'login object');
    try {
      setLoading(true);
      const response = await verifyLogin(object);
      setLoading(false);
      if (response?.data) {
        dispatch(login(response.data));
        navigation.navigate('Home');
      }
      console.log(response, 'login response');
    } catch (error) {
      setLoading(false);
      console.log(error, 'login error');
    }
  };

  return (
    <LinearGradient
      colors={['#EFF6FF', '#EDE9FE', '#FAE8FF']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            {/* Logo Section */}
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={colors.btnGradiant}
                style={styles.logoCircle}
              >
                <Text style={styles.logoText}>R</Text>
              </LinearGradient>
              <Text style={styles.title}>
                Welcome to <Text style={styles.titleHighlight}>Roster</Text>
              </Text>
              <Text style={styles.subtitle}>Sign in to continue</Text>
            </View>

            {/* Login Card */}
            <View style={styles.card}>
              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>User Name</Text>
                <Animated.View
                  style={[
                    styles.inputWrapper,
                    emailFocused && styles.inputWrapperFocused,
                    { transform: [{ scale: emailScale }] },
                  ]}
                >
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    onFocus={handleEmailFocus}
                    onBlur={handleEmailBlur}
                    placeholder="Enter Username"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </Animated.View>
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <Animated.View
                  style={[
                    styles.inputWrapper,
                    passwordFocused && styles.inputWrapperFocused,
                    { transform: [{ scale: passwordScale }] },
                  ]}
                >
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    value={password}
                    onChangeText={setPassword}
                    onFocus={handlePasswordFocus}
                    onBlur={handlePasswordBlur}
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Image
                      source={showPassword ? icons.eyeOpen : icons.eyeClose}
                      style={{ width: 20, height: 20, resizeMode: 'contain' }}
                    />
                  </TouchableOpacity>
                </Animated.View>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              {loading ? (
                <ActivityIndicator
                  size="large"
                  color={colors.primary}
                  style={{ marginTop: 10, marginBottom: 10 }}
                />
              ) : (
                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                  <TouchableOpacity
                    onPress={handleLoginPress}
                    activeOpacity={0.9}
                    style={styles.loginButton}
                  >
                    <LinearGradient
                      colors={['#0d4483', '#1a5da8']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.loginButtonGradient}
                    />
                    <Text style={styles.loginButtonText}>Sign In</Text>
                    <Text style={styles.arrowIcon}>→</Text>
                  </TouchableOpacity>
                </Animated.View>
              )}

              {/* Sign Up Link */}
              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <TouchableOpacity>
                  <Text style={styles.signupLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  titleHighlight: {
    color: colors.primary,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    paddingHorizontal: 12,
  },
  inputWrapperFocused: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  iconContainer: {
    marginRight: 8,
  },
  icon: {
    fontSize: 20,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    padding: 8,
  },
  eyeIcon: {
    fontSize: 20,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 12,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButtonGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  arrowIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signupText: {
    color: '#6B7280',
    fontSize: 14,
  },
  signupLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
