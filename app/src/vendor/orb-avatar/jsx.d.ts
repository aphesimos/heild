// Declara <orb-avatar> para o JSX do React 19.
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import type { OrbAvatar } from './orb-avatar'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'orb-avatar': DetailedHTMLProps<HTMLAttributes<OrbAvatar>, OrbAvatar> & {
        reaction?: string
        mode?: string
        gaze?: string
        color?: string
        'eye-color'?: string
        size?: string | number
        jelly?: string | number
        'face-scale'?: string | number
        morph?: string | number
        shadow?: boolean
        static?: boolean
        extras?: string
        label?: string
        alive?: boolean
        'idle-time'?: string | number
        'sleep-after'?: string | number
        emotes?: string
        'particle-color'?: string
        'spark-color'?: string
        'tear-color'?: string
      }
    }
  }
}
