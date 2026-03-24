export default function Page() {
  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">설치 예약</h1>

      <input
        className="w-full border p-2 mb-3 rounded"
        placeholder="이름"
      />

      <input
        className="w-full border p-2 mb-3 rounded"
        type="date"
      />

      <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        예약하기
      </button>
    </div>
  );
}