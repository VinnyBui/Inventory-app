import { React, useEffect, useState } from 'react';
import { db } from "../config/firebase";
import { getDocs, collection } from "firebase/firestore";
import { AddDummyData } from './dummyData';
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
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export const Display = () => {
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

    const handlePageChange = (page) => {
        setCurrentPage(page);
      };

    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div >
            {/* <AddDummyData /> */}
            <Card>
                <CardHeader>
                    <CardTitle>Inventory</CardTitle>
                    <CardDescription>Amount of items: {items.length}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table >
                        <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead className="hidden sm:table-cell">SKU</TableHead>
                            <TableHead className="hidden sm:table-cell">Amount</TableHead>
                            <TableHead className="hidden md:table-cell">Receiving</TableHead>
                            <TableHead className="hidden md:table-cell">Shipping</TableHead>
                            <TableHead className="text-right">Location</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentItems.map((item) => (
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
            <div>
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                        </PaginationItem>
                        {[...Array(Math.ceil(items.length / itemsPerPage)).keys()].map((page) => (
                            <PaginationItem key={page + 1}>
                                <PaginationLink href="#" onClick={() => handlePageChange(page + 1)} className={currentPage === page + 1 ? 'bg-muted text-primary' : ''}>
                                    {page + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext href="#" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === Math.ceil(items.length / itemsPerPage)} />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
};


export default Display;