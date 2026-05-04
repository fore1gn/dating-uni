import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors, spacing, borderRadius, typography } from '../lib/theme';
import {
  DEMO_USER_ID,
  DEMO_PROFILE,
  MOCK_PROFILES_CAMPUS,
  MOCK_PROFILES_CITY,
  MOCK_MATCHES,
  MOCK_MESSAGES,
  DEFAULT_AVATAR,
} from '../lib/mock';
import { Profile, Message } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PHOTO_GRID_GAP = 2;
const PHOTO_SIZE = (SCREEN_WIDTH - PHOTO_GRID_GAP * 2) / 3;

const Tab = createBottomTabNavigator();

// ── Profile Detail View (Instagram-style) ──

function ProfileDetail({ profile, onBack }: { profile: Profile; onBack: () => void }) {
  const [gridTab, setGridTab] = useState<'personal' | 'folio'>('personal');

  const personalSlots = Array.from({ length: 6 }, (_, i) =>
    profile.photos[i] || null
  );
  // Folio uses a separate set (empty placeholders for demo)
  const folioSlots = Array.from({ length: 6 }, () => null as string | null);

  const activeSlots = gridTab === 'personal' ? personalSlots : folioSlots;

  return (
    <View style={detailStyles.container}>
      <View style={detailStyles.header}>
        <TouchableOpacity onPress={onBack} style={detailStyles.backButton}>
          <Text style={detailStyles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={detailStyles.headerName}>{profile.name}</Text>
        <View style={detailStyles.backButton} />
      </View>

      <ScrollView contentContainerStyle={detailStyles.scrollContent}>
        <View style={detailStyles.profileHeader}>
          <Image
            source={profile.photos[0] ? { uri: profile.photos[0] } : DEFAULT_AVATAR}
            style={detailStyles.avatar}
          />
          <View style={detailStyles.statsRow}>
            <View style={detailStyles.stat}>
              <Text style={detailStyles.statNumber}>{profile.photos.length || 0}</Text>
              <Text style={detailStyles.statLabel}>Photos</Text>
            </View>
            <View style={detailStyles.stat}>
              <Text style={detailStyles.statNumber}>{profile.age}</Text>
              <Text style={detailStyles.statLabel}>Age</Text>
            </View>
          </View>
        </View>

        <View style={detailStyles.infoSection}>
          <Text style={detailStyles.name}>{profile.name}, {profile.age}</Text>
          {profile.degree ? (
            <Text style={detailStyles.degree}>{profile.degree}</Text>
          ) : null}
          {profile.university ? (
            <Text style={detailStyles.university}>{profile.university}</Text>
          ) : null}
          {profile.city ? (
            <Text style={detailStyles.city}>{profile.city}</Text>
          ) : null}
        </View>

        {profile.bio ? (
          <View style={detailStyles.bioSection}>
            <Text style={detailStyles.bio}>{profile.bio}</Text>
          </View>
        ) : null}

        <View style={detailStyles.actionRow}>
          <TouchableOpacity style={detailStyles.connectButton}>
            <Text style={detailStyles.connectButtonText}>Connect</Text>
          </TouchableOpacity>
          <TouchableOpacity style={detailStyles.messageButton}>
            <Text style={detailStyles.messageButtonText}>Message</Text>
          </TouchableOpacity>
        </View>

        {/* Personal / Folio toggle */}
        <View style={gridTabStyles.container}>
          <TouchableOpacity
            style={[gridTabStyles.tab, gridTab === 'personal' && gridTabStyles.activeTab]}
            onPress={() => setGridTab('personal')}
          >
            <Text style={[gridTabStyles.tabText, gridTab === 'personal' && gridTabStyles.activeTabText]}>
              Personal
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[gridTabStyles.tab, gridTab === 'folio' && gridTabStyles.activeTab]}
            onPress={() => setGridTab('folio')}
          >
            <Text style={[gridTabStyles.tabText, gridTab === 'folio' && gridTabStyles.activeTabText]}>
              Folio
            </Text>
          </TouchableOpacity>
        </View>

        <View style={detailStyles.photoGrid}>
          {activeSlots.map((photo, i) => (
            <View key={`${gridTab}-${i}`} style={detailStyles.photoCell}>
              {photo ? (
                <Image source={{ uri: photo }} style={detailStyles.gridPhoto} />
              ) : (
                <View style={detailStyles.emptyPhoto}>
                  <Image source={DEFAULT_AVATAR} style={detailStyles.gridPhoto} />
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// ── Connect Tab (Campus + City with top segment control) ──

function ConnectTab({ onSelectProfile }: { onSelectProfile: (p: Profile) => void }) {
  const [activeTab, setActiveTab] = useState<'campus' | 'city'>('campus');
  const profiles = activeTab === 'campus' ? MOCK_PROFILES_CAMPUS : MOCK_PROFILES_CITY;
  const subtitle = activeTab === 'campus'
    ? (DEMO_PROFILE.university || 'Your University')
    : (DEMO_PROFILE.city || 'Madrid');

  return (
    <View style={listStyles.container}>
      <Text style={listStyles.header}>Connect</Text>
      <View style={listStyles.subtitleRow}>
        <View style={listStyles.demoBadge}>
          <Text style={listStyles.demoBadgeText}>Demo Mode</Text>
        </View>
        <Text style={listStyles.subtitleText} numberOfLines={1}>{subtitle}</Text>
      </View>

      {/* Segment control */}
      <View style={segmentStyles.container}>
        <TouchableOpacity
          style={[segmentStyles.tab, activeTab === 'campus' && segmentStyles.activeTab]}
          onPress={() => setActiveTab('campus')}
        >
          <Text style={[segmentStyles.tabText, activeTab === 'campus' && segmentStyles.activeTabText]}>
            🎓  Campus
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[segmentStyles.tab, activeTab === 'city' && segmentStyles.activeTab]}
          onPress={() => setActiveTab('city')}
        >
          <Text style={[segmentStyles.tabText, activeTab === 'city' && segmentStyles.activeTabText]}>
            🏙️  City
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={profiles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={listStyles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={listStyles.userCard}
            onPress={() => onSelectProfile(item)}
            activeOpacity={0.7}
          >
            <Image
              source={item.photos[0] ? { uri: item.photos[0] } : DEFAULT_AVATAR}
              style={listStyles.userAvatar}
            />
            <View style={listStyles.userInfo}>
              <Text style={listStyles.userName}>{item.name}, {item.age}</Text>
              <Text style={listStyles.userDetail} numberOfLines={1}>
                {activeTab === 'campus' ? item.degree : item.university}
              </Text>
            </View>
            <View style={listStyles.chevron}>
              <Text style={listStyles.chevronText}>›</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// ── Matches Tab ──

function DemoMatches({ onOpenChat }: { onOpenChat: (profile: Profile) => void }) {
  return (
    <View style={matchStyles.container}>
      <Text style={matchStyles.header}>Messages</Text>
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
            <Image source={item.profile.photos[0] ? { uri: item.profile.photos[0] } : DEFAULT_AVATAR} style={matchStyles.avatar} />
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
    MOCK_MESSAGES.filter(() => otherUser.id === 'mock-c1')
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
    <ScrollView style={profileTabStyles.container} contentContainerStyle={profileTabStyles.content}>
      <Text style={profileTabStyles.header}>Profile</Text>

      <View style={profileTabStyles.photoSection}>
        <Image source={DEMO_PROFILE.photos[0] ? { uri: DEMO_PROFILE.photos[0] } : DEFAULT_AVATAR} style={profileTabStyles.mainPhoto} />
      </View>

      <View style={profileTabStyles.infoCard}>
        <Text style={profileTabStyles.name}>
          {DEMO_PROFILE.name}, {DEMO_PROFILE.age}
        </Text>
        <Text style={profileTabStyles.bio}>{DEMO_PROFILE.bio}</Text>
        {DEMO_PROFILE.university ? (
          <Text style={profileTabStyles.university}>{DEMO_PROFILE.university}</Text>
        ) : null}
        {DEMO_PROFILE.city ? (
          <Text style={profileTabStyles.city}>{DEMO_PROFILE.city}</Text>
        ) : null}
      </View>

      <TouchableOpacity style={profileTabStyles.exitButton} onPress={onExit}>
        <Text style={profileTabStyles.exitText}>Exit Demo Mode</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ── Main Demo Screen ──

export default function DemoScreen({ navigation }: any) {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [chatProfile, setChatProfile] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState('DemoConnect');

  if (chatProfile) {
    return (
      <DemoChat
        otherUser={chatProfile}
        onBack={() => setChatProfile(null)}
      />
    );
  }

  if (selectedProfile) {
    return <ProfileDetail profile={selectedProfile} onBack={() => setSelectedProfile(null)} />;
  }

  return (
    <Tab.Navigator
      initialRouteName={activeTab}
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
        name="DemoConnect"
        options={{
          tabBarLabel: 'Connect',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>👤</Text>,
        }}
      >
        {() => <ConnectTab onSelectProfile={setSelectedProfile} />}
      </Tab.Screen>
      <Tab.Screen
        name="DemoMatches"
        options={{
          tabBarLabel: 'Messages',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>💬</Text>,
        }}
      >
        {() => <DemoMatches onOpenChat={(profile) => { setActiveTab('DemoMatches'); setChatProfile(profile); }} />}
      </Tab.Screen>
      <Tab.Screen
        name="DemoProfile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>⚙️</Text>,
        }}
      >
        {() => <DemoProfile onExit={() => navigation.goBack()} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// ── Styles ──

const gridTabStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: spacing.xl,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    ...typography.bodyBold,
    color: colors.textLight,
  },
  activeTabText: {
    color: colors.primary,
  },
});

const segmentStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  activeTab: {
    backgroundColor: colors.white,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  activeTabText: {
    color: colors.primary,
  },
});

const listStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 60 },
  header: { ...typography.h2, color: colors.text, paddingHorizontal: spacing.xl, marginBottom: spacing.xs },
  subtitleRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, marginBottom: spacing.md, gap: spacing.sm },
  demoBadge: { backgroundColor: colors.secondary, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.full },
  demoBadgeText: { ...typography.small, color: colors.white, fontWeight: '600' },
  subtitleText: { ...typography.caption, color: colors.textSecondary, flex: 1 },
  list: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
  userCard: {
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
  userAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.surface },
  userInfo: { flex: 1, marginLeft: spacing.md },
  userName: { ...typography.bodyBold, color: colors.text },
  userDetail: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  chevron: { paddingLeft: spacing.sm },
  chevronText: { fontSize: 24, color: colors.textLight },
});

const detailStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  backText: { fontSize: 32, color: colors.primary, marginTop: -4 },
  headerName: { ...typography.bodyBold, color: colors.text },
  scrollContent: { paddingBottom: spacing.xxl },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  avatar: { width: 86, height: 86, borderRadius: 43, borderWidth: 2, borderColor: colors.primary },
  statsRow: { flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', marginLeft: spacing.lg },
  stat: { alignItems: 'center' },
  statNumber: { ...typography.h3, color: colors.text },
  statLabel: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
  infoSection: { paddingHorizontal: spacing.xl, marginBottom: spacing.sm },
  name: { ...typography.bodyBold, color: colors.text },
  degree: { ...typography.caption, color: colors.primary, marginTop: 2, fontWeight: '600' },
  university: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  city: { ...typography.small, color: colors.textLight, marginTop: 2 },
  bioSection: { paddingHorizontal: spacing.xl, marginBottom: spacing.lg },
  bio: { ...typography.body, color: colors.text, lineHeight: 22 },
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  connectButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  connectButtonText: { ...typography.bodyBold, color: colors.white },
  messageButton: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  messageButtonText: { ...typography.bodyBold, color: colors.text },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: PHOTO_GRID_GAP,
  },
  photoCell: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
  },
  gridPhoto: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  emptyPhoto: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
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

const profileTabStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingTop: 60, paddingBottom: spacing.xxl },
  header: { ...typography.h2, color: colors.text, paddingHorizontal: spacing.xl, marginBottom: spacing.lg },
  photoSection: { alignItems: 'center', marginBottom: spacing.lg },
  mainPhoto: { width: 160, height: 160, borderRadius: 80, borderWidth: 3, borderColor: colors.primary },
  infoCard: { marginHorizontal: spacing.xl, padding: spacing.lg, backgroundColor: colors.white, borderRadius: borderRadius.lg, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2, marginBottom: spacing.lg },
  name: { ...typography.h2, color: colors.text, textAlign: 'center' },
  bio: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm },
  university: { ...typography.caption, color: colors.primary, textAlign: 'center', marginTop: spacing.sm, fontWeight: '600' },
  city: { ...typography.caption, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs },
  exitButton: { marginHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: borderRadius.md, borderWidth: 1.5, borderColor: colors.secondary, alignItems: 'center' },
  exitText: { ...typography.bodyBold, color: colors.secondary },
});
