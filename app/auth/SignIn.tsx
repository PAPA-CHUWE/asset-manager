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

interface SignInFormValues {
  email: string
  password: string
  remember: boolean
}

export default function SignIn() {
  const [showPassword, setShowPassword] = React.useState(false)

  const form = useForm<SignInFormValues>({
    defaultValues: {
      email: '',
      password: '',
      remember: false
    }
  })

  return (
    <div className="relative bg-background text-foreground min-h-screen flex flex-col items-center justify-center py-6 px-4">
      {/* ModeToggle at top-right corner */}
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      <div className="max-w-md w-full border border-border p-8 rounded-xl bg-card shadow-sm">

        {/* Profile Icon */}
        <div className="mb-6 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-background shadow-md ring-2 ring-border flex items-center justify-center">
            <User size={50} className="text-slate-700" />
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => console.log(values))}
            className="space-y-6"
          >
            {/* Email */}
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

            {/* Password */}
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

            {/* Remember + Forgot Password */}
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

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-[#1E2772] hover:bg-[#1e4272] text-white text-[15px] py-3"
            >
              Sign In
            </Button>

            <p className="text-sm mt-4 text-center text-slate-600">
              Don&apos;t have an account?
              <span className="text-[#1E2772] font-medium hover:underline ml-1 cursor-pointer">
                Register here
              </span>
            </p>
          </form>
        </Form>
      </div>
    </div>
  )
}
