import React from "react";
import client from "@/tina/__generated__/client";
import Layout from "@/components/layout/layout";
import ProjectClientPage from "./client-page";

export default async function ProjectsPage({
  params,
}: {
  params: { filename: string[] };
}) {
  const data = await client.queries.project({
    relativePath: `${params.filename.join("/")}.mdx`,
  });

  return (
    <Layout rawPageData={data}>
      <ProjectClientPage {...data} />
    </Layout>
  );
}

export async function generateStaticParams() {
  let projects = await client.queries.projectConnection();
  const allProjects = projects;

  while (projects.data?.projectConnection.pageInfo.hasNextPage) {
    projects = await client.queries.projectConnection({
      after: projects.data.projectConnection.pageInfo.endCursor,
    });
    allProjects.data.projectConnection.edges.push(...projects.data.projectConnection.edges);
  }

  const params =
    allProjects.data?.projectConnection.edges.map((edge) => ({
      filename: edge.node._sys.breadcrumbs,
    })) || [];

  return params;
}
