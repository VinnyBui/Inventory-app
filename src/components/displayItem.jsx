// src/components/NotesPage.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

const DisplayItem = ({ id }) => {
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const itemDoc = await getDoc(doc(db, 'Shipping', id));
        if (itemDoc.exists()) {
          setItem(itemDoc.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };

    fetchItem();
  }, [id]);

  if (!item) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Notes for {item.Name}</h1>
      <p>{item.Notes}</p>
    </div>
  );
};

export default DisplayItem;
