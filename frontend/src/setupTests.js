// frontend/src/setupTests.js
import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Додаємо matchers (toBeInTheDocument тощо) до Vitest
expect.extend(matchers);

// Очищуємо DOM після кожного тесту
afterEach(() => {
  cleanup();
});