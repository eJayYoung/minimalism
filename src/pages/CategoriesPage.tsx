import { useState } from 'react'
import { List, Badge, Dialog, Input } from 'antd-mobile'
import { AddOutline, EditSOutline, DeleteOutline } from 'antd-mobile-icons'
import './CategoriesPage.css'

export interface Category {
  id: number
  name: string
  color: string
}

interface Item {
  id: number
  name: string
  location: string
  category: string
  image?: string
}

interface Props {
  categories: Category[]
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>
  items: Item[]
}

const PRESET_COLORS = [
  { color: '#1677ff', name: '蓝色' },
  { color: '#87d068', name: '绿色' },
  { color: '#2db7f5', name: '青色' },
  { color: '#f5317f', name: '粉色' },
  { color: '#ff6600', name: '橙色' },
  { color: '#722ed1', name: '紫色' },
]

export default function CategoriesPage({ categories, setCategories, items }: Props) {
  const [dialogVisible, setDialogVisible] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [categoryName, setCategoryName] = useState('')
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0].color)

  const getItemCount = (categoryName: string) => {
    return items.filter(item => item.category === categoryName).length
  }

  const handleAdd = () => {
    setEditingCategory(null)
    setCategoryName('')
    setSelectedColor(PRESET_COLORS[0].color)
    setDialogVisible(true)
  }

  const handleEdit = (category: Category, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingCategory(category)
    setCategoryName(category.name)
    setSelectedColor(category.color)
    setDialogVisible(true)
  }

  const handleDelete = (category: Category, e: React.MouseEvent) => {
    e.stopPropagation()
    Dialog.confirm({
      content: `确定删除分类「${category.name}」？`,
      onConfirm: () => {
        setCategories(categories.filter(cat => cat.id !== category.id))
      },
    })
  }

  const handleConfirm = () => {
    const trimmedName = categoryName.trim()
    if (!trimmedName) {
      Dialog.alert({ content: '请输入分类名称' })
      return
    }

    if (editingCategory) {
      setCategories(categories.map(cat =>
        cat.id === editingCategory.id
          ? { ...cat, name: trimmedName, color: selectedColor }
          : cat
      ))
    } else {
      const newCategory: Category = {
        id: Date.now(),
        name: trimmedName,
        color: selectedColor,
      }
      setCategories([...categories, newCategory])
    }

    setDialogVisible(false)
    setCategoryName('')
    setEditingCategory(null)
  }

  const handleClose = () => {
    setDialogVisible(false)
    setCategoryName('')
    setEditingCategory(null)
  }

  return (
    <div className="categories-page">
      <List header="我的分类">
        {categories.map((cat) => (
          <List.Item
            key={cat.id}
            prefix={<Badge color={cat.color} />}
            extra={
              <div className="category-actions">
                <span className="item-count">{getItemCount(cat.name)}件</span>
                <span
                  className="action-icon edit"
                  onClick={(e) => handleEdit(cat, e)}
                >
                  <EditSOutline />
                </span>
                <span
                  className="action-icon delete"
                  onClick={(e) => handleDelete(cat, e)}
                >
                  <DeleteOutline />
                </span>
              </div>
            }
          >
            <span className="category-name">{cat.name}</span>
          </List.Item>
        ))}
      </List>

      <div className="add-category-btn" onClick={handleAdd}>
        <AddOutline />
        <span>新增分类</span>
      </div>

      <Dialog
        visible={dialogVisible}
        onClose={handleClose}
        title={editingCategory ? '编辑分类' : '新增分类'}
        content={
          <div className="category-form">
            <div className="form-item">
              <div className="form-label">分类名称</div>
              <Input
                placeholder="请输入分类名称"
                value={categoryName}
                onChange={setCategoryName}
                clearable
              />
            </div>
            <div className="form-item">
              <div className="form-label">选择颜色</div>
              <div className="color-picker">
                {PRESET_COLORS.map((preset) => (
                  <div
                    key={preset.color}
                    className={`color-option ${selectedColor === preset.color ? 'active' : ''}`}
                    onClick={() => setSelectedColor(preset.color)}
                  >
                    <div
                      className="color-circle"
                      style={{ backgroundColor: preset.color }}
                    />
                    {selectedColor === preset.color && (
                      <div className="color-check">✓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
        actions={[
          {
            key: 'cancel',
            text: '取消',
            onClick: handleClose,
          },
          {
            key: 'confirm',
            text: '确认',
            onClick: handleConfirm,
            bold: true,
          },
        ]}
      />
    </div>
  )
}
