'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/_libs/supabase'
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession'

export default function Page() {
  const { session, isLoading, token } = useSupabaseSession()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/session_check')
  }

  return (
    <main className="min-h-screen bg-[#f4f4f4] px-4 py-12">
      <div className="max-w-md mx-auto bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">ログイン状態確認ページ</h1>

        {isLoading ? (
          <p className="text-gray-700">ログイン状態を確認中です...</p>
        ) : session ? (
          <div className="space-y-4">
            <p className="text-gray-900 font-medium">ログイン中です</p>

            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-semibold">メールアドレス：</span>
                {session.user.email}
              </p>
              <p>
                <span className="font-semibold">tokenあり：</span>
                {token ? 'あり' : 'なし'}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full text-black bg-[#43DDFF] hover:bg-[#3bb0cc] font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              ログアウト
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-900 font-medium">未ログインです</p>

            <Link
              href="/sign_in"
              className="block w-full text-center text-black bg-[#43DDFF] hover:bg-[#3bb0cc] font-medium rounded-lg text-sm px-5 py-2.5"
            >
              ログインページへ
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
