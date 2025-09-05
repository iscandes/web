import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'core/theme/app_theme.dart';
import 'core/constants/app_constants.dart';
import 'features/onboarding/presentation/pages/splash_page.dart';
import 'features/navigation/presentation/pages/main_navigation_page.dart';
import 'features/auth/presentation/providers/auth_provider.dart';
import 'features/property/presentation/providers/property_provider.dart';
import 'features/projects/presentation/providers/projects_provider.dart';
import 'features/developers/presentation/providers/developers_provider.dart';

void main() {
  runApp(const ProfinderApp());
}

class ProfinderApp extends StatelessWidget {
  const ProfinderApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => PropertyProvider()),
        ChangeNotifierProvider(create: (_) => ProjectsProvider()),
        ChangeNotifierProvider(create: (_) => DevelopersProvider()),
      ],
      child: MaterialApp(
        title: AppStrings.appName,
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.darkTheme,
        themeMode: ThemeMode.system,
        debugShowCheckedModeBanner: false,
        home: const SplashPage(),
        routes: {
          '/main': (context) => const MainNavigationPage(),
        },
      ),
    );
  }
}



