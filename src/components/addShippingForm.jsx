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
});

const AddShippingForm = () => {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      amount: "",
      serial: "",
      company: "",
      PO: "",
      tracking: "",
      date: "",
    },
  });

  const onSubmit = async (data) => {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });

    try {
      const itemsCollectionRef = collection(db, 'Shipping');
      const docRef = await addDoc(itemsCollectionRef, {
        Name: data.name,
        Amount: data.amount,
        Serial: data.serial,
        Company: data.company,
        PO: data.PO,
        Tracking: data.tracking,
        Date: data.date,
      });
      console.log("Document added with ID: ", docRef.id);
      form.reset(); 
    } catch (e) {
      console.error("Error adding document: ", e);
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
                <FormLabel>Serial Number</FormLabel>
                <FormControl>
                  <Input placeholder="12345" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input placeholder="IBuy" {...field} />
                </FormControl>
                <FormMessage />
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
                  <Input placeholder="PO" {...field} />
                </FormControl>
                <FormMessage />
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
                  <Input placeholder="IBuy" {...field} />
                </FormControl>
                <FormMessage />
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

export default AddShippingForm;
