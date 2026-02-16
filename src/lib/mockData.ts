// Mock data untuk Gallery

export interface Page {
  id: string
  name: string
  createdAt: string
}

export interface Row {
  id: string
  pageId: string
  title: string
  order: number
}

export interface GalleryImage {
  id: string
  rowId: string
  url: string
  title: string
  subtitle?: string | null
  order: number
}

export interface RowWithImages extends Row {
  images: GalleryImage[]
}

// Sample mock data
export const mockPages: Page[] = [
  {
    id: "page-1",
    name: "My Gallery",
    createdAt: new Date().toISOString()
  },
  {
    id: "page-2",
    name: "Nature Photos",
    createdAt: new Date().toISOString()
  }
]

export const mockRows: Row[] = [
  {
    id: "row-1",
    pageId: "page-1",
    title: "Landscapes",
    order: 0
  },
  {
    id: "row-2",
    pageId: "page-1",
    title: "Architecture",
    order: 1
  },
  {
    id: "row-3",
    pageId: "page-2",
    title: "Mountains",
    order: 0
  }
]

export const mockImages: GalleryImage[] = [
  // Row 1 - Landscapes
  {
    id: "img-1",
    rowId: "row-1",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    title: "Mountain Lake",
    subtitle: "Beautiful sunrise over the mountains",
    order: 0
  },
  {
    id: "img-2",
    rowId: "row-1",
    url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
    title: "Forest Path",
    subtitle: "Peaceful forest trail",
    order: 1
  },
  {
    id: "img-3",
    rowId: "row-1",
    url: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f",
    title: "Sandy Beach",
    subtitle: "Tropical paradise",
    order: 2
  },
  {
    id: "img-4",
    rowId: "row-1",
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    title: "River Valley",
    subtitle: "Scenic mountain river",
    order: 3
  },
  // Row 2 - Architecture
  {
    id: "img-5",
    rowId: "row-2",
    url: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b",
    title: "Modern Building",
    subtitle: "Contemporary architecture",
    order: 0
  },
  {
    id: "img-6",
    rowId: "row-2",
    url: "https://images.unsplash.com/photo-1511452885600-a3d2c9148a31",
    title: "City Lights",
    subtitle: "Urban nightscape",
    order: 1
  },
  {
    id: "img-7",
    rowId: "row-2",
    url: "https://images.unsplash.com/photo-1514565131-fce0801e5785",
    title: "Glass Tower",
    subtitle: "Reflective skyscraper",
    order: 2
  },
  // Row 3 - Mountains (Page 2)
  {
    id: "img-8",
    rowId: "row-3",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
    title: "Snow Peak",
    subtitle: "Majestic mountain peak",
    order: 0
  },
  {
    id: "img-9",
    rowId: "row-3",
    url: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606",
    title: "Mountain Range",
    subtitle: "Panoramic view",
    order: 1
  }
]

// Helper functions
export function getPageById(id: string): Page | undefined {
  return mockPages.find(p => p.id === id)
}

export function getRowsByPageId(pageId: string): Row[] {
  return mockRows.filter(r => r.pageId === pageId).sort((a, b) => a.order - b.order)
}

export function getImagesByRowId(rowId: string): GalleryImage[] {
  return mockImages.filter(i => i.rowId === rowId).sort((a, b) => a.order - b.order)
}

export function getRowsWithImages(pageId: string): RowWithImages[] {
  const rows = getRowsByPageId(pageId)
  return rows.map(row => ({
    ...row,
    images: getImagesByRowId(row.id)
  }))
}
