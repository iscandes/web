import { Metadata } from 'next';
import CinematicProjectPage from '@/components/CinematicProjectPage';
import { MySQLDatabase } from '@/lib/mysql-database';

interface ProjectPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  try {
    const projects = await MySQLDatabase.getProjects();
    // Filter out records that don\'t have a valid slug to prevent `/projects` export mismatch
    return projects
      .map((project) => project.slug)
      .filter((slug): slug is string => typeof slug === "string" && slug.trim().length > 0)
      .map((slug) => ({ slug }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  try {
    const { slug } = params;
    const project = await MySQLDatabase.getProjectBySlug(slug);

    if (!project) {
      return {
        title: "Project Not Found",
        description: "The requested project could not be found.",
      };
    }

    return {
      title: `${project.name} - Premium Choice Real Estate`,
      description: project.description,
      openGraph: {
        title: project.name,
        description: project.description,
        images: [project.image],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: project.name,
        description: project.description,
        images: [project.image],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Premium Choice Real Estate",
      description: "Luxury real estate projects in Dubai",
    };
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = params;

  return <CinematicProjectPage projectSlug={slug} />;
}