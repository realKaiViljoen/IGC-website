import Link from 'next/link'
import Image from 'next/image'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  href?: string
}

const sizeMap = {
  sm: { icon: 26, text: 'text-[0.8rem] sm:text-[0.875rem]' },
  md: { icon: 30, text: 'text-[0.875rem]' },
  lg: { icon: 36, text: 'text-[1rem]' },
}

export function Logo({ size = 'md', href = '/' }: LogoProps) {
  const { icon, text } = sizeMap[size]

  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2.5 no-underline"
      aria-label="Integrated Growth Consultants — home"
    >
      <Image
        src="/logo-icon.png"
        alt=""
        width={icon}
        height={icon}
        className="rounded-[4px] shrink-0"
        aria-hidden="true"
      />
      <span
        className={`${text} font-normal leading-none tracking-[0.01em] transition-opacity duration-300 group-hover:opacity-80 inline text-[#F2EDE4]`}
        style={{ fontFamily: 'var(--font-poppins), system-ui, sans-serif' }}
      >
        Integrated Growth Consultants
      </span>
    </Link>
  )
}
