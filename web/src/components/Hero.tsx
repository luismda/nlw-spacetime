import Image from 'next/image'
import Link from 'next/link'

import nlwSpacetimeLogo from '../assets/nlw-spacetime-logo.svg'
import { Button } from './Button'

export function Hero() {
  return (
    <div className="space-y-5">
      <Image src={nlwSpacetimeLogo} alt="NLW Spacetime" />

      <div className="max-w-[420px] space-y-1">
        <h1 className="text-4xl font-bold leading-tight text-gray-50 lg:text-5xl">
          Sua cápsula do tempo
        </h1>
        <p className="leading-relaxed lg:text-lg">
          Colecione momentos marcantes da sua jornada e compartilhe (se quiser)
          com o mundo!
        </p>
      </div>

      <Button className="inline-block" asChild>
        <Link href="/memories/new">CADASTRAR LEMBRANÇA</Link>
      </Button>
    </div>
  )
}
