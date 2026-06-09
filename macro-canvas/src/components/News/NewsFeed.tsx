import { useAppStore } from '../../store/appStore'
import ArticleCard from './ArticleCard'
import ArticleDetail from './ArticleDetail'

export default function NewsFeed() {
  const { articles, activeArticleId } = useAppStore()

  if (activeArticleId) return <ArticleDetail />

  return (
    <div className="p-2 space-y-2">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  )
}
