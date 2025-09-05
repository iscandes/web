import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/constants/app_constants.dart';

class SearchBarWidget extends StatelessWidget {
  final String? hintText;
  final VoidCallback? onTap;
  final bool enabled;
  final TextEditingController? controller;
  final Function(String)? onChanged;
  final Function(String)? onSubmitted;
  final bool showFilterButton;

  const SearchBarWidget({
    super.key,
    this.hintText,
    this.onTap,
    this.enabled = true,
    this.controller,
    this.onChanged,
    this.onSubmitted,
    this.showFilterButton = true,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: AppConstants.inputHeight,
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
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: controller,
              enabled: enabled,
              onChanged: onChanged,
              onSubmitted: onSubmitted,
              onTap: onTap ?? () {
                // Navigate to search page
                context.go('/search');
              },
              readOnly: onTap != null,
              style: AppTypography.bodyMedium,
              decoration: InputDecoration(
                hintText: hintText ?? 'Search properties, locations...',
                hintStyle: AppTypography.bodyMedium.copyWith(
                  color: AppColors.textSecondary,
                ),
                prefixIcon: Icon(
                  Icons.search_rounded,
                  color: AppColors.textSecondary,
                  size: AppConstants.iconMedium,
                ),
                border: InputBorder.none,
                enabledBorder: InputBorder.none,
                focusedBorder: InputBorder.none,
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: AppConstants.spacing16,
                  vertical: AppConstants.spacing16,
                ),
              ),
            ),
          ),
          
          if (showFilterButton) ...[
            Container(
              width: 1,
              height: 24,
              color: AppColors.borderColor,
            ),
            
            Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: () {
                  _showFilterBottomSheet(context);
                },
                borderRadius: BorderRadius.only(
                  topRight: Radius.circular(AppConstants.radiusLarge),
                  bottomRight: Radius.circular(AppConstants.radiusLarge),
                ),
                child: Container(
                  width: 48,
                  height: AppConstants.inputHeight,
                  child: Icon(
                    Icons.tune_rounded,
                    color: AppColors.greenOcean,
                    size: AppConstants.iconMedium,
                  ),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  void _showFilterBottomSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => const FilterBottomSheet(),
    );
  }
}

class FilterBottomSheet extends StatefulWidget {
  const FilterBottomSheet({super.key});

  @override
  State<FilterBottomSheet> createState() => _FilterBottomSheetState();
}

class _FilterBottomSheetState extends State<FilterBottomSheet> {
  RangeValues _priceRange = const RangeValues(100000, 1000000);
  String _selectedPropertyType = 'All';
  String _selectedStatus = 'All';
  int _selectedBedrooms = 0;
  int _selectedBathrooms = 0;
  
  final List<String> _propertyTypes = [
    'All', 'Apartment', 'House', 'Villa', 'Studio', 'Penthouse'
  ];
  
  final List<String> _statusOptions = [
    'All', 'For Sale', 'For Rent', 'Sold', 'Rented'
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(AppConstants.radiusXLarge),
          topRight: Radius.circular(AppConstants.radiusXLarge),
        ),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Handle
          Container(
            margin: const EdgeInsets.only(top: AppConstants.spacing16),
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: AppColors.borderColor,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          
          // Header
          Padding(
            padding: const EdgeInsets.all(AppConstants.spacing16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Filter Properties',
                  style: AppTypography.headlineSmall.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                TextButton(
                  onPressed: _resetFilters,
                  child: Text(
                    'Reset',
                    style: AppTypography.bodyMedium.copyWith(
                      color: AppColors.greenOcean,
                    ),
                  ),
                ),
              ],
            ),
          ),
          
