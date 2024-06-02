'use client'
import WriteAddress from './WriteAddress'

export default function Page() {

  return <main className={`min-h-screen flex items-center justify-center`}>
    <div className="w-[600px]">
      <WriteAddress previous={'0xC4ad0000E223E398DC329235e6C497Db5470B626'} />
    </div>
  </main>
}
