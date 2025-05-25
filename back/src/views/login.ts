import { config } from "../config.js";

export const login = () => `
<form class='txt_form' action="${config.baseUrl}/user/login" method='post'>
  <label for='username'>
    <span>Username</span>
    <input type='text' id='username' name='username' autofocus>
  </label>
  <label for='pw'>
    <span>Password</span>
    <input type='password' id='pw' name='pw'>
  </label>
  <input class='lg' type='submit' value='Login'>
</form>

<section class='new_account'>
  <h3>Don't have an account?</h3>
  <a href="${config.baseUrl}/users/new">Create new account</a>
</section>
`;
