import { List } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import './MyPage.css'

export default function MyPage() {
  const navigate = useNavigate()

  return (
    <div className="my-page">
      <div className="profile-section">
        <div className="avatar">物</div>
        <div className="nickname">我的物品</div>
        <div className="stats">共 0 件物品</div>
      </div>

      <List header="分类">
        <List.Item arrow onClick={() => navigate('/categories')}>
          分类管理
        </List.Item>
      </List>

      <List header="关于">
        <List.Item arrow>关于应用</List.Item>
        <List.Item arrow>使用帮助</List.Item>
      </List>
    </div>
  )
}
