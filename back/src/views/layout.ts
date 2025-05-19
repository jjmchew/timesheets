import type { Props } from "../types/types.js";

export const layout = (
  { title, isAuthenticated }: Props,
  children: string = "",
) => `
<!DOCTYPE html>
<html lang='en'>
<head>
  <title>${title}</title>
  <meta charset='utf-8'>
  <link rel='stylesheet' href="/stylesheets/css-reset.css">
  <link rel='stylesheet' href="/stylesheets/app.css">
  <link rel='icon' href="favicon-16x16.png" type='image/png'>
</head>

<body>
  <header>
      <h1>Timesheets</h1>
    <aside>
      <div>aside</div>
    </aside>
      <div>
        <span class="sm">why?</span>
        ${
          isAuthenticated
            ? `
              <form action="user/logout" method='post'>
                <input class='lg' type='submit' value='Logout'>
              </form>
            `
            : ""
        }
      </div>
      <a class='lg attn' href="<%= BASE_URL %>/login">Login</a>
  </header>

  <main>
    ${children}
  </main>
</body>
</html>
`;
