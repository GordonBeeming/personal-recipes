import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Header } from './Header'

export function NotFoundPage() {
  const navigate = useNavigate()

  const handleBackToHome = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onLogoClick={handleBackToHome} />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Error Code */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-primary mb-4" aria-label="Error 404">
              404
            </h1>
            <h2 className="text-3xl font-semibold text-foreground mb-4">
              Recipe Not Found
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Oops! Looks like this recipe doesn't exist in our collection. 
              Maybe it's still being perfected in the kitchen?
            </p>
          </div>

          {/* Illustration */}
          <div className="mb-12">
            <img 
              src="/images/404.png" 
              alt="404 - Recipe not found illustration"
              className="max-w-md mx-auto w-full h-auto rounded-lg"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleBackToHome}
              size="lg"
              className="min-w-[200px]"
            >
              Back to Recipe Collection
            </Button>
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              size="lg"
              className="min-w-[200px]"
            >
              Go Back
            </Button>
          </div>

          {/* Additional Help */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              If you think this is a mistake, please check the URL or try searching for the recipe from the homepage.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
