import { config } from "../config.js";

export const AddNewProject = () => {
  return `
    <form class='txt_form' action='${config.baseUrl}/projects/new' method='post'>
      <label for='new_project_name'>
        <span>Project name</span>
        <input id='new_project_name' 
          name='newProjectName' 
          type='text'
          placeholder='Enter project name here' 
          autofocus
        >
      </label>
      <input class='lg' type='submit' value='Add New project'>
    </form>
    <a class='cancel_link' href='${config.baseUrl}/projects'>Cancel</a>
  `;
};
