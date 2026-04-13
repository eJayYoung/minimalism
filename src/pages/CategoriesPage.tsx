import { useState, useEffect } from 'react'
import { List, Badge, Dialog, Input } from 'antd-mobile'
import { AddOutline } from 'antd-mobile-icons'
import { Category } from '../App'
import { Item } from './HomePage'
import './CategoriesPage.css'

interface Props {
  categories: Category[]
  items: Item[]
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>
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
  onClose: () => void
  onConfirm: (name: string, color: string) => void
  onDelete?: () => void
  initialName?: string
  initialColor?: string
  title: string
  isEditing: boolean
}

function CategoryDialog({ visible, onClose, onConfirm, onDelete, initialName = '', initialColor = PRESET_COLORS[0], title, isEditing }: CategoryDialogProps) {
  const [name, setName] = useState(initialName)
  const [color, setColor] = useState(initialColor)

  useEffect(() => {
    if (visible) {
      setName(initialName)
      setColor(initialColor || PRESET_COLORS[0])
    }
  }, [visible, initialName, initialColor])

  const handleConfirm = () => {
    const trimmedName = name.trim()
    if (trimmedName) {
      onConfirm(trimmedName, color)
      setName('')
      setColor(PRESET_COLORS[0])
    }
  }

  const handleClose = () => {
    setName('')
    setColor(PRESET_COLORS[0])
    onClose()
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete()
      handleClose()
    }
  }

  return (
    <Dialog
      visible={visible}
      onClose={handleClose}
      title={title}
      content={
        <div className="category-form">
          <div className="name-input-wrapper">
            <div className="input-label">分类名称</div>
            <Input
              placeholder="请输入分类名称"
              value={name}
              onChange={setName}
            />
          </div>

          <div className="color-section">
            <div className="input-label">选择颜色</div>
            <div className="color-picker">
              {PRESET_COLORS.map((c) => (
                <div
                  key={c}
                  className={`color-item ${color === c ? 'active' : ''}`}
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
            <button className="dialog-btn confirm" onClick={handleConfirm}>确认</button>
          </div>

          {isEditing && onDelete && (
            <button className="dialog-btn delete" onClick={handleDelete}>删除该分类</button>
          )}
        </div>
      }
    />
  )
}

export default function CategoriesPage({ categories, items, setCategories }: Props) {
  const [dialogVisible, setDialogVisible] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const getCategoryCount = (categoryName: string) => {
    return items.filter(item => item.category === categoryName).length
  }

  const handleAdd = () => {
    setEditingCategory(null)
    setDialogVisible(true)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setDialogVisible(true)
  }

  const handleDelete = (category: Category) => {
    Dialog.confirm({
      content: `确定删除分类「${category.name}」吗？`,
      onConfirm: () => {
        setCategories(categories.filter(c => c.id !== category.id))
      },
    })
  }

  const handleConfirm = (name: string, color: string) => {
    if (editingCategory) {
      setCategories(categories.map(c => 
        c.id === editingCategory.id 
          ? { ...c, name, color }
          : c
      ))
    } else {
      setCategories([...categories, {
        id: Date.now(),
        name,
        color,
      }])
    }
    setDialogVisible(false)
    setEditingCategory(null)
  }

  const handleClose = () => {
    setDialogVisible(false)
    setEditingCategory(null)
  }

  return (
    <div className="categories-page">
      <List header="我的分类">
        {categories.map((cat) => (
          <List.Item
            key={cat.id}
            prefix={<Badge color={cat.color}>{cat.name}</Badge>}
            extra={`${getCategoryCount(cat.name)}件`}
            onClick={() => handleEdit(cat)}
          >
            {cat.name}
          </List.Item>
        ))}
      </List>

      <div className="add-btn" onClick={handleAdd}>
        <AddOutline />
      </div>

      <CategoryDialog
        visible={dialogVisible}
        onClose={handleClose}
        onConfirm={handleConfirm}
        onDelete={editingCategory ? () => handleDelete(editingCategory) : undefined}
        initialName={editingCategory?.name}
        initialColor={editingCategory?.color}
        title={editingCategory ? '编辑分类' : '新增分类'}
        isEditing={!!editingCategory}
      />
    </div>
  )
}
