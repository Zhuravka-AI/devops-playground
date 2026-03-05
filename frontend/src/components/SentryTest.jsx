import React, { useState } from 'react';
import * as Sentry from '@sentry/react';

const SentryTest = () => {
  const [frontendResult, setFrontendResult] = useState(null);
  const [backendResult, setBackendResult] = useState(null);

  const handleFrontendError = () => {
    setFrontendResult(null);
    try {
      throw new Error('Frontend Test Error: Sentry is working!');
    } catch (error) {
      Sentry.captureException(error);
      setFrontendResult({ type: 'reported', message: 'Frontend error was sent to Sentry.' });
    }
  };

  const handleBackendError = async () => {
    setBackendResult(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/debug-sentry`);
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setBackendResult({ type: 'success', message: data.message || 'Backend responded OK.', status: response.status });
      } else {
        setBackendResult({ type: 'error', message: data.detail || `Backend returned ${response.status}`, status: response.status });
      }
    } catch (error) {
      setBackendResult({ type: 'error', message: error.message || 'Failed to reach backend.' });
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h3>Sentry Debug Panel</h3>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
          <button
            onClick={handleFrontendError}
            style={{ padding: '8px 16px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Break Frontend
          </button>
          {frontendResult && (
            <div
              style={{
                padding: '8px 12px',
                borderRadius: '4px',
                backgroundColor: frontendResult.type === 'reported' ? '#fff3e0' : '#e8f5e9',
                color: '#333',
                fontSize: '14px',
              }}
              role="status"
            >
              {frontendResult.message}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
          <button
            onClick={handleBackendError}
            style={{ padding: '8px 16px', backgroundColor: '#ff9800', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Break Backend
          </button>
          {backendResult && (
            <div
              style={{
                padding: '8px 12px',
                borderRadius: '4px',
                backgroundColor: backendResult.type === 'success' ? '#e8f5e9' : '#ffebee',
                color: '#333',
                fontSize: '14px',
              }}
              role="status"
            >
              {backendResult.status != null && <strong>[{backendResult.status}] </strong>}
              {backendResult.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SentryTest;
