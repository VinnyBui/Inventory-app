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
  const { id } = useParams(); // Get the id from URL parameters
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const docRef = doc(db, 'Shipping', id);
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
  }, [id]);

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
        <div>Company: {item?.Company}</div>
        <div>PO: {item?.PO}</div>
        <div>Date: {item?.Date}</div>
        <div>Serial: {item?.Serial}</div>
        <div>Tracking: {item?.Tracking}</div>
        <div>Notes: {item?.Notes}</div>
      </CardContent>
    </Card>
  );
};

export default DisplayItem;
