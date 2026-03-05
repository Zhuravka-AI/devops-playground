import React from 'react';

const SentryTest = () => {
  const handleFrontendError = () => {
    throw new Error('Frontend Test Error: Sentry is working!');
  };

  const handleBackendError = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/debug-sentry`);
      if (!response.ok) {
        console.log("Backend error triggered");
      }
    } catch (error) {
      console.error("Error calling backend:", error);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h3>Sentry Debug Panel</h3>
      <button onClick={handleFrontendError} style={{ marginRight: '10px', backgroundColor: '#f44336', color: 'white' }}>
        Break Frontend
      </button>
      <button onClick={handleBackendError} style={{ backgroundColor: '#ff9800', color: 'white' }}>
        Break Backend
      </button>
    </div>
  );
};

export default SentryTest;