"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, Search } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { FilterMenu, SelectedFilters, FilterOption } from "@/components/ui/filter-menu"

interface Opportunity {
  id: string
  title: string
  description: string
  deadline: string
  eligibility: string
  category: string
  is_free: boolean
  featured: boolean
  created_at: string
}

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set())
  
  const supabase = getSupabaseBrowserClient()

  const filterOptions: FilterOption[] = [
    // Time filters
    { id: 'ending-soon', label: 'Ending Soon', value: 'ending-soon', group: 'Time' },
    { id: 'this-month', label: 'Deadline This Month', value: 'this-month', group: 'Time' },
    { id: 'next-month', label: 'Deadline Next Month', value: 'next-month', group: 'Time' },
    // Type filters
    { id: 'scholarship', label: 'Scholarship', value: 'scholarship', group: 'Type' },
    { id: 'fellowship', label: 'Fellowship', value: 'fellowship', group: 'Type' },
    { id: 'internship', label: 'Internship', value: 'internship', group: 'Type' },
    { id: 'grant', label: 'Grant', value: 'grant', group: 'Type' },
    { id: 'competition', label: 'Competition', value: 'competition', group: 'Type' },
    { id: 'mentorship', label: 'Mentorship', value: 'mentorship', group: 'Type' },

  ]

  useEffect(() => {
    fetchOpportunities()
  }, [])

  const fetchOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .order('deadline', { ascending: true })

      if (error) throw error
      setOpportunities(data || [])
    } catch (error) {
      console.error('Error fetching opportunities:', error)
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

  const filteredOpportunities = opportunities.filter(opportunity => {
    // Search query filter
    const matchesSearch = 
      opportunity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opportunity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opportunity.category.toLowerCase().includes(searchQuery.toLowerCase())||
      opportunity.eligibility.toLowerCase().includes(searchQuery.toLowerCase()) ||
      new Date(opportunity.deadline).toLocaleString(undefined, {dateStyle: 'full'}).toLowerCase().includes(searchQuery.toLowerCase()) 

    if (!matchesSearch) return false

    // If no filters are selected, show all opportunities that match search
    if (selectedFilters.size === 0) return true

    // Check if opportunity matches selected filters
    return Array.from(selectedFilters).every(filterId => {
      const option = filterOptions.find(opt => opt.id === filterId)
      if (!option) return true

      const today = new Date()
      const deadline = new Date(opportunity.deadline)
      const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      
      switch (filterId) {
        case 'ending-soon':
          return deadline <= sevenDaysFromNow && deadline >= today
        case 'this-month':
          return deadline.getMonth() === today.getMonth() &&
                 deadline.getFullYear() === today.getFullYear()
        case 'next-month':
          const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1)
          return deadline.getMonth() === nextMonth.getMonth() &&
                 deadline.getFullYear() === nextMonth.getFullYear()
        case 'scholarship':
        case 'fellowship':
        case 'internship':
        case "Competition":
        case "Mentorship":
        case 'grant':
          return opportunity.category.toLowerCase() === filterId
        case 'free':
          return opportunity.is_free
        case 'paid':
          return !opportunity.is_free
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
            <h1 className="text-3xl md:text-4xl font-bold">Opportunities</h1>
            <p className="text-gray-400 max-w-[700px]">
              Discover scholarships, fellowships, internships, and grants to advance your career.
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
                  placeholder="Search opportunities..." 
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
              <Button asChild className="bg-brand-orange hover:bg-brand-orange/90 text-white">
                <Link href="/submit?type=opportunity">Submit Opportunity</Link>
              </Button>
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
          ) : filteredOpportunities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No opportunities found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOpportunities.map((opportunity) => (
                <Card key={opportunity.id} className="card-hover border-gray-200">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Badge variant="secondary" className="bg-gray-200 text-gray-800">
                        {opportunity.category}
                      </Badge>
                      {opportunity.featured && (
                        <Badge className="bg-amber-500">Featured</Badge>
                      )}
                    </div>
                    <CardTitle className="mt-2 text-lg font-semibold break-words hyphens-auto">
                      {opportunity.title}
                    </CardTitle>
                    <CardDescription className="mt-2 text-sm break-words hyphens-auto whitespace-pre-wrap">
                      {opportunity.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Clock className="mr-2 h-4 w-4 text-brand-orange" />
                        <span>Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</span>
                      </div>
                      {opportunity.eligibility && (
                        <div className="flex items-center text-sm">
                          <Users className="mr-2 h-4 w-4 text-brand-orange" />
                          <span>{opportunity.eligibility}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link 
                      href={`/opportunities/${opportunity.id}`}
                      className="w-full"
                    >
                      <Button className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white">
                        Learn More
                      </Button>
                    </Link>
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
