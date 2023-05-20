import Image from 'next/image'
import Link from 'next/link'

import nlwSpacetimeLogo from '../assets/nlw-spacetime-logo.svg'
import { Button } from './Button'

export function Hero() {
  return (
    <div className="space-y-5">
      <Image src={nlwSpacetimeLogo} alt="NLW Spacetime" />

      <div className="max-w-[420px] space-y-1">
        <h1 className="text-5xl font-bold leading-tight text-gray-50">
          Sua cápsula do tempo
        </h1>
        <p className="text-lg leading-relaxed">
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
