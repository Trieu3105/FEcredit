'use client';


export default function Forgot() {
  return (
    <div>
        <h1 className="text-2xl font-bold text-center">Quên mật khẩu</h1>
        <form className="mt-8 space-y-6" action="#" method="POST">
            <div className="rounded-md shadow-sm -space-y-px">
            <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                type="email"
                name="email"
                required
                className="mt-1 w-full border rounded-md px-3 py-2"
                />
            </div>
            </div>
    
            <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium w-full sm:w-auto"
            >
            Gửi yêu cầu
            </button>
        </form>
    </div>
  );
}