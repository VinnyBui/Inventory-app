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

export const DisplayShipping = ({ searchQuery }) => {
    const [items, setItems] = useState([]);
    const itemsCollectionRef = collection(db, "Shipping");
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
        item.Company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.PO.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.Tracking.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.Date.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (id) => {
        try {
          await deleteDoc(doc(db, "Shipping", id));
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
                    <CardTitle>Shipping</CardTitle>
                    <CardDescription>Amount of items: {filteredItems.length}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Company</TableHead>
                            <TableHead className="">PO</TableHead>
                            <TableHead className="">Date</TableHead>
                            <TableHead className="">Name</TableHead>
                            <TableHead className="">Amount</TableHead>
                            <TableHead className="">Serial#</TableHead>
                            <TableHead className="">Tracking#</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="font-medium">{item.Company}</div>
                                    </TableCell>
                                    <TableCell className="">{item.PO}</TableCell>
                                    <TableCell className="">{item.Date}</TableCell>
                                    <TableCell className="">{item.Name}</TableCell>
                                    <TableCell className="">{item.Amount}</TableCell>
                                    <TableCell className="">{item.Serial}</TableCell>
                                    <TableCell className="">{item.Tracking}</TableCell>
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

export default DisplayShipping;
