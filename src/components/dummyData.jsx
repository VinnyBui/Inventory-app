import { db } from "../config/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { faker } from '@faker-js/faker';
import { Button } from "@/components/ui/button";
import { useState } from 'react';

export const AddDummyData = () => {
    const [loading, setLoading] = useState(false);

    const addDummyData = async () => {
        setLoading(true);
        const itemsCollectionRef = collection(db, 'Items'); // Adjust the collection name

        for (let i = 0; i < 10; i++) { // Adjust the number of documents you want to add
            try {
                await addDoc(itemsCollectionRef, {
                    Name: faker.commerce.productName(),
                    SKU: faker.random.alphaNumeric(8),
                    Amount: faker.datatype.number({ min: 1, max: 100 }),
                    Receiving: faker.datatype.boolean(),
                    Shipping: faker.datatype.boolean(),
                    Location: faker.address.city(),
                    createdAt: serverTimestamp(),
                });
                console.log(`Document ${i + 1} added`);
            } catch (e) {
                console.error('Error adding document: ', e);
            }
        }
        setLoading(false);
    };

    return (
        <Button onClick={addDummyData} disabled={loading}>
            {loading ? 'Adding...' : 'Add Dummy Data'}
        </Button>
    );
};


