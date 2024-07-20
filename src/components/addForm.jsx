import { db } from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  amount: z.string().min(1, {
    message: "Amount must be at least 1 character.",
  }),
  serial: z.string().min(5, {
    message: "Serial number must be at least 5 characters.",
  }),
  location: z.string().min(1, {
    message: "Location must be at least 1 character.",
  }),
});

const AddForm = () => {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      amount: "",
      serial: "",
      location: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const itemsCollectionRef = collection(db, 'Items');
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
  }

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
                <FormMessage />
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
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="serial"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serial#</FormLabel>
                <FormControl>
                  <Input placeholder="12345" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
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
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}

export default AddForm;
