"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Instagram, Linkedin, Twitter, Mail, MessageSquare } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { getSupabaseBrowserClient } from "@/lib/supabase"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = getSupabaseBrowserClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('feedback')
        .insert([{
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }])

      if (error) throw error

      toast({
        title: "Message sent!",
        description: "Thank you for your feedback. We'll get back to you soon.",
      })

      setFormData({ name: "", email: "", message: "" })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-muted py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold">Contact Us</h1>
            <p className="text-muted-foreground max-w-[700px]">
              Have questions or suggestions? We'd love to hear from you!
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-10">
            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your message"
                      rows={5}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-primary" />
                    <span>glowupdiaries@gmail.com</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                    <Link href="https://wa.me/" className="hover:text-primary">
                      WhatsApp Contact
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Connect With Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    <Link href="https://instagram.com" className="hover:text-primary">
                      <Instagram className="h-6 w-6" />
                      <span className="sr-only">Instagram</span>
                    </Link>
                    <Link href="https://linkedin.com" className="hover:text-primary">
                      <Linkedin className="h-6 w-6" />
                      <span className="sr-only">LinkedIn</span>
                    </Link>
                    <Link href="https://twitter.com" className="hover:text-primary">
                      <Twitter className="h-6 w-6" />
                      <span className="sr-only">Twitter</span>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Join Our Community</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Be part of a growing network of ambitious young people sharing opportunities and resources.
                  </p>
                  <Button asChild className="w-full">
                    <Link href="https://chat.whatsapp.com/Jmqd8xJxMty3vcfoEwT4WQ">Join Now</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
