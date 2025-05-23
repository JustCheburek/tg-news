"use client"

import type React from "react"

import { useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from "@/components/ui/sidebar"
import { ArrowDown, ArrowUp, DollarSign, Euro, Bitcoin, Coins } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface Currency {
  name: string
  icon: React.ElementType
  value: number
  change: number
}

export default function SidebarWithCurrencies() {
  const [currencies, setCurrencies] = useState<Currency[]>([
    { name: "Доллар", icon: DollarSign, value: 92.45, change: -0.32 },
    { name: "Евро", icon: Euro, value: 98.76, change: 0.15 },
    { name: "Юань", icon: Coins, value: 12.85, change: 0.08 },
    { name: "Биткоин", icon: Bitcoin, value: 4250000, change: 2.45 },
  ])

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="p-2">
            <h2 className="text-xl font-bold">EconoNews</h2>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Навигация</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive>
                    <a href="/">Новости</a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Курс валют</SidebarGroupLabel>
            <SidebarGroupContent>
              <Card className="border-none shadow-none">
                <CardContent className="p-2">ё
                  <div className="space-y-3">
                    {currencies.map((currency) => (
                      <div key={currency.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <currency.icon className="h-4 w-4" />
                          <span className="font-medium">{currency.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{currency.value.toLocaleString("ru-RU")} ₽</span>
                          <span
                            className={`flex items-center text-xs ${
                              currency.change > 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {currency.change > 0 ? (
                              <ArrowUp className="h-3 w-3 mr-0.5" />
                            ) : (
                              <ArrowDown className="h-3 w-3 mr-0.5" />
                            )}
                            {Math.abs(currency.change).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <div className="p-4">
          <h1 className="text-2xl font-bold">Содержимое страницы</h1>
          <p className="mt-4">Здесь будет отображаться основное содержимое страницы.</p>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
