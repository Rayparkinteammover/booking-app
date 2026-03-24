"use client";

import { useState, useEffect } from "react";
import { db, auth, provider } from "../firebase";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";

import {
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

export default function Page() {
  const [user, setUser] = useState<any>(null);
  const [reservations, setReservations] = useState<any[]>([]);

  const ADMIN_EMAIL = "teammoverservice@gmail.com";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
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

  if (!user) {
    return (
      <div className="p-10 text-center">
        <button
          onClick={handleLogin}
          className="bg-black text-white p-2 rounded"
        >
          관리자 로그인
        </button>
      </div>
    );
  }

  if (!isAdmin) {
    return <div className="p-10 text-center">접근 권한 없음 ❌</div>;
  }

  const today = new Date().toISOString().slice(0, 10);
  const total = reservations.length;
  const todayCount = reservations.filter((r) => r.date === today).length;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">관리자 대시보드</h1>
        <button onClick={handleLogout} className="text-red-500">
          로그아웃
        </button>
      </div>

      <div className="p-4 bg-gray-100 rounded mb-4">
        <div>총 예약: {total}</div>
        <div>오늘 예약: {todayCount}</div>
      </div>

      <div>
        {reservations.map((item) => (
          <div
            key={item.id}
            className="flex justify-between p-3 border mb-2 rounded"
          >
            <div>
              {item.name} / {item.date} {item.time}
            </div>

            <button
              onClick={() => handleDelete(item.id)}
              className="text-red-500"
            >
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}