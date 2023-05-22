import './globals.css'
import '../lib/dayjs'

import { ReactNode } from 'react'
import { cookies } from 'next/headers'
import {
  Roboto_Flex as Roboto,
  Bai_Jamjuree as BaiJamjuree,
} from 'next/font/google'

import { Hero } from '@/components/Hero'
import { Profile } from '@/components/Profile'
import { SignIn } from '@/components/SignIn'
import { Copyright } from '@/components/Copyright'

const roboto = Roboto({ subsets: ['latin'], variable: '--font-roboto' })

const baiJamjuree = BaiJamjuree({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-bai-jamjuree',
})

export const metadata = {
  title: 'NLW Spacetime',
  description:
    'Uma cápsula do tempo para registrar momentos marcantes da sua vida, construída com React, Next.js, TailwindCSS e TypeScript.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const isAuthenticated = cookies().has('token')

  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${baiJamjuree.variable} overflow-x-hidden bg-gray-900 font-sans text-gray-100 lg:overflow-x-auto`}
      >
        <main className="grid min-h-screen lg:grid-cols-2">
          <div className="flex flex-col items-start justify-between gap-5 overflow-hidden bg-[url(../assets/bg-stars.svg)] bg-cover p-8 lg:relative lg:border-r lg:border-white/10 lg:px-28 lg:py-16">
            <div className="absolute right-0 top-1/2 -z-[1] h-[288px] w-[526px] -translate-y-3/4 translate-x-1/2 rounded-full bg-purple-700 opacity-50 blur-full lg:-translate-y-1/2" />

            <div className="fixed bottom-0 left-2 top-0 w-2 bg-stripes lg:absolute lg:left-auto lg:right-2" />

            {isAuthenticated ? <Profile /> : <SignIn />}

            <Hero />

            <Copyright />
          </div>

          <div className="flex flex-col bg-[url(../assets/bg-stars.svg)] bg-cover lg:max-h-screen lg:overflow-y-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
