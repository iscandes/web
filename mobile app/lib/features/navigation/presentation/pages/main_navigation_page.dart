import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../home/presentation/pages/home_page.dart';
import '../../../search/presentation/pages/search_page.dart';
import '../../../favorites/presentation/pages/favorites_page.dart';
import '../../../chat/presentation/pages/chat_page.dart';
import '../../../profile/presentation/pages/profile_page.dart';
import '../../../projects/presentation/pages/projects_page.dart';
import '../../../developers/presentation/pages/developers_page.dart';
import '../../../contact/presentation/pages/contact_page.dart';
import '../../../expert/presentation/pages/expert_page.dart';

class MainNavigationPage extends StatefulWidget {
  const MainNavigationPage({super.key});

  @override
  State<MainNavigationPage> createState() => _MainNavigationPageState();
}

class _MainNavigationPageState extends State<MainNavigationPage>
    with TickerProviderStateMixin {
  int _currentIndex = 0;
  late PageController _pageController;
  late List<AnimationController> _animationControllers;
  late List<Animation<double>> _animations;

  final List<NavigationItem> _navigationItems = [
    NavigationItem(
      icon: Icons.home_rounded,
      activeIcon: Icons.home_rounded,
      label: AppStrings.navHome,
    ),
    NavigationItem(
      icon: Icons.apartment_rounded,
      activeIcon: Icons.apartment_rounded,
      label: AppStrings.navProjects,
    ),
    NavigationItem(
      icon: Icons.domain_rounded,
      activeIcon: Icons.domain_rounded,
      label: AppStrings.navDevelopers,
    ),
    NavigationItem(
      icon: Icons.mail_outline_rounded,
      activeIcon: Icons.mail_rounded,
      label: AppStrings.navContact,
    ),
    NavigationItem(
      icon: Icons.support_agent_rounded,
      activeIcon: Icons.support_agent_rounded,
      label: AppStrings.navExpert,
    ),
  ];

  final List<Widget> _pages = [
    const HomePage(),
    const ProjectsPage(),
    const DevelopersPage(),
    const ContactPage(),
    const ExpertPage(),
  ];

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
    _initializeAnimations();
  }

  void _initializeAnimations() {
    _animationControllers = List.generate(
      _navigationItems.length,
      (index) => AnimationController(
        duration: AppConstants.animationMedium,
        vsync: this,
      ),
    );

    _animations = _animationControllers
        .map((controller) => Tween<double>(begin: 0.0, end: 1.0)
            .animate(CurvedAnimation(
              parent: controller,
              curve: Curves.elasticOut,
            )))
        .toList();

    // Animate the first item
    _animationControllers[0].forward();
  }

  @override
  void dispose() {
    _pageController.dispose();
    for (final controller in _animationControllers) {
      controller.dispose();
    }
    super.dispose();
  }

  void _onItemTapped(int index) {
    if (_currentIndex != index) {
      setState(() {
        _currentIndex = index;
      });

      // Animate page transition
      _pageController.animateToPage(
        index,
        duration: AppConstants.animationMedium,
        curve: Curves.easeInOut,
      );

      // Animate navigation icons
      for (int i = 0; i < _animationControllers.length; i++) {
        if (i == index) {
          _animationControllers[i].forward();
        } else {
          _animationControllers[i].reverse();
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: PageView(
        controller: _pageController,
        onPageChanged: (index) {
          setState(() {
            _currentIndex = index;
          });
          
          // Update animations when swiping
          for (int i = 0; i < _animationControllers.length; i++) {
            if (i == index) {
              _animationControllers[i].forward();
            } else {
              _animationControllers[i].reverse();
            }
          }
        },
        children: _pages,
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: AppColors.surface,
          boxShadow: [
            BoxShadow(
              color: AppColors.shadowLight,
              blurRadius: 20,
              offset: const Offset(0, -5),
            ),
          ],
        ),
        child: SafeArea(
          child: Container(
            height: AppConstants.bottomNavHeight,
            padding: const EdgeInsets.symmetric(
              horizontal: AppConstants.spacing16,
              vertical: AppConstants.spacing8,
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: List.generate(
                _navigationItems.length,
                (index) => _buildNavigationItem(index),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildNavigationItem(int index) {
    final item = _navigationItems[index];
    final isActive = _currentIndex == index;
    
    return GestureDetector(
      onTap: () => _onItemTapped(index),
      child: AnimatedBuilder(
        animation: _animations[index],
        builder: (context, child) {
          return Container(
            padding: const EdgeInsets.symmetric(
              horizontal: AppConstants.spacing16,
              vertical: AppConstants.spacing8,
            ),
            decoration: BoxDecoration(
              color: isActive 
                  ? AppColors.greenOcean.withOpacity(0.1)
                  : Colors.transparent,
              borderRadius: BorderRadius.circular(AppConstants.radiusLarge),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Icon with animation
                AnimatedContainer(
                  duration: AppConstants.animationFast,
                  curve: Curves.easeInOut,
                  transform: Matrix4.identity()
                    ..scale(isActive ? 1.2 : 1.0),
                  child: Icon(
                    isActive ? item.activeIcon : item.icon,
                    color: isActive 
                        ? AppColors.greenOcean 
                        : AppColors.textSecondary,
                    size: AppConstants.iconMedium,
                  ),
                ),
                
                const SizedBox(height: AppConstants.spacing4),
                
                // Label with fade animation
                AnimatedOpacity(
                  duration: AppConstants.animationFast,
                  opacity: isActive ? 1.0 : 0.7,
                  child: Text(
                    item.label,
                    style: AppTypography.labelSmall.copyWith(
                      color: isActive 
                          ? AppColors.greenOcean 
                          : AppColors.textSecondary,
                      fontWeight: isActive 
                          ? FontWeight.w600 
                          : FontWeight.w400,
                    ),
                  ),
                ),
                
                // Active indicator
                AnimatedContainer(
                  duration: AppConstants.animationFast,
                  margin: const EdgeInsets.only(top: AppConstants.spacing4),
                  height: 2,
                  width: isActive ? 20 : 0,
                  decoration: BoxDecoration(
                    color: AppColors.greenOcean,
                    borderRadius: BorderRadius.circular(1),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class NavigationItem {
  final IconData icon;
  final IconData activeIcon;
  final String label;

  const NavigationItem({
    required this.icon,
    required this.activeIcon,
    required this.label,
  });
}