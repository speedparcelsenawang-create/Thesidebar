import { useMemo, useState } from "react"
import { MapPin } from "lucide-react"
import "./route-iist.css"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

type Company = {
  id: string
  name: string
  slogan: string
  country: string
  rating: number
  color: string
  keywords: string[]
}

const companies: Company[] = [
  {
    id: "1",
    name: "Metro Rail",
    slogan: "Fast connections across the city.",
    country: "Malaysia",
    rating: 8.9,
    color: "#10b981",
    keywords: ["commute", "urban", "express"],
  },
  {
    id: "2",
    name: "Coastal Line",
    slogan: "Scenic routes along the shoreline.",
    country: "Singapore",
    rating: 9.2,
    color: "#2563eb",
    keywords: ["scenic", "tourism", "coastal"],
  },
  {
    id: "3",
    name: "Peninsula Shuttle",
    slogan: "Reliable service between major hubs.",
    country: "Malaysia",
    rating: 7.5,
    color: "#f59e0b",
    keywords: ["shuttle", "connect", "business"],
  },
  {
    id: "4",
    name: "Highland Express",
    slogan: "Comfortable journeys to the highlands.",
    country: "Thailand",
    rating: 8.1,
    color: "#ec4899",
    keywords: ["tourism", "mountain", "luxury"],
  },
  {
    id: "5",
    name: "City Link",
    slogan: "Every stop with a modern experience.",
    country: "Singapore",
    rating: 8.7,
    color: "#8b5cf6",
    keywords: ["urban", "frequent", "metro"],
  },
]

const countries = Array.from(new Set(companies.map((company) => company.country)))
const categories = Array.from(
  new Set(companies.flatMap((company) => company.keywords))
)
const ratingBounds = {
  min: Math.min(...companies.map((company) => company.rating)),
  max: Math.max(...companies.map((company) => company.rating)),
}

export default function RouteIist() {
  const [companiesData, setCompaniesData] = useState<Company[]>(companies)
  const [filters, setFilters] = useState({
    countries: Object.fromEntries(countries.map((country) => [country, false])),
    categories: Object.fromEntries(categories.map((category) => [category, false])),
    rating: ratingBounds.max,
  })

  const selectedCountries = useMemo(
    () => Object.keys(filters.countries).filter((country) => filters.countries[country]),
    [filters.countries]
  )

  const selectedCategories = useMemo(
    () => Object.keys(filters.categories).filter((category) => filters.categories[category]),
    [filters.categories]
  )

  const list = useMemo(
    () =>
      companiesData.filter((company) => {
        if (company.rating < filters.rating) return false

        if (selectedCountries.length && !selectedCountries.includes(company.country)) return false

        if (selectedCategories.length) {
          return selectedCategories.every((category) =>
            company.keywords.includes(category)
          )
        }

        return true
      }),
    [companiesData, filters, selectedCategories, selectedCountries]
  )

 

  const toggleFilter = (filter: "countries" | "categories", option: string) => {
    setFilters((current) => ({
      ...current,
      [filter]: {
        ...current[filter],
        [option]: !current[filter][option],
      },
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      countries: Object.fromEntries(countries.map((country) => [country, false])),
      categories: Object.fromEntries(categories.map((category) => [category, false])),
      rating: ratingBounds.max,
    })
  }

  const clearFilter = (filter: "countries" | "categories", option: string) => {
    setFilters((current) => ({
      ...current,
      [filter]: {
        ...current[filter],
        [option]: false,
      },
    }))
  }

  const addCard = () => {
    setCompaniesData((current) => [
      ...current,
      {
        id: `${Date.now()}`,
        name: `New Route ${current.length + 1}`,
        slogan: "New route description",
        country: "Unknown",
        rating: ratingBounds.max,
        color: "#3b82f6",
        keywords: ["new"],
      },
    ])
  }

  return (
    <main className="route-iist">
      <nav className="route-iist__nav">
        <menu className="route-iist__controls">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <li className={`route-iist__label ${selectedCountries.length ? "route-iist__label--filter" : ""}`}>
                Countries
              </li>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Countries</DropdownMenuLabel>
              {countries.map((country) => (
                <DropdownMenuCheckboxItem
                  key={country}
                  checked={filters.countries[country]}
                  onCheckedChange={() => toggleFilter("countries", country)}
                >
                  {country}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <li className={`route-iist__label ${selectedCategories.length ? "route-iist__label--filter" : ""}`}>
                Categories
              </li>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Categories</DropdownMenuLabel>
              {categories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category}
                  checked={filters.categories[category]}
                  onCheckedChange={() => toggleFilter("categories", category)}
                >
                  {category}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <li className={`route-iist__label ${filters.rating > ratingBounds.min ? "route-iist__label--filter" : ""}`}>
                Rating
              </li>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <div className="filters__rating" style={{ padding: 8 }}>
                <label>
                  Minimum rating: <strong>{filters.rating.toFixed(1)}</strong>
                </label>
                <input
                  className="filters__range"
                  type="range"
                  min={ratingBounds.min}
                  max={ratingBounds.max}
                  step={0.1}
                  value={filters.rating}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      rating: Number(event.target.value),
                    }))
                  }
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <li className="route-iist__label route-iist__label--clear" onClick={clearAllFilters}>
            Clear all
          </li>
        </menu>
        <button type="button" className="route-iist__add-button" onClick={addCard}>
          Add card
        </button>
      </nav>

      

      <section className="route-iist__list">
        {list.length === 0 ? (
          <div className="route-iist__empty">
            <div className="company__info">
              <p className="company__slogan">Tiada hasil. Cuba laraskan penapis anda.</p>
            </div>
          </div>
        ) : (
          list.map((company) => (
            <article key={company.id} className="company">
              <div className="company__info">
                <div className="company__top">
                  <div className="company__logo" style={{ backgroundColor: company.color }}>
                    <MapPin className="nav__icon" />
                  </div>
                  <div>
                    <h2 className="company__name">{company.name}</h2>
                    <blockquote className="company__slogan">{company.slogan}</blockquote>
                  </div>
                </div>
                <div className="company__details">
                  <div className="company__data">
                    <span className="company__label">Country</span>
                    <p className="company__country" onClick={() => clearFilter("countries", company.country)}>
                      {company.country}
                    </p>
                  </div>
                  <div className="company__data">
                    <span className="company__label">Rating</span>
                    <p className="company__rating">{company.rating.toFixed(1)}</p>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </section>

    </main>
  )
}
