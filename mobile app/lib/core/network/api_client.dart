import 'package:dio/dio.dart';
import 'api_config.dart';

/// Shared Dio client with interceptors, timeouts, and JSON config
class ApiClient {
  ApiClient._internal() {
    final base = BaseOptions(
      baseUrl: ApiConfig.baseUrl,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      sendTimeout: const Duration(seconds: 30),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    );
    _dio = Dio(base);

    // Basic logging in debug mode
    if (!bool.fromEnvironment('dart.vm.product')) {
      _dio.interceptors.add(LogInterceptor(
        requestHeader: false,
        requestBody: true,
        responseBody: true,
        responseHeader: false,
      ));
    }
  }
  static final ApiClient _instance = ApiClient._internal();
  factory ApiClient() => _instance;

  late final Dio _dio;
  Dio get dio => _dio;

  // Generic GET
  Future<Response<T>> get<T>(String path, {Map<String, dynamic>? query}) {
    return _dio.get(ApiConfig.api(path), queryParameters: query);
  }

  // Generic POST
  Future<Response<T>> post<T>(String path, {Object? data, Map<String, dynamic>? query}) {
    return _dio.post(ApiConfig.api(path), data: data, queryParameters: query);
  }
}