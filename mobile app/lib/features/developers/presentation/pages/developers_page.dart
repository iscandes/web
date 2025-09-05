import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/constants/app_constants.dart';
import 'package:provider/provider.dart';
import '../../../../core/models/web_models.dart';
import '../providers/developers_provider.dart';

class DevelopersPage extends StatefulWidget {
  const DevelopersPage({super.key});

  @override
  State<DevelopersPage> createState() => _DevelopersPageState();
}

class _DevelopersPageState extends State<DevelopersPage> {
  @override
  void initState() {
    super.initState();
    // Fetch developers when page loads
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<DevelopersProvider>().fetchDevelopers();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text('Developers', style: AppTypography.titleLarge),
        backgroundColor: AppColors.surface,
        elevation: 0,
      ),
      body: Consumer<DevelopersProvider>(
        builder: (context, provider, child) {
          if (provider.isLoading) {
            return const Center(
              child: CircularProgressIndicator(),
            );
          }

          if (provider.error != null) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.error_outline,
                    size: 64,
                    color: Colors.red[300],
                  ),
                  const SizedBox(height: AppConstants.spacing16),
                  Text(
                    'Error loading developers',
                    style: AppTypography.titleMedium,
                  ),
                  const SizedBox(height: AppConstants.spacing8),
                  Text(
                    provider.error!,
                    style: AppTypography.bodyMedium,
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: AppConstants.spacing16),
                  ElevatedButton(
                    onPressed: () => provider.fetchDevelopers(),
                    child: const Text('Retry'),
                  ),
                ],
              ),
            );
          }

          if (provider.developers.isEmpty) {
            return const Center(
              child: Text('No developers found'),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(AppConstants.spacing16),
            itemCount: provider.developers.length,
            itemBuilder: (context, index) {
              final developer = provider.developers[index];
              return _DeveloperTile(developer: developer);
            },
          );
        },
      ),
    );
  }
}

class _DeveloperTile extends StatelessWidget {
  final DeveloperModel developer;

  const _DeveloperTile({required this.developer});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: AppConstants.spacing12),
      child: Padding(
        padding: const EdgeInsets.all(AppConstants.spacing16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              developer.name,
              style: AppTypography.titleMedium,
            ),
            const SizedBox(height: AppConstants.spacing8),
            Text(
              developer.description,
              style: AppTypography.bodyMedium,
            ),
            const SizedBox(height: AppConstants.spacing8),
            Text(
              'Slug: ${developer.slug}',
              style: AppTypography.bodySmall.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}