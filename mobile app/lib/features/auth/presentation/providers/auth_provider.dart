import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Authentication state management
class AuthProvider extends ChangeNotifier {
  bool _isAuthenticated = false;
  bool _isLoading = false;
  String? _userToken;
  Map<String, dynamic>? _userData;
  String? _errorMessage;

  // Getters
  bool get isAuthenticated => _isAuthenticated;
  bool get isLoading => _isLoading;
  String? get userToken => _userToken;
  Map<String, dynamic>? get userData => _userData;
  String? get errorMessage => _errorMessage;
  Map<String, dynamic>? get user => _userData;
  bool get isLoggedIn => _isAuthenticated;

  /// Initialize authentication state
  Future<void> initializeAuth() async {
    _setLoading(true);
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('user_token');
      final userDataString = prefs.getString('user_data');
      
      if (token != null && token.isNotEmpty) {
        _userToken = token;
        _isAuthenticated = true;
        
        if (userDataString != null) {
          // In a real app, you'd parse JSON here
          // _userData = jsonDecode(userDataString);
        }
      }
    } catch (e) {
      _errorMessage = 'Failed to initialize authentication';
      debugPrint('Auth initialization error: $e');
    } finally {
      _setLoading(false);
    }
  }

  /// Sign in with email and password
  Future<bool> signIn(String email, String password) async {
    _setLoading(true);
    _clearError();
    
    try {
      // Simulate API call
      await Future.delayed(const Duration(seconds: 2));
      
      // Mock authentication logic
      if (email.isNotEmpty && password.length >= 6) {
        _userToken = 'mock_token_${DateTime.now().millisecondsSinceEpoch}';
        _userData = {
          'id': '1',
          'email': email,
          'name': 'John Doe',
          'avatar': null,
        };
        _isAuthenticated = true;
        
        // Save to local storage
        await _saveAuthData();
        
        return true;
      } else {
        _errorMessage = 'Invalid email or password';
        return false;
      }
    } catch (e) {
      _errorMessage = 'Sign in failed. Please try again.';
      debugPrint('Sign in error: $e');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Sign up with email, password, and name
  Future<bool> signUp(String name, String email, String password) async {
    _setLoading(true);
    _clearError();
    
    try {
      // Simulate API call
      await Future.delayed(const Duration(seconds: 2));
      
      // Mock registration logic
      if (name.isNotEmpty && email.isNotEmpty && password.length >= 6) {
        _userToken = 'mock_token_${DateTime.now().millisecondsSinceEpoch}';
        _userData = {
          'id': '1',
          'email': email,
          'name': name,
          'avatar': null,
        };
        _isAuthenticated = true;
        
        // Save to local storage
        await _saveAuthData();
        
        return true;
      } else {
        _errorMessage = 'Please fill all fields correctly';
        return false;
      }
    } catch (e) {
      _errorMessage = 'Sign up failed. Please try again.';
      debugPrint('Sign up error: $e');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Sign out
  Future<void> signOut() async {
    _setLoading(true);
    
    try {
      // Clear local storage
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove('user_token');
      await prefs.remove('user_data');
      
      // Clear state
      _userToken = null;
      _userData = null;
      _isAuthenticated = false;
      _clearError();
    } catch (e) {
      debugPrint('Sign out error: $e');
    } finally {
      _setLoading(false);
    }
  }

  /// Reset password
  Future<bool> resetPassword(String email) async {
    _setLoading(true);
    _clearError();
    
    try {
      // Simulate API call
      await Future.delayed(const Duration(seconds: 2));
      
      if (email.isNotEmpty && email.contains('@')) {
        return true;
      } else {
        _errorMessage = 'Please enter a valid email address';
        return false;
      }
    } catch (e) {
      _errorMessage = 'Password reset failed. Please try again.';
      debugPrint('Password reset error: $e');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Update user profile
  Future<bool> updateProfile(Map<String, dynamic> profileData) async {
    _setLoading(true);
    _clearError();
    
    try {
      // Simulate API call
      await Future.delayed(const Duration(seconds: 1));
      
      // Update local user data
      if (_userData != null) {
        _userData = {..._userData!, ...profileData};
        await _saveAuthData();
        return true;
      }
      
      return false;
    } catch (e) {
      _errorMessage = 'Profile update failed. Please try again.';
      debugPrint('Profile update error: $e');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Save authentication data to local storage
  Future<void> _saveAuthData() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      if (_userToken != null) {
        await prefs.setString('user_token', _userToken!);
      }
      if (_userData != null) {
        // In a real app, you'd use jsonEncode here
        // await prefs.setString('user_data', jsonEncode(_userData));
      }
    } catch (e) {
      debugPrint('Save auth data error: $e');
    }
  }

  /// Set loading state
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  /// Clear error message
  void _clearError() {
    _errorMessage = null;
    notifyListeners();
  }

  /// Clear error message manually
  void clearError() {
    _clearError();
  }
}


