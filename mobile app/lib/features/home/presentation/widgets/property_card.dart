import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:intl/intl.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../property/presentation/providers/property_provider.dart';

class PropertyCard extends StatelessWidget {
  final Property property;
  final VoidCallback? onTap;
  final VoidCallback? onFavoriteToggle;
  final bool isHorizontal;

  const PropertyCard({
    super.key,
    required this.property,
    this.onTap,
    this.onFavoriteToggle,
    this.isHorizontal = false,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
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
        child: isHorizontal ? _buildHorizontalCard() : _buildVerticalCard(),
      ),
    );
  }

  Widget _buildVerticalCard() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildImageSection(),
        _buildContentSection(),
      ],
    );
  }

  Widget _buildHorizontalCard() {
    return IntrinsicHeight(
      child: Row(
        children: [
          _buildImageSection(isHorizontal: true),
          Expanded(
            child: _buildContentSection(isHorizontal: true),
          ),
        ],
      ),
    );
  }

  Widget _buildImageSection({bool isHorizontal = false}) {
    return Stack(
      children: [
        ClipRRect(
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(AppConstants.radiusLarge),
            topRight: isHorizontal 
                ? Radius.zero 
                : const Radius.circular(AppConstants.radiusLarge),
            bottomLeft: isHorizontal 
                ? const Radius.circular(AppConstants.radiusLarge) 
                : Radius.zero,
          ),
          child: Container(
            width: isHorizontal ? 120 : double.infinity,
            height: isHorizontal ? double.infinity : 160,
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
                    size: 32,
                    color: AppColors.textSecondary,
                  ),
                ),
              ),
              errorWidget: (context, url, error) => Container(
                color: AppColors.surfaceVariant,
                child: Center(
                  child: Icon(
                    Icons.home_work_outlined,
                    size: 32,
                    color: AppColors.textSecondary,
                  ),
                ),
              ),
            ),
          ),
        ),
        
        // Status Badge
        Positioned(
          top: AppConstants.spacing8,
          left: AppConstants.spacing8,
          child: Container(
            padding: const EdgeInsets.symmetric(
              horizontal: AppConstants.spacing8,
              vertical: AppConstants.spacing4,
            ),
            decoration: BoxDecoration(
              color: _getStatusColor().withOpacity(0.9),
              borderRadius: BorderRadius.circular(AppConstants.radiusSmall),
            ),
            child: Text(
              property.status,
              style: AppTypography.labelSmall.copyWith(
                color: AppColors.surface,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ),
        
        // Favorite Button
        Positioned(
          top: AppConstants.spacing8,
          right: AppConstants.spacing8,
          child: GestureDetector(
            onTap: onFavoriteToggle,
            child: Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: AppColors.surface.withOpacity(0.9),
                borderRadius: BorderRadius.circular(AppConstants.radiusSmall),
              ),
              child: Icon(
                property.isFavorite 
                    ? Icons.favorite_rounded 
                    : Icons.favorite_border_rounded,
                size: 18,
                color: property.isFavorite 
                    ? AppColors.error 
                    : AppColors.textSecondary,
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildContentSection({bool isHorizontal = false}) {
    return Padding(
      padding: const EdgeInsets.all(AppConstants.spacing16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          // Price
          Text(
            _formatPrice(property.price),
            style: AppTypography.headlineSmall.copyWith(
              color: AppColors.greenOcean,
              fontWeight: FontWeight.bold,
            ),
          ),
          
          const SizedBox(height: AppConstants.spacing4),
          
          // Title
          Text(
            property.title,
            style: AppTypography.bodyLarge.copyWith(
              fontWeight: FontWeight.w600,
            ),
            maxLines: isHorizontal ? 2 : 1,
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
            children: [
              _buildDetailChip(
                icon: Icons.bed_outlined,
                text: '${property.bedrooms}',
              ),
              const SizedBox(width: AppConstants.spacing8),
              _buildDetailChip(
                icon: Icons.bathtub_outlined,
                text: '${property.bathrooms}',
              ),
              const SizedBox(width: AppConstants.spacing8),
              _buildDetailChip(
                icon: Icons.square_foot_outlined,
                text: '${property.area.toInt()} m²',
              ),
            ],
          ),
          
          if (!isHorizontal) ...[
            const SizedBox(height: AppConstants.spacing8),
            
            // Property Type
            Container(
              padding: const EdgeInsets.symmetric(
                horizontal: AppConstants.spacing8,
                vertical: AppConstants.spacing4,
              ),
              decoration: BoxDecoration(
                color: AppColors.greenOcean.withOpacity(0.1),
                borderRadius: BorderRadius.circular(AppConstants.radiusSmall),
              ),
              child: Text(
                property.type,
                style: AppTypography.labelSmall.copyWith(
                  color: AppColors.greenOcean,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildDetailChip({
    required IconData icon,
    required String text,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppConstants.spacing8,
        vertical: AppConstants.spacing4,
      ),
      decoration: BoxDecoration(
        color: AppColors.surfaceVariant,
        borderRadius: BorderRadius.circular(AppConstants.radiusSmall),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            size: 14,
            color: AppColors.textSecondary,
          ),
          const SizedBox(width: AppConstants.spacing4),
          Text(
            text,
            style: AppTypography.labelSmall.copyWith(
              color: AppColors.textSecondary,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
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