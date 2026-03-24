"use client";

import { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

export default function Page() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reservations, setReservations] = useState<any[]>([]);

  const timeOptions = [
    "09:00","09:30","10:00","10:30",
    "11:00","11:30","12:00","12:30",
    "13:00","13:30","14:00","14:30",
    "15:00","15:30","16:00","16:30",
    "17:00","17:30","18:00"
  ];

  // 🔥 예약 데이터 가져오기 (시간 중복 체크용)
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "reservations"),
      (snapshot) => {
        const data: any[] = [];
        snapshot.forEach((doc) => {
          data.push(doc.data());
        });
        setReservations(data);
      }
    );

    return () => unsubscribe();
  }, []);

  const bookedTimes = reservations
    .filter((item) => item.date === date)
    .map((item) => item.time);

  // ✅ 예약하기
  const handleSubmit = async () => {
    if (!name || !date || !time) {
      alert("모든 값을 입력하세요");
      return;
    }

    // 중복 체크
    const q = query(
      collection(db, "reservations"),
      where("date", "==", date),
      where("time", "==", time)
    );

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      alert("이미 해당 시간에 예약이 있습니다 ❌");
      return;
    }

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

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">설치 예약</h1>

      {/* 이름 */}
      <input
        className="w-full border p-2 mb-3 rounded"
        placeholder="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* 날짜 */}
      <input
        className="w-full border p-2 mb-3 rounded"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      {/* 시간 */}
      <select
        className="w-full border p-2 mb-3 rounded"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      >
        <option value="">시간 선택</option>
        {timeOptions.map((t) => (
          <option key={t} value={t} disabled={bookedTimes.includes(t)}>
            {t} {bookedTimes.includes(t) ? "❌" : ""}
          </option>
        ))}
      </select>

      {/* 버튼 */}
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white p-2 rounded"
      >
        예약하기
      </button>
    </div>
  );
}