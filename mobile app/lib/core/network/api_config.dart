import 'package:flutter/foundation.dart';

/// Centralized API configuration
class ApiConfig {
  // IMPORTANT: Adjust baseUrl per environment if needed.
  // - For local Next.js dev server: http://localhost:3000
  // - For Android emulator: http://10.0.2.2:3000
  // - For iOS simulator: http://localhost:3000
  // - For device on same LAN: http://<your-computer-ip>:3000
  static String get baseUrl {
    // Basic heuristic. You can enhance this to detect platform or inject via env.
    return 'http://localhost:3000';
  }

  static String api(String path) {
    final normalized = path.startsWith('/') ? path : '/$path';
    return '$baseUrl$normalized';
  }
}