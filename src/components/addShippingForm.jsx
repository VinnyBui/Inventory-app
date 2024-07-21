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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

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
  notes: z.string().optional(), // Make notes optional
});

const AddShippingForm = () => {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      amount: "",
      serial: [""], // Initialize with one empty serial number input
      company: "",
      PO: "",
      tracking: "",
      date: "",
      notes: "", // Ensure notes is initialized as an empty string
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "serial",
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
        Notes: data.notes || "", // Provide a default value if notes is undefined
      });
      console.log("Document added with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  return (
    <div className="flex items-center justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4 p-8 rounded shadow-md">
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
          <div className="col-span-1 md:col-span-2">
            <FormLabel>Serial Numbers</FormLabel>
            {fields.map((item, index) => (
              <div key={item.id} className="flex items-center gap-2 mb-2">
                <FormControl className="flex-1">
                  <Input placeholder="12345" {...form.register(`serial.${index}`)} />
                </FormControl>
                <Button
                  type="button"
                  onClick={() => remove(index)}
                  className="bg-red-500 text-white p-2 h-8 w-8 flex items-center justify-center  hover:bg-red-700"
                >
                  x
                </Button>
              </div>
            ))}
            <div className="flex justify-center">
              <Button
                type="button"
                onClick={() => append("")}
                className="bg-blue-500 text-white px-4 py-2 mt-2 text-sm  hover:bg-blue-700"
              >
                Add Serial Number
              </Button>
            </div>
          </div>
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
            name="notes"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-2">
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea placeholder="Additional information" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="col-span-1 md:col-span-2">
            <Button type="submit" className="w-full">Submit</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default AddShippingForm;
