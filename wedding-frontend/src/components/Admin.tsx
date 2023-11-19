// Admin.tsx
import React, { useState, useEffect } from 'react';
import { Guest } from '../apiClient/models/Guest'; // replace './Guest' with the correct path to the Guest module
import { MarriageApiService } from '../apiClient/services/MarriageApiService'; // replace './MarriageApiService' with the correct path to the MarriageApiService module
import 'bootstrap/dist/css/bootstrap.min.css';

function Admin() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [guests, setGuests] = useState<Guest[]>([]);

  useEffect(() => {
    const fetchGuests = async () => {
      const guests = await MarriageApiService.getGuests();
      setGuests(guests);
    };
  
    fetchGuests();
  }, []);
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    const guest = { name, email};
  
    try {
      const newGuest = await MarriageApiService.postGuests(guest);
      setGuests((prevGuests) => [...prevGuests, newGuest]);
    } catch (error) {
      console.error('Failed to add guest');
    }
  
    setName('');
    setEmail('');
  };

  return (
    <div className="container">
      <h1 className="text-center my-4">Admin Page</h1>

      <h2>Add New Guest</h2>
      <form onSubmit={handleSubmit} className="mb-3">
        <div className="mb-3">
          <label className="form-label">Name:</label>
          <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input type="text" className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">Add Guest</button>
      </form>

      <h2>Guest List</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>CODE</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((guest, index) => (
            <tr key={index}>
              <td>{guest.name}</td>
              <td>{guest.email}</td>
              <td>{guest.rsvpCode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;