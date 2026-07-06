import { test as base } from '@playwright/test';
import { PlaygroundPage } from '../pages/PlaygroundPage';

// Declare the types of custom fixtures.
type MyFixtures = {
  playgroundPage: PlaygroundPage;
};

// Extend base test with our custom fixture.
export const test = base.extend<MyFixtures>({
  playgroundPage: async ({ page }, use) => {
    const playgroundPage = new PlaygroundPage(page);
    await playgroundPage.goto();
    // Pass the initialized POM instance to the test execution.
    await use(playgroundPage);
  },
});

export { expect } from '@playwright/test';
