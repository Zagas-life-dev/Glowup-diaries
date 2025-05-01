"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Search } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { FilterMenu, SelectedFilters, FilterOption } from "@/components/ui/filter-menu"

interface Event {
  id: string
  title: string
  description: string
  date: string;  // Format: 'YYYY-MM-DD'
  time: string;  // Format: 'HH:mm:ss'
  location: string
  location_type: string
  is_free: boolean
  featured: boolean
  link: string
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set())
  
  const supabase = getSupabaseBrowserClient()

  const filterOptions: FilterOption[] = [
    // Time filters
    { id: 'this-month', label: 'This Month', value: 'this-month', group: 'Time' },
    { id: 'next-month', label: 'Next Month', value: 'next-month', group: 'Time' },
    { id: 'future', label: 'Future Events', value: 'future', group: 'Time' },
    // Cost filters
    { id: 'free', label: 'Free', value: true, group: 'Cost' },
    { id: 'paid', label: 'Paid', value: false, group: 'Cost' },
    // Location type
    { id: 'in-person', label: 'In Person', value: 'in-person', group: 'Location' },
    { id: 'virtual', label: 'Virtual', value: 'virtual', group: 'Location' },
  ]

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })

      if (error) throw error
      
      setEvents(data || [])
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filterId: string) => {
    const newFilters = new Set(selectedFilters)
    if (newFilters.has(filterId)) {
      newFilters.delete(filterId)
    } else {
      newFilters.add(filterId)
    }
    setSelectedFilters(newFilters)
  }

  const clearFilters = () => {
    setSelectedFilters(new Set())
  }

  const filteredEvents = events.filter(event => {
    // Search query filter
    const matchesSearch = 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (searchQuery.toLowerCase() === 'free' && event.is_free) ||
    (searchQuery.toLowerCase() === 'paid' && !event.is_free) ||
    (searchQuery.toLowerCase() === 'fre' && event.is_free) ||
    (searchQuery.toLowerCase() === 'pai' && !event.is_free) ||
    (searchQuery.toLowerCase() === 'fr' && event.is_free) ||
    (searchQuery.toLowerCase() === 'pa' && !event.is_free) ||
    new Date(event.date).toLocaleString(undefined, {dateStyle: 'full'}).toLowerCase().includes(searchQuery.toLowerCase()) 

    if (!matchesSearch) return false

    // If no filters are selected, show all events that match search
    if (selectedFilters.size === 0) return true

    // Check if event matches selected filters
    return Array.from(selectedFilters).every(filterId => {
      const option = filterOptions.find(opt => opt.id === filterId)
      if (!option) return true

      const today = new Date()
      const eventDate = new Date(event.date)
      
      switch (filterId) {
        case 'this-month':
          return eventDate.getMonth() === today.getMonth() &&
                 eventDate.getFullYear() === today.getFullYear()
        case 'next-month':
          const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1)
          return eventDate.getMonth() === nextMonth.getMonth() &&
                 eventDate.getFullYear() === nextMonth.getFullYear()
        case 'future':
          return eventDate > today
        case 'free':
          return event.is_free
        case 'paid':
          return !event.is_free
        case 'in-person':
          return event.location_type === 'physical' 
        case 'virtual':
          return event.location_type === 'online' || event.location_type === 'hybrid'
        default:
          return true
      }
    })
  })

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-black text-white py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold">Events Directory</h1>
            <p className="text-gray-400 max-w-[700px]">
              Discover upcoming events to expand your network, learn new skills, and advance your career.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search events..." 
                  className="pl-8" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <FilterMenu
                options={filterOptions}
                selectedFilters={selectedFilters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
              />
              
            </div>
            <SelectedFilters
              selectedFilters={selectedFilters}
              options={filterOptions}
              onFilterChange={handleFilterChange}
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <Card key={n} className="border-gray-200">
                  <CardHeader>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-6 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-20 w-full bg-gray-200 rounded animate-pulse"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No events found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="card-hover border-gray-200">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Badge variant="secondary" className="bg-gray-200 text-gray-800">
                        Event
                      </Badge>
                      <Badge
                        variant={event.is_free ? "outline" : "secondary"}
                        className={event.is_free ? "border-brand-orange text-brand-orange" : "bg-gray-200 text-gray-800"}
                      >
                        {event.is_free ? "Free" : "Paid"}
                      </Badge>
                    </div>
                    <CardTitle className="mt-2 text-lg font-semibold break-words hyphens-auto">
                      {event.title}
                    </CardTitle>
                    <CardDescription className="mt-2 text-sm break-words hyphens-auto whitespace-pre-wrap">
                      {event.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-2 h-4 w-4 text-brand-orange" />
                        <span>
                          {new Date(event.date).toLocaleString(undefined, {
                            dateStyle: 'full',
                           
                          }) } at {event.time}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="mr-2 h-4 w-4 text-brand-orange" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white"
                      onClick={() => window.open(event.link, '_blank')}
                    >
                      Sign Up For Event
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
