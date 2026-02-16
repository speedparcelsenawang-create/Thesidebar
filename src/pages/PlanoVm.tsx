import { useState, useRef, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageTabs } from "@/components/PageTabs"
import { HorizontalScrollRow } from "@/components/HorizontalScrollRow"
import { AddImageDialog } from "@/components/AddImageDialog"
import { EditImageDialog } from "@/components/EditImageDialog"
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog"
import { AddRowDialog } from "@/components/AddRowDialog"
import { EditRowDialog } from "@/components/EditRowDialog"
import { AddPageDialog } from "@/components/AddPageDialog"
import { EditPageDialog } from "@/components/EditPageDialog"
import { ShareLinkDialog } from "@/components/ShareLinkDialog"
import { AboutPageDialog } from "@/components/AboutPageDialog"
import { useToast } from "@/hooks/use-toast"
import {
  mockPages,
  mockRows,
  mockImages,
  type Page,
  type Row,
  type GalleryImage,
  type RowWithImages
} from "@/lib/mockData"
import LightGallery from "lightgallery/react"
import lgThumbnail from "lightgallery/plugins/thumbnail"
import lgZoom from "lightgallery/plugins/zoom"
import "lightgallery/css/lightgallery.css"
import "lightgallery/css/lg-thumbnail.css"
import "lightgallery/css/lg-zoom.css"

