import type { Props } from "../types/types.js";
import { config } from "../config.js";

export const notFound = ({ path, referer }: Props, _children: string = "") => `
<!DOCTYPE html>
<html lang='en'>
<head>
  <title>Not Found</title>
  <meta charset='utf-8'>
  <link rel='stylesheet' href="${config.baseUrl}/stylesheets/css-reset.css">
  <link rel='stylesheet' href="${config.baseUrl}/stylesheets/app.css">
  <link rel='icon' href="${config.baseUrl}/favicon-16x16.png" type='image/png'>
</head>

<body>
  <header>
      <h1>Timesheets</h1>
  </header>

  <main>
    <div> </div>
    <h2>Sorry - ${path} not found</h2>
    ${referer ? `<a href="${referer}"/>Go back</a>` : ""}
    <div> </div>
  </main>
</body>
</html>
`;
