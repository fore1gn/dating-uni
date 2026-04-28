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
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, borderRadius, typography } from '../lib/theme';
import { supabase } from '../lib/supabase';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) Alert.alert('Error', error.message);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>Spark</Text>
          <Text style={styles.tagline}>Find your match</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.textLight}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.textLight}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>Log In</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.link}>
            Don't have an account? <Text style={styles.linkBold}>Sign Up</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => navigation.navigate('Demo' as any)}
        >
          <Text style={styles.skipText}>Skip Login (Demo Mode)</Text>
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
  tagline: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  form: {
    marginBottom: spacing.lg,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.sm,
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
  link: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  linkBold: {
    color: colors.primary,
    fontWeight: '600',
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
