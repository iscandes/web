import 'package:flutter/foundation.dart';

class ProjectModel {
  final int id;
  final String name;
  final String slug;
  final String location;
  final num price;
  final String image;
  final String developer;
  final String status;
  final String description;

  ProjectModel({
    required this.id,
    required this.name,
    required this.slug,
    required this.location,
    required this.price,
    required this.image,
    required this.developer,
    required this.status,
    required this.description,
  });

  factory ProjectModel.fromJson(Map<String, dynamic> json) {
    return ProjectModel(
      id: json['id'] as int,
      name: json['name'] as String? ?? '',
      slug: json['slug'] as String? ?? '',
      location: json['location'] as String? ?? '',
      price: json['price'] as num? ?? 0,
      image: json['image'] as String? ?? '',
      developer: json['developer'] as String? ?? '',
      status: json['status'] as String? ?? '',
      description: json['description'] as String? ?? '',
    );
  }
}

class DeveloperModel {
  final String name;
  final String slug;
  final String description;

  DeveloperModel({
    required this.name,
    required this.slug,
    required this.description,
  });

  factory DeveloperModel.fromJson(Map<String, dynamic> json) {
    return DeveloperModel(
      name: json['name'] ?? '',
      slug: json['slug'] ?? '',
      description: json['description'] ?? 'No description available',
    );
  }
}