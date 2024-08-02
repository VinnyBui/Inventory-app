import { useEffect, useRef } from 'react';
import { db } from "../../config/firebase";
import { collection, addDoc } from "firebase/firestore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, useWatch  } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  amount: z.string().min(1, {
    message: "Amount must be at least 1 character.",
  }),
  serial: z.array(z.string().optional()).optional(), 
  location: z.string().optional(),
  notes: z.string().optional(),
});

const handleKeyDown = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
  }
};

const AddInventoryForm = () => {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      amount: "",
      serial: [""], 
      location: "",
      notes: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "serial",
  });

  //watch for a change in the serial Input
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
      const itemsCollectionRef = collection(db, 'Inventory');
      const docRef = await addDoc(itemsCollectionRef, {
        Name: data.name,
        Amount: Number(data.amount),
        Serial: data.serial.filter(Boolean), 
        Location: data.location || null, 
        Notes: data.notes || "", 
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
          className="w-full max-w-md space-y-6 p-8 rounded shadow-md"
          onKeyDown={handleKeyDown}
        >
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
            name="serial"
            render={() => (
              <div className="col-span-1 md:col-span-2">
                <FormLabel>Serial# (Count: {fields.length})</FormLabel>
                <div className="space-y-2">
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
                  <Input {...field} />
                </FormControl>
              </FormItem>
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
          <Button type="submit" >Submit</Button>
        </form>
      </Form>
    </div>
  );
}

export default AddInventoryForm;
