// src/components/displayInventory.jsx
import React, { useEffect, useState } from 'react';
import { db } from "../config/firebase";
import { getDocs, collection ,doc, deleteDoc} from "firebase/firestore";
import { AddDummyData } from './dummyData';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PaginationComponent from './pagination';

export const Display = ({ searchQuery }) => {
    const [items, setItems] = useState([]);
    const itemsCollectionRef = collection(db, "Items");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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

    const filteredItems = items.filter(item =>
        item.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.Serial.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.Location.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const handleDelete = async (id) => {
        try {
          await deleteDoc(doc(db, "Items", id));
          setItems(items.filter((item) => item.id !== id));
          console.log(`Document with ID ${id} deleted`);
        } catch (err) {
          console.error("Error deleting document:", err);
        }
      };
    
    const handlePageChange = (page) => {
        if (page >= 1 && page <= Math.ceil(items.length / itemsPerPage)) {
            setCurrentPage(page);
        }
    };

    const totalPages = Math.ceil(items.length / itemsPerPage);

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Inventory</CardTitle>
                    <CardDescription>Amount of items: {filteredItems.length}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead className="hidden sm:table-cell">Amount</TableHead>
                            <TableHead className="hidden sm:table-cell">Serial#</TableHead>
                            <TableHead className="text-right">Location</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="font-medium">{item.Name}</div>
                                        <div className="hidden text-sm text-muted-foreground md:inline">
                                            {item.email}
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">{item.Amount}</TableCell>
                                    <TableCell className="hidden sm:table-cell">{item.Serial}</TableCell>
                                    <TableCell className="text-right">{item.Location}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="destructive"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <PaginationComponent 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={handlePageChange} 
            />
        </div>
    );
};

export default Display;
