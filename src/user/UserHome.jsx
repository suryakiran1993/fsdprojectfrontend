import { useEffect, useState } from 'react';

export default function UserHome() {
  const [userData, setUserData] = useState("");

  useEffect(() => 
  {
    const storedUserData = localStorage.getItem('user');
    if (storedUserData) {
      // Parse the JSON string before accessing properties
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
    }
  }, []);

  return (
    <div>
      {userData ? (
        <div>
          <h4>Welcome {userData.name}</h4>
        </div>
      ) : (
        <h4>Loading...</h4>
      )}
    </div>
  );
}
