'use client'

import { Separator } from '@/components/ui/separator'

export function Footer() {
  return (
    <footer className="border-t py-10">
      <div className="container mx-auto px-4 text-sm text-muted-foreground">
        <Separator className="mb-6" />
        <div className="flex justify-center items-center">
          <p>© {new Date().getFullYear()} Freelancer. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}

