import { useEffect } from 'react';
import { db } from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { toast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

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
});

const AddInventoryForm = () => {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      amount: "",
      serial: [""], 
      location: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "serial",
  });

  const onSubmit = async (data) => {
    try {
      const itemsCollectionRef = collection(db, 'Inventory');
      const docRef = await addDoc(itemsCollectionRef, {
        Name: data.name,
        Amount: data.amount,
        Serial: data.serial,
        Location: data.location,
      });
      console.log("Document added with ID: ", docRef.id);

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
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md space-y-6 p-8 rounded shadow-md">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Cisco Router" {...field} />
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
                  <Input type="number" placeholder="1" {...field} />
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
                <div className="space-y-2">
                  {fields.map((item, index) => (
                    <div key={item.id} className="flex items-center mb-2">
                      <FormControl className="flex-1">
                        <Input 
                          placeholder="12345"
                          {...form.register(`serial.${index}`, {
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
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="G4" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}

export default AddInventoryForm;
