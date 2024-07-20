import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { db } from "../config/firebase";
import { getDocs, collection, doc, deleteDoc } from "firebase/firestore";
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

const DisplayInventory = () => {
  const { searchQuery, handleItemClick } = useOutletContext();
  const [items, setItems] = useState([]);
  const itemsCollectionRef = collection(db, "Items");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const getItems = async () => {
      try {
        const data = await getDocs(itemsCollectionRef);
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setItems(filteredData);
      } catch (err) {
        console.error("Error getting data:", err);
      }
    };

    getItems();
  }, []);

  const filteredItems = items.filter(item =>
    (item.Name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.Serial?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.Location?.toLowerCase().includes(searchQuery.toLowerCase()))
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
                <TableHead className="">Amount</TableHead>
                <TableHead className="">Serial#</TableHead>
                <TableHead className="">Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
                <TableRow key={item.id} onClick={() => handleItemClick(item.id, 'inventory')}>
                  <TableCell>
                    <div className="font-medium">{item.Name || 'N/A'}</div>
                  </TableCell>
                  <TableCell className="">{item.Amount || 'N/A'}</TableCell>
                  <TableCell className="">{item.Serial || 'N/A'}</TableCell>
                  <TableCell className="">{item.Location || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
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
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default DisplayInventory;
