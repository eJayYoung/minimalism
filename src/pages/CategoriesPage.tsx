import { useState } from 'react'
import { List, Badge, Dialog, Input, Grid, Button, SearchBar } from 'antd-mobile'
import { AddOutline, EditSOutline, DeleteOutline } from 'antd-mobile-icons'
import './CategoriesPage.css'

interface Category {
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
  items: Item[]
  onAdd: (category: Omit<Category, 'id'>) => void
  onUpdate: (id: number, category: Omit<Category, 'id'>) => void
  onDelete: (id: number) => void
}

const presetColors = [
  '#1677ff',
  '#87d068',
  '#2db7f5',
  '#f5317f',
  '#ff6600',
  '#722ed1',
]

export default function CategoriesPage({ categories, items, onAdd, onUpdate, onDelete }: Props) {
  const [searchValue, setSearchValue] = useState('')
  const [dialogVisible, setDialogVisible] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [categoryName, setCategoryName] = useState('')
  const [selectedColor, setSelectedColor] = useState(presetColors[0])

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchValue.toLowerCase())
  )

  const getCategoryCount = (categoryName: string) => {
    return items.filter(item => item.category === categoryName).length
  }

  const handleOpenAddDialog = () => {
    setEditingCategory(null)
    setCategoryName('')
    setSelectedColor(presetColors[0])
    setDialogVisible(true)
  }

  const handleOpenEditDialog = (category: Category) => {
    setEditingCategory(category)
    setCategoryName(category.name)
    setSelectedColor(category.color)
    setDialogVisible(true)
  }

  const handleCloseDialog = () => {
    setDialogVisible(false)
    setEditingCategory(null)
    setCategoryName('')
    setSelectedColor(presetColors[0])
  }

  const handleConfirm = () => {
    if (!categoryName.trim()) return

    if (editingCategory) {
      onUpdate(editingCategory.id, {
        name: categoryName.trim(),
        color: selectedColor,
      })
    } else {
      onAdd({
        name: categoryName.trim(),
        color: selectedColor,
      })
    }

    handleCloseDialog()
  }

  const handleDelete = (category: Category) => {
    Dialog.confirm({
      content: `确定删除分类「${category.name}」？`,
      onConfirm: () => {
        onDelete(category.id)
      },
    })
  }

  return (
    <div className="categories-page">
      <SearchBar
        placeholder="搜索分类"
        value={searchValue}
        onChange={setSearchValue}
        className="search-bar"
      />

      <div className="list-header">
        <h3 className="list-title">我的分类</h3>
        <Button
          size="small"
          color="primary"
          fill="none"
          onClick={handleOpenAddDialog}
        >
          <AddOutline /> 新增
        </Button>
      </div>
      <List>
        <List.Item
          prefix={<Badge color="#1677ff">全部</Badge>}
          extra={`${items.length}件`}
        >
          查看全部物品
        </List.Item>

        {filteredCategories.map((cat) => (
          <List.Item
            key={cat.id}
            prefix={<Badge color={cat.color}>{cat.name.charAt(0)}</Badge>}
            extra={`${getCategoryCount(cat.name)}件`}
            onClick={() => handleOpenEditDialog(cat)}
          >
            <div className="category-item-content">
              <span className="category-name">{cat.name}</span>
              <div className="category-actions">
                <EditSOutline
                  className="action-icon edit"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation()
                    handleOpenEditDialog(cat)
                  }}
                />
                <DeleteOutline
                  className="action-icon delete"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation()
                    handleDelete(cat)
                  }}
                />
              </div>
            </div>
          </List.Item>
        ))}
      </List>

      {filteredCategories.length === 0 && searchValue && (
        <div className="empty">未找到匹配的分类</div>
      )}

      <Dialog
        visible={dialogVisible}
        onClose={handleCloseDialog}
        title={editingCategory ? '编辑分类' : '新增分类'}
        content={
          <div className="category-form">
            <div className="form-item">
              <label className="form-label">分类名称</label>
              <Input
                placeholder="请输入分类名称"
                value={categoryName}
                onChange={setCategoryName}
                clearable
              />
            </div>

            <div className="form-item">
              <label className="form-label">选择颜色</label>
              <Grid columns={6} gap={8} className="color-picker">
                {presetColors.map((color) => (
                  <Grid.Item key={color}>
                    <div
                      className={`color-option ${selectedColor === color ? 'active' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    />
                  </Grid.Item>
                ))}
              </Grid>
            </div>

            <div className="dialog-footer">
              <button className="dialog-btn cancel" onClick={handleCloseDialog}>
                取消
              </button>
              <button
                className="dialog-btn confirm"
                onClick={handleConfirm}
                disabled={!categoryName.trim()}
              >
                确认
              </button>
            </div>
          </div>
        }
      />
    </div>
  )
}
