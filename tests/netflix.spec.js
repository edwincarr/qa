const { test, expect } = require("@playwright/test");

// run tests in headful mode so you can see the browser
test.use({ headless: true, slowMo: 1000 });

test("my first test", async ({ page }) => {
  // go to Netflix.com
  await page.goto("https://www.netflix.com");

  // assert page title appears
  await expect(page.locator('[data-uia="hero-title"]')).toHaveText(
    "Unlimited movies, TV shows, and more."
  );
});

// ADD YOUR TESTS HERE!

// Checking if "Sign In" button is able to redirect to login page
test('Sign In button working', async ({ page }) => {
  // Navigate to Homepage
  await page.goto('https://www.netflix.com');

  // Locate and click the "Sign In" button
  await page.locator('[data-uia="header-login-link"]').click();

  // Check URL if sucessful redirect
  await expect(page).toHaveURL(/\/login/);
});

test.describe.parallel('User Auth', () => {
  // Different user test cases
  const users = [
    {test: 'Invalid Email && Password within length parameters', email: 'username', password: 'password'},
    {test: 'Invalid Password Auth', email: 'username@gmail.com', password: 'password'},
    {test: 'Email && Password Under Length Requirement Auth', email: 'q', password: 'q'},
    {
    test: 'Email && Password Over Length Requirement Auth',
    email: 'qqqqqqqqqqqqqqqqqqqqqqqqqq@qqqqqqqqqqqqqqqqqqqqq.qqq',
    password: 'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq'
    },
    {
    test: 'Empty Email && Password',
    email: '',
    password: ''
    },
  ];

  test.beforeEach(async ({ page }) => {
    // Navigate to the login page directly after testing the "Sign In" button Earlier
    await page.goto('https://www.netflix.com/login');
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  // Wanted to Keep my code DRY so i made a helper function to locate and fill the "Sign Up" form
  const fill_form_and_submit = async (page, idx) => {
    // Locate and Enter user data of current index
    await page.locator('[id="id_userLoginId"]').fill(users[idx].email);
    await page.locator('[id="id_password"]').fill(users[idx].password);

    // Locate and Submit User Data
    await page.locator('[type="submit"]').click();
  };

  test("Invalid Email && Password Auth", async ({ page }) => {
    await fill_form_and_submit(page, 0);

    await expect(page.locator('[class="ui-message-contents"]')).toHaveText("Sorry, we can't find an account with this email address. Please try again or create a new account.");
  });

  test("Invalid Password Auth", async({ page }) => {
    fill_form_and_submit(page, 1);

    await expect(page.locator('[class="ui-message-contents"]')).toHaveText("Incorrect password. Please try again or you can reset your password.");
  });

  test("Email && Password Under Length Requirement Auth", async({ page }) => {
    await fill_form_and_submit(page, 2);

    await expect(page.locator('[data-uia="login-field+error"]')).toHaveText('Please enter a valid email.');
    await expect(page.locator('[data-uia="password-field+error"]')).toHaveText('Your password must contain between 4 and 60 characters.');
  });

  test("Email && Password Over Length Requirement Auth", async({ page }) => {
    await fill_form_and_submit(page, 3);

    await expect(page.locator('[data-uia="login-field+error"]')).toHaveText('Please enter a valid email.');
    await expect(page.locator('[data-uia="password-field+error"]')).toHaveText('Your password must contain between 4 and 60 characters.');
  });

  test("Empty Email && Password", async({ page }) => {
    await fill_form_and_submit(page, 4);

    await expect(page.locator('[data-uia="login-field+error"]')).toHaveText('Please enter a valid email or phone number.');
    await expect(page.locator('[data-uia="password-field+error"]')).toHaveText('Your password must contain between 4 and 60 characters.');
  });

});
