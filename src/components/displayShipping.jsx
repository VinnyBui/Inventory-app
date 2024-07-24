import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { db } from "../config/firebase";
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
import PaginationComponent from './pagination';
import EditShippingForm from './editShippingForm'; 

const DisplayShipping = () => {
  const { searchQuery, handleItemClick } = useOutletContext();
  const [items, setItems] = useState([]);
  const itemsCollectionRef = collection(db, "Shipping");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'Date', direction: 'ascending' });

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
    (item.Company?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.PO?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.Date?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedItems = React.useMemo(() => {
    let sortableItems = [...filteredItems];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const dateA = new Date(a[sortConfig.key]);
        const dateB = new Date(b[sortConfig.key]);
        if (dateA < dateB) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (dateA > dateB) {
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' };
    return date.toLocaleDateString('en-US', options); // 'en-US' format (MM/DD/YYYY)
  };
  

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
          <CardTitle>Shipping</CardTitle>
          <CardDescription>Amount of items: {totalAmount}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>PO</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => requestSort('Date')}
                    >
                      Date
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Amount</TableHead>
                  <TableHead className="hidden md:table-cell">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
                  <TableRow key={item.id} onClick={() => handleItemClick(item.id, 'shipping')}>
                    <TableCell>
                      <div className="font-medium">{item.Company}</div>
                    </TableCell>
                    <TableCell>{item.PO}</TableCell>
                    <TableCell>{formatDate(item.Date)}</TableCell>
                    <TableCell className="hidden sm:table-cell">{item.Name}</TableCell>
                    <TableCell className="hidden sm:table-cell">{item.Amount}</TableCell>
                    <TableCell className="hidden md:table-cell">{item.Notes || 'N/A'}</TableCell>
                    <TableCell className="text-right flex justify-end">
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
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              const trackingNumber = item.Tracking;
                              navigator.clipboard.writeText(trackingNumber)
                                .then(() => {
                                  toast({
                                    title: "Copied!",
                                    description: "Tracking number copied to clipboard.",
                                    variant: "success",
                                  });
                                })
                                .catch((err) => {
                                  toast({
                                    title: "Error!",
                                    description: "Failed to copy Tracking number.",
                                    variant: "destructive",
                                  });
                                  console.error("Failed to copy Tracking number: ", err);
                                });
                            }}
                          >
                            Copy Tracking#
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
          </div>
        </CardContent>
      </Card>
      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
      {selectedItem && (
        <EditShippingForm
          open={open}
          setOpen={setOpen}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
        />
      )}
    </div>
  );
};

export default DisplayShipping;
