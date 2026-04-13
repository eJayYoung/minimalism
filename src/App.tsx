import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { TabBar } from 'antd-mobile'
import { AppOutline, UserOutline } from 'antd-mobile-icons'
import HomePage, { AddDialog } from './pages/HomePage'
import MyPage from './pages/MyPage'
import CategoriesPage from './pages/CategoriesPage'
import { Dialog } from 'antd-mobile'
import './App.css'
import 'antd-mobile/bundle/style.css'

interface Item {
  id: number
  name: string
  location: string
  category: string
  image?: string
}

export interface Category {
  id: number
  name: string
  color: string
}

function TabBarWrapper() {
  const location = useLocation()
  const navigate = useNavigate()

  const setActiveKey = (key: string) => {
    navigate(key)
  }

  const activeKey = location.pathname === '/my' ? '/my' : '/'

  return (
    <TabBar activeKey={activeKey} onChange={setActiveKey}>
      <TabBar.Item key="/" icon={<AppOutline />} title="物品" />
      <TabBar.Item key="/my" icon={<UserOutline />} title="我的" />
    </TabBar>
  )
}

function AppContent() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: '白色T恤', location: '衣柜', category: '上衣' },
    { id: 2, name: '牛仔裤', location: '衣柜', category: '下装' },
    { id: 3, name: '运动鞋', location: '鞋柜', category: '鞋子' },
    { id: 4, name: '外套', location: '衣柜', category: '外套' },
    { id: 5, name: '衬衫', location: '衣柜', category: '上衣' },
    { id: 6, name: '休闲裤', location: '衣柜', category: '下装' },
  ])
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: '上衣', color: '#1677ff' },
    { id: 2, name: '下装', color: '#87d068' },
    { id: 3, name: '外套', color: '#2db7f5' },
    { id: 4, name: '鞋子', color: '#f5317f' },
    { id: 5, name: '配饰', color: '#ff6600' },
    { id: 6, name: '数码', color: '#722ed1' },
  ])
  const [addVisible, setAddVisible] = useState(false)

  const handleDelete = (id: number) => {
    Dialog.confirm({
      content: '确定删除该物品？',
      onConfirm: () => {
        setItems(items.filter(item => item.id !== id))
      },
    })
  }

  const handleAdd = () => {
    setAddVisible(true)
  }

  const handleAddConfirm = (item: Omit<Item, 'id'>) => {
    setItems([...items, {
      ...item,
      id: Date.now(),
    }])
    setAddVisible(false)
  }

  const handleAddCategory = (category: Omit<Category, 'id'>) => {
    setCategories([...categories, {
      ...category,
      id: Date.now(),
    }])
  }

  const handleUpdateCategory = (id: number, category: Omit<Category, 'id'>) => {
    setCategories(categories.map(c => 
      c.id === id ? { ...c, ...category } : c
    ))
  }

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter(c => c.id !== id))
  }

  return (
    <div className="app">
      <div className="page-content">
        <Routes>
          <Route path="/" element={<HomePage items={items} onDelete={handleDelete} onAdd={handleAdd} />} />
          <Route path="/my" element={<MyPage />} />
          <Route path="/categories" element={
            <CategoriesPage 
              categories={categories} 
              items={items}
              onAdd={handleAddCategory}
              onUpdate={handleUpdateCategory}
              onDelete={handleDeleteCategory}
            />
          } />
        </Routes>
      </div>

      <TabBarWrapper />

      <AddDialog
        visible={addVisible}
        onClose={() => setAddVisible(false)}
        onConfirm={handleAddConfirm}
      />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
