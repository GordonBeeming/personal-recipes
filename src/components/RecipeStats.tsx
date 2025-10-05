import { Card, CardContent } from './ui/card'
import { BookOpen, ForkKnife } from '@phosphor-icons/react'
import { RecipeStats } from '../lib/types'

interface RecipeStatsProps {
  stats: RecipeStats
}

export function RecipeStatsComponent({ stats }: RecipeStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <BookOpen size={24} className="text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.totalRecipes}</p>
              <p className="text-sm text-muted-foreground">Total Recipes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent/10 rounded-full">
              <ForkKnife size={24} className="text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.totalCategories}</p>
              <p className="text-sm text-muted-foreground">Categories</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}