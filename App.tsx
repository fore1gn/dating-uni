import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Session } from '@supabase/supabase-js';
import { supabase } from './src/lib/supabase';
import { colors } from './src/lib/theme';
import { Profile } from './src/types';

import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import ProfileSetupScreen from './src/screens/ProfileSetupScreen';
import DiscoverScreen from './src/screens/DiscoverScreen';
import MatchesScreen from './src/screens/MatchesScreen';
import ChatScreen from './src/screens/ChatScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import DemoScreen from './src/screens/DemoScreen';

const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
      <AuthStack.Screen name="Demo" component={DemoScreen} />
    </AuthStack.Navigator>
  );
}

function MainTabs({ userId }: { userId: string }) {
  const [chatMatchId, setChatMatchId] = useState<string | null>(null);
  const [chatProfile, setChatProfile] = useState<Profile | null>(null);

  if (chatMatchId && chatProfile) {
    return (
      <ChatScreen
        matchId={chatMatchId}
        userId={userId}
        otherUser={chatProfile}
        onBack={() => {
          setChatMatchId(null);
          setChatProfile(null);
        }}
      />
    );
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
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Discover"
        options={{
          tabBarLabel: 'Discover',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22, color }}>🔥</Text>
          ),
        }}
      >
        {() => <DiscoverScreen userId={userId} />}
      </Tab.Screen>
      <Tab.Screen
        name="Matches"
        options={{
          tabBarLabel: 'Matches',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22, color }}>💬</Text>
          ),
        }}
      >
        {() => (
          <MatchesScreen
            userId={userId}
            onOpenChat={(matchId, profile) => {
              setChatMatchId(matchId);
              setChatProfile(profile);
            }}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Profile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22, color }}>👤</Text>
          ),
        }}
      >
        {() => <ProfileScreen userId={userId} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        checkProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) {
          checkProfile(session.user.id);
        } else {
          setHasProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();
    setHasProfile(!!data);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <StatusBar style="dark" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      {!session ? (
        <AuthNavigator />
      ) : !hasProfile ? (
        <ProfileSetupScreen
          userId={session.user.id}
          onComplete={() => setHasProfile(true)}
        />
      ) : (
        <MainTabs userId={session.user.id} />
      )}
    </NavigationContainer>
  );
}
