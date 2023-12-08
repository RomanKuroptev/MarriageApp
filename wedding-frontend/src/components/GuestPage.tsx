import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MarriageApiService } from '../apiClient/services/MarriageApiService'; // replace './MarriageApiService' with the correct path to the MarriageApiService module
import { Guest } from '../apiClient';
import { UpdateGuestDto } from '../apiClient';
import 'bootstrap/dist/css/bootstrap.min.css';
import './GuestPage.css';
import { useNavigate } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import { OpenAPI } from '../apiClient'; // replace './apiClient' with the correct path to the OpenAPI module

function GuestPage() {
  const location = useLocation();
  const { rsvpCode } = useParams();
  const [guest, setGuest] = useState<Guest | undefined>(undefined);
  const [attendance, setAttendance] = useState('');
  const [allergy1, setAllergy1] = useState('');
  const [allergy2, setAllergy2] = useState('');
  const [foodPreference1, setFoodPreference1] = useState('');
  const [foodPreference2, setFoodPreference2] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const saveData = (data: Guest | undefined) => {
    localStorage.setItem('guest', JSON.stringify(data));
  };
  const ATTENDANCE_VALUES = [
    { value: '', text: 'Välj deltagande' },
    { value: 'noAttend', text: 'Kan inte delta' },
    { value: 'oneGuest', text: '1 gäst' },
    { value: 'twoGuests', text: '2 gäster' },
    // Add more values as needed...
  ];

  if (token) {
    OpenAPI.HEADERS = {
      ...OpenAPI.HEADERS,
      'Authorization': `Bearer ${token}`
    };
  }

  useEffect(() => {
    const fetchGuest = async () => {
      try {
        if (rsvpCode) {
          const fetchedGuest = await MarriageApiService.getGuestsRsvp(rsvpCode);
          saveData(fetchedGuest);
          console.log(fetchedGuest);
          setGuest(fetchedGuest);
          setIsSubmitted(false); // Reset the isSubmitted state
          if (fetchedGuest.isAttending1 !== null && fetchedGuest.isAttending1 !== undefined) {
            setAttendance(fetchedGuest.isAttending1 ? 'oneGuest' : 'noAttend');
          }
          setFoodPreference1(fetchedGuest.foodPreference1 || '');
          setFoodPreference2(fetchedGuest.foodPreference2 || '');
          setAllergy1(fetchedGuest.allergy1 || '');
          setAllergy2(fetchedGuest.allergy2 || '');
        }
      } catch (error) {
        console.error('Failed to fetch guest');
      }
    };


    fetchGuest();
  }, [rsvpCode]);

  useEffect(() => {
    if (attendance === 'oneGuest') {
      setFoodPreference2('');
      setAllergy2('');
    }
  }, [attendance]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (guest) {
      if (guest.id === undefined) {
        console.error('Guest ID is undefined');
        return;
      }

      // In your handleSubmit function, set isAttending1 and isAttending2 based on the selected value
      let isAttending1 = false;
      let isAttending2 = false;

      if (attendance === 'oneGuest' || attendance === 'twoGuests') {
        isAttending1 = true;
      }

      if (attendance === 'twoGuests') {
        isAttending2 = true;
      }
      const updatedGuest: UpdateGuestDto = {
        id: guest.id,
        name: guest.name ?? '',
        email: guest.email ?? '',
        isAttending1: isAttending1,
        isAttending2: isAttending2,
        allergy1: allergy1,
        allergy2: allergy2,
        rsvpCode: guest.rsvpCode ?? '',
        foodPreference1: foodPreference1,
        foodPreference2: foodPreference2,
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

  // Map the value of attendance to a human-readable string
  let attendanceDisplay = '';
  switch (attendance) {
    case 'noAttend':
      attendanceDisplay = "kan inte delta";
      break;
    case 'oneGuest':
      attendanceDisplay = '1 gäst';
      break;
    case 'twoGuests':
      attendanceDisplay = '2 gäster';
      break;
  }

  return (
    <div className="container-fluid guest-page my-font">
      <nav className="nav">
        <ul>
          <li><Link className={`nav-link ${location.pathname.startsWith('/guest') ? 'active' : ''}`} to="/guest">OSA</Link></li>
          <li><Link className={`nav-link ${location.pathname.startsWith('/info') ? 'active' : ''}`} to="/info">Information</Link></li>
        </ul>
      </nav>

      <div className="card mb-3">
        <div className="card-body">
          <h1 className="text-center my-4 title-font">Välkommen, {guest.name}!</h1>
          <h5 className="card-title">Hej</h5>
          <p className="card-text">Du är hjärtligt inbjuden till vårt bröllop i Montalcino, den 13-16 september 2024.</p>


          <h2>OSA</h2>
          {!isSubmitted ? (
            <form className="mb-3" onSubmit={handleSubmit}>
              <fieldset>
                <div>
                  <label>
                    Deltagande:
                    <select name="attendance" value={attendance} onChange={e => setAttendance(e.target.value)}>
                      {ATTENDANCE_VALUES.map(({ value, text }) => (
                        <option key={value} value={value}>{text}</option>
                      ))}
                    </select>
                  </label>
                </div>

                {attendance === 'oneGuest' && (
                  <div>
                    <label>
                      Matpreferens:
                      <select name="foodPreference" value={foodPreference1} onChange={e => setFoodPreference1(e.target.value)}>
                        <option value="">Ingen preferens</option>
                        <option value="vegetarian">Vegetarian</option>
                        <option value="vegan">Vegan</option>
                      </select>
                    </label>
                    <label>
                      Allergi:
                      <input
                        type="text"
                        name="allergy1"
                        value={allergy1}
                        onChange={event => setAllergy1(event.target.value)}
                      />
                    </label>
                  </div>
                )}
                {attendance === 'twoGuests' && (
                  <div>
                    <label>
                      Matpreferens för gäst 1:
                      <select name="foodPreference" value={foodPreference1} onChange={e => setFoodPreference1(e.target.value)}>
                        <option value="">Ingen preferens</option>
                        <option value="vegetarian">Vegetarian</option>
                        <option value="vegan">Vegan</option>
                      </select>
                    </label>
                    <label>
                      Allergi för gäst 1:
                      <input
                        type="text"
                        name="allergy1"
                        value={allergy1}
                        onChange={event => setAllergy1(event.target.value)}
                      />
                    </label>
                    <label>
                      Matpreferens för gäst 2:
                      <select name="foodPreference" value={foodPreference2} onChange={e => setFoodPreference2(e.target.value)}>
                        <option value="">Ingen preferens</option>
                        <option value="vegetarian">Vegetarian</option>
                        <option value="vegan">Vegan</option>
                      </select>
                    </label>
                    <label>
                      Allergi för gäst 2:
                      <input
                        type="text"
                        name="allergy2"
                        value={allergy2}
                        onChange={event => setAllergy2(event.target.value)}
                      />
                    </label>
                  </div>
                )}
              </fieldset>
              <button type="submit" className="btn btn-primary button-style">Skicka</button>
            </form>
          ) : (
            <>
              <p>
                Tack för ditt svar! Du har valt {ATTENDANCE_VALUES.find(item => item.value === attendance)?.text} för deltagande.
                Din matpreferens är {foodPreference1}.
                {allergy1 && ` Din allergi är ${allergy1}.`}
                {attendance === 'twoGuests' && foodPreference2 && ` Gäst 2's matpreferens är ${foodPreference2}.`}
                {attendance === 'twoGuests' && allergy2 && ` Gäst 2's allergi är ${allergy2}.`}
              </p>
              <button onClick={() => setIsSubmitted(false)}>Ändra ditt svar</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default GuestPage;