import 'package:flutter/foundation.dart';

/// Property model
class Property {
  final String id;
  final String title;
  final String description;
  final double price;
  final String location;
  final String type;
  final String status;
  final int bedrooms;
  final int bathrooms;
  final double area;
  final List<String> images;
  final Map<String, dynamic> features;
  final bool isFavorite;
  final DateTime createdAt;

  Property({
    required this.id,
    required this.title,
    required this.description,
    required this.price,
    required this.location,
    required this.type,
    required this.status,
    required this.bedrooms,
    required this.bathrooms,
    required this.area,
    required this.images,
    required this.features,
    this.isFavorite = false,
    required this.createdAt,
  });

  Property copyWith({
    String? id,
    String? title,
    String? description,
    double? price,
    String? location,
    String? type,
    String? status,
    int? bedrooms,
    int? bathrooms,
    double? area,
    List<String>? images,
    Map<String, dynamic>? features,
    bool? isFavorite,
    DateTime? createdAt,
  }) {
    return Property(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      price: price ?? this.price,
      location: location ?? this.location,
      type: type ?? this.type,
      status: status ?? this.status,
      bedrooms: bedrooms ?? this.bedrooms,
      bathrooms: bathrooms ?? this.bathrooms,
      area: area ?? this.area,
      images: images ?? this.images,
      features: features ?? this.features,
      isFavorite: isFavorite ?? this.isFavorite,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}

/// Property state management
class PropertyProvider extends ChangeNotifier {
  List<Property> _properties = [];
  List<Property> _featuredProperties = [];
  List<Property> _favoriteProperties = [];
  List<Property> _searchResults = [];
  bool _isLoading = false;
  bool _isLoadingMore = false;
  String? _errorMessage;
  String _searchQuery = '';
  Map<String, dynamic> _filters = {};
  int _currentPage = 1;
  bool _hasMoreData = true;

  // Getters
  List<Property> get properties => _properties;
  List<Property> get featuredProperties => _featuredProperties;
  List<Property> get favoriteProperties => _favoriteProperties;
  List<Property> get searchResults => _searchResults;
  bool get isLoading => _isLoading;
  bool get isLoadingMore => _isLoadingMore;
  String? get errorMessage => _errorMessage;
  String get searchQuery => _searchQuery;
  Map<String, dynamic> get filters => _filters;
  bool get hasMoreData => _hasMoreData;

  /// Initialize properties data
  Future<void> initializeProperties() async {
    _setLoading(true);
    try {
      await loadProperties();
      await loadFeaturedProperties();
    } catch (e) {
      _errorMessage = 'Failed to load properties';
      debugPrint('Properties initialization error: $e');
    } finally {
      _setLoading(false);
    }
  }

  /// Load properties with pagination
  Future<void> loadProperties({bool refresh = false}) async {
    if (refresh) {
      _currentPage = 1;
      _hasMoreData = true;
      _properties.clear();
    }

    if (!_hasMoreData) return;

    if (_currentPage == 1) {
      _setLoading(true);
    } else {
      _setLoadingMore(true);
    }

    try {
      // Simulate API call
      await Future.delayed(const Duration(seconds: 1));

      final newProperties = _generateMockProperties(_currentPage);
      
      if (newProperties.isEmpty) {
        _hasMoreData = false;
      } else {
        _properties.addAll(newProperties);
        _currentPage++;
      }

      _clearError();
    } catch (e) {
      _errorMessage = 'Failed to load properties';
      debugPrint('Load properties error: $e');
    } finally {
      _setLoading(false);
      _setLoadingMore(false);
    }
  }

  /// Load featured properties
  Future<void> loadFeaturedProperties() async {
    try {
      // Simulate API call
      await Future.delayed(const Duration(milliseconds: 500));
      
      _featuredProperties = _generateMockProperties(1, featured: true);
      notifyListeners();
    } catch (e) {
      debugPrint('Load featured properties error: $e');
    }
  }

  /// Search properties
  Future<void> searchProperties(String query) async {
    _searchQuery = query;
    _setLoading(true);
    
    try {
      // Simulate API call
      await Future.delayed(const Duration(milliseconds: 800));
      
      if (query.isEmpty) {
        _searchResults = [];
      } else {
        _searchResults = _properties
            .where((property) =>
                property.title.toLowerCase().contains(query.toLowerCase()) ||
                property.location.toLowerCase().contains(query.toLowerCase()) ||
                property.type.toLowerCase().contains(query.toLowerCase()))
            .toList();
      }
      
      _clearError();
    } catch (e) {
      _errorMessage = 'Search failed. Please try again.';
      debugPrint('Search properties error: $e');
    } finally {
      _setLoading(false);
    }
  }

  /// Apply filters
  Future<void> applyFilters(Map<String, dynamic> filters) async {
    _filters = filters;
    _setLoading(true);
    
    try {
      // Simulate API call with filters
      await Future.delayed(const Duration(seconds: 1));
      
      // Reset pagination
      _currentPage = 1;
      _hasMoreData = true;
      _properties.clear();
      
      // Load filtered properties
      await loadProperties();
    } catch (e) {
      _errorMessage = 'Failed to apply filters';
      debugPrint('Apply filters error: $e');
    } finally {
      _setLoading(false);
    }
  }

  /// Toggle favorite status
  Future<void> toggleFavorite(String propertyId) async {
    try {
      // Find property in all lists and update
      _updatePropertyInList(_properties, propertyId);
      _updatePropertyInList(_featuredProperties, propertyId);
      _updatePropertyInList(_searchResults, propertyId);
      
      // Update favorites list
      _updateFavoritesList();
      
      notifyListeners();
      
      // Simulate API call
      await Future.delayed(const Duration(milliseconds: 300));
    } catch (e) {
      debugPrint('Toggle favorite error: $e');
    }
  }

  /// Get property by ID
  Property? getPropertyById(String id) {
    try {
      return _properties.firstWhere((property) => property.id == id);
    } catch (e) {
      return null;
    }
  }

  /// Load favorite properties
  Future<void> loadFavoriteProperties() async {
    _updateFavoritesList();
  }

  /// Clear search
  void clearSearch() {
    _searchQuery = '';
    _searchResults = [];
    notifyListeners();
  }

  /// Clear filters
  void clearFilters() {
    _filters = {};
    notifyListeners();
  }

  /// Generate mock properties for testing
  List<Property> _generateMockProperties(int page, {bool featured = false}) {
    final properties = <Property>[];
    final startIndex = (page - 1) * 10;
    
    if (startIndex >= 50) return []; // Simulate end of data
    
    for (int i = 0; i < 10; i++) {
      final index = startIndex + i;
      if (index >= 50) break;
      
      properties.add(Property(
        id: 'property_$index',
        title: featured 
            ? 'Featured Luxury ${_getPropertyType(index)} in ${_getLocation(index)}'
            : 'Beautiful ${_getPropertyType(index)} in ${_getLocation(index)}',
        description: 'A stunning property with modern amenities and excellent location.',
        price: featured ? (500000 + (index * 50000)) : (200000 + (index * 25000)),
        location: _getLocation(index),
        type: _getPropertyType(index),
        status: index % 3 == 0 ? 'For Rent' : 'For Sale',
        bedrooms: (index % 4) + 1,
        bathrooms: (index % 3) + 1,
        area: 80 + (index * 10),
        images: [
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
          'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=800',
          'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800',
        ],
        features: {
          'parking': true,
          'garden': index % 2 == 0,
          'pool': featured && index % 3 == 0,
          'gym': featured,
          'security': true,
        },
        isFavorite: false,
        createdAt: DateTime.now().subtract(Duration(days: index)),
      ));
    }
    
    return properties;
  }

  String _getPropertyType(int index) {
    const types = ['Apartment', 'House', 'Villa', 'Studio', 'Penthouse'];
    return types[index % types.length];
  }

  String _getLocation(int index) {
    const locations = ['Downtown', 'Marina', 'Business Bay', 'Palm Jumeirah', 'Dubai Hills'];
    return locations[index % locations.length];
  }

  void _updatePropertyInList(List<Property> list, String propertyId) {
    for (int i = 0; i < list.length; i++) {
      if (list[i].id == propertyId) {
        list[i] = list[i].copyWith(isFavorite: !list[i].isFavorite);
        break;
      }
    }
  }

  void _updateFavoritesList() {
    _favoriteProperties = _properties.where((property) => property.isFavorite).toList();
  }

  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setLoadingMore(bool loading) {
    _isLoadingMore = loading;
    notifyListeners();
  }

  void _clearError() {
    _errorMessage = null;
    notifyListeners();
  }

  void clearError() {
    _clearError();
  }

  /// Clear all favorite properties
  Future<void> clearAllFavorites() async {
    _setLoading(true);
    try {
      // Clear all favorites
      _favoriteProperties.clear();
      
      // Update the main properties list
      _properties = _properties.map((property) => 
        property.copyWith(isFavorite: false)
      ).toList();
      
      // In a real app, you would also clear favorites from backend/storage
      // await _apiService.clearAllFavorites();
      
      notifyListeners();
    } catch (e) {
      _errorMessage = 'Failed to clear favorites';
      debugPrint('Clear favorites error: $e');
    } finally {
      _setLoading(false);
    }
  }
}