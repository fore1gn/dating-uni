import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../lib/theme';

type Props = {
  onComplete: (university: string, email: string) => void;
  onSkip: () => void;
};

export default function UniversitySetupScreen({ onComplete, onSkip }: Props) {
  const [university, setUniversity] = useState('');
  const [email, setEmail] = useState('');

  const handleContinue = () => {
    if (!university.trim()) {
      Alert.alert('Required', 'Please enter your university name');
      return;
    }
    if (!email.trim() || !email.includes('@') || !email.includes('.edu')) {
      Alert.alert('Invalid Email', 'Please enter a valid university email (.edu)');
      return;
    }
    onComplete(university.trim(), email.trim());
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>Spark</Text>
          <Text style={styles.subtitle}>University Edition</Text>
          <Text style={styles.description}>
            Connect with students at your university and in your city.
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>University Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Universidad Complutense de Madrid"
            placeholderTextColor={colors.textLight}
            value={university}
            onChangeText={setUniversity}
            autoCapitalize="words"
          />

          <Text style={styles.label}>University Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@university.edu"
            placeholderTextColor={colors.textLight}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
          <Text style={styles.skipText}>Skip (Developer Demo)</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logo: {
    ...typography.h1,
    fontSize: 48,
    color: colors.primary,
  },
  subtitle: {
    ...typography.h3,
    color: colors.primaryDark,
    marginTop: spacing.xs,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
  },
  form: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    ...typography.bodyBold,
    color: colors.white,
  },
  skipButton: {
    marginTop: spacing.xxl,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  skipText: {
    ...typography.caption,
    color: colors.textLight,
    textDecorationLine: 'underline',
  },
});
