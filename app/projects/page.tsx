import Layout from "@/components/layout/layout";
import client from "@/tina/__generated__/client";
import ProjectsClientPage from "./client-page";

export default async function ProjectsPage() {
  let projects = await client.queries.projectConnection({
    sort: "date",
  });
  const allProjects = projects;

  while (projects.data?.projectConnection.pageInfo.hasNextPage) {
    projects = await client.queries.projectConnection({
      sort: "date",
      after: projects.data.projectConnection.pageInfo.endCursor,
    });
    allProjects.data.projectConnection.edges.push(...projects.data.projectConnection.edges);
  }

  allProjects.data.projectConnection.edges.reverse();

  return (
    <Layout rawPageData={allProjects.data}>
      <ProjectsClientPage {...allProjects} />
    </Layout>
  );
}
