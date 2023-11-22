// LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MarriageApiService } from '../apiClient/services/MarriageApiService'; // replace './MarriageApiService' with the correct path to the MarriageApiService module

function LoginPage() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Replace this with your actual login logic
    const guest = await MarriageApiService.getGuestsEmail(email);
    navigate(`/guest/${guest.rsvpCode}`);
    
  };

  return (
    <div className="container-fluid guest-page my-font">
      <div className="card mb-3">
      <h1 className="text-center my-4 title-font">Välkommen!</h1>
      <p>Ange din e-postadress nedan:</p>
        <form onSubmit={handleSubmit}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
          <button type="submit">Log in</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;