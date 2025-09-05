import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../property/presentation/providers/property_provider.dart';
import '../../../home/presentation/widgets/property_card.dart';
import '../../../home/presentation/widgets/search_bar_widget.dart';

class SearchPage extends StatefulWidget {
  const SearchPage({super.key});

  @override
  State<SearchPage> createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> with AutomaticKeepAliveClientMixin {
  final TextEditingController _searchController = TextEditingController();
  final FocusNode _searchFocusNode = FocusNode();
  bool _isSearching = false;

  @override
  bool get wantKeepAlive => true;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _searchFocusNode.requestFocus();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    _searchFocusNode.dispose();
    super.dispose();
  }

  void _performSearch(String query) {
    if (query.trim().isEmpty) return;
    
    setState(() {
      _isSearching = true;
    });
    
    context.read<PropertyProvider>().searchProperties(query).then((_) {
      setState(() {
        _isSearching = false;
      });
    });
  }

  void _clearSearch() {
    _searchController.clear();
    context.read<PropertyProvider>().clearSearch();
    setState(() {
      _isSearching = false;
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
          'Search Properties',
          style: AppTypography.headlineSmall.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1),
          child: Container(
            height: 1,
            color: AppColors.borderColor,
          ),
        ),
      ),
      body: Column(
        children: [
          // Search Bar
          Container(
            color: AppColors.surface,
            padding: const EdgeInsets.all(AppConstants.spacingM),
            child: SearchBarWidget(
              controller: _searchController,
              onChanged: (value) {
                // Optional: Implement real-time search
              },
              onSubmitted: _performSearch,
              hintText: 'Search by location, property type...',
              showFilterButton: true,
            ),
          ),
          
          // Search Results
          Expanded(
            child: Consumer<PropertyProvider>(
              builder: (context, propertyProvider, child) {
                if (_isSearching || propertyProvider.isLoading) {
                  return _buildLoadingState();
                }
                
                if (propertyProvider.searchQuery.isEmpty) {
                  return _buildInitialState();
                }
                
                if (propertyProvider.searchResults.isEmpty) {
                  return _buildEmptyState();
                }
                
                return _buildSearchResults(propertyProvider.searchResults);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLoadingState() {
    return const Center(
      child: CircularProgressIndicator(),
    );
  }

  Widget _buildInitialState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppConstants.spacingXL),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.search_rounded,
              size: 80,
              color: AppColors.textSecondary,
            ),
            const SizedBox(height: AppConstants.spacingL),
            Text(
              'Search for Properties',
              style: AppTypography.headlineSmall.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: AppConstants.spacingS),
            Text(
              'Find your dream home by searching for location, property type, or any keyword',
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

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppConstants.spacingXL),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.search_off_rounded,
              size: 80,
              color: AppColors.textSecondary,
            ),
            const SizedBox(height: AppConstants.spacingL),
            Text(
              'No Properties Found',
              style: AppTypography.headlineSmall.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: AppConstants.spacingS),
            Text(
              'Try adjusting your search criteria or browse all properties',
              style: AppTypography.bodyMedium.copyWith(
                color: AppColors.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: AppConstants.spacingL),
            ElevatedButton(
              onPressed: _clearSearch,
              child: const Text('Clear Search'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSearchResults(List<Property> properties) {
    return Column(
      children: [
        // Results Header
        Container(
          padding: const EdgeInsets.all(AppConstants.spacingM),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '${properties.length} Properties Found',
                style: AppTypography.bodyLarge.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
              TextButton(
                onPressed: _clearSearch,
                child: Text(
                  'Clear',
                  style: AppTypography.bodyMedium.copyWith(
                    color: AppColors.primary,
                  ),
                ),
              ),
            ],
          ),
        ),
        
        // Results List
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.symmetric(
              horizontal: AppConstants.spacingM,
            ),
            itemCount: properties.length,
            itemBuilder: (context, index) {
              final property = properties[index];
              return Padding(
                padding: const EdgeInsets.only(
                  bottom: AppConstants.spacingM,
                ),
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
              );
            },
          ),
        ),
      ],
    );
  }
}