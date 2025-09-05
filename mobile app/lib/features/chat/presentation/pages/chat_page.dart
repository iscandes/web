import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../auth/presentation/providers/auth_provider.dart';

class ChatPage extends StatefulWidget {
  const ChatPage({super.key});

  @override
  State<ChatPage> createState() => _ChatPageState();
}

class _ChatPageState extends State<ChatPage> with AutomaticKeepAliveClientMixin {
  @override
  bool get wantKeepAlive => true;

  final List<ChatConversation> _conversations = [
    ChatConversation(
      id: '1',
      agentName: 'Sarah Johnson',
      agentImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      lastMessage: 'The property viewing is scheduled for tomorrow at 2 PM',
      timestamp: DateTime.now().subtract(const Duration(minutes: 15)),
      unreadCount: 2,
      propertyTitle: 'Modern Villa in Beverly Hills',
      isOnline: true,
    ),
    ChatConversation(
      id: '2',
      agentName: 'Michael Chen',
      agentImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      lastMessage: 'I have some similar properties that might interest you',
      timestamp: DateTime.now().subtract(const Duration(hours: 2)),
      unreadCount: 0,
      propertyTitle: 'Downtown Apartment',
      isOnline: false,
    ),
    ChatConversation(
      id: '3',
      agentName: 'Emma Wilson',
      agentImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      lastMessage: 'Thank you for your interest in this property',
      timestamp: DateTime.now().subtract(const Duration(days: 1)),
      unreadCount: 0,
      propertyTitle: 'Luxury Penthouse',
      isOnline: true,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    super.build(context);
    
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        title: Text(
          'Messages',
          style: AppTypography.headlineSmall.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        actions: [
          IconButton(
            onPressed: () {
              // Search conversations
            },
            icon: const Icon(Icons.search_rounded),
          ),
          PopupMenuButton<String>(
            onSelected: (value) {
              if (value == 'mark_all_read') {
                _markAllAsRead();
              } else if (value == 'archived') {
                _showArchivedChats();
              }
            },
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'mark_all_read',
                child: Row(
                  children: [
                    Icon(Icons.mark_email_read_rounded),
                    SizedBox(width: 8),
                    Text('Mark all as read'),
                  ],
                ),
              ),
              const PopupMenuItem(
                value: 'archived',
                child: Row(
                  children: [
                    Icon(Icons.archive_rounded),
                    SizedBox(width: 8),
                    Text('Archived chats'),
                  ],
                ),
              ),
            ],
          ),
        ],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1),
          child: Container(
            height: 1,
            color: AppColors.borderColor,
          ),
        ),
      ),
      body: Consumer<AuthProvider>(
        builder: (context, authProvider, child) {
          if (!authProvider.isLoggedIn) {
            return _buildLoginPrompt();
          }
          
          if (_conversations.isEmpty) {
            return _buildEmptyState();
          }
          
          return _buildConversationsList();
        },
      ),
      floatingActionButton: Consumer<AuthProvider>(
        builder: (context, authProvider, child) {
          if (!authProvider.isLoggedIn) {
            return const SizedBox.shrink();
          }
          
          return FloatingActionButton(
            onPressed: _startNewConversation,
            backgroundColor: AppColors.primary,
            child: const Icon(
              Icons.add_comment_rounded,
              color: Colors.white,
            ),
          );
        },
      ),
    );
  }

  Widget _buildLoginPrompt() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppConstants.spacingXL),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.chat_bubble_outline_rounded,
              size: 80,
              color: AppColors.textSecondary,
            ),
            const SizedBox(height: AppConstants.spacingL),
            Text(
              'Sign In to Chat',
              style: AppTypography.headlineSmall.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: AppConstants.spacingS),
            Text(
              'Connect with real estate agents and get instant answers to your questions',
              style: AppTypography.bodyMedium.copyWith(
                color: AppColors.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: AppConstants.spacingL),
            ElevatedButton(
              onPressed: () {
                // Navigate to login
              },
              child: const Text('Sign In'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppConstants.spacingXL),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.chat_rounded,
              size: 80,
              color: AppColors.textSecondary,
            ),
            const SizedBox(height: AppConstants.spacingL),
            Text(
              'No Conversations Yet',
              style: AppTypography.headlineSmall.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: AppConstants.spacingS),
            Text(
              'Start chatting with real estate agents to get personalized assistance',
              style: AppTypography.bodyMedium.copyWith(
                color: AppColors.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildConversationsList() {
    return ListView.builder(
      padding: const EdgeInsets.symmetric(
        vertical: AppConstants.spacingS,
      ),
      itemCount: _conversations.length,
      itemBuilder: (context, index) {
        final conversation = _conversations[index];
        return _buildConversationTile(conversation);
      },
    );
  }

  Widget _buildConversationTile(ChatConversation conversation) {
    return Container(
      margin: const EdgeInsets.symmetric(
        horizontal: AppConstants.spacingM,
        vertical: AppConstants.spacingXS,
      ),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppConstants.radiusM),
        border: Border.all(
          color: AppColors.borderColor,
          width: 1,
        ),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.all(AppConstants.spacingM),
        leading: Stack(
          children: [
            CircleAvatar(
              radius: 24,
              backgroundImage: NetworkImage(conversation.agentImage),
            ),
            if (conversation.isOnline)
              Positioned(
                right: 0,
                bottom: 0,
                child: Container(
                  width: 12,
                  height: 12,
                  decoration: BoxDecoration(
                    color: AppColors.success,
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: AppColors.surface,
                      width: 2,
                    ),
                  ),
                ),
              ),
          ],
        ),
        title: Row(
          children: [
            Expanded(
              child: Text(
                conversation.agentName,
                style: AppTypography.bodyLarge.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
            Text(
              _formatTimestamp(conversation.timestamp),
              style: AppTypography.bodySmall.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
          ],
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: AppConstants.spacingXS),
            Text(
              conversation.propertyTitle,
              style: AppTypography.bodySmall.copyWith(
                color: AppColors.primary,
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: AppConstants.spacingXS),
            Row(
              children: [
                Expanded(
                  child: Text(
                    conversation.lastMessage,
                    style: AppTypography.bodyMedium.copyWith(
                      color: conversation.unreadCount > 0
                          ? AppColors.textPrimary
                          : AppColors.textSecondary,
                      fontWeight: conversation.unreadCount > 0
                          ? FontWeight.w500
                          : FontWeight.normal,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                if (conversation.unreadCount > 0)
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.primary,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      conversation.unreadCount.toString(),
                      style: AppTypography.bodySmall.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
              ],
            ),
          ],
        ),
        onTap: () {
          _openConversation(conversation);
        },
      ),
    );
  }

  String _formatTimestamp(DateTime timestamp) {
    final now = DateTime.now();
    final difference = now.difference(timestamp);
    
    if (difference.inMinutes < 60) {
      return '${difference.inMinutes}m';
    } else if (difference.inHours < 24) {
      return '${difference.inHours}h';
    } else if (difference.inDays < 7) {
      return '${difference.inDays}d';
    } else {
      return '${timestamp.day}/${timestamp.month}';
    }
  }

  void _openConversation(ChatConversation conversation) {
    // Navigate to individual chat screen
    // Navigator.push(context, MaterialPageRoute(builder: (context) => ChatDetailPage(conversation: conversation)));
  }

  void _startNewConversation() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) => Container(
        padding: const EdgeInsets.all(AppConstants.spacingL),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Start New Conversation',
              style: AppTypography.headlineSmall.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: AppConstants.spacingL),
            ListTile(
              leading: const Icon(Icons.support_agent_rounded),
              title: const Text('General Inquiry'),
              subtitle: const Text('Ask questions about properties or services'),
              onTap: () {
                Navigator.pop(context);
                // Start general inquiry chat
              },
            ),
            ListTile(
              leading: const Icon(Icons.home_rounded),
              title: const Text('Property Inquiry'),
              subtitle: const Text('Ask about a specific property'),
              onTap: () {
                Navigator.pop(context);
                // Start property inquiry chat
              },
            ),
            ListTile(
              leading: const Icon(Icons.schedule_rounded),
              title: const Text('Schedule Viewing'),
              subtitle: const Text('Book a property viewing appointment'),
              onTap: () {
                Navigator.pop(context);
                // Start viewing scheduling chat
              },
            ),
          ],
        ),
      ),
    );
  }

  void _markAllAsRead() {
    setState(() {
      for (var conversation in _conversations) {
        conversation.unreadCount = 0;
      }
    });
  }

  void _showArchivedChats() {
    // Navigate to archived chats
  }
}

class ChatConversation {
  final String id;
  final String agentName;
  final String agentImage;
  final String lastMessage;
  final DateTime timestamp;
  int unreadCount;
  final String propertyTitle;
  final bool isOnline;

  ChatConversation({
    required this.id,
    required this.agentName,
    required this.agentImage,
    required this.lastMessage,
    required this.timestamp,
    required this.unreadCount,
    required this.propertyTitle,
    required this.isOnline,
  });
}