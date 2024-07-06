import { React, useEffect, useState } from 'react';
import { db } from "../config/firebase";
import { getDocs, collection } from "firebase/firestore";
import { Link } from 'react-router-dom';


import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


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
                console.log("Fetched items: ", filteredData); // Debugging line
            } catch (err){
                console.error("Error getting data:", err);
            };
        };

        getItems();
    }, []);


    return (
        <>
            {/* <div>
                {items.map((item) => (
                    <div key={item.id}>
                        <h1>{item.Product}</h1>
                        <h1>{item.SKU}</h1>
                        <h1>{item.Location}</h1>
                        <h1>{item.Amount}</h1>
                        <h1>{item.Shipping}</h1>
                    </div>
                ))}
            </div> */}
            <div>
            <Card>
                <CardHeader>
                  <CardTitle>Inventory</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden sm:table-cell">SKU</TableHead>
                        <TableHead className="hidden sm:table-cell">Amount</TableHead>
                        <TableHead className="hidden md:table-cell">Receiving</TableHead>
                        <TableHead className="hidden md:table-cell">Shipping</TableHead>
                        <TableHead className="text-right">Location</TableHead>
                        {/* <TableHead className="text-right">Location</TableHead> */}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.id}>
                            <TableCell>
                                <div className="font-medium">{item.Name}</div>
                                <div className="hidden text-sm text-muted-foreground md:inline">
                                {item.email}
                                </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">{item.SKU}</TableCell>
                            <TableCell className="hidden sm:table-cell">{item.Amount}</TableCell>
                            <TableCell className="hidden md:table-cell">{item.Receiving}</TableCell>
                            <TableCell className="hidden md:table-cell">{item.Shipping}</TableCell>
                            <TableCell className="text-right">{item.Location}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

        </>
    );
};


export default Display;