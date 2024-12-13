import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Import useParams

export default function ViewUserProfile() {
  const [jobseekerData, setJobSeekerData] = useState(null);
  const { email } = useParams(); // Extract email from URL parameters

  useEffect(() => {
    const fetchJobSeekerData = async () => {
      try {
        const response = await axios.get(`http://localhost:2014/viewjobseekerprofile/${email}`);
        setJobSeekerData(response.data);
      } catch (error) {
        console.error(error.message);
      }
    };

    if (email) {
      fetchJobSeekerData();
    }
  }, [email]);


  if (!email) {
    return null;
  }

  return (
    jobseekerData ? (
      <div className='profile-card'>
        <p><strong>Full Name:</strong> {jobseekerData.fullname}</p>
        <p><strong>Gender:</strong> {jobseekerData.gender}</p>
        <p><strong>Date of Birth:</strong> {jobseekerData.dateofbirth}</p>
        <p><strong>Email:</strong> {jobseekerData.email}</p>
        <p><strong>Location:</strong> {jobseekerData.location}</p>
        <p><strong>Contact:</strong> {jobseekerData.contact}</p>
      </div>
    ) : (
      <p>No Job Seeker Data Found</p>
    )
  );
}
