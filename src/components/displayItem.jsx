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
  const { type, id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const collectionName = type === 'inventory' ? 'Inventory' :
                               type === 'shipping' ? 'Shipping' : 'Receiving';
        const docRef = doc(db, collectionName, id);
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
    return <div className="flex justify-center items-center h-screen">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
           </div>;
  }

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="border shadow-lg max-w-xl w-full rounded-lg">
        <CardHeader className="bg-slate-200 rounded-t-lg p-4">
          <CardTitle className="text-2xl font-bold text-center text-black">Item Details</CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="space-y-3">
              <div className="font-semibold">Part #: {item?.Name}</div>
              <div>Amount: {item?.Amount}</div>
              {type !== 'inventory' && <div>Company: {item?.Company}</div>}
              {type !== 'inventory' && <div>PO: {item?.PO}</div>}
              {type !== 'inventory' && <div>Date: {item?.Date}</div>}
              <div>Serial #:
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
              {type !== 'inventory' && <div>Tracking #: {item?.Tracking}</div>}
              {type !== 'inventory' && <div>Carrier #: {item?.Carrier}</div>}
              {type !== 'inventory' && <div>Shipping Cost: ${item?.Shipping}</div>}
              {type !== 'inventory' && <div>Blind Shipping: {item?.BlindShip ? 'Yes' : 'No'}</div>}
              {type === 'receiving' && <div>Address: {item?.Address}</div>}
              {type === 'inventory' && <div>Location: {item?.Location}</div>}
              <div>Notes: {item?.Notes}</div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DisplayItem;
