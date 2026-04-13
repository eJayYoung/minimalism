import { List, Badge } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import './CategoriesPage.css'

const categories = [
  { name: '全部', color: '#1677ff', count: 3 },
  { name: '数码', color: '#87d068', count: 1 },
  { name: '衣物', color: '#2db7f5', count: 1 },
  { name: '书籍', color: '#f5317f', count: 0 },
  { name: '文件', color: '#ff6600', count: 1 },
]

export default function CategoriesPage() {
  const navigate = useNavigate()

  return (
    <div className="categories-page">
      <List header="我的分类">
        {categories.map((cat) => (
          <List.Item
            key={cat.name}
            prefix={<Badge color={cat.color}>{cat.name}</Badge>}
            extra={`${cat.count}件`}
            arrow={cat.count > 0 ? true : undefined}
            onClick={() => {
              if (cat.count > 0) {
                navigate('/')
              }
            }}
          >
            {cat.name === '全部' ? '查看全部物品' : cat.name}
          </List.Item>
        ))}
      </List>
    </div>
  )
}
