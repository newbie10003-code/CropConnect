import React, { useState } from 'react';

const Crop = () => {
  const [inputs, setInputs] = useState({
    nitrogen: 0,
    phosphorus: 5,
    potassium: 5,
    temperature: 8.82,
    humidity: 14.25,
    ph: 3.5,
    rainfall: 20.21,
  });
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState('');
  const [error, setError] = useState('');

  // Limits as per your message:
  const limits = {
    nitrogen: { min: 0, max: 140 },
    phosphorus: { min: 5, max: 145 },
    potassium: { min: 5, max: 205 },
    temperature: { min: 8.82, max: 43.67 },
    humidity: { min: 14.25, max: 99.98 },
    ph: { min: 3.5, max: 9.93 },
    rainfall: { min: 20.21, max: 298.56 },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check all inputs have values within range
    for (const key in limits) {
      if (
        inputs[key] === '' ||
        inputs[key] < limits[key].min ||
        inputs[key] > limits[key].max
      ) {
        setError(`Please enter a valid value for ${key.toUpperCase()} between ${limits[key].min} and ${limits[key].max}`);
        return;
      }
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/crop-recommendation', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'An error occurred during prediction.');
        return;
      }

      const result = await response.json();
      setRecommendation(result.recommendation);
    } catch (err) {
      setError('Failed to connect to the prediction server.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="cropRec"
      style={{ paddingTop: '12rem', maxWidth: '600px', margin: 'auto', paddingLeft: '1rem', paddingRight: '1rem' }}
    >
      <form onSubmit={handleSubmit} className="crop-form" style={{ textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Crop Recommendation System</h2>

        {Object.entries(limits).map(([key, { min, max }]) => (
          <div key={key} className="input-group" style={{ marginBottom: '1.2rem', textAlign: 'left' }}>
            <label htmlFor={key} style={{ display: 'block', fontWeight: '600', marginBottom: '0.3rem', textTransform: 'capitalize' }}>
              {key} ({key === 'ph' ? '' : key === 'humidity' ? '%' : ''})
            </label>
            <input
              type="range"
              id={key}
              name={key}
              min={min}
              max={max}
              step={key === 'ph' || key === 'temperature' || key === 'humidity' || key === 'rainfall' ? '0.01' : '1'}
              value={inputs[key]}
              onChange={handleChange}
              style={{ width: '100%' }}
            />
            <div style={{ textAlign: 'right', fontWeight: '600' }}>{inputs[key]}</div>
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="submit-btn"
          style={{
            padding: '0.7rem 2rem',
            fontSize: '1rem',
            fontWeight: '700',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Predicting...' : 'Submit'}
        </button>
      </form>

      {error && (
        <p style={{ color: 'red', textAlign: 'center', marginTop: '1rem', fontWeight: '600' }}>{error}</p>
      )}

      {recommendation && !error && (
        <div
          className="result"
          style={{
            marginTop: '2rem',
            marginBottom: '2rem',
            padding: '1rem',
            border: '1px solid #ddd',
            borderRadius: '6px',
            backgroundColor: '#f9f9f9',
            textAlign: 'center',
          }}
        >
          <h3>Recommended Crop: {recommendation}</h3>
        </div>
      )}
    </div>
  );
};

export default Crop;
