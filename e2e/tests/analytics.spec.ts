import { test, expect } from '../fixtures/testFixtures';

test.describe('DevOps Playground E2E Tests', () => {

  test('should display the main application header and components', async ({ playgroundPage }) => {
    await expect(playgroundPage.headerTitle).toHaveText('DevOps Playground');
    await expect(playgroundPage.textInput).toBeVisible();
    await expect(playgroundPage.analyzeButton).toBeDisabled(); // Should be disabled initially
  });

  test('should analyze short text and return expected metrics', async ({ playgroundPage }) => {
    const testText = 'Hello DevOps!';
    await playgroundPage.analyzeText(testText);

    // Verify analysis report is rendered
    await expect(playgroundPage.resultContainer).toBeVisible();

    // Verify correct counts
    await expect(playgroundPage.charCount).toHaveText('13'); // Length of 'Hello DevOps!' is 13
    await expect(playgroundPage.wordCount).toHaveText('2');   // 2 words
    await expect(playgroundPage.longContentBadge).toHaveText('NO');
  });

  test('should analyze long text and flag it as long content', async ({ playgroundPage }) => {
    const testText = 'This is a significantly longer text designed to exceed the fifty character threshold for evaluation.';
    await playgroundPage.analyzeText(testText);

    // Verify analysis report is rendered and categorizes as long content
    await expect(playgroundPage.resultContainer).toBeVisible();
    await expect(playgroundPage.longContentBadge).toHaveText('YES');
  });

  test('should trigger and handle frontend Sentry error simulation', async ({ playgroundPage }) => {
    await playgroundPage.clickBreakFrontend();
    
    // Verify frontend status message is visible and displays successfully
    await expect(playgroundPage.frontendStatusBox).toBeVisible();
    await expect(playgroundPage.frontendStatusBox).toContainText('Frontend error was sent to Sentry');
  });

  test('should trigger and handle backend Sentry error simulation', async ({ playgroundPage }) => {
    await playgroundPage.clickBreakBackend();

    // Verify backend status box appears and logs a [500] division by zero error code
    await expect(playgroundPage.backendStatusBox).toBeVisible();
    await expect(playgroundPage.backendStatusBox).toContainText('[500]');
  });
});
