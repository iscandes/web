import 'package:flutter/foundation.dart';
import '../../../../core/network/api_client.dart';
import '../../../../core/models/web_models.dart';

class ProjectsProvider extends ChangeNotifier {
  final _api = ApiClient();

  bool _loading = false;
  String? _error;
  List<ProjectModel> _projects = [];

  bool get loading => _loading;
  String? get error => _error;
  List<ProjectModel> get projects => _projects;

  Future<void> fetchProjects() async {
    _loading = true;
    _error = null;
    notifyListeners();
    try {
      final res = await _api.get('/api/projects');
      final data = res.data as List<dynamic>;
      _projects = data.map((e) => ProjectModel.fromJson(e as Map<String, dynamic>)).toList();
    } catch (e) {
      _error = e.toString();
    } finally {
      _loading = false;
      notifyListeners();
    }
  }
}