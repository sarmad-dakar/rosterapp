import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { verifyDomain } from '../api/auth';

const { width, height } = Dimensions.get('window');

export default function ModernLoginScreen({ navigation }) {
  const [domain, setDomain] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

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
    console.log('initiated');
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
    };
    const response = await verifyDomain(object);
    console.log('Domain verification response:', response);
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
                colors={['#2563EB', '#4F46E5']}
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
                <Text style={styles.label}>Email Address</Text>
                <Animated.View
                  style={[
                    styles.inputWrapper,
                    emailFocused && styles.inputWrapperFocused,
                    { transform: [{ scale: emailScale }] },
                  ]}
                >
                  <View style={styles.iconContainer}>
                    <Text style={styles.icon}>Https://</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    value={domain}
                    onChangeText={setDomain}
                    onFocus={handleEmailFocus}
                    onBlur={handleEmailBlur}
                    placeholder="Enter your domain"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </Animated.View>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <TouchableOpacity
                  onPress={handleLoginPress}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={['#2563EB', '#4F46E5']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.loginButton}
                  >
                    <Text style={styles.loginButtonText}>Sign In</Text>
                    <Text style={styles.arrowIcon}>→</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

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
    color: '#2563EB',
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
    fontSize: 12,
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
    color: '#2563EB',
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
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },
});
