const handleSubmit = async () => {
  if (!name || !date || !time) {
    alert("모든 값을 입력하세요");
    return;
  }

  // ⭐ 중복 체크 쿼리
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

  // ✅ 예약 저장
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