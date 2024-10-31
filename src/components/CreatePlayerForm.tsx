"use client"

import React, { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ReloadIcon } from "@radix-ui/react-icons"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "./ui/badge"
import axios from "axios"

// Define the form schema with Zod
const formSchema = z.object({
  playerURL: z.string().min(1, { message: "Player URL is required." }),
  season: z.string().min(1, { message: "Please select a season." }),
})

type FormSchema = z.infer<typeof formSchema>

export function CreatePlayerForm() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string | null>(null) // Holds status or error message

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      playerURL: "",
      season: "2024/2025",
    },
  })

  // Handle form submission
  async function onSubmit(data: { playerURL: string, season: string }) {
    setLoading(true)
    setStatus(null) // Reset status
    try {
      const response = await axios.post('/api/createPlayer', {
        url: data.playerURL,
        season: data.season,
      });
      console.log(response.data) // Handle the response data
      setStatus("Player created successfully!")
    } catch (error: any) {
      setStatus(`Error: ${error.response?.data?.message || "Something went wrong."}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center pt-4 pb-8">
      <h1 className="text-4xl font-bold mb-4">Add New Player</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md w-full">
          {/* Player URL Input */}
          <FormField
            control={form.control}
            name="playerURL"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="playerURL">Player ProA / ProB URL</FormLabel>
                <FormControl>
                  <Input id="playerURL" placeholder="www.2basketballbundesliga.de/teams/kader/spieler/4818" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Season Select */}
          <FormField
            control={form.control}
            name="season"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="season">First Season</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a season" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="2024/2025">2024/2025</SelectItem>
                    <SelectItem value="2023/2024">2023/2024</SelectItem>
                    <SelectItem value="2022/2023">2022/2023</SelectItem>
                    <SelectItem value="2021/2022">2021/2022</SelectItem>
                    <SelectItem value="2020/2021">2020/2021</SelectItem>
                    <SelectItem value="2019/2020">2019/2020</SelectItem>
                    <SelectItem value="2018/2019">2018/2019</SelectItem>
                    <SelectItem value="2017/2018">2017/2018</SelectItem>
                    <SelectItem value="2016/2017">2016/2017</SelectItem>
                    <SelectItem value="2015/2016">2015/2016</SelectItem>
                    <SelectItem value="2014/2015">2014/2015</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Create Player!"
            )}
          </Button>

          {/* Status Message */}
          {status && (
            <Badge variant={status.startsWith("Error") ? "destructive" : "outline"} className="mt-2 mx-auto text-center">
              {status}
            </Badge>
          )}
        </form>
      </Form>
    </div>
  )
}
