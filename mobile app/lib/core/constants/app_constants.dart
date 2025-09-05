/// App constants for spacing, dimensions, and other design tokens
class AppConstants {
  // Spacing
  static const double spacing4 = 4.0;
  static const double spacing8 = 8.0;
  static const double spacing12 = 12.0;
  static const double spacing16 = 16.0;
  static const double spacing20 = 20.0;
  static const double spacing24 = 24.0;
  static const double spacing32 = 32.0;
  static const double spacing40 = 40.0;
  static const double spacing48 = 48.0;
  static const double spacing64 = 64.0;
  
  // Border Radius
  static const double radiusSmall = 8.0;
  static const double radiusMedium = 12.0;
  static const double radiusM = 12.0; // Alias for radiusMedium
  static const double radiusLarge = 16.0;
  static const double radiusXLarge = 24.0;
  static const double radiusCircular = 50.0;
  
  // Icon Sizes
  static const double iconSmall = 16.0;
  static const double iconMedium = 24.0;
  static const double iconLarge = 32.0;
  static const double iconXLarge = 48.0;
  
  // Button Heights
  static const double buttonHeightSmall = 36.0;
  static const double buttonHeightMedium = 48.0;
  static const double buttonHeightLarge = 56.0;
  static const double buttonHeight = buttonHeightMedium; // Default button height
  
  // App Bar
  static const double appBarHeight = 56.0;
  static const double appBarElevation = 0.0;
  
  // Bottom Navigation
  static const double bottomNavHeight = 80.0;
  static const double bottomNavElevation = 8.0;
  
  // Card
  static const double cardElevation = 2.0;
  static const double cardRadius = 12.0;
  
  // Input Fields
  static const double inputHeight = 56.0;
  static const double inputRadius = 12.0;
  
  // List Items
  static const double listItemHeight = 72.0;
  static const double listItemPadding = 16.0;
  
  // Images
  static const double avatarSmall = 32.0;
  static const double avatarMedium = 48.0;
  static const double avatarLarge = 64.0;
  static const double avatarXLarge = 96.0;
  
  // Property Card
  static const double propertyCardHeight = 280.0;
  static const double propertyImageHeight = 180.0;
  
  // Animation Durations
  static const Duration animationFast = Duration(milliseconds: 150);
  static const Duration animationMedium = Duration(milliseconds: 300);
  static const Duration animationSlow = Duration(milliseconds: 500);
  
  // API
  static const int apiTimeoutSeconds = 30;
  static const int maxRetryAttempts = 3;
  
  // Pagination
  static const int defaultPageSize = 20;
  static const int maxPageSize = 100;
  
  // Map
  static const double defaultZoom = 14.0;
  static const double maxZoom = 20.0;
  static const double minZoom = 5.0;
  
  // Search
  static const int searchDebounceMs = 500;
  static const int minSearchLength = 2;
  
  // Cache
  static const int imageCacheMaxAge = 7; // days
  static const int dataCacheMaxAge = 1; // hours
}

/// App strings and text constants
class AppStrings {
  // App Info
  static const String appName = 'Profinder Real Estate';
  static const String appVersion = '1.0.0';
  
  // Navigation
  static const String navHome = 'Home';
  static const String navSearch = 'Search';
  static const String navFavorites = 'Favorites';
  static const String navChat = 'Chat';
  static const String navProfile = 'Profile';
  // Added for website-aligned navigation
  static const String navProjects = 'Projects';
  static const String navDevelopers = 'Developers';
  static const String navContact = 'Contact';
  static const String navExpert = 'Expert';
  
  // Common Actions
  static const String save = 'Save';
  static const String cancel = 'Cancel';
  static const String delete = 'Delete';
  static const String edit = 'Edit';
  static const String share = 'Share';
  static const String filter = 'Filter';
  static const String sort = 'Sort';
  static const String search = 'Search';
  static const String viewAll = 'View All';
  static const String seeMore = 'See More';
  static const String showLess = 'Show Less';
  
  // Authentication
  static const String signIn = 'Sign In';
  static const String signUp = 'Sign Up';
  static const String signOut = 'Sign Out';
  static const String forgotPassword = 'Forgot Password?';
  static const String resetPassword = 'Reset Password';
  static const String createAccount = 'Create Account';
  
  // Property
  static const String properties = 'Properties';
  static const String propertyDetails = 'Property Details';
  static const String featuredProperties = 'Featured Properties';
  static const String recentProperties = 'Recent Properties';
  static const String nearbyProperties = 'Nearby Properties';
  static const String similarProperties = 'Similar Properties';
  
  // Property Types
  static const String apartment = 'Apartment';
  static const String house = 'House';
  static const String villa = 'Villa';
  static const String studio = 'Studio';
  static const String penthouse = 'Penthouse';
  static const String townhouse = 'Townhouse';
  
  // Property Status
  static const String forSale = 'For Sale';
  static const String forRent = 'For Rent';
  static const String sold = 'Sold';
  static const String rented = 'Rented';
  
  // Errors
  static const String errorGeneral = 'Something went wrong. Please try again.';
  static const String errorNetwork = 'Network error. Please check your connection.';
  static const String errorNotFound = 'Item not found.';
  static const String errorUnauthorized = 'Unauthorized access.';
  static const String errorValidation = 'Please check your input.';
  
  // Empty States
  static const String emptyProperties = 'No properties found';
  static const String emptyPropertiesTitle = 'No Properties Found';
  static const String emptyPropertiesMessage = 'We couldn\'t find any properties matching your criteria. Try adjusting your search filters.';
  static const String emptyFavorites = 'No favorites yet';
  static const String emptySearch = 'No search results';
  static const String emptyChat = 'No messages yet';
  
  // Loading
  static const String loading = 'Loading...';
  static const String loadingProperties = 'Loading properties...';
  static const String loadingMore = 'Loading more...';
}