import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  getTagConfig,
  getProjectsByTag,
  TAG_CONFIGS,
} from "../data/projects";
import { PageHeader } from "../components/PageHeader";
import { TagNav } from "../components/TagNav";
import { ProjectGallery } from "../components/ProjectGallery";
import { Header } from "../views/Header";
import { Footer } from "../views/Footer";

interface TagPageProps {
  params: Promise<{
    tag: string;
  }>;
}

export function generateStaticParams() {
  const params: { tag: string }[] = [];
  for (const config of Object.values(TAG_CONFIGS)) {
    params.push({ tag: config.slug });
    if (config.slug !== config.tag) {
      params.push({ tag: config.tag });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const config = getTagConfig(tag);
  if (!config) {
    return {
      title: "Not Found / James Bradford",
    };
  }

  return {
    title: `${config.title} / James Bradford`,
    description: config.blurb,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const config = getTagConfig(tag);

  if (!config) {
    notFound();
  }

  const projects = getProjectsByTag(config.tag);

  return (
    <>
      <Header />
      <main>
        <article>
          <TagNav activeTag={config.tag} />
          <PageHeader
            header={config.title}
            subHeader={config.subHeader}
            description={config.blurb}
          />
          <ProjectGallery projects={projects} />
        </article>
      </main>
      <Header style={{ borderBottom: "var(--border-1)" }} />
      <Footer />
    </>
  );
}
