type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger'
}

export default function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const base = 'font-semibold py-2 px-4 rounded cursor-pointer'
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  }

  return <button className={`${base} ${variantClasses[variant]} ${className}`} {...props} />
}
