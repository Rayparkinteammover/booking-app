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
  getDocs,
  where,
} from "firebase/firestore";

export default function Page() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reservations, setReservations] = useState<any[]>([]);

  // 🔥 데이터 불러오기
  useEffect(() => {
    const q = query(
      collection(db, "reservations"),
      orderBy("date", "asc")
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

  // ✅ 예약 추가 (중복 + 시간 제한)
  const handleSubmit = async () => {
    if (!name || !date || !time) {
      alert("모든 값을 입력하세요");
      return;
    }

    // ⭐ 시간 제한 체크 (09:00 ~ 18:00)
    if (time < "09:00" || time > "18:00") {
      alert("예약 가능 시간은 09:00 ~ 18:00 입니다 ⏰");
      return;
    }

    // ⭐ 중복 체크
    const q = query(
      collection(db, "reservations"),
      where("date", "==", date),
      where("time", "==", time)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      alert("이미 해당 시간에 예약이 있습니다 ❌");
      return;
    }

    // ✅ 저장
    await addDoc(collection(db, "reservations"), {
      name,
      date,
      time,
      createdAt: new Date(),
    });

    alert("예약 완료!");
    setName("");
    setDate("");
    setTime("");
  };

  // ❌ 삭제
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

      <input
        className="w-full border p-2 mb-3 rounded"
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white p-2 rounded mb-4"
      >
        예약하기
      </button>

      {/* 🔥 리스트 */}
      <div className="mt-4 space-y-2">
        {reservations.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg shadow-sm"
          >
            <div>
              <div className="font-semibold">{item.name}</div>
              <div className="text-sm text-gray-500">
                {item.date} {item.time}
              </div>
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
    </div>
  );
}