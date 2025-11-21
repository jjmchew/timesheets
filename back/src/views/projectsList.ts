import type { ProjectInfo } from "../types/types.js";
import { dbActions } from "../models/dbActions.js";
import { config } from "../config.js";

/*
 * Buttons
 */
interface ButtonProps {
  project_id: number;
}
const StopButton = ({ project_id }: ButtonProps) => `
  <form action="${config.baseUrl}/projects/${project_id.toString()}/stop" method='post'>
    <input class='stop' type='submit' value='Stop Timer'>
  </form>
`;

const StartButton = ({ project_id }: ButtonProps) => `
  <form action="${config.baseUrl}/projects/${project_id.toString()}/start" method='post'>
    <input class='start' type='submit' value='Start Timer'>
  </form>
`;

/*
 * Individual Cards
 */
interface ProjectCardProps {
  project_name: string;
  project_id: number;
  hasNullTimer: boolean;
}

const ProjectCard = async ({
  project_name,
  project_id,
  hasNullTimer,
}: ProjectCardProps) => `
  <li>
    <div class='project_name'>
      ${project_name}
    </div>
    <div>
      ${hasNullTimer ? StopButton({ project_id }) : StartButton({ project_id })}
    </div>
    <div>
      <a class='sm' href="${config.baseUrl}/tally/${project_id}">Tally</a>
      <form action="${config.baseUrl}/projects/${project_id}/hide" method='post'>
        <input class='sm' type='submit' value='Hide'>
      </form>
    </div>
  </li>
`;

const renderCards = async (projects: ProjectInfo[]) => {
  let out = "";
  for (const project of projects) {
    const hasNullTimer = await dbActions.hasNullTimer({
      projectName: project.project_name,
    });
    out += await ProjectCard({
      project_name: project.project_name,
      project_id: project.id,
      hasNullTimer,
    });
  }
  return out;
};

/*
 * Primary list of projects
 */
interface ProjectsListProps {
  projects: ProjectInfo[];
}

export const ProjectsList = async ({ projects }: ProjectsListProps) => `
<ul>
  ${projects ? await renderCards(projects) : ""}
</ul>

`;
