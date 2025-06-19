"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Building2, Clock, MapPin } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { FilterMenu, SelectedFilters, FilterOption } from "@/components/ui/filter-menu"

interface Job {
  id: string
  title: string
  description: string
  company: string
  location: string
  job_type: string
  salary_range?: string
  deadline: string
  requirements: string
  link: string
  featured: boolean
  created_at: string
}

const jobTypes = [
  'full-time',
  'part-time',
  'contract',
  'internship',
  'remote',
  'graduate-trainee'
] as const;

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set())
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const supabase = getSupabaseBrowserClient()

  const filterOptions: FilterOption[] = [
    { id: 'ending-soon', label: 'Ending Soon', value: 'ending-soon', group: 'Time' },
    { id: 'this-month', label: 'Deadline This Month', value: 'this-month', group: 'Time' },
    { id: 'next-month', label: 'Deadline Next Month', value: 'next-month', group: 'Time' },
    { id: 'remote', label: 'Remote', value: 'remote', group: 'Location' },
    { id: 'hybrid', label: 'Hybrid', value: 'hybrid', group: 'Location' },
    { id: 'on-site', label: 'On-site', value: 'on-site', group: 'Location' },
  ]

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('deadline', { ascending: true })
      if (error) throw error
      setJobs(data || [])
    } catch (error) {
      console.error('Error fetching jobs:', error)
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

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.job_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.requirements.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.salary_range && job.salary_range.toLowerCase().includes(searchQuery.toLowerCase())) ||
      new Date(job.deadline).toLocaleString(undefined, {dateStyle: 'full'}).toLowerCase().includes(searchQuery.toLowerCase())
    if (!matchesSearch) return false
    if (selectedType && job.job_type.toLowerCase() !== selectedType.toLowerCase()) {
      return false
    }
    if (selectedFilters.size === 0) return true
    return Array.from(selectedFilters).every(filterId => {
      const option = filterOptions.find(opt => opt.id === filterId)
      if (!option) return true
      const today = new Date()
      const deadline = new Date(job.deadline)
      const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      switch (filterId) {
        case 'ending-soon':
          return deadline <= sevenDaysFromNow && deadline >= today
        case 'this-month':
          return deadline.getMonth() === today.getMonth() && deadline.getFullYear() === today.getFullYear()
        case 'next-month':
          const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1)
          return deadline.getMonth() === nextMonth.getMonth() && deadline.getFullYear() === nextMonth.getFullYear()
        case 'remote':
          return job.location.toLowerCase().includes('remote')
        case 'hybrid':
          return job.location.toLowerCase().includes('hybrid')
        case 'on-site':
          return !job.location.toLowerCase().includes('remote') && !job.location.toLowerCase().includes('hybrid')
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
            <h1 className="text-3xl md:text-4xl font-bold">Jobs Directory</h1>
            <p className="text-gray-400 max-w-[700px]">
              Find your next career opportunity with companies looking for talented individuals like you.
            </p>
          </div>
        </div>
      </section>
      <section className="py-8 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                variant={selectedType === null ? "default" : "outline"}
                onClick={() => setSelectedType(null)}
                className="rounded-full"
              >
                All
              </Button>
              {jobTypes.map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  onClick={() => setSelectedType(type)}
                  className="rounded-full capitalize"
                >
                  {type}
                </Button>
              ))}
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search jobs..." 
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
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No jobs found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="card-hover border-gray-200">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Badge variant="secondary" className="bg-gray-200 text-gray-800 capitalize">
                        {job.job_type}
                      </Badge>
                      {job.featured && (
                        <Badge className="bg-amber-500">Featured</Badge>
                      )}
                    </div>
                    <CardTitle className="mt-2 text-lg font-semibold break-words hyphens-auto">
                      {job.title}
                    </CardTitle>
                    <CardDescription className="mt-2 text-sm break-words hyphens-auto whitespace-pre-wrap">
                      {job.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Building2 className="mr-2 h-4 w-4 text-brand-orange" />
                        <span>{job.company}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="mr-2 h-4 w-4 text-brand-orange" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="mr-2 h-4 w-4 text-brand-orange" />
                        <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                      </div>
                      {job.salary_range && (
                        <div className="text-sm mt-2">
                          <Badge variant="outline" className="border-brand-orange text-brand-orange">
                            {job.salary_range}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link 
                      href={job.link.startsWith("http") ? job.link : `https://${job.link}`}
                      className="w-full"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white">
                        Apply Now
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
