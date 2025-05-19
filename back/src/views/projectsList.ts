import type { Props, ProjectInfo } from "../types/types.js";
import { dbActions } from "../models/actions.js";

const stopButton = ({ project_id }: Props) => `
  <form action="/projects/${project_id}/stop" method='post'>
    <input class='stop' type='submit' value='Stop Timer'>
  </form>
`;

const startButton = ({ project_id }: Props) => `
  <form action="/projects/${project_id}/start" method='post'>
    <input class='start' type='submit' value='Start Timer'>
  </form>
`;

const projectCard = async ({
  project_name,
  project_id,
  hasNullTimer,
}: Props) => `
  <li>
    <div class='project_name'>
      ${project_name}
    </div>
    <div>
      ${hasNullTimer ? stopButton({ project_id }) : startButton({ project_id })}
    </div>
    <div>
      <a class='sm' href="/tally/${project_id}">Tally</a>
      <a class='sm' href="/projects/${project_id}/csv">CSV</a>
      <form action="/projects/${project_id}/hide" method='post'>
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
    out += await projectCard({
      project_name: project.project_name,
      project_id: project.id,
      hasNullTimer,
    });
  }
  return out;
};

export const projectsList = async ({ projects }: Props) => `
<ul>
  ${projects ? await renderCards(projects) : ""}
</ul>

`;
