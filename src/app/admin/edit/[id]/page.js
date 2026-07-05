'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../../lib/supabaseClient'
import { useRouter, useParams } from 'next/navigation'
import RequireAuth from '../../../../components/RequireAuth'

export default function EditItem() {
  const router = useRouter()
  const params = useParams()
  const id = params.id

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [imageUrl, setImageUrl] = useState(null)
  const [photo, setPhoto] = useState(null)
  const [unitType, setUnitType] = useState('ширхэг')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [allItems, setAllItems] = useState([])
  const [relatedItems, setRelatedItems] = useState([])
  const [relatedSearch, setRelatedSearch] = useState('')

  useEffect(() => {
    async function loadData() {
      const { data: itemData } = await supabase.from('items').select().eq('id', id).single()
      const { data: allData } = await supabase.from('items').select('id, name, unit_type').order('name')
      if (itemData) {
        setName(itemData.name)
        setPrice(itemData.price)
        setQuantity(itemData.quantity)
        setImageUrl(itemData.image_url)
        setUnitType(itemData.unit_type || 'ширхэг')
        setRelatedItems(itemData.related_items || [])
      }
      if (allData) setAllItems(allData.filter(i => i.id !== id))
      setLoading(false)
    }
    loadData()
  }, [id])

  function addRelated(item) {
    if (relatedItems.find(r => r.id === item.id)) return
    setRelatedItems([...relatedItems, { id: item.id, name: item.name, unit_type: item.unit_type || 'ширхэг', qty: 1 }])
    setRelatedSearch('')
  }

  function removeRelated(itemId) {
    setRelatedItems(relatedItems.filter(r => r.id !== itemId))
  }

  function updateRelatedQty(itemId, qty) {
    setRelatedItems(relatedItems.map(r => r.id === itemId ? { ...r, qty } : r))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)

    let newImageUrl = imageUrl
    if (photo) {
      const fileName = `${Date.now()}-${photo.name}`
      const { error: uploadError } = await supabase.storage.from('item-photos').upload(fileName, photo)
      if (uploadError) { alert('Error uploading photo: ' + uploadError.message); setSaving(false); return }
      const { data: publicUrlData } = supabase.storage.from('item-photos').getPublicUrl(fileName)
      newImageUrl = publicUrlData.publicUrl
    }

    const { error } = await supabase.from('items').update({
      name,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      image_url: newImageUrl,
      unit_type: unitType,
      related_items: relatedItems,
    }).eq('id', id)

    setSaving(false)
    if (error) { alert('Error updating item: ' + error.message) }
    else { router.push('/admin') }
  }

  const inputStyle = { background: 'var(--card)', border: '0.5px solid var(--border)', color: 'var(--foreground)' }

  const filteredAllItems = allItems.filter(i =>
    i.name.toLowerCase().includes(relatedSearch.toLowerCase()) &&
    !relatedItems.find(r => r.id === i.id)
  )

  if (loading) {
    return (
      <RequireAuth allowedRoles={['admin', 'sales_manager']}>
        <div className="p-10" style={{ background: 'var(--background)', minHeight: '100vh' }}>
          <p style={{ color: 'var(--muted)' }}>Loading...</p>
        </div>
      </RequireAuth>
    )
  }

  return (
    <RequireAuth allowedRoles={['admin', 'sales_manager']}>
      <div className="p-10" style={{ background: 'var(--background)', minHeight: '100vh' }}>
        <div className="pb-4 mb-6" style={{ borderBottom: '2px solid var(--accent)' }}>
          <h1 className="text-xl font-medium tracking-wide" style={{ color: 'var(--foreground)' }}>EDIT ITEM</h1>
        </div>

        <div className="flex gap-10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" style={{ width: '320px' }}>
            {imageUrl && <img src={imageUrl} alt={name} className="w-full aspect-square object-cover rounded" />}

            <input type="text" placeholder="Item name" value={name} onChange={(e) => setName(e.target.value)} className="p-2 rounded text-sm" style={inputStyle} required />
            <input type="number" step="0.01" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="p-2 rounded text-sm" style={inputStyle} required />
            <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="p-2 rounded text-sm" style={inputStyle} required />

            <div>
              <label className="text-xs block mb-2" style={{ color: 'var(--muted)' }}>Борлуулалтын нэгж</label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setUnitType('ширхэг')} className="flex-1 py-2 rounded text-sm font-medium" style={{ background: unitType === 'ширхэг' ? 'var(--accent)' : 'var(--card)', color: unitType === 'ширхэг' ? '#fff' : 'var(--foreground)', border: '0.5px solid var(--border)' }}>Ширхэгээр</button>
                <button type="button" onClick={() => setUnitType('м.кв')} className="flex-1 py-2 rounded text-sm font-medium" style={{ background: unitType === 'м.кв' ? 'var(--accent)' : 'var(--card)', color: unitType === 'м.кв' ? '#fff' : 'var(--foreground)', border: '0.5px solid var(--border)' }}>Метр квадратаар</button>
              </div>
            </div>

            <div>
              <label className="text-xs block mb-1" style={{ color: 'var(--muted)' }}>Replace photo (optional)</label>
              <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} className="p-2 rounded text-sm w-full" style={inputStyle} />
            </div>

            <button type="submit" disabled={saving} className="py-2 rounded text-sm font-medium disabled:opacity-50" style={{ background: 'var(--foreground)', color: 'var(--background)' }}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>

          {/* Related Items */}
          <div style={{ flex: 1 }}>
            <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--foreground)' }}>Хамт их авдаг бараа</h2>

            {/* Selected related items */}
            {relatedItems.length > 0 && (
              <div className="flex flex-col gap-2 mb-4">
                {relatedItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded" style={{ background: 'var(--card)', border: '0.5px solid var(--border)' }}>
                    <span className="text-sm flex-1" style={{ color: 'var(--foreground)' }}>{item.name}</span>
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>Тоо:</span>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={item.qty}
                      onChange={(e) => updateRelatedQty(item.id, e.target.value)}
                      className="p-1 rounded text-sm w-16"
                      style={inputStyle}
                    />
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>{item.unit_type === 'м.кв' ? 'м²' : 'ш'}</span>
                    <button onClick={() => removeRelated(item.id)} className="text-xs" style={{ color: 'var(--soldout-text)' }}>✕</button>
                  </div>
                ))}
              </div>
            )}

            {/* Search to add */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Бараа хайж нэмэх..."
                value={relatedSearch}
                onChange={(e) => setRelatedSearch(e.target.value)}
                className="p-2 rounded text-sm w-full"
                style={inputStyle}
              />
              {relatedSearch && filteredAllItems.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--card)', border: '0.5px solid var(--border)', borderRadius: '6px', zIndex: 10, maxHeight: '200px', overflowY: 'auto' }}>
                  {filteredAllItems.slice(0, 10).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => addRelated(item)}
                      className="p-2 text-sm cursor-pointer"
                      style={{ color: 'var(--foreground)', borderBottom: '0.5px solid var(--border)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--background)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs mt-2" style={{ color: 'var(--muted)' }}>Эдгээр бараа баримт дээр автоматаар гарна</p>
          </div>
        </div>
      </div>
    </RequireAuth>
  )
}
