import { useState } from 'react'
import { List, Badge, Dialog, Input, SearchBar } from 'antd-mobile'
import { AddOutline } from 'antd-mobile-icons'
import { Category } from '../App'
import './CategoriesPage.css'

interface Item {
  id: number
  name: string
  location: string
  category: string
  image?: string
}

interface Props {
  categories: Category[]
  items: Item[]
  onAdd: (category: Omit<Category, 'id'>) => void
  onUpdate: (id: number, category: Omit<Category, 'id'>) => void
  onDelete: (id: number) => void
}

const PRESET_COLORS = [
  '#1677ff',
  '#87d068',
  '#2db7f5',
  '#f5317f',
  '#ff6600',
  '#722ed1',
]

interface CategoryDialogProps {
  visible: boolean
  mode: 'add' | 'edit'
  category?: Category
  onClose: () => void
  onConfirm: (data: { name: string; color: string }) => void
}

function CategoryDialog({ visible, mode, category, onClose, onConfirm }: CategoryDialogProps) {
  const [name, setName] = useState(category?.name || '')
  const [color, setColor] = useState(category?.color || PRESET_COLORS[0])

  const handleConfirm = () => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      Dialog.alert({ content: '请输入分类名称' })
      return
    }
    onConfirm({ name: trimmedName, color })
    handleClose()
  }

  const handleClose = () => {
    setName('')
    setColor(PRESET_COLORS[0])
    onClose()
  }

  return (
    <Dialog
      visible={visible}
      onClose={handleClose}
      title={mode === 'add' ? '新增分类' : '编辑分类'}
      content={
        <div className="category-form">
          <div className="form-item">
            <div className="form-label">分类名称</div>
            <Input
              placeholder="请输入分类名称"
              value={name}
              onChange={setName}
              className="category-input"
            />
          </div>

          <div className="form-item">
            <div className="form-label">选择颜色</div>
            <div className="color-picker">
              {PRESET_COLORS.map((c) => (
                <div
                  key={c}
                  className={`color-option ${color === c ? 'active' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                >
                  {color === c && <span className="check-mark">✓</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="dialog-footer">
            <button className="dialog-btn cancel" onClick={handleClose}>取消</button>
            <button className="dialog-btn confirm" onClick={handleConfirm}>
              {mode === 'add' ? '添加' : '保存'}
            </button>
          </div>
        </div>
      }
    />
  )
}

export default function CategoriesPage({ categories, items, onAdd, onUpdate, onDelete }: Props) {
  const [searchValue, setSearchValue] = useState('')
  const [dialogVisible, setDialogVisible] = useState(false)
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add')
  const [editingCategory, setEditingCategory] = useState<Category | undefined>()

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchValue.toLowerCase())
  )

  const getItemCount = (categoryName: string) => {
    return items.filter(item => item.category === categoryName).length
  }

  const handleAddClick = () => {
    setDialogMode('add')
    setEditingCategory(undefined)
    setDialogVisible(true)
  }

  const handleEditClick = (category: Category) => {
    setDialogMode('edit')
    setEditingCategory(category)
    setDialogVisible(true)
  }

  const handleDeleteClick = (category: Category) => {
    const itemCount = getItemCount(category.name)
    Dialog.confirm({
      content: `确定删除分类「${category.name}」？${itemCount > 0 ? `\n该分类下有 ${itemCount} 件物品` : ''}`,
      onConfirm: () => {
        onDelete(category.id)
      },
    })
  }

  const handleDialogConfirm = (data: { name: string; color: string }) => {
    if (dialogMode === 'add') {
      onAdd(data)
    } else if (editingCategory) {
      onUpdate(editingCategory.id, data)
    }
  }

  return (
    <div className="categories-page">
      <SearchBar
        placeholder="搜索分类"
        value={searchValue}
        onChange={setSearchValue}
      />

      <List header="我的分类" className="category-list">
        {filteredCategories.map((cat) => (
          <List.Item
            key={cat.id}
            prefix={<Badge color={cat.color} />}
            extra={
              <div className="category-actions">
                <span className="item-count">{getItemCount(cat.name)}件</span>
                <button
                  className="action-btn edit-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEditClick(cat)
                  }}
                >
                  编辑
                </button>
                <button
                  className="action-btn delete-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteClick(cat)
                  }}
                >
                  删除
                </button>
              </div>
            }
          >
            {cat.name}
          </List.Item>
        ))}
        {filteredCategories.length === 0 && (
          <div className="empty-tip">暂无分类</div>
        )}
      </List>

      <div className="add-btn" onClick={handleAddClick}>
        <AddOutline />
      </div>

      <CategoryDialog
        visible={dialogVisible}
        mode={dialogMode}
        category={editingCategory}
        onClose={() => setDialogVisible(false)}
        onConfirm={handleDialogConfirm}
      />
    </div>
  )
}
