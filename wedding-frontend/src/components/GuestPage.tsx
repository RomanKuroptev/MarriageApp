import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MarriageApiService } from '../apiClient/services/MarriageApiService'; // replace './MarriageApiService' with the correct path to the MarriageApiService module
import { Guest } from '../apiClient';
import 'bootstrap/dist/css/bootstrap.min.css';
import './GuestPage.css';

function GuestPage() {
  const { rsvpCode } = useParams();
const [guest, setGuest] = useState<Guest | undefined>(undefined);

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
        <form className="mb-3">
          <div>
            <label>
              <input type="radio" value="yes" name="attendance" /> Ja, jag kan delta
            </label>
            <label>
              <input type="radio" value="no" name="attendance" /> Nej, jag kan inte delta
            </label>
          </div>
          <div>
            <label>
              Matpreferens:
              <select name="foodPreference">
                <option value="noPreference">Ingen preferens</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                {/* Add more options as needed */}
              </select>
            </label>
          </div>
          <button type="submit" className="btn btn-primary button-style">Skicka</button>
        </form>
      </div>
    </div>
  </div>
);
}

export default GuestPage;