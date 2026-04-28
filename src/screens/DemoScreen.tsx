import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Animated,
  PanResponder,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors, spacing, borderRadius, typography } from '../lib/theme';
import { DEMO_USER_ID, DEMO_PROFILE, MOCK_PROFILES, MOCK_MATCHES, MOCK_MESSAGES } from '../lib/mock';
import { Profile, Message } from '../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

const Tab = createBottomTabNavigator();

// ── Discover Tab ──

function DemoDiscover() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;

  const currentProfile = MOCK_PROFILES[currentIndex];

  const handleSwipe = (direction: 'like' | 'pass') => {
    if (currentIndex < MOCK_PROFILES.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setCurrentIndex(0);
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

  if (!currentProfile) return null;

  return (
    <View style={discoverStyles.container}>
      <Text style={discoverStyles.header}>Discover</Text>
      <View style={discoverStyles.demoBadge}>
        <Text style={discoverStyles.demoBadgeText}>Demo Mode</Text>
      </View>

      <View style={discoverStyles.cardContainer}>
        {MOCK_PROFILES[currentIndex + 1] && (
          <View style={[discoverStyles.card, discoverStyles.nextCard]}>
            <Image
              source={{ uri: MOCK_PROFILES[currentIndex + 1].photos[0] }}
              style={discoverStyles.cardImage}
            />
          </View>
        )}

        <Animated.View
          {...panResponder.panHandlers}
          style={[
            discoverStyles.card,
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
            source={{ uri: currentProfile.photos[0] }}
            style={discoverStyles.cardImage}
          />
          <View style={discoverStyles.cardOverlay}>
            <Animated.View style={[discoverStyles.stamp, discoverStyles.likeStamp, { opacity: likeOpacity }]}>
              <Text style={discoverStyles.likeText}>LIKE</Text>
            </Animated.View>
            <Animated.View style={[discoverStyles.stamp, discoverStyles.passStamp, { opacity: passOpacity }]}>
              <Text style={discoverStyles.passText}>NOPE</Text>
            </Animated.View>
          </View>
          <View style={discoverStyles.cardInfo}>
            <Text style={discoverStyles.cardName}>
              {currentProfile.name}, {currentProfile.age}
            </Text>
            {currentProfile.bio ? (
              <Text style={discoverStyles.cardBio} numberOfLines={2}>
                {currentProfile.bio}
              </Text>
            ) : null}
          </View>
        </Animated.View>
      </View>

      <View style={discoverStyles.actions}>
        <TouchableOpacity
          style={[discoverStyles.actionButton, discoverStyles.passButton]}
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
          <Text style={discoverStyles.actionIcon}>✕</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[discoverStyles.actionButton, discoverStyles.likeButton]}
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
          <Text style={discoverStyles.actionIcon}>♥</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Matches Tab ──

function DemoMatches({ onOpenChat }: { onOpenChat: (profile: Profile) => void }) {
  return (
    <View style={matchStyles.container}>
      <Text style={matchStyles.header}>Matches</Text>
      <FlatList
        data={MOCK_MATCHES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={matchStyles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={matchStyles.matchCard}
            onPress={() => onOpenChat(item.profile)}
            activeOpacity={0.7}
          >
            <Image source={{ uri: item.profile.photos[0] }} style={matchStyles.avatar} />
            <View style={matchStyles.matchInfo}>
              <Text style={matchStyles.matchName}>
                {item.profile.name}, {item.profile.age}
              </Text>
              <Text style={matchStyles.matchBio} numberOfLines={1}>
                {item.profile.bio || 'Say hello!'}
              </Text>
            </View>
            <View style={matchStyles.chatIndicator}>
              <Text style={matchStyles.chatArrow}>›</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// ── Chat View ──

function DemoChat({ otherUser, onBack }: { otherUser: Profile; onBack: () => void }) {
  const [messages, setMessages] = useState<Message[]>(
    MOCK_MESSAGES.filter(() => otherUser.id === 'mock-1') // show messages for first match
  );
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        match_id: 'match-1',
        sender_id: DEMO_USER_ID,
        content: text,
        created_at: new Date().toISOString(),
      },
    ]);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <KeyboardAvoidingView
      style={chatStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={chatStyles.header}>
        <TouchableOpacity onPress={onBack} style={chatStyles.backButton}>
          <Text style={chatStyles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={chatStyles.headerName}>{otherUser.name}</Text>
        <View style={chatStyles.backButton} />
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={chatStyles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        renderItem={({ item }) => {
          const isOwn = item.sender_id === DEMO_USER_ID;
          return (
            <View style={[chatStyles.messageBubble, isOwn ? chatStyles.ownBubble : chatStyles.otherBubble]}>
              <Text style={[chatStyles.messageText, isOwn ? chatStyles.ownText : chatStyles.otherText]}>
                {item.content}
              </Text>
              <Text style={[chatStyles.messageTime, isOwn ? chatStyles.ownTime : chatStyles.otherTime]}>
                {formatTime(item.created_at)}
              </Text>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={chatStyles.emptyChat}>
            <Text style={chatStyles.emptyChatText}>Say hi to {otherUser.name}!</Text>
          </View>
        }
      />

      <View style={chatStyles.inputBar}>
        <TextInput
          style={chatStyles.input}
          placeholder="Type a message..."
          placeholderTextColor={colors.textLight}
          value={input}
          onChangeText={setInput}
          multiline
        />
        <TouchableOpacity
          style={[chatStyles.sendButton, !input.trim() && chatStyles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!input.trim()}
        >
          <Text style={chatStyles.sendText}>↑</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// ── Profile Tab ──

function DemoProfile({ onExit }: { onExit: () => void }) {
  return (
    <ScrollView style={profileStyles.container} contentContainerStyle={profileStyles.content}>
      <Text style={profileStyles.header}>Profile</Text>

      <View style={profileStyles.photoSection}>
        <Image source={{ uri: DEMO_PROFILE.photos[0] }} style={profileStyles.mainPhoto} />
      </View>

      <View style={profileStyles.infoCard}>
        <Text style={profileStyles.name}>
          {DEMO_PROFILE.name}, {DEMO_PROFILE.age}
        </Text>
        <Text style={profileStyles.bio}>{DEMO_PROFILE.bio}</Text>
      </View>

      <TouchableOpacity style={profileStyles.exitButton} onPress={onExit}>
        <Text style={profileStyles.exitText}>Exit Demo Mode</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ── Main Demo Screen ──

export default function DemoScreen({ navigation }: any) {
  const [chatProfile, setChatProfile] = useState<Profile | null>(null);

  if (chatProfile) {
    return <DemoChat otherUser={chatProfile} onBack={() => setChatProfile(null)} />;
  }

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          borderTopColor: colors.border,
          backgroundColor: colors.white,
          paddingBottom: 4,
          height: 56,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="DemoDiscover"
        component={DemoDiscover}
        options={{
          tabBarLabel: 'Discover',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🔥</Text>,
        }}
      />
      <Tab.Screen
        name="DemoMatches"
        options={{
          tabBarLabel: 'Matches',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>💬</Text>,
        }}
      >
        {() => <DemoMatches onOpenChat={(profile) => setChatProfile(profile)} />}
      </Tab.Screen>
      <Tab.Screen
        name="DemoProfile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>👤</Text>,
        }}
      >
        {() => <DemoProfile onExit={() => navigation.goBack()} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// ── Styles ──

const discoverStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 60 },
  header: { ...typography.h2, color: colors.text, paddingHorizontal: spacing.xl, marginBottom: spacing.xs },
  demoBadge: { alignSelf: 'flex-start', marginLeft: spacing.xl, backgroundColor: colors.secondary, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.full, marginBottom: spacing.sm },
  demoBadgeText: { ...typography.small, color: colors.white, fontWeight: '600' },
  cardContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { width: SCREEN_WIDTH - spacing.xl * 2, height: SCREEN_HEIGHT * 0.55, borderRadius: borderRadius.xl, position: 'absolute', overflow: 'hidden', shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8, backgroundColor: colors.surface },
  nextCard: { transform: [{ scale: 0.95 }] },
  cardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  cardOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  stamp: { position: 'absolute', top: 40, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 3, borderRadius: borderRadius.sm },
  likeStamp: { left: 20, borderColor: colors.success, transform: [{ rotate: '-15deg' }] },
  passStamp: { right: 20, borderColor: colors.danger, transform: [{ rotate: '15deg' }] },
  likeText: { ...typography.h2, color: colors.success },
  passText: { ...typography.h2, color: colors.danger },
  cardInfo: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: spacing.lg, backgroundColor: 'rgba(0,0,0,0.4)' },
  cardName: { ...typography.h2, color: colors.white },
  cardBio: { ...typography.body, color: 'rgba(255,255,255,0.9)', marginTop: spacing.xs },
  actions: { flexDirection: 'row', justifyContent: 'center', gap: spacing.xl, paddingVertical: spacing.lg, paddingBottom: spacing.xl },
  actionButton: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
  passButton: { backgroundColor: colors.white, borderWidth: 2, borderColor: colors.danger },
  likeButton: { backgroundColor: colors.primary },
  actionIcon: { fontSize: 28 },
});

const matchStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 60 },
  header: { ...typography.h2, color: colors.text, paddingHorizontal: spacing.xl, marginBottom: spacing.md },
  list: { paddingHorizontal: spacing.md },
  matchCard: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, marginBottom: spacing.sm, backgroundColor: colors.white, borderRadius: borderRadius.lg, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  matchInfo: { flex: 1, marginLeft: spacing.md },
  matchName: { ...typography.bodyBold, color: colors.text },
  matchBio: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  chatIndicator: { paddingLeft: spacing.sm },
  chatArrow: { fontSize: 24, color: colors.textLight },
});

const chatStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 56, paddingBottom: spacing.md, paddingHorizontal: spacing.md, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  backText: { fontSize: 32, color: colors.primary, marginTop: -4 },
  headerName: { ...typography.bodyBold, color: colors.text },
  messagesList: { padding: spacing.md, flexGrow: 1 },
  messageBubble: { maxWidth: '78%', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.lg, marginBottom: spacing.sm },
  ownBubble: { alignSelf: 'flex-end', backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  otherBubble: { alignSelf: 'flex-start', backgroundColor: colors.surface, borderBottomLeftRadius: 4 },
  messageText: { ...typography.body },
  ownText: { color: colors.white },
  otherText: { color: colors.text },
  messageTime: { ...typography.small, marginTop: 4 },
  ownTime: { color: 'rgba(255,255,255,0.7)', textAlign: 'right' },
  otherTime: { color: colors.textLight },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', padding: spacing.sm, paddingBottom: spacing.lg, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border, gap: spacing.sm },
  input: { flex: 1, backgroundColor: colors.surface, borderRadius: borderRadius.xl, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, ...typography.body, color: colors.text, maxHeight: 100, borderWidth: 1, borderColor: colors.border },
  sendButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  sendButtonDisabled: { backgroundColor: colors.textLight },
  sendText: { color: colors.white, fontSize: 20, fontWeight: '700' },
  emptyChat: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
  emptyChatText: { ...typography.body, color: colors.textSecondary },
});

const profileStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingTop: 60, paddingBottom: spacing.xxl },
  header: { ...typography.h2, color: colors.text, paddingHorizontal: spacing.xl, marginBottom: spacing.lg },
  photoSection: { alignItems: 'center', marginBottom: spacing.lg },
  mainPhoto: { width: 160, height: 160, borderRadius: 80, borderWidth: 3, borderColor: colors.primary },
  infoCard: { marginHorizontal: spacing.xl, padding: spacing.lg, backgroundColor: colors.white, borderRadius: borderRadius.lg, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2, marginBottom: spacing.lg },
  name: { ...typography.h2, color: colors.text, textAlign: 'center' },
  bio: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm },
  exitButton: { marginHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: borderRadius.md, borderWidth: 1.5, borderColor: colors.secondary, alignItems: 'center' },
  exitText: { ...typography.bodyBold, color: colors.secondary },
});
