import { NextRequest, NextResponse } from 'next/server';
import { MySQLDatabase } from '@/lib/mysql-database';

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const developerName = decodeURIComponent(params.name);
    
    if (!developerName) {
      return NextResponse.json(
        { error: 'Developer name is required' },
        { status: 400 }
      );
    }

    const projects = await MySQLDatabase.getProjectsByDeveloper(developerName);
    
    // Transform the data to match the expected format
    const transformedProjects = projects.map((project: any, index: number) => {
      // Use local images from uploads folder
      let imageUrl = project.image_url || project.image;
      
      // If the image is an external URL or placeholder, use local images
      if (!imageUrl || imageUrl.includes('readdy.ai') || imageUrl.includes('placeholder')) {
        // Use sequential local images
        const imageNumber = (index % 23) + 1; // We have 23 photos in uploads
        imageUrl = `/uploads/photo_${imageNumber}_2025-07-24_19-59-29.jpg`;
      }
      
      return {
        id: project.id,
        name: project.name,
        slug: project.slug,
        location: project.location,
        price: project.price,
        image: imageUrl,
        developer: project.developer,
        status: project.status || 'Ready',
        description: project.description || `Luxury property in ${project.location}`,
        bedrooms: project.bedrooms,
        bathrooms: project.bathrooms,
        area: project.area,
        features: project.features,
        amenities: project.amenities
      };
    });

    return NextResponse.json(transformedProjects);

  } catch (error) {
    console.error('Error fetching projects by developer:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch projects for developer' },
      { status: 500 }
    );
  }
}