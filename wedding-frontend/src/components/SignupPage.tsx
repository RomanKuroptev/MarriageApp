// SignupPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Guest } from '../apiClient';
import { UpdateGuestDto } from '../apiClient';
import { MarriageApiService } from '../apiClient/services/MarriageApiService'; // replace './MarriageApiService' with the correct path to the MarriageApiService module
import './GuestPage.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';

function SignupPage() {
  const { rsvpCode } = useParams();
  const [guest, setGuest] = useState<Guest | undefined>(undefined);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const fetchGuest = async () => {
      try {
        if (rsvpCode) {
          const fetchedGuest = await MarriageApiService.getGuestsRsvp(rsvpCode);
          setGuest(fetchedGuest);
        }
      } catch (error) {
        console.error('Failed to fetch guest');
      }
    };

    fetchGuest();
  }, [rsvpCode]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (guest) {
      if (guest.id === undefined) {
        console.error('Guest ID is undefined');
        return;
      }

      const updatedGuest: UpdateGuestDto = { 
        id: guest.id,
        name: guest.name ?? '',
        email: email,
        isAttending1: guest.isAttending1 || false,
        rsvpCode: guest.rsvpCode ?? '',
        foodPreference1: guest.foodPreference1 ?? '',
      };

      try {
        const response = await MarriageApiService.putGuests(updatedGuest.id ?? 0, updatedGuest);
        navigate(`/`);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="container-fluid guest-page my-font">
      <div className="card mb-3">
        <h1 className="text-center my-4 title-font">Välkommen, {guest?.name}!</h1>
        <p>Ange en e-postadress som kommer att användas för inloggning senare och för att få e-postuppdateringar om bröllopet.</p>
        <form onSubmit={handleSubmit}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
          <button type="submit">Sign up</button>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;