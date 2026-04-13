import { useState, useEffect, useRef } from 'react'
import { SearchBar, Tabs, Grid, PullToRefresh, Dialog, ActionSheet, Input } from 'antd-mobile'
import { AddOutline } from 'antd-mobile-icons'
import './HomePage.css'

export interface Item {
  id: number
  name: string
  location: string
  category: string
  image?: string
}

interface Props {
  items: Item[]
  onDelete: (id: number) => void
  onAdd: () => void
}

const categories = ['全部', '上衣', '下装', '外套', '鞋子']

export default function HomePage({ items, onDelete, onAdd }: Props) {
  const [searchValue, setSearchValue] = useState('')
  const [activeTab, setActiveTab] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [displayItems, setDisplayItems] = useState<Item[]>([])
  const [page, setPage] = useState(1)

  const filteredItems = items.filter(item => {
    const matchCategory = activeTab === 0 || item.category === categories[activeTab]
    const matchSearch = item.name.toLowerCase().includes(searchValue.toLowerCase())
    return matchCategory && matchSearch
  })

  const loadMore = () => {
    if (!hasMore) return

    const pageSize = 9
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const newItems = filteredItems.slice(start, end)

    if (newItems.length > 0) {
      setDisplayItems([...displayItems, ...newItems])
      setPage(page + 1)
    }

    if (end >= filteredItems.length) {
      setHasMore(false)
    }
  }

  useEffect(() => {
    setPage(1)
    setHasMore(true)
    const pageSize = 9
    setDisplayItems(filteredItems.slice(0, pageSize))
  }, [activeTab, searchValue, items])

  const onRefresh = async () => {
    setPage(1)
    setHasMore(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setDisplayItems(filteredItems.slice(0, 9))
  }

  useEffect(() => {
    if (displayItems.length < filteredItems.length && hasMore) {
      loadMore()
    }
  }, [displayItems.length])

  return (
    <div className="home-page">
      <SearchBar
        placeholder="搜索物品"
        value={searchValue}
        onChange={setSearchValue}
      />

      <Tabs
        activeKey={activeTab.toString()}
        onChange={(key) => setActiveTab(Number(key))}
      >
        {categories.map((cat, index) => (
          <Tabs.Tab title={cat} key={index} />
        ))}
      </Tabs>

      <PullToRefresh onRefresh={onRefresh}>
        <Grid columns={3} gap={8} className="item-grid">
          {displayItems.map((item) => (
            <Grid.Item key={item.id}>
              <div
                className="grid-item"
                onClick={() => {
                  Dialog.confirm({
                    content: `确定删除「${item.name}」？`,
                    onConfirm: () => onDelete(item.id),
                  })
                }}
              >
                {item.image ? (
                  <div className="grid-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                ) : (
                  <div className="grid-item-icon">
                    {item.name.charAt(0)}
                  </div>
                )}
                <div className="grid-item-name">{item.name}</div>
              </div>
            </Grid.Item>
          ))}
        </Grid>

        {displayItems.length === 0 && (
          <div className="empty">暂无物品</div>
        )}

        {!hasMore && displayItems.length > 0 && (
          <div className="no-more">— 没有更多了 —</div>
        )}
      </PullToRefresh>

      <div className="add-btn" onClick={onAdd}>
        <AddOutline />
      </div>
    </div>
  )
}

interface AddDialogProps {
  visible: boolean
  onClose: () => void
  onConfirm: (item: Omit<Item, 'id'>) => void
}

export function AddDialog({ visible, onClose, onConfirm }: AddDialogProps) {
  const [image, setImage] = useState<string>('')
  const [name, setName] = useState('')
  const [category, setCategory] = useState('上衣')
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const albumInputRef = useRef<HTMLInputElement>(null)
  const [sheetVisible, setSheetVisible] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, source: string) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setImage(event.target.result as string)
          setSheetVisible(false)
        }
      }
      reader.readAsDataURL(file)
    }
    // Reset input
    if (source === 'camera') {
      e.target.value = ''
    }
  }

  const handleConfirm = () => {
    if (image) {
      onConfirm({
        name: name.trim() || `物品${Date.now()}`,
        location: '未分类',
        category,
        image,
      })
      setImage('')
      setName('')
      setCategory('上衣')
    }
  }

  const handleClose = () => {
    setImage('')
    setName('')
    setCategory('上衣')
    onClose()
  }

  return (
    <>
      <Dialog
        visible={visible}
        onClose={handleClose}
        title="添加物品"
        content={
          <div className="add-form">
            <div className="image-upload-area">
              {image ? (
                <div className="uploaded-image">
                  <img src={image} alt="预览" />
                  <div className="reupload" onClick={() => setSheetVisible(true)}>
                    重新上传
                  </div>
                </div>
              ) : (
                <div className="upload-placeholder" onClick={() => setSheetVisible(true)}>
                  <AddOutline />
                  <span>添加图片</span>
                </div>
              )}
            </div>

            <div className="name-input">
              <Input
                placeholder="物品名称（选填）"
                value={name}
                onChange={setName}
              />
            </div>

            <div className="category-section">
              <div className="category-label">选择类型</div>
              <Grid columns={3} gap={8}>
                {categories.slice(1).map((cat) => (
                  <Grid.Item key={cat}>
                    <div
                      className={`category-item ${category === cat ? 'active' : ''}`}
                      onClick={() => setCategory(cat)}
                    >
                      {cat}
                    </div>
                  </Grid.Item>
                ))}
              </Grid>
            </div>

            <div className="dialog-footer">
              <button className="dialog-btn cancel" onClick={handleClose}>取消</button>
              <button className="dialog-btn confirm" onClick={handleConfirm}>添加</button>
            </div>
          </div>
        }
      />

      <ActionSheet
        visible={sheetVisible}
        actions={[
          {
            key: 'camera',
            text: '拍照',
            onClick: () => cameraInputRef.current?.click(),
          },
          {
            key: 'album',
            text: '从相册选择',
            onClick: () => albumInputRef.current?.click(),
          },
        ]}
        onClose={() => setSheetVisible(false)}
        extra="选择图片来源"
      />

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => handleFileChange(e, 'camera')}
        style={{ display: 'none' }}
      />
      <input
        ref={albumInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange(e, 'album')}
        style={{ display: 'none' }}
      />
    </>
  )
}
