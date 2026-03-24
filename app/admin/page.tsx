"use client";

import { useState, useEffect } from "react";
import { db, auth, provider } from "../firebase";
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

import {
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

export default function Page() {
  const [user, setUser] = useState<any>(null);

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reservations, setReservations] = useState<any[]>([]);

  const ADMIN_EMAIL = "여기에_본인_이메일";

  const timeOptions = [
    "09:00","09:30","10:00","10:30",
    "11:00","11:30","12:00","12:30",
    "13:00","13:30","14:00","14:30",
    "15:00","15:30","16:00","16:30",
    "17:00","17:30","18:00"
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

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

  const bookedTimes = reservations
    .filter((item) => item.date === date)
    .map((item) => item.time);

  // 📊 통계 계산
  const today = new Date().toISOString().slice(0, 10);

  const totalCount = reservations.length;
  const todayCount = reservations.filter((r) => r.date === today).length;

  const timeStats: { [key: string]: number } = {};
  reservations.forEach((r) => {
    timeStats[r.time] = (timeStats[r.time] || 0) + 1;
  });

  const handleSubmit = async () => {
    if (!name || !date || !time) {
      alert("모든 값을 입력하세요");
      return;
    }

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

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "reservations", id));
  };

  const handleLogin = async () => {
    await signInWithPopup(auth, provider);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const isAdmin = user?.email === ADMIN_EMAIL;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">설치 예약</h1>

      {!user ? (
        <button
          onClick={handleLogin}
          className="w-full bg-black text-white p-2 rounded mb-4"
        >
          Google 로그인
        </button>
      ) : (
        <div className="mb-4 flex justify-between">
          <span className="text-sm">{user.email}</span>
          <button onClick={handleLogout} className="text-red-500 text-sm">
            로그아웃
          </button>
        </div>
      )}

      {/* 예약 입력 */}
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

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white p-2 rounded mb-6"
      >
        예약하기
      </button>

      {/* 🔥 관리자 대시보드 */}
      {isAdmin && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-3">📊 관리자 대시보드</h2>

          <div className="mb-4 p-3 bg-gray-100 rounded">
            <div>총 예약: {totalCount}</div>
            <div>오늘 예약: {todayCount}</div>
          </div>

          {/* 시간별 통계 */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">⏰ 시간별 예약</h3>
            {Object.keys(timeStats).map((t) => (
              <div key={t} className="text-sm">
                {t} : {timeStats[t]}건
              </div>
            ))}
          </div>

          {/* 리스트 */}
          <div className="space-y-2">
            <h3 className="font-semibold">📋 예약 목록</h3>

            {reservations.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <div>{item.name}</div>
                  <div className="text-sm text-gray-500">
                    {item.date} {item.time}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 text-sm"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}