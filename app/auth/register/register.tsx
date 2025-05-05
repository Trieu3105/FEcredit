' use client';



export default function Register() {
  return (
    <div>
        <h1 className="text-2xl font-bold text-center">Đăng ký tài khoản</h1>
        <form className="mt-8 space-y-6" action="#" method="POST">
            <div className="rounded-md shadow-sm -space-y-px">
            <div>
                <label className="block text-sm font-medium">Tên đăng nhập</label>
                <input
                type="text"
                name="username"
                required
                className="mt-1 w-full border rounded-md px-3 py-2"
                />
            </div>
            <div>
                <label className="block text-sm font-medium">Mật khẩu</label>
                <input
                type="password"
                name="password"
                required
                className="mt-1 w-full border rounded-md px-3 py-2"
                />
            </div>
            </div>
    
            <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium w-full sm:w-auto"
            >
            Đăng ký
            </button>
        </form>
    </div>
  );
}