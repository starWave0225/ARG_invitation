"use client";

import { useState } from "react";

type View = "home" | "catalog" | "directory" | "hub";
const programs = [
  ["Computer Science", "CS", "College of Computing", "B.S. / M.S."],
  ["Data Science", "DS", "College of Computing", "B.S. / M.S."],
  ["Visual Communication", "VC", "College of Arts & Media", "B.F.A."],
  ["Economics", "EC", "College of Social Sciences", "B.A."],
  ["Biomedical Sciences", "BS", "College of Health", "B.S."],
];
const students = [
  ["MENG ZHI", "2025", "Data Science", "2025-DS-MZ-104305"],
  ["JIN WEI", "2024", "Computer Science", "2024-CS-JW-040219"],
  ["LUO XIN", "2025", "Visual Communication", "2025-VC-LX-281740"],
  ["CHEN YU", "2023", "Economics", "2023-EC-CY-193802"],
];

export default function UniversitySite() {
  const [view, setView] = useState<View>("home");
  const [name, setName] = useState("");
  const [year, setYear] = useState("2025");
  const [major, setMajor] = useState("DS");
  const [studentId, setStudentId] = useState("");
  const [message, setMessage] = useState("");
  const [registeredProfile,setRegisteredProfile]=useState<{name:string;year:string;major:string;studentId:string}|null>(null);
  const navigate=(next:View)=>{setView(next);setMessage("")};
  const register=()=>{
    const cleanName=name.trim();
    const cleanId=studentId.trim().toUpperCase();
    const match=cleanId.match(/^(\d{4})-([A-Z]{2})-([A-Z]{2,4})-(\d{6})$/);
    const latinInitials=cleanName.split(/\s+/).filter(Boolean).map(part=>part[0]?.toUpperCase()).join("");
    const hasChinese=/[\u3400-\u9fff]/.test(cleanName);
    const unused=!students.some(row=>row[3]===cleanId);
    const valid=!!match&&cleanName.length>=2&&match[1]===year&&match[2]===major&&unused&&(hasChinese||match[3]===latinInitials);
    if(valid){
      const profile={name:cleanName,year,major,studentId:cleanId};
      localStorage.setItem("jia-school-registered","true");
      localStorage.setItem("jia-school-profile",JSON.stringify(profile));
      setRegisteredProfile(profile);setMessage("success");
    }else setMessage("error");
  };

  return <main className="route-page university-route">
    <div className="uni-utility"><span>Students　Faculty & Staff　Alumni　Parents</span><span>Directory　Library　Give　🔍 Search</span></div>
    <header className="uni-header">
      <button className="uni-brand" onClick={()=>navigate("home")}><i>NB</i><span><b>NORTHBRIDGE</b><small>UNIVERSITY</small></span></button>
      <nav><button onClick={()=>navigate("catalog")}>Academics</button><button>Admissions</button><button>Research</button><button>Campus Life</button><button>About</button></nav>
      <button className="uni-hub-button" onClick={()=>navigate("hub")}>Student Hub</button>
    </header>
    {view==="home"&&<div className="uni-home">
      <section className="uni-hero"><div><small>KNOWLEDGE IN ACTION</small><h1>Learn boldly.<br/>Build what’s next.</h1><p>A global research university where ideas cross disciplines, communities and borders.</p><button onClick={()=>navigate("catalog")}>Explore academics →</button></div><span>Northbridge Commons · Fall term</span></section>
      <div className="uni-quick"><button onClick={()=>navigate("catalog")}><b>Academic Catalog</b><span>Programs, courses and policies</span></button><button onClick={()=>navigate("directory")}><b>Campus Directory</b><span>Find students and organizations</span></button><button onClick={()=>navigate("hub")}><b>Student Hub</b><span>Registration, grades and services</span></button></div>
      <section className="uni-stories"><p>AT NORTHBRIDGE</p><h2>Ideas become impact.</h2><div><article><b>Computing across disciplines</b><p>New pathways connect data, public health and responsible technology.</p><small>ACADEMICS　→</small></article><article><b>A campus built for belonging</b><p>More than 800 student organizations connect learners from around the world.</p><small>STUDENT LIFE　→</small></article><article><b>Fall events calendar</b><p>Lectures, exhibitions, performances and community programs—open to all.</p><small>VIEW EVENTS　→</small></article></div></section>
    </div>}
    {view==="catalog"&&<div className="uni-inner">
      <div className="uni-breadcrumb">Home　/　Academics　/　Academic Catalog</div>
      <div className="uni-title"><p>2025–2026 UNDERGRADUATE CATALOG</p><h1>Programs of Study</h1><span>Explore academic programs by college, credential or area of interest.</span></div>
      <div className="uni-tools"><input placeholder="Search programs, departments or codes"/><button>Search catalog</button></div>
      <section className="uni-content-grid"><aside><b>Catalog navigation</b><button className="active">Programs of Study</button><button>Course Descriptions</button><button>Academic Policies</button><button>Colleges & Schools</button><button>Archived Catalogs</button></aside><div><h2>Undergraduate programs</h2><p className="uni-note">Program codes are used by university student services and legacy community systems.</p><div className="uni-program-table"><div><b>Program</b><b>Code</b><b>College</b><b>Degree</b></div>{programs.map(row=><div key={row[1]}>{row.map((cell,i)=><span key={cell} className={i===1?"code":""}>{cell}</span>)}</div>)}</div><button className="uni-link" onClick={()=>navigate("directory")}>Continue to campus directory →</button></div></section>
    </div>}
    {view==="directory"&&<div className="uni-inner">
      <div className="uni-breadcrumb">Home　/　Campus Directory　/　Public profiles</div>
      <div className="uni-title"><p>CAMPUS DIRECTORY</p><h1>People at Northbridge</h1><span>Public profiles shared by students participating in campus organizations.</span></div>
      <section className="uni-directory"><div className="uni-directory-search"><input defaultValue="Data Science"/><button>Search</button></div><div className="uni-legacy-note"><b>Legacy Community ID</b><p>Community profiles use: <strong>entry year – program code – name initials – six-digit record number</strong>.</p></div><div className="uni-student-list"><div><b>Name</b><b>Entry year</b><b>Program</b><b>Community ID</b></div>{students.map(row=><div key={row[3]}>{row.map(cell=><span key={cell}>{cell}</span>)}</div>)}</div><div className="uni-invite"><div><small>INTERNATIONAL WELCOME DESK</small><h3>Pending exchange profile</h3><p><b>Lin Chuan</b> · 2025 entry · Data Science<br/>Reserved record number: <strong>184206</strong></p></div><button onClick={()=>navigate("hub")}>Create community profile</button></div></section>
    </div>}
    {view==="hub"&&<div className="uni-hub">
      <aside><button className="uni-brand" onClick={()=>navigate("home")}><i>NB</i><span><b>NORTHBRIDGE</b><small>STUDENT SERVICES</small></span></button><small>STUDENT HUB</small><button className="active">Account activation</button><button>Course registration</button><button>Academic records</button><button>Enrollment verification</button><button>Campus community</button><footer>ITS Service Desk<br/>System status: ● Operational</footer></aside>
      <section><header><div><p>IDENTITY & ACCESS MANAGEMENT</p><h1>Activate a community account</h1></div><button onClick={()=>navigate("home")}>University home</button></header><div className="uni-hub-alert">Legacy service notice: Community accounts are validated against the identifier format. Registrar synchronization is temporarily unavailable.</div>
      {message!=="success"?<div className="uni-form-card"><h2>Student information</h2><p>Create a community profile using a valid entry year, catalog program code, your name initials and an unused six-digit record number.</p><div className="uni-form-grid"><label>Legal or preferred name<input value={name} onChange={e=>setName(e.target.value)}/></label><label>Entry year<select value={year} onChange={e=>setYear(e.target.value)}><option>2025</option><option>2024</option></select></label><label>Program code<select value={major} onChange={e=>setMajor(e.target.value)}>{programs.map(p=><option key={p[1]}>{p[1]}</option>)}</select></label><label>Community ID<input value={studentId} onChange={e=>setStudentId(e.target.value.toUpperCase())} placeholder="YYYY-XX-II-000000"/></label></div>{message==="error"&&<p className="uni-error">Validation failed. Check the year, real program code, name initials and ensure the six-digit record number is unused.</p>}<button onClick={register}>Validate and activate</button></div>:<div className="uni-success"><span>✓</span><div><small>ACCOUNT ACTIVATED</small><h2>Welcome, {registeredProfile?.name}.</h2><p>Your campus community profile is active. Keep these details consistent when a community administrator verifies you.</p><dl><dt>Community ID</dt><dd>{registeredProfile?.studentId}</dd><dt>Entry year</dt><dd>{registeredProfile?.year}</dd><dt>Program</dt><dd>{registeredProfile?.major}</dd><dt>Access</dt><dd>Student organizations · Public directory</dd></dl><b>Return to the investigation and answer with this exact profile.</b></div></div>}
      </section>
    </div>}
    <footer className="uni-footer">© 2026 Northbridge University　·　Accessibility　Privacy　Emergency Information　Title IX</footer>
  </main>;
}
