import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../property/presentation/providers/property_provider.dart';

class FeaturedPropertiesSection extends StatelessWidget {
  final List<Property> properties;
  final Function(Property)? onPropertyTap;
  final Function(Property)? onFavoriteToggle;

  const FeaturedPropertiesSection({
    super.key,
    required this.properties,
    this.onPropertyTap,
    this.onFavoriteToggle,
  });

  @override
  Widget build(BuildContext context) {
    if (properties.isEmpty) {
      return const SizedBox.shrink();
    }

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppConstants.spacing16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppConstants.spacing16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Featured Properties',
                  style: AppTypography.headlineSmall.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                TextButton(
                  onPressed: () {
                    // Navigate to featured properties page
                  },
                  child: Text(
                    'See All',
                    style: AppTypography.bodyMedium.copyWith(
                      color: AppColors.greenOcean,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppConstants.spacing16),
          SizedBox(
            height: 300,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: AppConstants.spacing16),
              itemCount: properties.length,
              itemBuilder: (context, index) {
                final property = properties[index];
                return Padding(
                  padding: EdgeInsets.only(
                    right: index < properties.length - 1 ? AppConstants.spacing16 : 0,
                  ),
                  child: FeaturedPropertyCard(
                    property: property,
                    onTap: () => onPropertyTap?.call(property),
                    onFavoriteToggle: () => onFavoriteToggle?.call(property),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class FeaturedPropertyCard extends StatelessWidget {
  final Property property;
  final VoidCallback? onTap;
  final VoidCallback? onFavoriteToggle;

  const FeaturedPropertyCard({
    super.key,
    required this.property,
    this.onTap,
    this.onFavoriteToggle,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 280,
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(AppConstants.radiusLarge),
          boxShadow: [
            BoxShadow(
              color: AppColors.shadowLight,
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildImageSection(),
            _buildContentSection(),
          ],
        ),
      ),
    );
  }

  Widget _buildImageSection() {
    return Stack(
      children: [
        ClipRRect(
          borderRadius: const BorderRadius.only(
            topLeft: Radius.circular(AppConstants.radiusLarge),
            topRight: Radius.circular(AppConstants.radiusLarge),
          ),
          child: Container(
            height: 180,
            width: double.infinity,
            child: CachedNetworkImage(
              imageUrl: property.images.isNotEmpty 
                  ? property.images.first 
                  : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
              fit: BoxFit.cover,
              placeholder: (context, url) => Container(
                color: AppColors.surfaceVariant,
                child: Center(
                  child: Icon(
                    Icons.home_work_outlined,
                    size: 40,
                    color: AppColors.textSecondary,
                  ),
                ),
              ),
              errorWidget: (context, url, error) => Container(
                color: AppColors.surfaceVariant,
                child: Center(
                  child: Icon(
                    Icons.home_work_outlined,
                    size: 40,
                    color: AppColors.textSecondary,
                  ),
                ),
              ),
            ),
          ),
        ),
        
        // Gradient overlay
        Positioned.fill(
          child: Container(
            decoration: BoxDecoration(
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(AppConstants.radiusLarge),
                topRight: Radius.circular(AppConstants.radiusLarge),
              ),
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Colors.transparent,
                  Colors.black.withOpacity(0.3),
                ],
              ),
            ),
          ),
        ),
        
        // Featured Badge
        Positioned(
          top: AppConstants.spacing16,
          left: AppConstants.spacing16,
          child: Container(
            padding: const EdgeInsets.symmetric(
              horizontal: AppConstants.spacing8,
              vertical: AppConstants.spacing4,
            ),
            decoration: BoxDecoration(
              color: AppColors.warning.withOpacity(0.9),
              borderRadius: BorderRadius.circular(AppConstants.radiusSmall),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  Icons.star_rounded,
                  size: 14,
                  color: AppColors.surface,
                ),
                const SizedBox(width: AppConstants.spacing4),
                Text(
                  'Featured',
                  style: AppTypography.labelSmall.copyWith(
                    color: AppColors.surface,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        ),
        
        // Favorite Button
        Positioned(
          top: AppConstants.spacing16,
          right: AppConstants.spacing16,
          child: GestureDetector(
            onTap: onFavoriteToggle,
            child: Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: AppColors.surface.withOpacity(0.9),
                borderRadius: BorderRadius.circular(AppConstants.radiusSmall),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.shadowLight,
                    blurRadius: 4,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Icon(
                property.isFavorite 
                    ? Icons.favorite_rounded 
                    : Icons.favorite_border_rounded,
                size: 20,
                color: property.isFavorite 
                    ? AppColors.error 
                    : AppColors.textSecondary,
              ),
            ),
          ),
        ),
        
        // Price Badge
        Positioned(
          bottom: AppConstants.spacing16,
          left: AppConstants.spacing16,
          child: Container(
            padding: const EdgeInsets.symmetric(
              horizontal: AppConstants.spacing16,
              vertical: AppConstants.spacing8,
            ),
            decoration: BoxDecoration(
              color: AppColors.greenOcean.withOpacity(0.9),
              borderRadius: BorderRadius.circular(AppConstants.radiusMedium),
            ),
            child: Text(
              _formatPrice(property.price),
              style: AppTypography.bodyLarge.copyWith(
                color: AppColors.surface,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildContentSection() {
    return Padding(
      padding: const EdgeInsets.all(AppConstants.spacing16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Title
          Text(
            property.title,
            style: AppTypography.bodyLarge.copyWith(
              fontWeight: FontWeight.w600,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          
          const SizedBox(height: AppConstants.spacing4),
          
          // Location
          Row(
            children: [
              Icon(
                Icons.location_on_outlined,
                size: 16,
                color: AppColors.textSecondary,
              ),
              const SizedBox(width: AppConstants.spacing4),
              Expanded(
                child: Text(
                  property.location,
                  style: AppTypography.bodyMedium.copyWith(
                    color: AppColors.textSecondary,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          
          const SizedBox(height: AppConstants.spacing8),
          
          // Property Details
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildDetailItem(
                icon: Icons.bed_outlined,
                text: '${property.bedrooms}',
              ),
              _buildDetailItem(
                icon: Icons.bathtub_outlined,
                text: '${property.bathrooms}',
              ),
              _buildDetailItem(
                icon: Icons.square_foot_outlined,
                text: '${property.area.toInt()} m²',
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: AppConstants.spacing8,
                  vertical: AppConstants.spacing4,
                ),
                decoration: BoxDecoration(
                  color: _getStatusColor().withOpacity(0.1),
                  borderRadius: BorderRadius.circular(AppConstants.radiusSmall),
                ),
                child: Text(
                  property.status,
                  style: AppTypography.labelSmall.copyWith(
                    color: _getStatusColor(),
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildDetailItem({
    required IconData icon,
    required String text,
  }) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(
          icon,
          size: 16,
          color: AppColors.textSecondary,
        ),
        const SizedBox(width: AppConstants.spacing4),
        Text(
          text,
          style: AppTypography.labelMedium.copyWith(
            color: AppColors.textSecondary,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  Color _getStatusColor() {
    switch (property.status.toLowerCase()) {
      case 'for sale':
        return AppColors.success;
      case 'for rent':
        return AppColors.greenOcean;
      case 'sold':
        return AppColors.error;
      case 'rented':
        return AppColors.warning;
      default:
        return AppColors.textSecondary;
    }
  }

  String _formatPrice(double price) {
    final formatter = NumberFormat.currency(
      symbol: '\$',
      decimalDigits: 0,
    );
    
    if (price >= 1000000) {
      return '${formatter.format(price / 1000000)}M';
    } else if (price >= 1000) {
      return '${formatter.format(price / 1000)}K';
    } else {
      return formatter.format(price);
    }
  }
}