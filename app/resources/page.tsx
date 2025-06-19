"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Download, ExternalLink } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import Loading from "./loading"
import { toast } from "@/hooks/use-toast"
import { FilterMenu, SelectedFilters, FilterOption } from "@/components/ui/filter-menu"

interface Resource {
  id: string
  title: string
  description: string
  category: string
  is_premium: boolean
  featured: boolean
  file_url: string
  created_at: string
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set())
  
  const supabase = getSupabaseBrowserClient()

  const filterOptions: FilterOption[] = [
    { id: 'career-development', label: 'Career Development', value: 'career development', group: 'Type' },
    { id: 'study-materials', label: 'Study Materials', value: 'study materials', group: 'Type' },
    { id: 'templates', label: 'Templates', value: 'templates', group: 'Type' },
    { id: 'guides', label: 'Guides', value: 'guides', group: 'Type' },
    { id: 'worksheets', label: 'Worksheets', value: 'worksheets', group: 'Type' },
    { id: 'courses', label: 'Courses', value: 'courses', group: 'Type' },
    { id: 'free', label: 'Free', value: true, group: 'Access' },
    { id: 'premium', label: 'Premium', value: false, group: 'Access' },
    { id: 'featured', label: 'Featured', value: true, group: 'Featured' },
  ]

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      
      setResources(data || [])
    } catch (error) {
      console.error('Error fetching resources:', error)
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

  const filteredResources = resources.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    if (selectedFilters.size === 0) return true

    return Array.from(selectedFilters).every(filterId => {
      const option = filterOptions.find(opt => opt.id === filterId)
      if (!option) return true

      switch (filterId) {
        case 'career-development':
        case 'study-materials':
        case 'templates':
        case 'guides':
        case 'worksheets':
        case 'courses':
          return resource.category.toLowerCase() === option.value
        case 'free':
          return !resource.is_premium
        case 'premium':
          return resource.is_premium
        case 'featured':
          return resource.featured
        default:
          return true
      }
    })
  })

  const handleResourceAction = async (resource: Resource) => {
    if (resource.is_premium) {
      window.open(resource.file_url, '_blank')
    } else {
      try {
        const urlParts = resource.file_url.split('/')
        const fileName = urlParts[urlParts.length - 1]
        
        const response = await fetch(resource.file_url)
        if (!response.ok) throw new Error('Download failed')
        
        const blob = await response.blob()
        
        const downloadUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = fileName || `${resource.title}.${blob.type.split('/')[1]}`
        document.body.appendChild(link)
        link.click()
        
        document.body.removeChild(link)
        window.URL.revokeObjectURL(downloadUrl)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to download the resource. Please try again.",
        })
      }
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-black text-white py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold">Learning Resources</h1>
            <p className="text-gray-400 max-w-[700px]">
              Discover resources to help you learn and grow in your career.
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
                  placeholder="Search resources..." 
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

          {filteredResources.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No resources found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <Card key={resource.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Badge variant="secondary" className="mb-2">
                        {resource.category}
                      </Badge>
                      {resource.featured && (
                        <Badge className="bg-amber-500">Featured</Badge>
                      )}
                    </div>
                    <CardTitle className="mt-2 text-lg font-semibold break-words hyphens-auto">
                      {resource.title}
                    </CardTitle>
                    <CardDescription className="mt-2 text-sm break-words hyphens-auto whitespace-pre-wrap">
                      {resource.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="space-y-2">
                      <Badge variant={resource.is_premium ? "secondary" : "outline"} className="mb-2">
                        {resource.is_premium ? "Premium" : "Free"}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-brand-orange hover:bg-brand-orange/90"
                      onClick={() => handleResourceAction(resource)}
                    >
                      {resource.is_premium ? (
                        <>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Access Resource
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </>
                      )}
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