export default function PlanoVm() {
  const { toast } = useToast()
  const [pages, setPages] = useState<Page[]>(mockPages)
  const [rows, setRows] = useState<Row[]>(mockRows)
  const [images, setImages] = useState<GalleryImage[]>(mockImages)
  const [activePage, setActivePage] = useState<string>(pages[0]?.id || "")

  const [addImageDialog, setAddImageDialog] = useState<{ open: boolean; rowId?: string }>({ open: false })
  const [editImageDialog, setEditImageDialog] = useState<{ open: boolean; rowId?: string; imageId?: string }>({ open: false })
  const [deleteImageDialog, setDeleteImageDialog] = useState<{ open: boolean; rowId?: string; imageId?: string }>({ open: false })
  const [addRowDialog, setAddRowDialog] = useState(false)
  const [editRowDialog, setEditRowDialog] = useState<{ open: boolean; rowId?: string }>({ open: false })
  const [deleteRowDialog, setDeleteRowDialog] = useState<{ open: boolean; rowId?: string }>({ open: false })
  const [addPageDialog, setAddPageDialog] = useState(false)
  const [editPageDialog, setEditPageDialog] = useState<{ open: boolean; pageId?: string }>({ open: false })
  const [deletePageDialog, setDeletePageDialog] = useState<{ open: boolean; pageId?: string }>({ open: false })
  const [shareLinkDialog, setShareLinkDialog] = useState<{ open: boolean; url?: string }>({ open: false })
  const [aboutPageDialog, setAboutPageDialog] = useState<{ open: boolean; pageId?: string }>({ open: false })

  const lightGalleryRef = useRef<any>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImages, setLightboxImages] = useState<{ src: string; thumb: string }[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const rowsWithImages: RowWithImages[] = rows
    .filter(r => r.pageId === activePage)
    .sort((a, b) => a.order - b.order)
    .map(row => ({
      ...row,
      images: images.filter(img => img.rowId === row.id).sort((a, b) => a.order - b.order)
    }))

  const handleAddPage = (name: string) => {
    const newPage: Page = {
      id: `page-${Date.now()}`,
      name,
      createdAt: new Date().toISOString()
    }
    setPages([...pages, newPage])
    setActivePage(newPage.id)
    toast({ title: "Page created successfully" })
  }

  const handleEditPage = (name: string) => {
    if (editPageDialog.pageId) {
      setPages(pages.map(p => p.id === editPageDialog.pageId ? { ...p, name } : p))
      setEditPageDialog({ open: false })
      toast({ title: "Page renamed successfully" })
    }
  }

  const handleDeletePage = (pageId: string) => {
    if (pages.length === 1) {
      toast({ title: "Cannot delete the last page", variant: "destructive" })
      return
    }
    setPages(pages.filter(p => p.id !== pageId))
    if (activePage === pageId) {
      setActivePage(pages.find(p => p.id !== pageId)?.id || "")
    }
    toast({ title: "Page deleted successfully" })
  }

  const handleAddRow = (title: string) => {
    const newRow: Row = {
      id: `row-${Date.now()}`,
      pageId: activePage,
      title,
      order: rows.filter(r => r.pageId === activePage).length
    }
    setRows([...rows, newRow])
    toast({ title: "Row created successfully" })
  }

  const handleEditRow = (rowId: string, title: string) => {
    setRows(rows.map(r => r.id === rowId ? { ...r, title } : r))
    setEditRowDialog({ open: false })
    toast({ title: "Row updated successfully" })
  }

  const handleDeleteRow = (rowId: string) => {
    setRows(rows.filter(r => r.id !== rowId))
    setImages(images.filter(i => i.rowId !== rowId))
    toast({ title: "Row deleted successfully" })
  }

  const handleAddImage = (rowId: string, data: { url: string; title: string; subtitle?: string }) => {
    const newImage: GalleryImage = {
      id: `img-${Date.now()}`,
      rowId,
      url: data.url,
      title: data.title,
      subtitle: data.subtitle || null,
      order: images.filter(i => i.rowId === rowId).length
    }
    setImages([...images, newImage])
    setAddImageDialog({ open: false })
    toast({ title: "Image added successfully" })
  }

  const handleEditImage = (imageId: string, data: { url: string; title: string; subtitle?: string }) => {
    setImages(images.map(i => i.id === imageId ? { ...i, ...data } : i))
    setEditImageDialog({ open: false })
    toast({ title: "Image updated successfully" })
  }

  const handleDeleteImage = (imageId: string) => {
    setImages(images.filter(i => i.id !== imageId))
    setDeleteImageDialog({ open: false })
    toast({ title: "Image deleted successfully" })
  }

  const handleCopyLink = (pageId: string) => {
    const shareUrl = `${window.location.origin}/plano-vm?page=${pageId}`
    setShareLinkDialog({ open: true, url: shareUrl })
  }

  const handleImageClick = (rowImages: GalleryImage[], index: number) => {
    const imgs = rowImages.map(img => ({ src: img.url, thumb: img.url }))
    setLightboxImages(imgs)
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  useEffect(() => {
    if (lightboxOpen && lightGalleryRef.current && lightboxImages.length > 0) {
      setTimeout(() => {
        lightGalleryRef.current?.openGallery(lightboxIndex)
      }, 50)
    }
  }, [lightboxOpen])

  const currentEditImage = editImageDialog.imageId
    ? images.find(i => i.id === editImageDialog.imageId)
    : undefined

  const currentEditRow = editRowDialog.rowId
    ? rows.find(r => r.id === editRowDialog.rowId)
    : undefined

  return (
    <div className="flex-1 bg-background">
      <PageTabs
        pages={pages}
        activePage={activePage}
        onPageChange={setActivePage}
        onAddPage={() => setAddPageDialog(true)}
        onEditPage={(pageId) => setEditPageDialog({ open: true, pageId })}
        onDeletePage={(pageId) => setDeletePageDialog({ open: true, pageId })}
        onCopyLink={handleCopyLink}
        onDetailsPage={(pageId) => setAboutPageDialog({ open: true, pageId })}
      />

      <main className="max-w-7xl mx-auto">
        {rowsWithImages.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500 mx-auto mb-4 flex items-center justify-center">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-lg font-semibold mb-2">No rows yet</h2>
            <p className="text-muted-foreground mb-6">Create your first row to start adding images</p>
            <Button onClick={() => setAddRowDialog(true)} className="bg-green-500 hover:bg-green-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Row
            </Button>
          </div>
        ) : (
          <>
            {rowsWithImages.map((row) => (
              <HorizontalScrollRow
                key={row.id}
                title={row.title}
                images={row.images}
                onImageClick={(_, index) => handleImageClick(row.images, index)}
                onEditRow={() => setEditRowDialog({ open: true, rowId: row.id })}
                onDeleteRow={() => setDeleteRowDialog({ open: true, rowId: row.id })}
                onAddImage={() => setAddImageDialog({ open: true, rowId: row.id })}
                onEditImage={(imageId) => setEditImageDialog({ open: true, rowId: row.id, imageId })}
                onDeleteImage={(imageId) => setDeleteImageDialog({ open: true, rowId: row.id, imageId })}
              />
            ))}
            <div className="py-8 px-8">
              <Button onClick={() => setAddRowDialog(true)} variant="outline" className="w-full border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add New Row
              </Button>
            </div>
          </>
        )}
      </main>

      {lightboxOpen && lightboxImages.length > 0 && (
        <LightGallery
          onInit={(detail: any) => {
            lightGalleryRef.current = detail.instance
          }}
          dynamic
          dynamicEl={lightboxImages}
          plugins={[lgThumbnail, lgZoom]}
          onAfterClose={() => setLightboxOpen(false)}
          speed={500}
          mode="lg-fade"
          loop={false}
        />
      )}

      <AddImageDialog
        open={addImageDialog.open}
        onOpenChange={(open) => setAddImageDialog({ open })}
        onSubmit={(data) => addImageDialog.rowId && handleAddImage(addImageDialog.rowId, data)}
        isLoading={false}
      />

      <EditImageDialog
        open={editImageDialog.open}
        onOpenChange={(open) => setEditImageDialog({ open })}
        onSubmit={(data) => editImageDialog.imageId && handleEditImage(editImageDialog.imageId, data)}
        initialData={currentEditImage}
      />

      <DeleteConfirmDialog
        open={deleteImageDialog.open}
        onOpenChange={(open) => setDeleteImageDialog({ open })}
        onConfirm={() => deleteImageDialog.imageId && handleDeleteImage(deleteImageDialog.imageId)}
        title="Delete Image?"
        description="This action cannot be undone. This will permanently delete the image from the gallery."
      />

      <AddRowDialog
        open={addRowDialog}
        onOpenChange={setAddRowDialog}
        onSubmit={handleAddRow}
      />

      <EditRowDialog
        open={editRowDialog.open}
        onOpenChange={(open) => setEditRowDialog({ open })}
        onSubmit={(title) => editRowDialog.rowId && handleEditRow(editRowDialog.rowId, title)}
        initialTitle={currentEditRow?.title}
      />

      <DeleteConfirmDialog
        open={deleteRowDialog.open}
        onOpenChange={(open) => setDeleteRowDialog({ open })}
        onConfirm={() => deleteRowDialog.rowId && handleDeleteRow(deleteRowDialog.rowId)}
        title="Delete Row?"
        description="This will permanently delete the row and all its images. This action cannot be undone."
      />

      <AddPageDialog
        open={addPageDialog}
        onOpenChange={setAddPageDialog}
        onSubmit={handleAddPage}
      />

      <EditPageDialog
        open={editPageDialog.open}
        onOpenChange={(open) => setEditPageDialog({ ...editPageDialog, open })}
        onSubmit={handleEditPage}
        currentName={pages.find(p => p.id === editPageDialog.pageId)?.name || ""}
      />

      <DeleteConfirmDialog
        open={deletePageDialog.open}
        onOpenChange={(open) => setDeletePageDialog({ open })}
        onConfirm={() => deletePageDialog.pageId && handleDeletePage(deletePageDialog.pageId)}
        title="Delete Page?"
        description="This will permanently delete the page and all its rows and images. This action cannot be undone."
      />

      <ShareLinkDialog
        open={shareLinkDialog.open}
        onOpenChange={(open) => setShareLinkDialog({ open })}
        shareUrl={shareLinkDialog.url || ""}
      />

      <AboutPageDialog
        open={aboutPageDialog.open}
        onOpenChange={(open) => setAboutPageDialog({ open })}
        page={pages.find(p => p.id === aboutPageDialog.pageId) || null}
        rows={rows.filter(r => r.pageId === aboutPageDialog.pageId)}
        images={images.filter(i => rows.find(r => r.id === i.rowId && r.pageId === aboutPageDialog.pageId))}
      />
    </div>
  )
}
