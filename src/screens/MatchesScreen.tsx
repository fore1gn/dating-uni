import React, { useEffect, useState, useCallback } from 'react';
import { DEFAULT_AVATAR } from '../lib/mock';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, borderRadius, typography } from '../lib/theme';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';

type MatchWithProfile = {
  id: string;
  created_at: string;
  profile: Profile;
};

type Props = {
  userId: string;
  onOpenChat: (matchId: string, profile: Profile) => void;
};

export default function MatchesScreen({ userId, onOpenChat }: Props) {
  const [matches, setMatches] = useState<MatchWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
    // Get all matches where user is either user1 or user2
    const { data: matchesData } = await supabase
      .from('matches')
      .select('*')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (!matchesData) {
      setLoading(false);
      return;
    }

    // Get the other user's profile for each match
    const otherUserIds = matchesData.map((m) =>
      m.user1_id === userId ? m.user2_id : m.user1_id
    );

    const { data: profilesData } = await supabase
      .from('profiles')
      .select('*')
      .in('id', otherUserIds);

    const profileMap = new Map(profilesData?.map((p) => [p.id, p]) || []);

    const matchesWithProfiles: MatchWithProfile[] = matchesData
      .map((m) => {
        const otherId = m.user1_id === userId ? m.user2_id : m.user1_id;
        const profile = profileMap.get(otherId);
        if (!profile) return null;
        return { id: m.id, created_at: m.created_at, profile };
      })
      .filter(Boolean) as MatchWithProfile[];

    setMatches(matchesWithProfiles);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchMatches();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Matches</Text>
      {matches.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyIcon}>💕</Text>
          <Text style={styles.emptyTitle}>No matches yet</Text>
          <Text style={styles.emptyText}>
            Keep swiping to find your match!
          </Text>
        </View>
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.matchCard}
              onPress={() => onOpenChat(item.id, item.profile)}
              activeOpacity={0.7}
            >
              <Image
                source={item.profile.photos[0] ? { uri: item.profile.photos[0] } : DEFAULT_AVATAR}
                style={styles.avatar}
              />
              <View style={styles.matchInfo}>
                <Text style={styles.matchName}>
                  {item.profile.name}, {item.profile.age}
                </Text>
                <Text style={styles.matchBio} numberOfLines={1}>
                  {item.profile.bio || 'Say hello!'}
                </Text>
              </View>
              <View style={styles.chatIndicator}>
                <Text style={styles.chatArrow}>›</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 60,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  header: {
    ...typography.h2,
    color: colors.text,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  list: {
    paddingHorizontal: spacing.md,
  },
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  matchInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  matchName: {
    ...typography.bodyBold,
    color: colors.text,
  },
  matchBio: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  chatIndicator: {
    paddingLeft: spacing.sm,
  },
  chatArrow: {
    fontSize: 24,
    color: colors.textLight,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.text,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
