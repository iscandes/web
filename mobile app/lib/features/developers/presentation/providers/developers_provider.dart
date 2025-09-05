import 'package:flutter/foundation.dart';
import '../../../../core/network/api_client.dart';
import '../../../../core/models/web_models.dart';

class DevelopersProvider extends ChangeNotifier {
  final _api = ApiClient();

  bool _loading = false;
  String? _error;
  List<DeveloperModel> _developers = [];

  bool get isLoading => _loading;
  String? get error => _error;
  List<DeveloperModel> get developers => _developers;

  Future<void> fetchDevelopers() async {
    _loading = true;
    _error = null;
    notifyListeners();
    try {
      final res = await _api.get('/api/developers');
      final data = res.data as List<dynamic>;
      _developers = data.map((e) => DeveloperModel.fromJson(e as Map<String, dynamic>)).toList();
    } catch (e) {
      _error = e.toString();
    } finally {
      _loading = false;
      notifyListeners();
    }
  }
}