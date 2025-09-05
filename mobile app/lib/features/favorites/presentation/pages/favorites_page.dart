import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../property/presentation/providers/property_provider.dart';
import '../../../home/presentation/widgets/property_card.dart';

class FavoritesPage extends StatefulWidget {
  const FavoritesPage({super.key});

  @override
  State<FavoritesPage> createState() => _FavoritesPageState();
}

class _FavoritesPageState extends State<FavoritesPage> with AutomaticKeepAliveClientMixin {
  @override
  bool get wantKeepAlive => true;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<PropertyProvider>().loadFavoriteProperties();
    });
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        title: Text(
          'My Favorites',
          style: AppTypography.headlineSmall.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        actions: [
          Consumer<PropertyProvider>(
            builder: (context, propertyProvider, child) {
              if (propertyProvider.favoriteProperties.isEmpty) {
                return const SizedBox.shrink();
              }
              
              return PopupMenuButton<String>(
                onSelected: (value) {
                  if (value == 'clear_all') {
                    _showClearAllDialog();
                  } else if (value == 'sort') {
                    _showSortOptions();
                  }
                },
                itemBuilder: (context) => [
                  const PopupMenuItem(
                    value: 'sort',
                    child: Row(
                      children: [
                        Icon(Icons.sort_rounded),
                        SizedBox(width: 8),
                        Text('Sort'),
                      ],
                    ),
                  ),
                  const PopupMenuItem(
                    value: 'clear_all',
                    child: Row(
                      children: [
                        Icon(Icons.clear_all_rounded, color: Colors.red),
                        SizedBox(width: 8),
                        Text('Clear All', style: TextStyle(color: Colors.red)),
                      ],
                    ),
                  ),
                ],
              );
            },
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
      body: Consumer<PropertyProvider>(
        builder: (context, propertyProvider, child) {
          if (propertyProvider.isLoading) {
            return _buildLoadingState();
          }
          
          if (propertyProvider.favoriteProperties.isEmpty) {
            return _buildEmptyState();
          }
          
          return _buildFavoritesList(propertyProvider.favoriteProperties);
        },
      ),
    );
  }

  Widget _buildLoadingState() {
    return const Center(
      child: CircularProgressIndicator(),
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
              Icons.favorite_border_rounded,
              size: 80,
              color: AppColors.textSecondary,
            ),
            const SizedBox(height: AppConstants.spacingL),
            Text(
              'No Favorites Yet',
              style: AppTypography.headlineSmall.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: AppConstants.spacingS),
            Text(
              'Start exploring properties and save your favorites here for easy access',
              style: AppTypography.bodyMedium.copyWith(
                color: AppColors.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: AppConstants.spacingL),
            ElevatedButton(
              onPressed: () {
                // Navigate to home or search
                DefaultTabController.of(context)?.animateTo(0);
              },
              child: const Text('Explore Properties'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFavoritesList(List<Property> favorites) {
    return Column(
      children: [
        // Favorites Count
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(AppConstants.spacingM),
          child: Text(
            '${favorites.length} Saved Properties',
            style: AppTypography.bodyLarge.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
        
        // Favorites List
        Expanded(
          child: RefreshIndicator(
            onRefresh: () async {
              await context.read<PropertyProvider>().loadFavoriteProperties();
            },
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(
                horizontal: AppConstants.spacingM,
              ),
              itemCount: favorites.length,
              itemBuilder: (context, index) {
                final property = favorites[index];
                return Padding(
                  padding: const EdgeInsets.only(
                    bottom: AppConstants.spacingM,
                  ),
                  child: Dismissible(
                    key: Key('favorite_${property.id}'),
                    direction: DismissDirection.endToStart,
                    background: Container(
                      alignment: Alignment.centerRight,
                      padding: const EdgeInsets.only(right: AppConstants.spacingL),
                      decoration: BoxDecoration(
                        color: AppColors.error,
                        borderRadius: BorderRadius.circular(AppConstants.radiusM),
                      ),
                      child: const Icon(
                        Icons.delete_rounded,
                        color: Colors.white,
                        size: 24,
                      ),
                    ),
                    confirmDismiss: (direction) async {
                      return await _showRemoveDialog(property.title);
                    },
                    onDismissed: (direction) {
                      context.read<PropertyProvider>().toggleFavorite(property.id);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('${property.title} removed from favorites'),
                          action: SnackBarAction(
                            label: 'Undo',
                            onPressed: () {
                              context.read<PropertyProvider>().toggleFavorite(property.id);
                            },
                          ),
                        ),
                      );
                    },
                    child: PropertyCard(
                      property: property,
                      isHorizontal: true,
                      onTap: () {
                        // Navigate to property details
                      },
                      onFavoriteToggle: () {
                        context.read<PropertyProvider>().toggleFavorite(property.id);
                      },
                    ),
                  ),
                );
              },
            ),
          ),
        ),
      ],
    );
  }

  Future<bool?> _showRemoveDialog(String propertyTitle) {
    return showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Remove from Favorites'),
        content: Text('Remove "$propertyTitle" from your favorites?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.of(context).pop(true),
            style: TextButton.styleFrom(
              foregroundColor: AppColors.error,
            ),
            child: const Text('Remove'),
          ),
        ],
      ),
    );
  }

  void _showClearAllDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Clear All Favorites'),
        content: const Text('Are you sure you want to remove all properties from your favorites?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              context.read<PropertyProvider>().clearAllFavorites();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('All favorites cleared'),
                ),
              );
            },
            style: TextButton.styleFrom(
              foregroundColor: AppColors.error,
            ),
            child: const Text('Clear All'),
          ),
        ],
      ),
    );
  }

  void _showSortOptions() {
    showModalBottomSheet(
      context: context,
      builder: (context) => Container(
        padding: const EdgeInsets.all(AppConstants.spacingL),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Sort Favorites',
              style: AppTypography.headlineSmall.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: AppConstants.spacingL),
            ListTile(
              leading: const Icon(Icons.access_time_rounded),
              title: const Text('Recently Added'),
              onTap: () {
                Navigator.pop(context);
                // Implement sort by recently added
              },
            ),
            ListTile(
              leading: const Icon(Icons.attach_money_rounded),
              title: const Text('Price: Low to High'),
              onTap: () {
                Navigator.pop(context);
                // Implement sort by price ascending
              },
            ),
            ListTile(
              leading: const Icon(Icons.money_off_rounded),
              title: const Text('Price: High to Low'),
              onTap: () {
                Navigator.pop(context);
                // Implement sort by price descending
              },
            ),
            ListTile(
              leading: const Icon(Icons.location_on_rounded),
              title: const Text('Location'),
              onTap: () {
                Navigator.pop(context);
                // Implement sort by location
              },
            ),
          ],
        ),
      ),
    );
  }
}