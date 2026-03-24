"use client";

import { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";

export default function Page() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [reservations, setReservations] = useState<any[]>([]);

  // 🔥 실시간 데이터 불러오기
  useEffect(() => {
    const q = query(
      collection(db, "reservations"),
      orderBy("date","asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: any[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setReservations(data);
    });

    return () => unsubscribe();
  }, []);

  // ✅ 예약 추가
  const handleSubmit = async () => {
    if (!name || !date) {
      alert("모든 값을 입력하세요");
      return;
    }

    await addDoc(collection(db, "reservations"), {
      name,
      date,
      createdAt: new Date(),
    });

    setName("");
    setDate("");
  };

  // ❌ 예약 삭제
  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "reservations", id));
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">설치 예약</h1>

      <input
        className="w-full border p-2 mb-3 rounded"
        placeholder="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="w-full border p-2 mb-3 rounded"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white p-2 rounded mb-4"
      >
        예약하기
      </button>

      {/* 🔥 예약 목록 */}
     <div className="mt-4 space-y-2">
  {reservations.map((item) => (
    <div
      key={item.id}
      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg shadow-sm"
    >
      <div>
        <div className="font-semibold">{item.name}</div>
        <div className="text-sm text-gray-500">{item.date}</div>
      </div>

      <button
        onClick={() => handleDelete(item.id)}
        className="text-red-500 text-sm hover:underline"
      >
        삭제
      </button>
    </div>
  ))}
</div>
await addDoc(collection(db, "reservations"), {
  name,
  date,
  createdAt: new Date(),
});

alert("예약 완료!"); //
      </div>
    </div>
  );
}