import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/constants/app_constants.dart';
import 'package:provider/provider.dart';
import '../../../../core/models/web_models.dart';
import '../providers/projects_provider.dart';

class ProjectsPage extends StatefulWidget {
  const ProjectsPage({super.key});

  @override
  State<ProjectsPage> createState() => _ProjectsPageState();
}

class _ProjectsPageState extends State<ProjectsPage> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() => context.read<ProjectsProvider>().fetchProjects());
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<ProjectsProvider>();
    return Scaffold(
      appBar: AppBar(title: const Text('Projects')),
      body: switch ((provider.loading, provider.error, provider.projects.isEmpty)) {
        (true, _, _) => const Center(child: CircularProgressIndicator()),
        (false, String err, _) when err.isNotEmpty => Center(child: Text('Error: ${provider.error}')),
        (false, _, true) => const Center(child: Text('No projects found')),
        _ => ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: provider.projects.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, i) {
                final p = provider.projects[i];
                return _ProjectTile(project: p);
              },
            )
      },
    );
  }
}

class _ProjectTile extends StatelessWidget {
  final ProjectModel project;
  const _ProjectTile({required this.project});

  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      child: ListTile(
        leading: SizedBox(
          width: 72,
          child: Image.network(project.image, fit: BoxFit.cover, errorBuilder: (_, __, ___) => const Icon(Icons.image_not_supported)),
        ),
        title: Text(project.name),
        subtitle: Text('${project.location} • ${project.status}'),
        trailing: Text('\$${project.price}'),
      ),
    );
  }
}