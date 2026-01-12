// ===== SEMESTER FIXED DATES =====
const SEM_START = new Date("2026-01-05");
const SEM_END   = new Date("2026-04-11");

// ===== HOLIDAYS =====
const collegeHolidays = [
  "2026-01-14","2026-01-15","2026-01-16","2026-01-17",
  "2026-01-19","2026-01-20","2026-01-21","2026-01-22","2026-01-23","2026-01-24",
  "2026-01-26",
  "2026-02-10","2026-02-20","2026-02-21",
  "2026-03-04",
  "2026-03-05","2026-03-06","2026-03-07","2026-03-08","2026-03-09",
  "2026-03-10","2026-03-11","2026-03-12","2026-03-13","2026-03-14",
  "2026-03-21","2026-03-26",
  "2026-04-18","2026-04-25"
];

// ===== SATURDAY ONLINE TIMETABLE =====
const specialSaturdayMap = {
  "2026-01-10": 4,
  "2026-01-30": 5,
  "2026-02-07": 4,
  "2026-02-14": 5,
  "2026-02-21": 3,
  "2026-03-28": 4,
  "2026-04-04": 5,
  "2026-04-11": 4
};

document.getElementById("calculate").addEventListener("click", function () {

  const current = new Date(document.getElementById("currentdate").value);
  const attended = Number(document.getElementById("attended").value);

  const subjectDays = Array.from(document.querySelectorAll(".day:checked"))
    .map(d => Number(d.value));

  let classesTillNow = 0;
  let totalSemesterClasses = 0;

  // ---- count till today ----
  for (let d = new Date(SEM_START); d <= current; d.setDate(d.getDate() + 1)) {
    let day = d.getDay();
    const dStr = d.toISOString().split("T")[0];
    if (day === 6 && specialSaturdayMap[dStr]) day = specialSaturdayMap[dStr];
    if (subjectDays.includes(day) && !collegeHolidays.includes(dStr)) classesTillNow++;
  }

  // ---- count full semester ----
  for (let d = new Date(SEM_START); d <= SEM_END; d.setDate(d.getDate() + 1)) {
    let day = d.getDay();
    const dStr = d.toISOString().split("T")[0];
    if (day === 6 && specialSaturdayMap[dStr]) day = specialSaturdayMap[dStr];
    if (subjectDays.includes(day) && !collegeHolidays.includes(dStr)) totalSemesterClasses++;
  }

  const attendancePercent = classesTillNow ? (attended / classesTillNow) * 100 : 0;
  const roundedAttendance = Math.ceil(attendancePercent);

  let marks = 0, status="", color="";

  if (roundedAttendance < 75)      { marks=0; status="❌ Not Eligible"; color="red"; }
  else if (roundedAttendance<=80)  { marks=1; status="⚠️ Just Eligible"; color="orange"; }
  else if (roundedAttendance<=85)  { marks=2; status="🙂 Safe"; color="green"; }
  else if (roundedAttendance<=90)  { marks=3; status="🙂 Safe"; color="green"; }
  else if (roundedAttendance<=95)  { marks=4; status="😀 Very Good"; color="green"; }
  else                             { marks=5; status="🏆 Excellent"; color="green"; }

  const minRequired = Math.ceil(0.75 * totalSemesterClasses);
  const remainingMissable = Math.max(0, totalSemesterClasses - minRequired - (classesTillNow - attended));

  document.getElementById("result").innerHTML = `
    <p><strong>Classes till now:</strong> ${classesTillNow}</p>
    <p><strong>Total semester classes:</strong> ${totalSemesterClasses}</p>
    <p><strong>Current Attendance:</strong> ${attendancePercent.toFixed(2)}%</p>
    <p><strong>Current Attendance Marks:</strong> ${marks} / 5</p>
    <p><strong>You can still miss:</strong> ${remainingMissable} classes</p>
    <p style="color:${color}; font-weight:bold;">${status}</p>
  `;
});






