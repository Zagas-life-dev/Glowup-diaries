import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar, Lightbulb, Plane } from "lucide-react"
import FeaturedCard from "@/components/featured-card"
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

async function getFeaturedItems() {
  const supabase = createServerComponentClient({ cookies })

  // Get featured events
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })

  // Get featured opportunities
  const { data: opportunities } = await supabase
    .from('opportunities')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })

  // Get featured resources
  const { data: resources } = await supabase
    .from('resources')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })
  return {
    events: events || [],
    opportunities: opportunities || [],
    resources: resources || [],
    jobs: jobs || []
  }
}

export default async function Home() {
  const { events, opportunities, resources, jobs } = await getFeaturedItems()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-black text-white py-12 md:py-24">
        <div className="container px-4 md:px-12">
          <div className="flex flex-col items-center text-center space-y-8">
            <Image src="/images/logo-transparent.png" alt="Glow Up Diaries" width={300} height={0} className="mb-1 space-24" />

            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
              Find Opportunities. Access Resources. Glow Up.
            </h1>
            <p className="text-xl text-gray-400 max-w-[700px]">
              Connecting young ambitious people to opportunities, events, and free resources.
            </p>

            {/* Quick Search Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 w-full max-w-3xl">
              <Button
                asChild
                variant="outline"
                className="h-20 card-hover border-brand-orange text-brand-orange bg-black hover:bg-black/90"
              >
                <Link href="/events" className="flex flex-col items-center justify-center space-y-2">
                  <Calendar className="h-6 w-6 text-brand-orange" />
                  <span>Find Events</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-20 card-hover border-brand-orange text-brand-orange bg-black hover:bg-black/90"
              >
                <Link href="/opportunities" className="flex flex-col items-center justify-center space-y-2">
                  <Plane className="h-6 w-6 text-brand-orange" />
                  <span>Explore Opportunities</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-20 card-hover border-brand-orange text-brand-orange bg-black hover:bg-black/90"
              >
                <Link href="/resources" className="flex flex-col items-center justify-center space-y-2">
                  <Lightbulb className="h-6 w-6 text-brand-orange" />
                  <span>Get Resources</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold">About Glow Up Diaries</h2>
            <p className="text-muted-foreground">
              Glow Up Diaries is a platform dedicated to helping young ambitious individuals discover opportunities,
              events, and resources that can accelerate their personal and professional growth. We believe that everyone
              deserves access to quality opportunities regardless of their background.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Featured This Week</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <FeaturedCard
                key={event.id}
                type="Event"
                title={event.title}
                description={event.description}
                date={event.date}
                location={event.location}
                isFree={event.is_free}
                link={event.link || `#`}
              />
            ))}
            {opportunities.map((opportunity) => (
              <FeaturedCard
                key={opportunity.id}
                type="Opportunity"
                title={opportunity.title}
                description={opportunity.description}
                deadline={opportunity.deadline}
                eligibility={opportunity.eligibility}
                link={opportunity.link || `#`}
              />
            ))}

            {jobs.map((job) => (
              <FeaturedCard
                key={job.id}
                type="Jobs"
                title={job.title}
                description={job.description}
                location={job.location}
                link={job.link || `#`}
              />
            ))}

            {resources.map((resource) => (
              <FeaturedCard
                key={resource.id}
                type="Resources"
                title={resource.title}
                description={resource.description}
                link={resource.link || `#`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">Join Our Community</h2>
            <p className="text-gray-400 max-w-2xl">
              Be part of a growing network of ambitious young people sharing opportunities and resources.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-brand-orange hover:bg-brand-orange/90 text-white">
                <Link href="/submit">Submit an Opportunity</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-brand-orange text-brand-orange bg-black hover:bg-black/90"
              >
                <Link href="https://whatsapp.com/channel/0029Vanm1p0InlqII9gDQl0i">Join Our Community</Link>
              </Button>
              <Button asChild size="lg" className="px-16 bg-brand-orange hover:bg-brand-orange/90 text-white">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
