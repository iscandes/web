import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/constants/app_constants.dart';

class CategoryChips extends StatefulWidget {
  final Function(String)? onCategorySelected;
  final String? selectedCategory;

  const CategoryChips({
    super.key,
    this.onCategorySelected,
    this.selectedCategory,
  });

  @override
  State<CategoryChips> createState() => _CategoryChipsState();
}

class _CategoryChipsState extends State<CategoryChips> {
  String _selectedCategory = 'All';
  
  final List<CategoryItem> _categories = [
    CategoryItem(
      id: 'all',
      name: 'All',
      icon: Icons.apps_rounded,
    ),
    CategoryItem(
      id: 'apartment',
      name: 'Apartment',
      icon: Icons.apartment_rounded,
    ),
    CategoryItem(
      id: 'house',
      name: 'House',
      icon: Icons.home_rounded,
    ),
    CategoryItem(
      id: 'villa',
      name: 'Villa',
      icon: Icons.villa_rounded,
    ),
    CategoryItem(
      id: 'studio',
      name: 'Studio',
      icon: Icons.single_bed_rounded,
    ),
    CategoryItem(
      id: 'penthouse',
      name: 'Penthouse',
      icon: Icons.home_work_rounded,
    ),
  ];

  @override
  void initState() {
    super.initState();
    _selectedCategory = widget.selectedCategory ?? 'All';
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Categories',
          style: AppTypography.headlineSmall.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: AppConstants.spacing16),
        SizedBox(
          height: 100,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: _categories.length,
            itemBuilder: (context, index) {
              final category = _categories[index];
              final isSelected = _selectedCategory.toLowerCase() == category.name.toLowerCase();
              
              return Padding(
                padding: EdgeInsets.only(
                  right: index < _categories.length - 1 ? AppConstants.spacing16 : 0,
                ),
                child: _buildCategoryChip(category, isSelected),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildCategoryChip(CategoryItem category, bool isSelected) {
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedCategory = category.name;
        });
        widget.onCategorySelected?.call(category.name);
      },
      child: AnimatedContainer(
        duration: AppConstants.animationFast,
        curve: Curves.easeInOut,
        width: 80,
        decoration: BoxDecoration(
          color: isSelected 
              ? AppColors.greenOcean 
              : AppColors.surface,
          borderRadius: BorderRadius.circular(AppConstants.radiusLarge),
          border: Border.all(
            color: isSelected 
                ? AppColors.greenOcean 
                : AppColors.borderColor,
            width: 1,
          ),
          boxShadow: [
            if (isSelected)
              BoxShadow(
                color: AppColors.greenOcean.withOpacity(0.3),
                blurRadius: 8,
                offset: const Offset(0, 2),
              )
            else
              BoxShadow(
                color: AppColors.shadowLight,
                blurRadius: 4,
                offset: const Offset(0, 1),
              ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Icon with animation
            AnimatedContainer(
              duration: AppConstants.animationFast,
              curve: Curves.easeInOut,
              padding: const EdgeInsets.all(AppConstants.spacing8),
              decoration: BoxDecoration(
                color: isSelected 
                    ? AppColors.surface.withOpacity(0.2) 
                    : AppColors.greenOcean.withOpacity(0.1),
                borderRadius: BorderRadius.circular(AppConstants.radiusMedium),
              ),
              child: Icon(
                category.icon,
                size: AppConstants.iconMedium,
                color: isSelected 
                    ? AppColors.surface 
                    : AppColors.greenOcean,
              ),
            ),
            
            const SizedBox(height: AppConstants.spacing8),
            
            // Category name
            Text(
              category.name,
              style: AppTypography.labelMedium.copyWith(
                color: isSelected 
                    ? AppColors.surface 
                    : AppColors.textPrimary,
                fontWeight: isSelected 
                    ? FontWeight.w600 
                    : FontWeight.w500,
              ),
              textAlign: TextAlign.center,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}

class CategoryItem {
  final String id;
  final String name;
  final IconData icon;

  CategoryItem({
    required this.id,
    required this.name,
    required this.icon,
  });
}


