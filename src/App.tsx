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

  return (
    <div className="app">
      <div className="page-content">
        <Routes>
          <Route path="/" element={<HomePage items={items} onDelete={handleDelete} onAdd={handleAdd} />} />
          <Route path="/my" element={<MyPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
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
