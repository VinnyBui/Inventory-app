import { useEffect, useState } from 'react';
import { db } from "../config/firebase";
import { getDocs, collection } from "firebase/firestore";

export const Display = () => {
    const [items, setItems] = useState([]);

    const itemsCollectionRef = collection(db, "Items");

    useEffect(() => {
        const getItems = async () => {
            try{
                const data = await getDocs(itemsCollectionRef);
                const filteredData = data.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                setItems(filteredData);
            } catch (err){
                console.error("Error getting data:", err);
            };
        };

        getItems();
    }, []);


    return (
        <>
            <div>
                {items.map((item) => (
                    <div key={item.id}>
                        <h1>{item.Product}</h1>
                        <h1>{item.SKU}</h1>
                        <h1>{item.Location}</h1>
                        <h1>{item.Amount}</h1>
                        <h1>{item.Shipping}</h1>
                    </div>
                ))}
            </div>
        </>
    );
};


export default Display;