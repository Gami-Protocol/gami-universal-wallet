/**
 * SignUpScreen Component
 * User registration screen with social auth options
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
import { Eye, EyeOff, Mail, User } from 'lucide-react-native';
import { neoUIColors, typography, spacing, borderRadius } from '@/theme';
import { NeoButton, NeoInput } from '@/components/NeoUI';
import { isValidEmail, validatePassword, validateFullName } from '@/utils/validation';

export default function SignUpScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    const nameError = validateFullName(formData.fullName);
    if (nameError) {
      newErrors.fullName = nameError;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }
    
    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the Terms and Privacy Policy';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = () => {
    if (validateForm()) {
      // TODO: Implement actual sign up logic
      console.log('Sign up with:', formData);
      router.replace('/(tabs)/home');
    }
  };

  const handleSocialAuth = (provider: 'google' | 'apple') => {
    // TODO: Implement social auth
    console.log('Sign up with', provider);
    router.replace('/(tabs)/home');
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
          <Text style={styles.title}>Hello!</Text>
          <Text style={styles.subtitle}>Create your account to get started</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <NeoInput
            label="Full Name"
            value={formData.fullName}
            onChangeText={(text) => setFormData({ ...formData, fullName: text })}
            error={errors.fullName}
            leftIcon={<User size={20} color={neoUIColors.text.subtext} />}
            autoCapitalize="words"
          />

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

          {/* Terms & Conditions */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAgreedToTerms(!agreedToTerms)}
          >
            <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
              {agreedToTerms && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxText}>
              I agree with{' '}
              <Text style={styles.link}>Terms</Text>
              {' and '}
              <Text style={styles.link}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>
          {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}

          {/* Sign Up Button */}
          <NeoButton
            title="Sign up"
            onPress={handleSignUp}
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
            title="Sign up with Google"
            onPress={() => handleSocialAuth('google')}
            variant="outline"
            size="lg"
            fullWidth
          />
          
          <NeoButton
            title="Sign up with Apple"
            onPress={() => handleSocialAuth('apple')}
            variant="outline"
            size="lg"
            fullWidth
          />

          {/* Login Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have an account?{' '}
              <Text
                style={styles.link}
                onPress={() => router.push('/auth/login')}
              >
                Login
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: neoUIColors.border.dark,
    borderRadius: 6,
    marginRight: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: neoUIColors.primary,
    borderColor: neoUIColors.primary,
  },
  checkmark: {
    color: neoUIColors.text.light,
    fontSize: 16,
    fontFamily: typography.fonts.bold,
  },
  checkboxText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: neoUIColors.text.subtext,
  },
  link: {
    color: neoUIColors.primary,
    fontFamily: typography.fonts.semiBold,
  },
  errorText: {
    color: neoUIColors.status.error,
    fontSize: typography.sizes.xs,
    marginTop: -spacing.sm,
    marginLeft: spacing.base,
    fontFamily: typography.fonts.regular,
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
});
