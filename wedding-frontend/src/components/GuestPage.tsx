import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MarriageApiService } from '../apiClient/services/MarriageApiService'; // replace './MarriageApiService' with the correct path to the MarriageApiService module
import { Guest } from '../apiClient';
import { UpdateGuestDto } from '../apiClient';
import 'bootstrap/dist/css/bootstrap.min.css';
import './GuestPage.css';
import { useNavigate } from 'react-router-dom';

function GuestPage() {
  const { rsvpCode } = useParams();
  const [guest, setGuest] = useState<Guest | undefined>(undefined);
  const [attendance, setAttendance] = useState<boolean | null>(null);
  const [foodPreference, setFoodPreference] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const saveData = (data: Guest | undefined) => {
    localStorage.setItem('guest', JSON.stringify(data));
  };

  useEffect(() => {
    const fetchGuest = async () => {
      try {
        if (rsvpCode) {
          const fetchedGuest = await MarriageApiService.getGuestsRsvp(rsvpCode);
          saveData(fetchedGuest);
          console.log(fetchedGuest);
          setGuest(fetchedGuest);
          setIsSubmitted(false); // Reset the isSubmitted state
          if (fetchedGuest.isAttending !== null && fetchedGuest.isAttending !== undefined) {
            setAttendance(fetchedGuest.isAttending);
          }
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
        email: guest.email ?? '',
        isAttending: attendance === true, 
        rsvpCode: guest.rsvpCode ?? '',
        foodPreference 
      };

      try {
        const response = await MarriageApiService.putGuests(updatedGuest.id ?? 0, updatedGuest);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    setIsSubmitted(true);
  };

  if (!guest) {
    return <div className="text-center my-4">Loading...</div>;
  }

  return (
    <div className="container-fluid guest-page my-font">
      <div className="card mb-3">
        <div className="card-body">
          <h1 className="text-center my-4 title-font">Välkommen, {guest.name}!</h1>
          <h5 className="card-title">Hej</h5>
          <p className="card-text">Du är hjärtligt inbjuden till vårt bröllop i Montalcino, den 13-16 september 2024.</p>


          <h2>OSA</h2>
          {!isSubmitted ? (
            <form className="mb-3" onSubmit={handleSubmit}>
              <div>
              <label>
                  <input
                    type="radio"
                    value="true"
                    name="attendance"
                    checked={attendance === true}
                    onChange={() => setAttendance(true)}
                  /> Ja, jag kan delta
                </label>
                <label>
                  <input
                    type="radio"
                    value="false"
                    name="attendance"
                    checked={attendance === false}
                    onChange={() => setAttendance(false)}
                  /> Nej, jag kan inte delta
                </label>
              </div>
              <div>
                <label>
                  Matpreferens:
                  <select name="foodPreference" value={foodPreference} onChange={e => setFoodPreference(e.target.value)}>
                    <option value="">Ingen preferens</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                  </select>
                </label>
              </div>
              <button type="submit" className="btn btn-primary button-style">Skicka</button>
            </form>
          ) : (
            <>
              <p>Tack för ditt svar! Du har valt {attendance} för deltagande och din matpreferens är {foodPreference}.</p>
              <button onClick={() => setIsSubmitted(false)}>Ändra ditt svar</button>
            </>
          )}
          <button className="info-link" onClick={() => navigate('/info')}>Info om bröllopet</button>
        </div>
      </div>
    </div>
  );
}

export default GuestPage;