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
  Alert,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { verifyDomain } from '../api/auth';
import { colors } from '../utils/colors';

const { width, height } = Dimensions.get('window');

export default function ModernLoginScreen({ navigation }) {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const emailScale = useRef(new Animated.Value(1)).current;
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

  const handleLoginPress = async () => {
    if (!domain.trim()) {
      Alert.alert('Error', 'Please enter your domain.');
      return;
    }
    // navigation.navigate('loginScreen', { domain: `https://${domain}` });
    setLoading(true);

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

    try {
      const response = await verifyDomain({ domain });
      if (response?.data) {
        navigation.navigate('loginScreen', { domain: `https://${domain}` });
      } else {
        Alert.alert('Error', 'Invalid domain. Please try again.');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Domain verification failed. Please try again.');
    } finally {
      setLoading(false);
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
              {/* Domain Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Domain</Text>
                <Animated.View
                  style={[
                    styles.inputWrapper,
                    emailFocused && styles.inputWrapperFocused,
                    { transform: [{ scale: emailScale }] },
                  ]}
                >
                  <View style={styles.iconContainer}>
                    <Text style={styles.icon}>https://</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    value={domain}
                    onChangeText={setDomain}
                    onFocus={handleEmailFocus}
                    onBlur={handleEmailBlur}
                    placeholder="Enter your domain"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="none"
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
                  disabled={loading}
                >
                  <LinearGradient
                    colors={colors.btnGradiant}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.loginButton, loading && { opacity: 0.7 }]}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <>
                        <Text style={styles.loginButtonText}>Next</Text>
                        <Text style={styles.arrowIcon}>→</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Loader Overlay */}
      {loading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loaderText}>Verifying domain...</Text>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  content: { width: '100%', maxWidth: 400, alignSelf: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
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
  logoText: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  titleHighlight: { color: colors.primary },
  subtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center' },
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
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    paddingHorizontal: 12,
  },
  inputWrapperFocused: { backgroundColor: '#EFF6FF', borderColor: '#2563EB' },
  iconContainer: { marginRight: 8 },
  icon: { fontSize: 12 },
  input: { flex: 1, paddingVertical: 16, fontSize: 16, color: '#1F2937' },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 24 },
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
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  arrowIcon: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signupText: { color: '#6B7280', fontSize: 14 },
  signupLink: { color: '#2563EB', fontSize: 14, fontWeight: '600' },

  // Loader Overlay Styles
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '600',
  },
});
