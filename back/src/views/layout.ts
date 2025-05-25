import type { Props } from "../types/types.js";
import { config } from "../config.js";

export const layout = (
  { title, isAuthenticated, username }: Props,
  children: string = "",
) => `
<!DOCTYPE html>
<html lang='en'>
<head>
  <title>${title}</title>
  <meta charset='utf-8'>
  <link rel='stylesheet' href="${config.baseUrl}/stylesheets/css-reset.css">
  <link rel='stylesheet' href="${config.baseUrl}/stylesheets/app.css">
  <link rel='icon' href="${config.baseUrl}/favicon-16x16.png" type='image/png'>
</head>

<body>
  <header>
      <h1>Timesheets</h1>
    <aside>
    </aside>
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
