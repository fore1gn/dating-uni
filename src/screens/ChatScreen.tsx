import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../lib/theme';
import { supabase } from '../lib/supabase';
import { Message, Profile } from '../types';

type Props = {
  matchId: string;
  userId: string;
  otherUser: Profile;
  onBack: () => void;
};

export default function ChatScreen({ matchId, userId, otherUser, onBack }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`messages:${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => [...prev, newMsg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId]);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('match_id', matchId)
      .order('created_at', { ascending: true });

    setMessages(data || []);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    setInput('');
    await supabase.from('messages').insert({
      match_id: matchId,
      sender_id: userId,
      content: text,
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwn = item.sender_id === userId;
    return (
      <View style={[styles.messageBubble, isOwn ? styles.ownBubble : styles.otherBubble]}>
        <Text style={[styles.messageText, isOwn ? styles.ownText : styles.otherText]}>
          {item.content}
        </Text>
        <Text style={[styles.messageTime, isOwn ? styles.ownTime : styles.otherTime]}>
          {formatTime(item.created_at)}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerName}>{otherUser.name}</Text>
        <View style={styles.backButton} />
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: false })
        }
        ListEmptyComponent={
          <View style={styles.emptyChat}>
            <Text style={styles.emptyChatText}>
              Say hi to {otherUser.name}! 👋
            </Text>
          </View>
        }
      />

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={colors.textLight}
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!input.trim()}
        >
          <Text style={styles.sendText}>↑</Text>
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 32,
    color: colors.primary,
    marginTop: -4,
  },
  headerName: {
    ...typography.bodyBold,
    color: colors.text,
  },
  messagesList: {
    padding: spacing.md,
    flexGrow: 1,
  },
  messageBubble: {
    maxWidth: '78%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  ownBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    ...typography.body,
  },
  ownText: {
    color: colors.white,
  },
  otherText: {
    color: colors.text,
  },
  messageTime: {
    ...typography.small,
    marginTop: 4,
  },
  ownTime: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'right',
  },
  otherTime: {
    color: colors.textLight,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.sm,
    paddingBottom: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.body,
    color: colors.text,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.textLight,
  },
  sendText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
  },
  emptyChat: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyChatText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
