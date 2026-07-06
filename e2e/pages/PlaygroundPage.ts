import { Page, Locator } from '@playwright/test';

export class PlaygroundPage {
  readonly page: Page;
  readonly headerTitle: Locator;
  readonly textInput: Locator;
  readonly analyzeButton: Locator;
  readonly resultContainer: Locator;
  readonly charCount: Locator;
  readonly wordCount: Locator;
  readonly longContentBadge: Locator;

  // Sentry Elements
  readonly breakFrontendButton: Locator;
  readonly frontendStatusBox: Locator;
  readonly breakBackendButton: Locator;
  readonly backendStatusBox: Locator;

  constructor(page: Page) {
    this.page = page;
    this.headerTitle = page.locator('h1.title-gradient');
    this.textInput = page.locator('#text-analyzer-input');
    this.analyzeButton = page.locator('#btn-analyze');
    this.resultContainer = page.locator('.result-container');
    
    // Within result grid, we look for labels and their adjacent values
    this.charCount = page.locator('.result-item:has-text("Characters") .value');
    this.wordCount = page.locator('.result-item:has-text("Words") .value');
    this.longContentBadge = page.locator('.result-item:has-text("Long Content") .status-badge');

    // Sentry Debug Panel Buttons
    this.breakFrontendButton = page.locator('button:has-text("Break Frontend")');
    this.frontendStatusBox = page.locator('.sentry-action-card:has-text("Break Frontend") .status-box');
    
    this.breakBackendButton = page.locator('button:has-text("Break Backend")');
    this.backendStatusBox = page.locator('.sentry-action-card:has-text("Break Backend") .status-box');
  }

  /**
   * Navigates to the home/root page of the application.
   */
  async goto() {
    await this.page.goto('/');
  }

  /**
   * Types text into the analyzer input box.
   */
  async enterText(text: string) {
    await this.textInput.fill(text);
  }

  /**
   * Clicks the Analyze button.
   */
  async clickAnalyze() {
    await this.analyzeButton.click();
  }

  /**
   * Performs the end-to-end flow of entering text and initiating analysis.
   */
  async analyzeText(text: string) {
    await this.enterText(text);
    await this.clickAnalyze();
  }

  /**
   * Triggers client-side Sentry error simulation.
   */
  async clickBreakFrontend() {
    await this.breakFrontendButton.click();
  }

  /**
   * Triggers server-side Sentry error endpoint.
   */
  async clickBreakBackend() {
    await this.breakBackendButton.click();
  }
}
