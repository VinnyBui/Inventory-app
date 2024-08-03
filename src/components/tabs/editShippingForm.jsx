import React, { useEffect, useRef } from 'react';
import { useForm, FormProvider, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { db } from "../../config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Switch } from "@/components/ui/switch";

// Define the schema for form validation
const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  amount: z.preprocess(
    (val) => (typeof val === "string" ? parseInt(val, 10) : val),
    z.number().min(1, {
      message: "Amount must be at least 1.",
    })
  ),
  company: z.string().min(1, {
    message: "Company name must be at least 1 character.",
  }),
  PO: z.string().min(1, {
    message: "PO must be at least 1 character.",
  }),
  date: z.string().min(1, {
    message: "Date must be at least 1 character.",
  }),
  notes: z.string().optional(),
  serial: z.array(z.string().optional()).optional(),
  tracking: z.string().optional(),
  carrier: z.string().optional(),
  shipping: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z.number().min(0, {
      message: "Shipping must be a valid number.",
    })
  ),
  blindShip: z.boolean().optional(),
});

// Prevent form submission with Enter key
const handleKeyDown = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
  }
};

const EditShippingForm = ({ open, setOpen, selectedItem, setSelectedItem, refreshItems }) => {
  // Initialize form methods
  const methods = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      amount: "",
      serial: [""],
      company: "",
      PO: "",
      tracking: "",
      date: "",
      notes: "",
      carrier: "",
      shipping: "",
      blindShip: false,
    },
  });

  const { reset, handleSubmit, register, control } = methods;
  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "serial",
  });

  // Reset form with selected item data
  useEffect(() => {
    if (selectedItem) {
      reset({
        name: selectedItem.Name,
        amount: selectedItem.Amount,
        serial: selectedItem.Serial || [""],
        company: selectedItem.Company,
        PO: selectedItem.PO,
        tracking: selectedItem.Tracking,
        date: selectedItem.Date,
        notes: selectedItem.Notes,
        carrier: selectedItem.Carrier,
        shipping: (selectedItem.Shipping ?? 0).toString(),
        blindShip: selectedItem.BlindShip,
      });
    }
  }, [selectedItem, reset]);

  // Watch for serial field changes
  const serialFields = useWatch({
    control: methods.control,
    name: "serial",
  });

  const typingTimeoutRef = useRef(null);

  // Auto-append empty serial input on typing
  useEffect(() => {
    if (serialFields && serialFields.length > 0) {
      const lastSerialField = serialFields[serialFields.length - 1];
      if (lastSerialField && lastSerialField.trim() !== "") {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
          append("");
          setTimeout(() => {
            const newInput = document.querySelector(`[name='serial.${serialFields.length}']`);
            if (newInput) {
              newInput.focus();
            }
          }, 0);
        }, 500); // Adjust timeout as needed
      }
    }
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [serialFields, append]);

  // Handle form submission
  const onSubmit = async (data) => {
    if (selectedItem) {
      try {
        const itemDocRef = doc(db, 'Shipping', selectedItem.id);
        await updateDoc(itemDocRef, {
          Name: data.name,
          Amount: Number(data.amount),
          Serial: data.serial.filter(Boolean), // Remove empty serials
          Company: data.company,
          PO: data.PO,
          Tracking: data.tracking,
          Date: data.date,
          Notes: data.notes,
          Carrier: data.carrier,
          Shipping: Number(data.shipping),
          BlindShip: data.blindShip,
        });
        methods.reset();
        toast({
          title: "Success!",
          description: "Document updated successfully.",
          variant: "success",
        });
        setOpen(false);
        setSelectedItem(null);
        refreshItems(); // Refresh items list after update
      } catch (e) {
        console.error("Error updating document: ", e);
        toast({
          title: "Error!",
          description: "There was an error updating the document.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[75vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle>Edit Shipping Item</DialogTitle>
          <DialogDescription>
            Make changes to the shipping item details below.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...methods}>
          <form 
              onSubmit={handleSubmit(onSubmit)} 
              className="space-y-4"
              onKeyDown={handleKeyDown}
            >
            <FormField
              control={methods.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="serial"
              render={() => (
                <FormItem>
                  <FormLabel>Serial# (Count: {fields.length})</FormLabel>
                  <div className="max-h-40 overflow-y-auto custom-scrollbar">
                    <div className="p-4">
                      {fields.map((field, index) => (
                        <div key={field.id} className="flex items-center mb-2">
                          <FormControl className="flex-1">
                            <Input
                              {...register(`serial.${index}`, {
                                required: "Serial number is required",
                                minLength: { value: 5, message: "Serial number must be at least 5 characters" }
                              })}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            onClick={() => remove(index)}
                            variant="destructive"
                            size="sm"
                            className="ml-2"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      onClick={() => append("")}
                      variant="secondary"
                      size="sm"
                      className="mt-2"
                    >
                      Add Serial Number
                    </Button>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="PO"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PO</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="tracking"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tracking#</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="carrier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carrier#</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="shipping"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping Cost</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        $
                      </span>
                      <Input
                        {...field}
                        type="number"
                        className="pl-8"
                        step="0.01"
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="blindShip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blind Shipping</FormLabel>
                  <FormControl>
                    <div className="relative py-2">
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default EditShippingForm;
