import { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const DisplayItem = () => {
  const { type, id } = useParams(); // Get the type and id from URL parameters
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const docRef = doc(db, type === 'inventory' ? 'Items' : 'Shipping', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setItem(docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching document: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [type, id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Item Details</CardTitle>
        <CardDescription>{item?.Name}</CardDescription>
      </CardHeader>
      <CardContent>
        {type === 'inventory' ? (
          <>
            <div>Location: {item?.Location}</div>
            <div>Serial: {item?.Serial}</div>
            <div>Amount: {item?.Amount}</div>
            <div>Notes: {item?.Notes}</div>
          </>
        ) : (
          <>
            <div>Company: {item?.Company}</div>
            <div>PO: {item?.PO}</div>
            <div>Date: {item?.Date}</div>
            <div>
              Serial#: 
              {Array.isArray(item?.Serial) ? (
                <ul>
                  {item.Serial.map((serial, index) => (
                    <li key={index}>- {serial}</li>
                  ))}
                </ul>
              ) : (
                <span>{item?.Serial}</span>
              )}
            </div>
            <div>Tracking#: {item?.Tracking}</div>
            <div>Notes: {item?.Notes}</div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DisplayItem;
