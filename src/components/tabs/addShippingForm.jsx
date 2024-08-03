import { useEffect, useRef } from 'react';
import { db } from "../../config/firebase";
import { collection, addDoc, serverTimestamp  } from "firebase/firestore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  amount: z.string().refine((val) => !isNaN(parseFloat(val)), {
    message: "Amount must be a valid number.",
  }),
  company: z.string().min(1, {
    message: "Company name must be at least 1 character.",
  }),
  PO: z.string().min(1, {
    message: "PO must be at least 1 character.",
  }),
  date: z.string().min(1, {
    message: "Date must be at least 1 character.",
  }),
  serial: z.array(z.string().optional()).optional(), 
  tracking: z.string().optional(),
  notes: z.string().optional(),
  carrier: z.string().optional(),
  shipping: z.string().refine((val) => !isNaN(parseFloat(val)), {
    message: "Shipping must be a valid number.",
  }),
  blindShip: z.boolean().optional(), 
});

const AddShippingForm = () => {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      amount: 0,
      serial: [""], // Initialize with one empty serial number input
      company: "",
      PO: "",
      tracking: "",
      date: "",
      notes: "", 
      carrier: "",
      shipping: 0,
      blindShip: false,
    },
  });

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "serial",
  });

  const serialFields = useWatch({
    control: form.control,
    name: "serial",
  });

  const typingTimeoutRef = useRef(null);

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

  const onSubmit = async (data) => {
    try {
      const amount = parseFloat(data.amount);
      const shipping = parseFloat(data.shipping);

      const itemsCollectionRef = collection(db, 'Shipping');
      const docRef = await addDoc(itemsCollectionRef, {
        Name: data.name,
        Amount: amount,
        Serial: data.serial.filter(Boolean), // Filter out empty serial numbers
        Company: data.company,
        PO: data.PO,
        Tracking: data.tracking || "",
        Date: data.date,
        Notes: data.notes || "",
        Carrier: data.carrier,
        Shipping: shipping,
        BlindShip: data.blindShip,
        createdAt: serverTimestamp(), 
      });
      console.log("Document added with ID: ", docRef.id);
      form.reset();
      toast({
        title: "Success!",
        description: "Document added successfully.",
        variant: "success",
      });
    } catch (e) {
      console.error("Error adding document: ", e);

      toast({
        title: "Error!",
        description: "There was an error adding the document.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const handleValidationErrors = () => {
      const errors = form.formState.errors;
      if (Object.keys(errors).length > 0) {
        Object.keys(errors).forEach((key) => {
          if (Array.isArray(errors[key])) {
            errors[key].forEach((error, index) => {
              toast({
                title: `Error in ${key}[${index}]`,
                description: error.message,
                variant: "destructive",
              });
            });
          } else {
            toast({
              title: `Error in ${key}`,
              description: errors[key]?.message,
              variant: "destructive",
            });
          }
        });
      }
    };
    handleValidationErrors();
  }, [form.formState.errors]);

  return (
    <div className="flex items-center justify-center">
      <Form {...form}>
        <form 
            onSubmit={form.handleSubmit(onSubmit)} 
            className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-3 gap-4 p-8 rounded shadow-md"
            onKeyDown={handleKeyDown}
          >
          <FormField
            control={form.control}
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
            control={form.control}
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
            control={form.control}
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
            control={form.control}
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
            control={form.control}
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
            control={form.control}
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
            control={form.control}
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
            control={form.control}
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
            control={form.control}
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
            control={form.control}
            name="serial"
            render={() => (
              <div className="col-span-1 md:col-span-2">
                <FormLabel>Serial# (Count: {fields.length})</FormLabel>
                <ScrollArea className="h-52 w-full rounded-md">
                  <div className="p-4">
                    {fields.map((item, index) => (
                      <div key={item.id} className="flex items-center mb-2">
                        <FormControl className="flex-1">
                          <Input 
                            {...form.register(`serial.${index}`)}
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
                </ScrollArea>
              </div>
            )}
          />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-3">
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="col-span-1 md:col-span-3">
            <Button type="submit" className="w-full">Submit</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default AddShippingForm;
