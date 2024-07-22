import React, { useEffect } from 'react';
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
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
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { db } from "../config/firebase";
import { doc, updateDoc } from "firebase/firestore";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  amount: z.string().min(1, {
    message: "Amount must be at least 1 character.",
  }),
  serial: z.array(
    z.string().min(5, {
      message: "Serial number must be at least 5 characters.",
    })
  ).min(1, { message: "Must have at least one serial number." }),
  location: z.string().min(1, {
    message: "Location must be at least 1 character.",
  }),
  notes: z.string().optional(),
});

const EditInventoryForm = ({ open, setOpen, selectedItem, setSelectedItem }) => {
  const methods = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      amount: "",
      serial: [""],
      location: "",
      notes: "",
    },
  });

  const { reset, handleSubmit, register, control } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "serial",
  });

  useEffect(() => {
    if (selectedItem) {
      reset({
        name: selectedItem.Name,
        amount: selectedItem.Amount,
        serial: selectedItem.Serial,
        location: selectedItem.Location,
        notes: selectedItem.Notes || "",
      });
    }
  }, [selectedItem, reset]);

  const onSubmit = async (data) => {
    if (selectedItem) {
      try {
        const itemDocRef = doc(db, 'Inventory', selectedItem.id);
        await updateDoc(itemDocRef, {
          Name: data.name,
          Amount: data.amount,
          Serial: data.serial,
          Location: data.location,
          Notes: data.notes || "",  // Ensure Notes has a default value
        });
        form.reset();
        toast({
          title: "Success!",
          description: "Document updated successfully.",
          variant: "success",
        });
        setOpen(false);
        setSelectedItem(null);
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
          <DialogTitle>Edit Inventory Item</DialogTitle>
          <DialogDescription>
            Make changes to the inventory item details below.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={methods.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Product Name" {...field} />
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
                    <Input type="number" placeholder="1" {...field} />
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
                              placeholder="12345"
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
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Location" {...field} />
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
                    <Textarea placeholder="Additional information" {...field} />
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

export default EditInventoryForm;
