import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../auth/presentation/providers/auth_provider.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> with AutomaticKeepAliveClientMixin {
  @override
  bool get wantKeepAlive => true;

  @override
  Widget build(BuildContext context) {
    super.build(context);
    
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Consumer<AuthProvider>(
        builder: (context, authProvider, child) {
          if (!authProvider.isLoggedIn) {
            return _buildGuestProfile();
          }
          
          return _buildUserProfile(authProvider);
        },
      ),
    );
  }

  Widget _buildGuestProfile() {
    return CustomScrollView(
      slivers: [
        SliverAppBar(
          backgroundColor: AppColors.primary,
          expandedHeight: 200,
          pinned: true,
          flexibleSpace: FlexibleSpaceBar(
            background: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    AppColors.primary,
                    AppColors.primary.withOpacity(0.8),
                  ],
                ),
              ),
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const SizedBox(height: 40),
                    CircleAvatar(
                      radius: 40,
                      backgroundColor: Colors.white.withOpacity(0.2),
                      child: const Icon(
                        Icons.person_rounded,
                        size: 40,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: AppConstants.spacing16),
                    Text(
                      'Welcome to Profinder',
                      style: AppTypography.headlineSmall.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: AppConstants.spacing8),
                    Text(
                      'Sign in to access all features',
                      style: AppTypography.bodyMedium.copyWith(
                        color: Colors.white.withOpacity(0.9),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.all(AppConstants.spacing24),
            child: Column(
              children: [
                // Sign In Button
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      // Navigate to login
                    },
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(
                        vertical: AppConstants.spacing16,
                      ),
                    ),
                    child: const Text('Sign In'),
                  ),
                ),
                const SizedBox(height: AppConstants.spacing16),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton(
                    onPressed: () {
                      // Navigate to register
                    },
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(
                        vertical: AppConstants.spacing16,
                      ),
                    ),
                    child: const Text('Create Account'),
                  ),
                ),
                const SizedBox(height: AppConstants.spacing64),
                
                // Guest Features
                _buildSettingsSection('App Settings', [
                  _buildSettingsTile(
                    icon: Icons.language_rounded,
                    title: 'Language',
                    subtitle: 'English',
                    onTap: () => _showLanguageSelector(),
                  ),
                  _buildSettingsTile(
                    icon: Icons.dark_mode_rounded,
                    title: 'Dark Mode',
                    subtitle: 'System default',
                    onTap: () => _showThemeSelector(),
                  ),
                  _buildSettingsTile(
                    icon: Icons.notifications_rounded,
                    title: 'Notifications',
                    subtitle: 'Manage notification preferences',
                    onTap: () => _showNotificationSettings(),
                  ),
                ]),
                
                _buildSettingsSection('Support', [
                  _buildSettingsTile(
                    icon: Icons.help_rounded,
                    title: 'Help Center',
                    subtitle: 'Get help and support',
                    onTap: () => _openHelpCenter(),
                  ),
                  _buildSettingsTile(
                    icon: Icons.feedback_rounded,
                    title: 'Send Feedback',
                    subtitle: 'Help us improve the app',
                    onTap: () => _sendFeedback(),
                  ),
                  _buildSettingsTile(
                    icon: Icons.info_rounded,
                    title: 'About',
                    subtitle: 'App version and information',
                    onTap: () => _showAboutDialog(),
                  ),
                ]),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildUserProfile(AuthProvider authProvider) {
    return CustomScrollView(
      slivers: [
        SliverAppBar(
          backgroundColor: AppColors.primary,
          expandedHeight: 200,
          pinned: true,
          actions: [
            IconButton(
              onPressed: () {
                // Edit profile
              },
              icon: const Icon(
                Icons.edit_rounded,
                color: Colors.white,
              ),
            ),
          ],
          flexibleSpace: FlexibleSpaceBar(
            background: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    AppColors.primary,
                    AppColors.primary.withOpacity(0.8),
                  ],
                ),
              ),
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const SizedBox(height: 40),
                    CircleAvatar(
                      radius: 40,
                      backgroundImage: authProvider.user?['profileImage'] != null
                            ? NetworkImage(authProvider.user!['profileImage']!)
                          : null,
                      backgroundColor: Colors.white.withOpacity(0.2),
                      child: authProvider.user?['profileImage'] == null
                          ? Text(
                              authProvider.user?['name']?.substring(0, 1).toUpperCase() ?? 'U',
                              style: AppTypography.headlineMedium.copyWith(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                              ),
                            )
                          : null,
                    ),
                    const SizedBox(height: AppConstants.spacing16),
                    Text(
                      authProvider.user?['name'] ?? 'User',
                      style: AppTypography.headlineSmall.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: AppConstants.spacing4),
                    Text(
                      authProvider.user?['email'] ?? '',
                      style: AppTypography.bodyMedium.copyWith(
                        color: Colors.white.withOpacity(0.9),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.all(AppConstants.spacing24),
            child: Column(
              children: [
                // Quick Stats
                Row(
                  children: [
                    Expanded(
                      child: _buildStatCard(
                        icon: Icons.favorite_rounded,
                        title: 'Favorites',
                        value: '12',
                        color: AppColors.error,
                      ),
                    ),
                    const SizedBox(width: AppConstants.spacing16),
                    Expanded(
                      child: _buildStatCard(
                        icon: Icons.visibility_rounded,
                        title: 'Viewed',
                        value: '45',
                        color: AppColors.primary,
                      ),
                    ),
                    const SizedBox(width: AppConstants.spacing16),
                    Expanded(
                      child: _buildStatCard(
                        icon: Icons.schedule_rounded,
                        title: 'Scheduled',
                        value: '3',
                        color: AppColors.success,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppConstants.spacing64),
                
                // Account Settings
                _buildSettingsSection('Account', [
                  _buildSettingsTile(
                    icon: Icons.person_rounded,
                    title: 'Personal Information',
                    subtitle: 'Update your profile details',
                    onTap: () => _editPersonalInfo(),
                  ),
                  _buildSettingsTile(
                    icon: Icons.security_rounded,
                    title: 'Security',
                    subtitle: 'Password and security settings',
                    onTap: () => _openSecuritySettings(),
                  ),
                  _buildSettingsTile(
                    icon: Icons.payment_rounded,
                    title: 'Payment Methods',
                    subtitle: 'Manage your payment options',
                    onTap: () => _managePaymentMethods(),
                  ),
                ]),
                
                // Preferences
                _buildSettingsSection('Preferences', [
                  _buildSettingsTile(
                    icon: Icons.notifications_rounded,
                    title: 'Notifications',
                    subtitle: 'Manage notification preferences',
                    onTap: () => _showNotificationSettings(),
                  ),
                  _buildSettingsTile(
                    icon: Icons.location_on_rounded,
                    title: 'Location Preferences',
                    subtitle: 'Set your preferred search areas',
                    onTap: () => _setLocationPreferences(),
                  ),
                  _buildSettingsTile(
                    icon: Icons.language_rounded,
                    title: 'Language',
                    subtitle: 'English',
                    onTap: () => _showLanguageSelector(),
                  ),
                  _buildSettingsTile(
                    icon: Icons.dark_mode_rounded,
                    title: 'Theme',
                    subtitle: 'Light mode',
                    onTap: () => _showThemeSelector(),
                  ),
                ]),
                
                // Support
                _buildSettingsSection('Support', [
                  _buildSettingsTile(
                    icon: Icons.help_rounded,
                    title: 'Help Center',
                    subtitle: 'Get help and support',
                    onTap: () => _openHelpCenter(),
                  ),
                  _buildSettingsTile(
                    icon: Icons.feedback_rounded,
                    title: 'Send Feedback',
                    subtitle: 'Help us improve the app',
                    onTap: () => _sendFeedback(),
                  ),
                  _buildSettingsTile(
                    icon: Icons.info_rounded,
                    title: 'About',
                    subtitle: 'App version and information',
                    onTap: () => _showAboutDialog(),
                  ),
                ]),
                
                const SizedBox(height: AppConstants.spacing64),
                
                // Sign Out Button
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton(
                    onPressed: () => _showSignOutDialog(),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.error,
                      side: BorderSide(color: AppColors.error),
                      padding: const EdgeInsets.symmetric(
                        vertical: AppConstants.spacing16,
                      ),
                    ),
                    child: const Text('Sign Out'),
                  ),
                ),
                
                const SizedBox(height: AppConstants.spacing64),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildStatCard({
    required IconData icon,
    required String title,
    required String value,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(AppConstants.spacing16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppConstants.radiusM),
        border: Border.all(
          color: AppColors.borderColor,
          width: 1,
        ),
      ),
      child: Column(
        children: [
          Icon(
            icon,
            color: color,
            size: 24,
          ),
          const SizedBox(height: AppConstants.spacing8),
          Text(
            value,
            style: AppTypography.headlineSmall.copyWith(
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
          const SizedBox(height: AppConstants.spacing4),
          Text(
            title,
            style: AppTypography.bodySmall.copyWith(
              color: AppColors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSettingsSection(String title, List<Widget> children) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: AppConstants.spacing8,
            vertical: AppConstants.spacing16,
          ),
          child: Text(
            title,
            style: AppTypography.titleMedium.copyWith(
              fontWeight: FontWeight.bold,
              color: AppColors.textSecondary,
            ),
          ),
        ),
        Container(
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(AppConstants.radiusM),
            border: Border.all(
              color: AppColors.borderColor,
              width: 1,
            ),
          ),
          child: Column(
            children: children,
          ),
        ),
        const SizedBox(height: AppConstants.spacing24),
      ],
    );
  }

  Widget _buildSettingsTile({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
    Widget? trailing,
  }) {
    return ListTile(
      leading: Icon(
        icon,
        color: AppColors.textSecondary,
      ),
      title: Text(
        title,
        style: AppTypography.bodyLarge.copyWith(
          fontWeight: FontWeight.w500,
        ),
      ),
      subtitle: Text(
        subtitle,
        style: AppTypography.bodyMedium.copyWith(
          color: AppColors.textSecondary,
        ),
      ),
      trailing: trailing ?? const Icon(
        Icons.chevron_right_rounded,
        color: AppColors.textSecondary,
      ),
      onTap: onTap,
    );
  }

  // Action Methods
  void _editPersonalInfo() {
    // Navigate to edit profile page
  }

  void _openSecuritySettings() {
    // Navigate to security settings
  }

  void _managePaymentMethods() {
    // Navigate to payment methods
  }

  void _showNotificationSettings() {
    // Show notification settings
  }

  void _setLocationPreferences() {
    // Navigate to location preferences
  }

  void _showLanguageSelector() {
    // Show language selector
  }

  void _showThemeSelector() {
    // Show theme selector
  }

  void _openHelpCenter() {
    // Navigate to help center
  }

  void _sendFeedback() {
    // Open feedback form
  }

  void _showAboutDialog() {
    showAboutDialog(
      context: context,
      applicationName: 'Profinder',
      applicationVersion: '1.0.0',
      applicationLegalese: '© 2024 Profinder. All rights reserved.',
      children: [
        const SizedBox(height: 16),
        const Text('Your trusted real estate companion.'),
      ],
    );
  }

  void _showSignOutDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Sign Out'),
        content: const Text('Are you sure you want to sign out?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              context.read<AuthProvider>().signOut();
            },
            style: TextButton.styleFrom(
              foregroundColor: AppColors.error,
            ),
            child: const Text('Sign Out'),
          ),
        ],
      ),
    );
  }
}