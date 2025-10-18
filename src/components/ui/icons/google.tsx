import type { SVGProps } from "react"

type GoogleIconProps = SVGProps<SVGSVGElement>

const GoogleIcon = (props: GoogleIconProps) => {
  const { className, ...rest } = props
  return (
    <svg
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...rest}
    >
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303C33.991 31.91 29.39 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.963 3.037l5.657-5.657C33.64 6.053 29.084 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20c0-1.32-.138-2.607-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.818C14.48 16.154 18.879 13 24 13c3.059 0 5.842 1.154 7.963 3.037l5.657-5.657C33.64 6.053 29.084 4 24 4 15.47 4 8.232 8.86 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.017 0 9.6-1.926 13.067-5.073l-6.018-5.012C29.948 35.305 27.107 36.5 24 36c-5.28-.84-9.53-4.957-10.757-10.02l-6.592 5.085C9.517 39.63 16.161 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303c-1.031 2.96-3.34 5.404-6.235 6.65l6.018 5.012C36.88 39.7 44 35.5 44 24c0-1.32-.138-2.607-.389-3.917z"
      />
    </svg>
  )
}

export default GoogleIcon
