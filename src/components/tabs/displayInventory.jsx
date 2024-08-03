import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { db } from "../../config/firebase";
import { getDocs, collection, doc, deleteDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
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
import PaginationComponent from '../pagination';
import EditInventoryForm from './editInventoryForm'; 

const DisplayInventory = () => {
  const { searchQuery, handleItemClick } = useOutletContext();
  const [items, setItems] = useState([]);
  const itemsCollectionRef = collection(db, "Inventory");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'Name', direction: 'ascending' });

  const fetchItems = async () => {
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

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = items.filter(item =>
    (item.Name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.Location?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedItems = React.useMemo(() => {
    let sortableItems = [...filteredItems];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredItems, sortConfig]);

  const requestSort = key => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "Inventory", id));
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
  const totalAmount = filteredItems.reduce((acc, item) => acc + (item.Amount || 0), 0);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
          <CardDescription>Amount of items: {totalAmount}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => requestSort('Name')}
                  >
                    Part #
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
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
                          Copy Serial#
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
          refreshItems={fetchItems} // Pass refresh function here
        />
      )}
    </div>
  );
};

export default DisplayInventory;
