import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Animated,
  PanResponder,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../lib/theme';
import { supabase } from '../lib/supabase';
import { DEFAULT_AVATAR } from '../lib/mock';
import { Profile } from '../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

type Props = {
  userId: string;
};

export default function DiscoverScreen({ userId }: Props) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const position = useRef(new Animated.ValueXY()).current;

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    // Get profiles we haven't swiped on yet
    const { data: swipedIds } = await supabase
      .from('swipes')
      .select('swiped_id')
      .eq('swiper_id', userId);

    const excludeIds = [userId, ...(swipedIds?.map((s) => s.swiped_id) || [])];

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .not('id', 'in', `(${excludeIds.join(',')})`)
      .limit(20);

    setProfiles(data || []);
    setCurrentIndex(0);
    setLoading(false);
  };

  const handleSwipe = async (direction: 'like' | 'pass') => {
    const profile = profiles[currentIndex];
    if (!profile) return;

    await supabase.from('swipes').insert({
      swiper_id: userId,
      swiped_id: profile.id,
      direction,
    });

    if (currentIndex >= profiles.length - 1) {
      fetchProfiles();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          Animated.spring(position, {
            toValue: { x: SCREEN_WIDTH + 100, y: gesture.dy },
            useNativeDriver: false,
          }).start(() => {
            position.setValue({ x: 0, y: 0 });
            handleSwipe('like');
          });
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          Animated.spring(position, {
            toValue: { x: -SCREEN_WIDTH - 100, y: gesture.dy },
            useNativeDriver: false,
          }).start(() => {
            position.setValue({ x: 0, y: 0 });
            handleSwipe('pass');
          });
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: ['-10deg', '0deg', '10deg'],
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SCREEN_WIDTH / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const passOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 4, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const currentProfile = profiles[currentIndex];

  if (!currentProfile) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyIcon}>✨</Text>
        <Text style={styles.emptyTitle}>No more profiles</Text>
        <Text style={styles.emptyText}>Check back later for new people</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={fetchProfiles}>
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Discover</Text>

      <View style={styles.cardContainer}>
        {/* Next card (behind) */}
        {profiles[currentIndex + 1] && (
          <View style={[styles.card, styles.nextCard]}>
            <Image
              source={profiles[currentIndex + 1].photos[0] ? { uri: profiles[currentIndex + 1].photos[0] } : DEFAULT_AVATAR}
              style={styles.cardImage}
            />
          </View>
        )}

        {/* Current card */}
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.card,
            {
              transform: [
                { translateX: position.x },
                { translateY: position.y },
                { rotate },
              ],
            },
          ]}
        >
          <Image
            source={currentProfile.photos[0] ? { uri: currentProfile.photos[0] } : DEFAULT_AVATAR}
            style={styles.cardImage}
          />
          <View style={styles.cardOverlay}>
            <Animated.View style={[styles.stamp, styles.likeStamp, { opacity: likeOpacity }]}>
              <Text style={styles.likeText}>LIKE</Text>
            </Animated.View>
            <Animated.View style={[styles.stamp, styles.passStamp, { opacity: passOpacity }]}>
              <Text style={styles.passText}>NOPE</Text>
            </Animated.View>
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardName}>
              {currentProfile.name}, {currentProfile.age}
            </Text>
            {currentProfile.bio ? (
              <Text style={styles.cardBio} numberOfLines={2}>
                {currentProfile.bio}
              </Text>
            ) : null}
          </View>
        </Animated.View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.passButton]}
          onPress={() => {
            Animated.spring(position, {
              toValue: { x: -SCREEN_WIDTH - 100, y: 0 },
              useNativeDriver: false,
            }).start(() => {
              position.setValue({ x: 0, y: 0 });
              handleSwipe('pass');
            });
          }}
        >
          <Text style={styles.actionIcon}>✕</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={() => {
            Animated.spring(position, {
              toValue: { x: SCREEN_WIDTH + 100, y: 0 },
              useNativeDriver: false,
            }).start(() => {
              position.setValue({ x: 0, y: 0 });
              handleSwipe('like');
            });
          }}
        >
          <Text style={styles.actionIcon}>♥</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  header: {
    ...typography.h2,
    color: colors.text,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: SCREEN_WIDTH - spacing.xl * 2,
    height: SCREEN_HEIGHT * 0.55,
    borderRadius: borderRadius.xl,
    position: 'absolute',
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    backgroundColor: colors.surface,
  },
  nextCard: {
    transform: [{ scale: 0.95 }],
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  stamp: {
    position: 'absolute',
    top: 40,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 3,
    borderRadius: borderRadius.sm,
  },
  likeStamp: {
    left: 20,
    borderColor: colors.success,
    transform: [{ rotate: '-15deg' }],
  },
  passStamp: {
    right: 20,
    borderColor: colors.danger,
    transform: [{ rotate: '15deg' }],
  },
  likeText: {
    ...typography.h2,
    color: colors.success,
  },
  passText: {
    ...typography.h2,
    color: colors.danger,
  },
  cardInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  cardName: {
    ...typography.h2,
    color: colors.white,
  },
  cardBio: {
    ...typography.body,
    color: 'rgba(255,255,255,0.9)',
    marginTop: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xl,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  passButton: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.danger,
  },
  likeButton: {
    backgroundColor: colors.primary,
  },
  actionIcon: {
    fontSize: 28,
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
  },
  refreshButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  refreshText: {
    ...typography.bodyBold,
    color: colors.white,
  },
});
