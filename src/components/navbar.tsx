'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ThemeToggle } from './theme-toggle'

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/logo.png" alt="" />
            <AvatarFallback>FR</AvatarFallback>
          </Avatar>
          <span className="font-semibold">Freelancer</span>
        </div>
        <nav className="hidden gap-6 text-sm font-medium md:flex">
          <Link href="#services" className="text-foreground/80 hover:text-foreground">Услуги</Link>
          <Link href="#portfolio" className="text-foreground/80 hover:text-foreground">Портфолио</Link>
          <Link href="#testimonials" className="text-foreground/80 hover:text-foreground">Отзывы</Link>
          <Link href="#contact" className="text-foreground/80 hover:text-foreground">Контакты</Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild>
            <Link href="#contact">Нанять</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

