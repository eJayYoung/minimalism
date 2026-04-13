import { useState, useMemo } from 'react'
import { List, Badge, Dialog, Input, Button, Space, SearchBar } from 'antd-mobile'
import { AddOutline } from 'antd-mobile-icons'
import { useNavigate } from 'react-router-dom'
import type { Category } from '../App'
import type { Item } from './HomePage'
import './CategoriesPage.css'

interface Props {
  categories: Category[]
  setCategories: (categories: Category[]) => void
  presetColors: string[]
  items: Item[]
}

export default function CategoriesPage({ categories, setCategories, presetColors, items }: Props) {
  const navigate = useNavigate()
  const [dialogVisible, setDialogVisible] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [categoryName, setCategoryName] = useState('')
  const [selectedColor, setSelectedColor] = useState(presetColors[0])
  const [searchValue, setSearchValue] = useState('')

  const getCategoryCount = (categoryName: string) => {
    if (categoryName === '全部') {
      return items.length
    }
    return items.filter(item => item.category === categoryName).length
  }

  const handleAdd = () => {
    setEditingCategory(null)
    setCategoryName('')
    setSelectedColor(presetColors[0])
    setDialogVisible(true)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setCategoryName(category.name)
    setSelectedColor(category.color)
    setDialogVisible(true)
  }

  const handleDelete = (category: Category) => {
    Dialog.confirm({
      content: `确定删除分类「${category.name}」？`,
      onConfirm: () => {
        setCategories(categories.filter(c => c.id !== category.id))
      },
    })
  }

  const handleConfirm = () => {
    if (!categoryName.trim()) {
      return
    }

    if (editingCategory) {
      setCategories(
        categories.map(c =>
          c.id === editingCategory.id
            ? { ...c, name: categoryName.trim(), color: selectedColor }
            : c
        )
      )
    } else {
      const newCategory: Category = {
        id: Date.now(),
        name: categoryName.trim(),
        color: selectedColor,
      }
      setCategories([...categories, newCategory])
    }

    setDialogVisible(false)
    setCategoryName('')
    setEditingCategory(null)
  }

  const handleCancel = () => {
    setDialogVisible(false)
    setCategoryName('')
    setEditingCategory(null)
  }

  const allCategories = [
    { id: 0, name: '全部', color: '#1677ff' },
    ...categories,
  ]

  const filteredCategories = useMemo(() => {
    if (!searchValue.trim()) {
      return allCategories
    }
    return allCategories.filter(cat =>
      cat.name.toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [allCategories, searchValue])

  return (
    <div className="categories-page">
      <SearchBar
        placeholder="搜索分类"
        value={searchValue}
        onChange={setSearchValue}
        style={{ '--background': '#f5f5f5', margin: '8px 12px' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: '#f5f5f5' }}>
        <span style={{ fontSize: 14, color: '#666' }}>我的分类</span>
        <Button size="small" color="primary" onClick={handleAdd}>
          <AddOutline /> 新增
        </Button>
      </div>
      <List>
        {filteredCategories.map((cat) => (
          <List.Item
            key={cat.id}
            prefix={<Badge color={cat.color}>{cat.name}</Badge>}
            extra={`${getCategoryCount(cat.name)}件`}
            arrow={cat.name !== '全部' ? true : undefined}
            onClick={() => {
              if (cat.name === '全部') {
                navigate('/')
              } else {
                handleEdit(cat as Category)
              }
            }}
            style={{ cursor: cat.name !== '全部' ? 'pointer' : 'default' }}
          >
            {cat.name === '全部' ? '查看全部物品' : cat.name}
          </List.Item>
        ))}
      </List>

      <Dialog
        visible={dialogVisible}
        title={editingCategory ? '编辑分类' : '新增分类'}
        content={
          <div style={{ padding: '12px 0' }}>
            <Input
              placeholder="请输入分类名称"
              value={categoryName}
              onChange={setCategoryName}
              style={{ marginBottom: 16 }}
            />
            <div style={{ marginBottom: 8, fontSize: 14, color: '#666' }}>选择颜色</div>
            <Space wrap>
              {presetColors.map((color) => (
                <div
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: color,
                    cursor: 'pointer',
                    border: selectedColor === color ? '3px solid #333' : '3px solid transparent',
                    boxSizing: 'border-box',
                  }}
                />
              ))}
            </Space>
            {editingCategory && (
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <Button
                  size="small"
                  color="danger"
                  fill="outline"
                  onClick={() => {
                    handleDelete(editingCategory)
                    setDialogVisible(false)
                  }}
                >
                  删除分类
                </Button>
              </div>
            )}
          </div>
        }
        actions={[
          [
            {
              key: 'cancel',
              text: '取消',
              onClick: handleCancel,
            },
            {
              key: 'confirm',
              text: '确认',
              bold: true,
              danger: false,
              onClick: handleConfirm,
            },
          ],
        ]}
        onClose={handleCancel}
      />
    </div>
  )
}
