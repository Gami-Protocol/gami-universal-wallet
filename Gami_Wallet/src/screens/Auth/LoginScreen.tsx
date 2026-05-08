/**
 * LoginScreen Component
 * User login screen with social auth options
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Eye, EyeOff, Mail } from 'lucide-react-native';
import { neoUIColors, typography, spacing } from '@/theme';
import { NeoButton, NeoInput } from '@/components/NeoUI';
import { isValidEmail } from '@/utils/validation';

export default function LoginScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (validateForm()) {
      // TODO: Implement actual login logic
      console.log('Login with:', formData);
      router.replace('/(tabs)/home');
    }
  };

  const handleSocialAuth = (provider: 'google' | 'apple') => {
    // TODO: Implement social auth
    console.log('Login with', provider);
    router.replace('/(tabs)/home');
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password
    console.log('Forgot password');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome back!</Text>
          <Text style={styles.subtitle}>Login to continue your journey</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <NeoInput
            label="Email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            error={errors.email}
            leftIcon={<Mail size={20} color={neoUIColors.text.subtext} />}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <NeoInput
            label="Password"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            error={errors.password}
            secureTextEntry={!showPassword}
            rightIcon={
              showPassword ? (
                <EyeOff size={20} color={neoUIColors.text.subtext} />
              ) : (
                <Eye size={20} color={neoUIColors.text.subtext} />
              )
            }
            onRightIconPress={() => setShowPassword(!showPassword)}
          />

          {/* Forgot Password */}
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <NeoButton
            title="Login"
            onPress={handleLogin}
            variant="gradient"
            size="lg"
            fullWidth
          />

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Auth */}
          <NeoButton
            title="Login with Google"
            onPress={() => handleSocialAuth('google')}
            variant="outline"
            size="lg"
            fullWidth
          />
          
          <NeoButton
            title="Login with Apple"
            onPress={() => handleSocialAuth('apple')}
            variant="outline"
            size="lg"
            fullWidth
          />

          {/* Sign Up Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account?{' '}
              <Text
                style={styles.link}
                onPress={() => router.push('/auth/signup')}
              >
                Sign up
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: neoUIColors.background.darker,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing['5xl'],
    paddingBottom: spacing['2xl'],
  },
  header: {
    marginBottom: spacing['3xl'],
  },
  title: {
    fontSize: typography.sizes['4xl'],
    fontFamily: typography.fonts.bold,
    color: neoUIColors.text.light,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.regular,
    color: neoUIColors.text.subtext,
  },
  form: {
    gap: spacing.base,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -spacing.sm,
  },
  forgotPasswordText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.semiBold,
    color: neoUIColors.primary,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: neoUIColors.border.dark,
  },
  dividerText: {
    marginHorizontal: spacing.base,
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: neoUIColors.text.subtext,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  footerText: {
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.regular,
    color: neoUIColors.text.subtext,
  },
  link: {
    color: neoUIColors.primary,
    fontFamily: typography.fonts.semiBold,
  },
});
