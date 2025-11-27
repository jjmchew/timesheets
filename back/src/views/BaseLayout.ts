import { config } from "../config.js";

interface BaseLayoutProps {
  title: string;
  isAuthenticated?: boolean;
  username?: string;
}

export const BaseLayout = (
  { title, isAuthenticated = false, username }: BaseLayoutProps,
  children: string = "",
) => `
<!DOCTYPE html>
<html lang='en'>
<head>
  <title>${title}</title>
  <meta charset='utf-8'>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel='stylesheet' href="${config.baseUrl}/stylesheets/css-reset.css">
  <link rel='stylesheet' href="${config.baseUrl}/stylesheets/app.css">
  <link rel='icon' href="${config.baseUrl}/favicon-16x16.png" type='image/png'>
</head>

<body>
  <header>
      <h1 class='hideForMobile'>Timesheets</h1>
      <nav>
        ${
          isAuthenticated
            ? `
              <form action="${config.baseUrl}/projects/new" method='get'>
                <input class='sm' type='submit' value='Add Project'>
              </form>
            `
            : ""
        }
      </nav>
      <div>
        ${
          isAuthenticated
            ? `
              <span class="sm">${username}</span>
              <form action="${config.baseUrl}/user/logout" method='post'>
                <input class='lg' type='submit' value='Logout'>
              </form>
            `
            : `<a class='lg attn' href="${config.baseUrl}/user/login">Login</a>`
        }
      </div>
  </header>

  <main>
    ${children}
  </main>
</body>
</html>
`;
