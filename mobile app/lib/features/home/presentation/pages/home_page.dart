import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:shimmer/shimmer.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../property/presentation/providers/property_provider.dart';
import '../../../auth/presentation/providers/auth_provider.dart';
import '../widgets/property_card.dart';
import '../widgets/search_bar_widget.dart';
import '../widgets/category_chips.dart';
import '../widgets/featured_properties_section.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> with AutomaticKeepAliveClientMixin {
  final ScrollController _scrollController = ScrollController();
  bool _showSearchBar = true;
  double _scrollOffset = 0;

  @override
  bool get wantKeepAlive => true;

  @override
  void initState() {
    super.initState();
    _initializeData();
    _setupScrollListener();
  }

  void _initializeData() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final propertyProvider = context.read<PropertyProvider>();
      if (propertyProvider.properties.isEmpty) {
        propertyProvider.initializeProperties();
      }
    });
  }

  void _setupScrollListener() {
    _scrollController.addListener(() {
      final offset = _scrollController.offset;
      setState(() {
        _scrollOffset = offset;
        _showSearchBar = offset < 100;
      });
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    
    return Scaffold(
      backgroundColor: AppColors.background,
      body: RefreshIndicator(
        onRefresh: () async {
          await context.read<PropertyProvider>().loadProperties(refresh: true);
        },
        color: AppColors.primary,
        child: CustomScrollView(
          controller: _scrollController,
          slivers: [
            _buildAppBar(),
            _buildSearchSection(),
            _buildCategoriesSection(),
            _buildFeaturedSection(),
            _buildRecentPropertiesSection(),
          ],
        ),
      ),
    );
  }

  Widget _buildAppBar() {
    return Consumer<AuthProvider>(
      builder: (context, authProvider, child) {
        return SliverAppBar(
          expandedHeight: 120,
          floating: false,
          pinned: true,
          backgroundColor: AppColors.primary,
          flexibleSpace: FlexibleSpaceBar(
            background: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    AppColors.primary,
                    AppColors.primary.withOpacity(0.8),
                  ],
                ),
              ),
              child: SafeArea(
                child: Padding(
                  padding: const EdgeInsets.all(AppConstants.spacing16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Good ${_getGreeting()}!',
                                  style: AppTypography.bodyMedium.copyWith(
                                    color: AppColors.surface.withOpacity(0.8),
                                  ),
                                ),
                                const SizedBox(height: AppConstants.spacing4),
                                Text(
                                  authProvider.user?['name'] ?? 'Welcome',
                                  style: AppTypography.headlineSmall.copyWith(
                                    color: AppColors.surface,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Container(
                            width: 48,
                            height: 48,
                            decoration: BoxDecoration(
                              color: AppColors.surface,
                              borderRadius: BorderRadius.circular(AppConstants.radiusLarge),
                              boxShadow: [
                                BoxShadow(
                                  color: AppColors.shadowLight,
                                  blurRadius: 8,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                            ),
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(AppConstants.radiusLarge),
                              child: authProvider.user?['profileImage'] != null
                                  ? CachedNetworkImage(
                                      imageUrl: authProvider.user!['profileImage']!,
                                      fit: BoxFit.cover,
                                      placeholder: (context, url) => Container(
                                        color: AppColors.surfaceVariant,
                                        child: Icon(
                                          Icons.person,
                                          color: AppColors.primary,
                                        ),
                                      ),
                                      errorWidget: (context, url, error) => Container(
                                        color: AppColors.surfaceVariant,
                                        child: Icon(
                                          Icons.person,
                                          color: AppColors.primary,
                                        ),
                                      ),
                                    )
                                  : Container(
                                      color: AppColors.surfaceVariant,
                                      child: Icon(
                                        Icons.person,
                                        color: AppColors.primary,
                                      ),
                                    ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildSearchSection() {
    return SliverToBoxAdapter(
      child: AnimatedContainer(
        duration: AppConstants.animationMedium,
        height: _showSearchBar ? 80 : 0,
        child: AnimatedOpacity(
          duration: AppConstants.animationMedium,
          opacity: _showSearchBar ? 1.0 : 0.0,
          child: const Padding(
            padding: EdgeInsets.all(AppConstants.spacing16),
            child: SearchBarWidget(),
          ),
        ),
      ),
    );
  }

  Widget _buildCategoriesSection() {
    return const SliverToBoxAdapter(
      child: Padding(
        padding: EdgeInsets.symmetric(horizontal: AppConstants.spacing16),
        child: CategoryChips(),
      ),
    );
  }

  Widget _buildFeaturedSection() {
    return Consumer<PropertyProvider>(
      builder: (context, propertyProvider, child) {
        if (propertyProvider.isLoading && propertyProvider.featuredProperties.isEmpty) {
          return SliverToBoxAdapter(
            child: _buildFeaturedShimmer(),
          );
        }

        if (propertyProvider.featuredProperties.isEmpty) {
          return const SliverToBoxAdapter(child: SizedBox.shrink());
        }

        return SliverToBoxAdapter(
          child: FeaturedPropertiesSection(
            properties: propertyProvider.featuredProperties,
          ),
        );
      },
    );
  }

  Widget _buildRecentPropertiesSection() {
    return Consumer<PropertyProvider>(
      builder: (context, propertyProvider, child) {
        return SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.all(AppConstants.spacing16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Recent Properties',
                      style: AppTypography.headlineSmall.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    TextButton(
                      onPressed: () {
                        // Navigate to all properties
                      },
                      child: Text(
                        'See All',
                        style: AppTypography.bodyMedium.copyWith(
                          color: AppColors.primary,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppConstants.spacing16),
                if (propertyProvider.isLoading && propertyProvider.properties.isEmpty)
                  _buildPropertiesShimmer()
                else if (propertyProvider.properties.isEmpty)
                  _buildEmptyState()
                else
                  _buildPropertiesList(propertyProvider.properties.take(5).toList()),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildFeaturedShimmer() {
    return Padding(
      padding: const EdgeInsets.all(AppConstants.spacing16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Shimmer.fromColors(
            baseColor: AppColors.surfaceVariant,
            highlightColor: AppColors.surface,
            child: Container(
              width: 150,
              height: 24,
              decoration: BoxDecoration(
                color: AppColors.surfaceVariant,
                borderRadius: BorderRadius.circular(AppConstants.radiusSmall),
              ),
            ),
          ),
          const SizedBox(height: AppConstants.spacing16),
          SizedBox(
            height: 200,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: 3,
              itemBuilder: (context, index) {
                return Padding(
                  padding: EdgeInsets.only(
                    right: index < 2 ? AppConstants.spacing16 : 0,
                  ),
                  child: Shimmer.fromColors(
                    baseColor: AppColors.surfaceVariant,
                    highlightColor: AppColors.surface,
                    child: Container(
                      width: 280,
                      decoration: BoxDecoration(
                        color: AppColors.surfaceVariant,
                        borderRadius: BorderRadius.circular(AppConstants.radiusLarge),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPropertiesShimmer() {
    return Column(
      children: List.generate(3, (index) {
        return Padding(
          padding: const EdgeInsets.only(bottom: AppConstants.spacing16),
          child: Shimmer.fromColors(
            baseColor: AppColors.surfaceVariant,
            highlightColor: AppColors.surface,
            child: Container(
              height: 120,
              decoration: BoxDecoration(
                color: AppColors.surfaceVariant,
                borderRadius: BorderRadius.circular(AppConstants.radiusLarge),
              ),
            ),
          ),
        );
      }),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppConstants.spacing64),
        child: Column(
          children: [
            Icon(
              Icons.home_work_outlined,
              size: 64,
              color: AppColors.textSecondary,
            ),
            const SizedBox(height: AppConstants.spacing16),
            Text(
              AppStrings.emptyPropertiesTitle,
              style: AppTypography.headlineSmall.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: AppConstants.spacing8),
            Text(
              AppStrings.emptyPropertiesMessage,
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

  Widget _buildPropertiesList(List<Property> properties) {
    return Column(
      children: properties.map((property) {
        return Padding(
          padding: const EdgeInsets.only(bottom: AppConstants.spacing16),
          child: PropertyCard(
            property: property,
            onTap: () {
              // Navigate to property details
            },
            onFavoriteToggle: () {
              context.read<PropertyProvider>().toggleFavorite(property.id);
            },
          ),
        );
      }).toList(),
    );
  }

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) {
      return 'Morning';
    } else if (hour < 17) {
      return 'Afternoon';
    } else {
      return 'Evening';
    }
  }
}


