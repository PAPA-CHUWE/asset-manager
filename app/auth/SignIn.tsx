'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { User, Eye, EyeOff } from 'lucide-react'
import { ModeToggle } from '../theme/ModeTogle'
import { Switch } from '@/components/ui/switch'

interface SignInFormValues {
  email: string
  password: string
  remember: boolean
}

export default function SignIn() {
  const [showPassword, setShowPassword] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const form = useForm<SignInFormValues>({
    defaultValues: {
      email: '',
      password: '',
      remember: false
    }
  })

  const handleLogin = async (values: SignInFormValues) => {
    setLoading(true)
    setErrorMessage(null)
  
    try {
      const res = await fetch(
        'https://asset-manager-backend-xlkf.onrender.com/admin/auth/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: values.email, password: values.password })
        }
      )
  
      const data = await res.json()
  
      if (!res.ok) throw new Error(data.message || 'Login failed')
  
      // Determine role directly from response
      const role = data.user.role || 'user'
  
      // Save token & role
      const storage = values.remember ? localStorage : sessionStorage
      storage.setItem('access_token', data.accessToken) // <-- use data.accessToken
      storage.setItem('role', role)
  
      // Redirect based on role
      window.location.href = role === 'admin' ? '/admin/home' : '/user/home'
    } catch (error: any) {
      console.error('Login error:', error)
      setErrorMessage(error.message)
    } finally {
      setLoading(false)
    }
  }
  
  
  
  return (
    <div className="relative bg-background text-foreground min-h-screen flex flex-col items-center justify-center py-6 px-4">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      <div className="max-w-md w-full border border-border p-8 rounded-xl bg-card shadow-sm">
        <div className="mb-6 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-background shadow-md ring-2 ring-border flex items-center justify-center">
            <User size={50} className="text-slate-700" />
          </div>
        </div>


        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleLogin)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormControl>
                    <Input
                      placeholder="Enter email"
                      type="email"
                      className="pl-4 pr-10"
                      {...field}
                    />
                  </FormControl>
                  <User className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      className="pl-4 pr-10"
                      {...field}
                    />
                  </FormControl>

                  {showPassword ? (
                    <EyeOff
                      className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                      onClick={() => setShowPassword(false)}
                    />
                  ) : (
                    <Eye
                      className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                      onClick={() => setShowPassword(true)}
                    />
                  )}

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="remember"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm text-slate-600">
                      Remember me
                    </FormLabel>
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="link"
                className="text-[#1E2772] text-sm"
              >
                Forgot Password?
              </Button>
            </div>

            {errorMessage && (
              <p className="text-red-500 text-sm text-center">{errorMessage}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-[#1E2772] hover:bg-[#1e4272] text-white text-[15px] py-3"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

           
          </form>
        </Form>
      </div>
    </div>
  )
}
