import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { db } from "../config/firebase";
import { getDocs, collection, doc, deleteDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PaginationComponent from './pagination';
import EditInventoryForm from './editInventoryForm'; 

const DisplayInventory = () => {
  const { searchQuery, handleItemClick } = useOutletContext();
  const [items, setItems] = useState([]);
  const itemsCollectionRef = collection(db, "Inventory");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

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

  const handleEdit = (e, item) => {
    e.stopPropagation(); 
    setSelectedItem(item);
    setOpen(true);
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
                <TableHead>Amount</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
                <TableRow key={item.id} onClick={() => handleItemClick(item.id, 'inventory')}>
                  <TableCell>
                    <div className="font-medium">{item.Name || 'N/A'}</div>
                  </TableCell>
                  <TableCell className="">{item.Amount || 'N/A'}</TableCell>
                  <TableCell className="">{item.Location || 'N/A'}</TableCell>
                  <TableCell className="">{item.Notes || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            const serialNumbers = item.Serial.join(", ");
                            navigator.clipboard.writeText(serialNumbers)
                              .then(() => {
                                toast({
                                  title: "Copied!",
                                  description: "All serial numbers copied to clipboard.",
                                  variant: "success",
                                });
                              })
                              .catch((err) => {
                                toast({
                                  title: "Error!",
                                  description: "Failed to copy serial numbers.",
                                  variant: "destructive",
                                });
                                console.error("Failed to copy serial numbers: ", err);
                              });
                          }}
                        >
                          Copy All Serial#
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={(e) => handleEdit(e, item)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.id);
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
      {selectedItem && (
        <EditInventoryForm
          open={open}
          setOpen={setOpen}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
        />
      )}
    </div>
  );
};

export default DisplayInventory;
