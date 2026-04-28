import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../lib/theme';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';

type Props = {
  userId: string;
};

export default function ProfileScreen({ userId }: Props) {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    setProfile(data);
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => supabase.auth.signOut(),
      },
    ]);
  };

  if (!profile) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Profile</Text>

      <View style={styles.photoSection}>
        <Image
          source={{
            uri: profile.photos[0] || 'https://via.placeholder.com/200',
          }}
          style={styles.mainPhoto}
        />
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.name}>
          {profile.name}, {profile.age}
        </Text>
        {profile.bio ? (
          <Text style={styles.bio}>{profile.bio}</Text>
        ) : null}
      </View>

      <View style={styles.photosRow}>
        {profile.photos.slice(1).map((uri, i) => (
          <Image key={i} source={{ uri }} style={styles.smallPhoto} />
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingTop: 60,
    paddingBottom: spacing.xxl,
  },
  header: {
    ...typography.h2,
    color: colors.text,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  mainPhoto: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  infoCard: {
    marginHorizontal: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: spacing.lg,
  },
  name: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
  },
  bio: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  photosRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  smallPhoto: {
    width: 100,
    height: 133,
    borderRadius: borderRadius.md,
  },
  logoutButton: {
    marginHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.danger,
    alignItems: 'center',
  },
  logoutText: {
    ...typography.bodyBold,
    color: colors.danger,
  },
});