          // Filters Content
          Flexible(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(
                horizontal: AppConstants.spacing16,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildPriceRangeFilter(),
                  const SizedBox(height: AppConstants.spacing24),
                  _buildPropertyTypeFilter(),
                  const SizedBox(height: AppConstants.spacing24),
                  _buildStatusFilter(),
                  const SizedBox(height: AppConstants.spacing24),
                  _buildBedroomsFilter(),
                  const SizedBox(height: AppConstants.spacing24),
                  _buildBathroomsFilter(),
                  const SizedBox(height: AppConstants.spacing64),
                ],
              ),
            ),
          ),
          
          // Apply Button
          Padding(
            padding: const EdgeInsets.all(AppConstants.spacing16),
            child: SizedBox(
              width: double.infinity,
              height: AppConstants.buttonHeight,
              child: ElevatedButton(
                onPressed: _applyFilters,
                child: Text(
                  'Apply Filters',
                  style: AppTypography.bodyLarge.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPriceRangeFilter() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Price Range',
          style: AppTypography.bodyLarge.copyWith(
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: AppConstants.spacing8),
        RangeSlider(
          values: _priceRange,
          min: 50000,
          max: 2000000,
          divisions: 20,
          labels: RangeLabels(
            '\$${(_priceRange.start / 1000).toInt()}K',
            '\$${(_priceRange.end / 1000).toInt()}K',
          ),
          onChanged: (values) {
            setState(() {
              _priceRange = values;
            });
          },
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              '\$${(_priceRange.start / 1000).toInt()}K',
              style: AppTypography.bodyMedium.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
            Text(
              '\$${(_priceRange.end / 1000).toInt()}K',
              style: AppTypography.bodyMedium.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildPropertyTypeFilter() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Property Type',
          style: AppTypography.bodyLarge.copyWith(
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: AppConstants.spacing8),
        Wrap(
          spacing: AppConstants.spacing8,
          runSpacing: AppConstants.spacing8,
          children: _propertyTypes.map((type) {
            final isSelected = _selectedPropertyType == type;
            return GestureDetector(
              onTap: () {
                setState(() {
                  _selectedPropertyType = type;
                });
              },
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: AppConstants.spacing16,
                  vertical: AppConstants.spacing8,
                ),
                decoration: BoxDecoration(
                  color: isSelected 
                      ? AppColors.greenOcean 
                      : AppColors.surfaceVariant,
                  borderRadius: BorderRadius.circular(AppConstants.radiusLarge),
                ),
                child: Text(
                  type,
                  style: AppTypography.bodyMedium.copyWith(
                    color: isSelected 
                        ? AppColors.surface 
                        : AppColors.textPrimary,
                    fontWeight: isSelected 
                        ? FontWeight.w600 
                        : FontWeight.w400,
                  ),
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildStatusFilter() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Status',
          style: AppTypography.bodyLarge.copyWith(
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: AppConstants.spacing8),
        Wrap(
          spacing: AppConstants.spacing8,
          runSpacing: AppConstants.spacing8,
          children: _statusOptions.map((status) {
            final isSelected = _selectedStatus == status;
            return GestureDetector(
              onTap: () {
                setState(() {
                  _selectedStatus = status;
                });
              },
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: AppConstants.spacing16,
                  vertical: AppConstants.spacing8,
                ),
                decoration: BoxDecoration(
                  color: isSelected 
                      ? AppColors.greenOcean 
                      : AppColors.surfaceVariant,
                  borderRadius: BorderRadius.circular(AppConstants.radiusLarge),
                ),
                child: Text(
                  status,
                  style: AppTypography.bodyMedium.copyWith(
                    color: isSelected 
                        ? AppColors.surface 
                        : AppColors.textPrimary,
                    fontWeight: isSelected 
                        ? FontWeight.w600 
                        : FontWeight.w400,
                  ),
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildBedroomsFilter() {
    return _buildCounterFilter(
      title: 'Bedrooms',
      value: _selectedBedrooms,
      onChanged: (value) {
        setState(() {
          _selectedBedrooms = value;
        });
      },
    );
  }

  Widget _buildBathroomsFilter() {
    return _buildCounterFilter(
      title: 'Bathrooms',
      value: _selectedBathrooms,
      onChanged: (value) {
        setState(() {
          _selectedBathrooms = value;
        });
      },
    );
  }

  Widget _buildCounterFilter({
    required String title,
    required int value,
    required Function(int) onChanged,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: AppTypography.bodyLarge.copyWith(
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: AppConstants.spacing8),
        Row(
          children: [
            GestureDetector(
              onTap: () {
                if (value > 0) onChanged(value - 1);
              },
              child: Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: AppColors.surfaceVariant,
                  borderRadius: BorderRadius.circular(AppConstants.radiusSmall),
                ),
                child: Icon(
                  Icons.remove,
                  color: AppColors.textSecondary,
                ),
              ),
            ),
            const SizedBox(width: AppConstants.spacing16),
            Container(
              width: 60,
              height: 40,
              decoration: BoxDecoration(
                color: AppColors.greenOcean.withOpacity(0.1),
                borderRadius: BorderRadius.circular(AppConstants.radiusSmall),
              ),
              child: Center(
                child: Text(
                  value == 0 ? 'Any' : value.toString(),
                  style: AppTypography.bodyLarge.copyWith(
                    color: AppColors.greenOcean,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ),
            const SizedBox(width: AppConstants.spacing16),
            GestureDetector(
              onTap: () {
                if (value < 10) onChanged(value + 1);
              },
              child: Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: AppColors.surfaceVariant,
                  borderRadius: BorderRadius.circular(AppConstants.radiusSmall),
                ),
                child: Icon(
                  Icons.add,
                  color: AppColors.textSecondary,
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  void _resetFilters() {
    setState(() {
      _priceRange = const RangeValues(100000, 1000000);
      _selectedPropertyType = 'All';
      _selectedStatus = 'All';
      _selectedBedrooms = 0;
      _selectedBathrooms = 0;
    });
  }

  void _applyFilters() {
    // Apply filters logic here
    Navigator.pop(context);
  }
}