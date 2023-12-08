// LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MarriageApiService } from '../apiClient/services/MarriageApiService'; // replace './MarriageApiService' with the correct path to the MarriageApiService module
import { OpenAPI } from '../apiClient'; // replace './apiClient' with the correct path to the OpenAPI module

function LoginPage() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [loginFailed, setLoginFailed] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    setLoginFailed(false);
    event.preventDefault();
    console.log('REACT_APP_BASE_URL:', process.env.REACT_APP_BASE_URL);
    console.log('Base:', OpenAPI.BASE);
    try {
      // Send a request to the login endpoint
      const response = await MarriageApiService.postLogin({ email });

      // Parse the JWT from the response
      const { token } = response;

      if (!token) {
        throw new Error('Login failed');
      }

      // Store the JWT in local storage
      localStorage.setItem('token', token);
  
      // Use the JWT for subsequent requests
      // For example, you can set it in the headers of the OpenAPI object
      OpenAPI.HEADERS = { 
        ...OpenAPI.HEADERS, 
        'Authorization': `Bearer ${token}` 
      };
      const guest = await MarriageApiService.getGuestsEmail(email);
      localStorage.setItem('guest', JSON.stringify(guest));
      navigate(`/info`);
    } catch (error) {
      console.error('Login failed:', error);
      setLoginFailed(true);
    }
  };

  return (
    <div className="container-fluid guest-page my-font">
      <div className="card mb-3">
      <h1 className="text-center my-4 title-font">Välkommen!</h1>
      <p>Ange din e-postadress nedan:</p>
      {loginFailed && <p>Login failed. Please try again.</p>}
        <form onSubmit={handleSubmit}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
          <button type="submit">Log in</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;