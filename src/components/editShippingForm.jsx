import React, { useEffect } from 'react';
import { useForm, FormProvider } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  company: z.string().min(1, {
    message: "Company name must be at least 1 character.",
  }),
  PO: z.string().min(1, {
    message: "PO must be at least 1 character.",
  }),
  tracking: z.string().min(1, {
    message: "Tracking number must be at least 1 character.",
  }),
  date: z.string().min(1, {
    message: "Date must be at least 1 character.",
  }),
  notes: z.string().optional(),
});

const EditShippingForm = ({ open, setOpen, selectedItem, setSelectedItem }) => {
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
    },
  });

  const { reset, handleSubmit, register, watch } = methods;

  useEffect(() => {
    if (selectedItem) {
      reset({
        name: selectedItem.Name,
        amount: selectedItem.Amount,
        serial: selectedItem.Serial,
        company: selectedItem.Company,
        PO: selectedItem.PO,
        tracking: selectedItem.Tracking,
        date: selectedItem.Date,
        notes: selectedItem.Notes,
      });
    }
  }, [selectedItem, reset]);

  const onSubmit = async (data) => {
    if (selectedItem) {
      try {
        const itemDocRef = doc(db, 'Shipping', selectedItem.id);
        await updateDoc(itemDocRef, {
          Name: data.name,
          Amount: data.amount,
          Serial: data.serial,
          Company: data.company,
          PO: data.PO,
          Tracking: data.tracking,
          Date: data.date,
          Notes: data.notes,
        });

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Shipping Item</DialogTitle>
          <DialogDescription>
            Make changes to the shipping item details below.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label>Name</label>
              <Input placeholder="Product Name" {...register('name')} />
            </div>
            <div>
              <label>Amount</label>
              <Input type="number" placeholder="1" {...register('amount')} />
            </div>
            <div>
              <label>Serial#</label>
              {watch('serial').map((serial, index) => (
                <div key={index} className="mb-2">
                  <Input
                    placeholder="12345"
                    {...register(`serial.${index}`, {
                      required: "Serial number is required",
                      minLength: { value: 5, message: "Serial number must be at least 5 characters" }
                    })}
                  />
                </div>
              ))}
            </div>
            <div>
              <label>Company</label>
              <Input placeholder="Company Name" {...register('company')} />
            </div>
            <div>
              <label>PO</label>
              <Input placeholder="Purchase Order" {...register('PO')} />
            </div>
            <div>
              <label>Tracking#</label>
              <Input placeholder="Tracking Number" {...register('tracking')} />
            </div>
            <div>
              <label>Date</label>
              <Input type="date" placeholder="Date" {...register('date')} />
            </div>
            <div>
              <label>Notes</label>
              <Textarea placeholder="Additional information" {...register('notes')} />
            </div>
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
