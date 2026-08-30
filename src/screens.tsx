import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { Link, NavLink, Outlet, useNavigate, useParams, useLocation } from "react-router";

// ─── Types ─────────────────────────────────────────────────────────────────
type Post = { id:number;author:string;time:string;title:string;body:string;category:string;region:string;childAge:string;cheers:number;comments:number;reactions?:Record<string,number>;minor?:boolean;senior?:boolean };
type Profile = { nickname:string;age:number;childCount:number;children:string[];region:string;lifeStatus:string;housing:string;difficulties:string[];interests:string[];wantedSenior:string[];isMinor:boolean };
type MockUser = { nickname:string;region:string;childAges:string[];lifeStatus:string;difficulties:string[];experiences:string[];quote:string };

// ─── Post data ─────────────────────────────────────────────────────────────
const basePosts:Post[] = [
  {id:1,author:"햇살맘",time:"12분 전",title:"아이가 낮잠을 안 자는 날, 저만 그런가요?",body:"오늘은 유난히 잠들기 어려워하네요. 선배님들의 작은 팁도 큰 힘이 됩니다.",category:"양육",region:"경기",childAge:"0~2세",cheers:28,comments:12},
  {id:2,author:"우리둘",time:"35분 전",title:"면접 볼 때 아이 이야기는 어디까지 하면 좋을까요",body:"구직을 다시 시작했어요. 솔직하면서도 당당하게 이야기하고 싶습니다.",category:"취업",region:"경기",childAge:"0~2세",cheers:41,comments:19},
  {id:3,author:"봄날의집",time:"1시간 전",title:"이사 후 아이가 새로운 동네를 좋아하게 된 이유",body:"작은 산책길 하나가 우리에게 큰 위로가 됐어요. 저희의 새 집 적응기를 나눠요.",category:"후기",region:"서울",childAge:"3~5세",cheers:64,comments:15,senior:true},
  {id:4,author:"차분한하루",time:"2시간 전",title:"퇴근 후 20분, 우리만의 저녁 루틴",body:"거창하지 않아도 함께 웃는 시간이 있으면 하루가 조금 달라져요.",category:"양육",region:"인천",childAge:"초등학생",cheers:33,comments:7},
  {id:5,author:"내일을향해",time:"3시간 전",title:"국비교육 시작 전, 용기 내어 질문합니다",body:"경력 공백이 길어 걱정되지만 한 걸음씩 준비해보려 해요.",category:"질문",region:"부산",childAge:"3~5세",cheers:22,comments:11},
  {id:6,author:"별빛친구",time:"어제",title:"아이와 처음 어린이집에 간 날",body:"문 앞에서 손을 놓던 순간의 마음을 잊지 못할 것 같아요. 지금은 웃으며 인사해요.",category:"후기",region:"대전",childAge:"3~5세",cheers:89,comments:23,senior:true},
  {id:7,author:"든든한나무",time:"어제",title:"생활비 기록, 부담 없이 시작하는 방법",body:"완벽한 가계부보다 나에게 맞는 한 줄 기록이 오래가더라고요.",category:"경제",region:"서울",childAge:"초등학생",cheers:37,comments:9},
  {id:8,author:"미소한스푼",time:"어제",title:"혼자 버티는 기분이 드는 밤에는",body:"답을 찾기보다 그냥 마음을 적어도 괜찮다는 걸 이곳에서 배웠어요.",category:"정서",region:"경기",childAge:"중학생",cheers:71,comments:26},
  {id:9,author:"새싹엄마",time:"2일 전",title:"전세 계약 전 꼭 확인한 세 가지",body:"저처럼 처음 계약하시는 분들께 도움이 되길 바라며 정리해 봤어요.",category:"주거",region:"인천",childAge:"0~2세",cheers:46,comments:13,senior:true},
  {id:10,author:"하늘바라기",time:"2일 전",title:"아이 학교 상담, 어떻게 준비하셨나요?",body:"다음 주 상담이라 마음이 조금 긴장돼요. 대화 팁이 있을까요?",category:"학교생활",region:"부산",childAge:"초등학생",cheers:18,comments:8},
  {id:11,author:"작은용기",time:"3일 전",title:"처음으로 내 시간을 만들었어요",body:"아이와 약속한 30분 동안 책을 읽었는데, 숨이 조금 트이는 기분이었어요.",category:"정서",region:"대전",childAge:"0~2세",cheers:56,comments:14},
  {id:12,author:"오늘도우리",time:"3일 전",title:"주말에 돈 많이 들지 않는 놀이 추천",body:"근처 도서관과 공원을 연결해서 다녀왔어요. 아이가 참 좋아했답니다.",category:"양육",region:"경기",childAge:"3~5세",cheers:39,comments:17},
  {id:13,author:"열일곱엄마",time:"20분 전",title:"학교와 육아 사이에서 지치지 않는 방법",body:"오늘 하루도 잘 버틴 우리에게 서로 한마디씩 건네요.",category:"학교생활",region:"서울",childAge:"0~2세",cheers:34,comments:10,minor:true},
  {id:14,author:"나의진로",time:"어제",title:"검정고시 준비, 같이 계획 세워요",body:"아기가 자는 시간에 조금씩 공부하고 있어요. 함께하는 분 있나요?",category:"진로",region:"경기",childAge:"임신 중",cheers:29,comments:16,minor:true},
  {id:15,author:"한걸음씩",time:"어제",title:"가족에게 내 마음을 꺼내는 게 어려워요",body:"말하고 싶은데 상처받을까 망설여져요. 들어주셔도 감사해요.",category:"고민",region:"부산",childAge:"0~2세",cheers:44,comments:21,minor:true},
  {id:16,author:"초록우산",time:"4일 전",title:"아이와 새로운 집을 구하며 배운 것",body:"불안했던 시간 끝에 우리 둘만의 작은 보금자리를 찾았어요.",category:"후기",region:"경기",childAge:"0~2세",cheers:92,comments:28,senior:true},
];

// ─── Mock users for matching ────────────────────────────────────────────────
const mockUsers:MockUser[] = [
  {nickname:"햇살맘",region:"경기",childAges:["0~2세"],lifeStatus:"일을 구하고 있어요",difficulties:["취업","양육/돌봄"],experiences:[],quote:"어린이집 보내고 취업 준비하고 있어요."},
  {nickname:"새싹엄마",region:"인천",childAges:["0~2세"],lifeStatus:"일을 구하고 있어요",difficulties:["취업","경제적인 문제"],experiences:[],quote:"첫 취업 준비, 함께라면 할 수 있어요."},
  {nickname:"내일을향해",region:"부산",childAges:["3~5세"],lifeStatus:"취업을 준비하고 있어요",difficulties:["취업","학업"],experiences:[],quote:"용기 내어 한 걸음씩 나아가고 있어요."},
  {nickname:"작은용기",region:"대전",childAges:["0~2세"],lifeStatus:"육아에 집중하고 있어요",difficulties:["정서적인 어려움","양육/돌봄"],experiences:[],quote:"처음으로 내 시간을 만들었어요."},
  {nickname:"하늘바라기",region:"부산",childAges:["초등학교 1~3학년"],lifeStatus:"일을 쉬고 있어요",difficulties:["자녀 교육","경제적인 문제"],experiences:[],quote:"아이 학교 상담, 어떻게 준비하셨나요?"},
  {nickname:"우리둘",region:"경기",childAges:["3~5세"],lifeStatus:"직장을 다니고 있어요",difficulties:[],experiences:["취업","양육/돌봄"],quote:"아이를 키우면서 다시 일을 시작했어요."},
  {nickname:"봄날의집",region:"서울",childAges:["초등학교 1~3학년"],lifeStatus:"직장을 다니고 있어요",difficulties:[],experiences:["주거","경제적인 문제"],quote:"새로운 집을 구하며 많은 걸 배웠어요."},
  {nickname:"차분한하루",region:"인천",childAges:["초등학교 1~3학년"],lifeStatus:"직장을 다니고 있어요",difficulties:[],experiences:["양육/돌봄","취업","자녀 교육"],quote:"아이와 저, 함께 성장하고 있어요."},
  {nickname:"다온맘",region:"경기",childAges:["초등학교 1~3학년"],lifeStatus:"직장을 다니고 있어요",difficulties:[],experiences:["취업","양육/돌봄","자녀 교육"],quote:"아이 3살 때부터 일을 시작했어요."},
  {nickname:"별빛친구",region:"대전",childAges:["초등학교 1~3학년"],lifeStatus:"직장을 다니고 있어요",difficulties:[],experiences:["양육/돌봄","취업","경제적인 문제"],quote:"아이와 처음 어린이집에 간 날을 잊지 못해요."},
  {nickname:"든든한나무",region:"서울",childAges:["초등학교 4~6학년"],lifeStatus:"직장을 다니고 있어요",difficulties:[],experiences:["경제적인 문제","주거","취업"],quote:"생활비 기록으로 조금씩 나아지고 있어요."},
  {nickname:"오늘도우리",region:"경기",childAges:["3~5세"],lifeStatus:"직장을 다니고 있어요",difficulties:[],experiences:["양육/돌봄","취업"],quote:"아이와 함께 자라고 있어요."},
  {nickname:"미소한스푼",region:"경기",childAges:["중학생"],lifeStatus:"직장을 다니고 있어요",difficulties:[],experiences:["정서적인 어려움","양육/돌봄","인간관계"],quote:"마음을 적는 게 큰 도움이 됐어요."},
  {nickname:"초록우산",region:"경기",childAges:["초등학교 1~3학년"],lifeStatus:"직장을 다니고 있어요",difficulties:[],experiences:["주거","양육/돌봄","경제적인 문제"],quote:"아이와 새로운 집을 구하며 배운 것들."},
];

const childAgeOrder = ["임신 중","0~2세","3~5세","초등학교 1~3학년","초등학교 4~6학년","중학생","고등학생","대학생/성인"];

function scoreSimilar(profile:Profile, u:MockUser):{score:number;reasons:string[]} {
  let score = 0; const reasons:string[] = [];
  if (u.region === profile.region) { score += 2; reasons.push("같은 지역"); }
  profile.difficulties.forEach(d => { if (u.difficulties.includes(d)) { score += 3; reasons.push(`${d} 고민`); } });
  if (profile.children.some(c => u.childAges.includes(c))) { score += 2; reasons.push("비슷한 자녀 연령"); }
  if (u.lifeStatus === profile.lifeStatus) { score += 2; reasons.push("비슷한 생활 상황"); }
  return { score, reasons };
}

function scoreSenior(profile:Profile, u:MockUser):{score:number;expMatch:string[]} {
  const expMatch = profile.difficulties.filter(d => u.experiences.includes(d));
  let score = expMatch.length * 4;
  if (u.region === profile.region) score += 1;
  const userLevel = Math.max(0, ...profile.children.map(c => childAgeOrder.indexOf(c)));
  const seniorLevel = Math.max(0, ...u.childAges.map(c => childAgeOrder.indexOf(c)));
  if (seniorLevel > userLevel) score += 2;
  return { score, expMatch };
}

// ─── Context ────────────────────────────────────────────────────────────────
export const AppCtx = createContext<any>(null);
export const useApp = () => useContext(AppCtx);
export function Provider({children}:{children:ReactNode}) {
  const [posts,setPosts] = useState(basePosts);
  const [profile,setProfile] = useState<Profile>({
    nickname:"다온",age:28,childCount:1,children:["0~2세"],region:"경기",
    lifeStatus:"일을 구하고 있어요",housing:"안정적으로 거주하고 있어요",
    difficulties:["취업","양육/돌봄"],interests:["취업","양육","경제"],
    wantedSenior:["취업 경험이 있는 부모"],isMinor:false,
  });
  const [liked,setLiked] = useState<number[]>([]);
  return <AppCtx.Provider value={{posts,setPosts,profile,setProfile,liked,setLiked}}>{children}</AppCtx.Provider>;
}

// ─── UI Primitives ──────────────────────────────────────────────────────────
const Icon = ({children}:{children:string}) => <span className="text-lg leading-none">{children}</span>;
function Brand(){return <Link to="/home" className="flex items-center gap-1.5 font-display text-xl tracking-tight text-[#355b4b]"><span className="text-lg">🌱</span>다육이</Link>}
const Pill = ({children}:{children:ReactNode}) => <span className="rounded-full bg-[#e5f0e7] px-2.5 py-1 text-[11px] text-[#4f775f]">{children}</span>;
const Input = ({placeholder,type="text",value,onChange}:{placeholder:string;type?:string;value?:string;onChange?:any}) => <input type={type} value={value} onChange={onChange} placeholder={placeholder} className="w-full rounded-2xl border border-[#e2e1da] bg-white px-4 py-4 outline-none placeholder:text-[#a7aaa4] focus:border-[#85ad91]"/>;
function Section({title,link,children}:{title:string;link?:string;children:ReactNode}){return <section className="py-5"><div className="mb-3 flex items-center justify-between"><h2 className="font-display text-lg font-bold">{title}</h2>{link&&<Link to={link} className="text-xs text-[#60816b]">더보기 →</Link>}</div><div className="space-y-3">{children}</div></section>}
function PostCard({post}:{post:Post}){return <Link to={`/community/${post.id}`} className="block rounded-[22px] border border-[#ece9e1] bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-center justify-between"><div className="flex gap-2"><Pill>{post.category}</Pill>{post.senior&&<Pill>선배 이야기</Pill>}</div><span className="text-[11px] text-[#969b95]">{post.time}</span></div><h3 className="mt-3 font-bold leading-6 text-[#333a35]">{post.title}</h3><p className="mt-1 line-clamp-2 text-xs leading-5 text-[#737a73]">{post.body}</p><div className="mt-3 flex justify-between text-[11px] text-[#7f8780]"><span>{post.author} · {post.region}</span><span>♡ {post.cheers} &nbsp; ◌ {post.comments}</span></div></Link>}
function Header({back,title}:{back?:boolean;title?:string}){const nav=useNavigate();return <header className="flex items-center justify-between px-5 pb-4 pt-6">{back?<button onClick={()=>nav(-1)} className="grid size-9 place-items-center rounded-full bg-[#f1eee7]">‹</button>:<Brand/>}<strong className="text-sm">{title}</strong>{back?<span className="size-9"/>:<Link className="grid size-9 place-items-center rounded-full bg-[#e7f0e8] text-[#517a62]" to="/write">✎</Link>}</header>}
function Nav(){const{profile}=useApp();const links=[["/home","⌂","홈"],["/community","▤","커뮤니티"],["/match","♧","연결"],["/my","☺","마이"]];return <nav className="fixed bottom-0 left-1/2 z-20 flex w-full max-w-[520px] -translate-x-1/2 items-center justify-around border-t border-[#e9e5db] bg-[#fdfcf8]/95 px-3 py-3 backdrop-blur">{links.map(([to,i,t])=><NavLink key={to} to={to} className={({isActive})=>`flex min-w-14 flex-col items-center gap-1 text-[11px] ${isActive?"text-[#4f8268]":"text-[#8c928b]"}`}><Icon>{i}</Icon><span>{t}</span></NavLink>)}</nav>}

// ─── AppShell ───────────────────────────────────────────────────────────────
export function AppShell(){return <div className="min-h-screen bg-[#f7f3ea]"><main className="mx-auto min-h-screen w-full max-w-[520px] bg-[#fdfcf8] pb-24 shadow-[0_0_60px_rgba(59,70,56,.08)]"><Outlet/></main><Nav/></div>}

// ─── Auth ───────────────────────────────────────────────────────────────────
export function Start(){return <div className="grid min-h-screen place-items-center bg-[#f7f3ea] p-6"><div className="w-full max-w-[410px] text-center"><div className="mx-auto mb-8 grid size-20 place-items-center rounded-[30px] bg-[#dbeee0] text-4xl shadow-[inset_0_0_0_8px_#edf6ed]">🌱</div><p className="mb-4 text-sm tracking-[.2em] text-[#648272]">다 함께 육아하는 사람들</p><h1 className="font-display text-5xl font-bold text-[#314b3e]">다육이</h1><p className="mx-auto mt-6 max-w-[280px] leading-7 text-[#69716b]">혼자가 아닌, 함께 키워가는 우리. 비슷한 상황의 사람들과 연결되어 함께 자라요.</p><div className="mt-14 space-y-3"><Link className="block rounded-2xl bg-[#547f65] py-4 font-bold text-white shadow-lg shadow-[#547f65]/20" to="/login">로그인</Link><Link className="block rounded-2xl border border-[#cddccc] bg-white py-4 font-bold text-[#547f65]" to="/signup">회원가입</Link></div><p className="mt-7 text-xs text-[#929790]">모든 이야기와 프로필은 발표용 예시 데이터입니다.</p></div></div>}
function AuthLayout({title,children}:{title:string;children:ReactNode}){return <div className="mx-auto min-h-screen max-w-[520px] bg-[#fdfcf8] px-6 pt-14"><Link to="/" className="text-[#668172]">‹ 처음으로</Link><h1 className="mt-10 font-display text-3xl font-bold text-[#314b3e]">{title}</h1>{children}</div>}
export function Login(){const n=useNavigate();return <AuthLayout title="다시 만나서 반가워요"><div className="mt-10 space-y-3"><Input placeholder="아이디"/><Input placeholder="비밀번호" type="password"/><button onClick={()=>n("/home")} className="mt-5 w-full rounded-2xl bg-[#547f65] py-4 font-bold text-white">로그인</button></div><p className="mt-8 text-center text-sm text-[#747a74]">아직 회원이 아니신가요? <Link to="/signup" className="font-bold text-[#527c63]">회원가입</Link></p></AuthLayout>}
export function Signup(){const n=useNavigate();return <AuthLayout title="우리의 연결을 시작해요"><div className="mt-8 space-y-3"><Input placeholder="닉네임"/><Input placeholder="아이디"/><Input placeholder="비밀번호" type="password"/><button onClick={()=>n("/verify")} className="mt-4 w-full rounded-2xl bg-[#547f65] py-4 font-bold text-white">회원가입</button></div><div className="my-8 flex items-center gap-3 text-xs text-[#a0a39e]"><i className="h-px flex-1 bg-[#e4e2dc]"/>간편하게 시작하기<i className="h-px flex-1 bg-[#e4e2dc]"/></div><div className="space-y-2">{["N 네이버로 시작하기","● 카카오로 시작하기","G Google로 시작하기"].map(x=><button key={x} onClick={()=>n("/verify")} className="w-full rounded-2xl border border-[#e5e2da] bg-white py-3.5 text-sm text-[#505751]">{x}</button>)}</div></AuthLayout>}
export function Verify(){const n=useNavigate();const[family,setFamily]=useState("");const[resident,setResident]=useState("");const[agreed,setAgreed]=useState(false);const ready=true;return <div className="mx-auto min-h-screen max-w-[520px] bg-[#fdfcf8] px-6 pt-10 pb-14"><Link to="/signup" className="text-sm text-[#668172]">‹ 뒤로</Link><div className="mt-8 flex size-14 items-center justify-center rounded-[20px] bg-[#dbeee0] text-2xl shadow-[inset_0_0_0_5px_#edf6ed]">✦</div><p className="mt-6 text-xs tracking-widest text-[#76a88a]">한부모가족 인증</p><h1 className="mt-2 font-display text-2xl font-bold leading-9 text-[#314b3e]">우리끼리 더 안전하게<br/>이야기할 수 있도록</h1><p className="mt-2 text-sm leading-6 text-[#737a73]">한부모가족 여부를 확인하고 있어요.</p><div className="mt-8 space-y-4"><div className="rounded-2xl border border-[#e4e1d9] bg-white p-5"><p className="text-sm font-bold text-[#333a35]">가족관계증명서</p><p className="mt-1 text-xs text-[#8a9089]">발급일 기준 3개월 이내 서류</p><label className="mt-4 flex cursor-pointer items-center gap-3"><span className="rounded-xl bg-[#e6f0e8] px-4 py-2.5 text-xs font-bold text-[#4f7f66] whitespace-nowrap">파일 선택</span>{family?<span className="truncate text-xs text-[#4f7f66]">✓ {family}</span>:<span className="text-xs text-[#a7aaa4]">파일을 선택해주세요</span>}<input type="file" accept=".pdf,.jpg,.png" className="hidden" onChange={e=>{if(e.target.files?.[0])setFamily(e.target.files[0].name||"가족관계증명서.pdf")}}/></label></div><div className="rounded-2xl border border-[#e4e1d9] bg-white p-5"><p className="text-sm font-bold text-[#333a35]">주민등록등본</p><p className="mt-1 text-xs text-[#8a9089]">발급일 기준 3개월 이내 서류</p><label className="mt-4 flex cursor-pointer items-center gap-3"><span className="rounded-xl bg-[#e6f0e8] px-4 py-2.5 text-xs font-bold text-[#4f7f66] whitespace-nowrap">파일 선택</span>{resident?<span className="truncate text-xs text-[#4f7f66]">✓ {resident}</span>:<span className="text-xs text-[#a7aaa4]">파일을 선택해주세요</span>}<input type="file" accept=".pdf,.jpg,.png" className="hidden" onChange={e=>{if(e.target.files?.[0])setResident(e.target.files[0].name||"주민등록등본.pdf")}}/></label></div></div><label className="mt-5 flex cursor-pointer items-start gap-3"><span className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border-2 text-xs font-bold transition ${agreed?"border-[#547f65] bg-[#547f65] text-white":"border-[#c9c6bf] text-transparent"}`} onClick={()=>setAgreed(!agreed)}>✓</span><span className="text-sm leading-6 text-[#555a56]">인증을 위해 제출한 정보의 이용에 동의합니다.</span></label><p className="mt-2 text-xs leading-5 text-[#9a9e9a]">제출된 서류는 한부모가족 여부 확인 목적으로만 사용되며, 확인 후 즉시 파기됩니다.</p><p className="mt-4 rounded-xl bg-[#f4f2ec] px-4 py-3 text-xs leading-5 text-[#8a9089]">🌱 프로토타입에서는 서류 제출 여부와 관계없이 다음 단계로 이동할 수 있어요.</p><button onClick={()=>n("/verify-done")} className="mt-6 w-full rounded-2xl bg-[#547f65] py-4 font-bold text-white shadow-lg shadow-[#547f65]/20">인증 요청하기</button></div>}
export function VerifyDone(){const n=useNavigate();return <div className="grid min-h-screen place-items-center bg-[#f7f3ea] p-6"><div className="w-full max-w-[410px] text-center"><div className="mx-auto mb-8 grid size-20 place-items-center rounded-[30px] bg-[#dbeee0] text-4xl shadow-[inset_0_0_0_8px_#edf6ed]">✓</div><p className="text-xs tracking-widest text-[#76a88a]">인증 완료</p><h1 className="mt-3 font-display text-3xl font-bold text-[#314b3e]">인증이 완료되었어요.</h1><p className="mx-auto mt-4 max-w-[260px] leading-7 text-[#69716b]">이제 다육이의 커뮤니티를<br/>이용할 수 있어요.</p><div className="mt-6 rounded-2xl border border-[#d9eedd] bg-[#f0f9f2] px-5 py-4 text-sm text-[#4f7f66]">한부모가족 구성원으로 확인되었습니다.</div><button onClick={()=>n("/onboarding")} className="mt-10 w-full rounded-2xl bg-[#547f65] py-4 font-bold text-white shadow-lg shadow-[#547f65]/20">내 상황 입력하기</button></div></div>}

// ─── Onboarding (3-step) ────────────────────────────────────────────────────
export function Onboarding() {
  const n = useNavigate();
  const { profile, setProfile } = useApp();
  const [step, setStep] = useState(1);
  const [myAge, setMyAge] = useState("");
  const [childCountNum, setChildCountNum] = useState(1);
  const [children, setChildren] = useState<string[]>(["0~2세"]);
  const [region, setRegion] = useState("경기");
  const [lifeStatus, setLifeStatus] = useState("");
  const [housing, setHousing] = useState("");
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [wantedSenior, setWantedSenior] = useState<string[]>([]);

  const ordinals = ["첫째", "둘째", "셋째", "넷째"];
  const ageOpts = ["임신 중","0~2세","3~5세","초등학교 1~3학년","초등학교 4~6학년","중학생","고등학생","대학생/성인"];

  const toggle = (arr:string[], set:(v:string[])=>void, max:number, val:string) => {
    arr.includes(val) ? set(arr.filter(x=>x!==val)) : arr.length < max && set([...arr, val]);
  };

  const handleChildCount = (cnt:number) => {
    setChildCountNum(cnt);
    setChildren(prev => {
      const arr = [...prev];
      while (arr.length < cnt) arr.push("0~2세");
      return arr.slice(0, cnt);
    });
  };

  const done = () => {
    const ageNum = Number(myAge) || 28;
    setProfile({
      nickname: profile.nickname,
      age: ageNum,
      childCount: childCountNum,
      children,
      region,
      lifeStatus: lifeStatus || "일을 구하고 있어요",
      housing: housing || "안정적으로 거주하고 있어요",
      difficulties,
      interests,
      wantedSenior,
      isMinor: ageNum <= 24,
    });
    n("/home");
  };

  const steps = ["나와 아이", "나의 생활", "필요한 연결"];
  const BtnPill = ({label, active, onClick}:{label:string;active:boolean;onClick:()=>void}) => (
    <button onClick={onClick} className={`rounded-full px-3 py-2 text-xs transition ${active?"bg-[#547f65] text-white":"bg-[#f1efe8] text-[#667069]"}`}>{label}</button>
  );

  return (
    <div className="mx-auto min-h-screen max-w-[520px] bg-[#fdfcf8] px-6 pb-16 pt-8">
      {/* Progress */}
      <div className="flex items-center gap-1 mb-8">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-1">
            {i > 0 && <span className="mx-1 h-px w-5 bg-[#e4e2da]" />}
            <div className={`flex items-center gap-1.5 text-xs ${step === i+1 ? "text-[#547f65] font-bold" : step > i+1 ? "text-[#82ad92]" : "text-[#a7aaa4]"}`}>
              <span className={`flex size-5 items-center justify-center rounded-full text-[10px] font-bold ${step === i+1 ? "bg-[#547f65] text-white" : step > i+1 ? "bg-[#82ad92] text-white" : "bg-[#e4e2da] text-[#a7aaa4]"}`}>{step > i+1 ? "✓" : i+1}</span>
              <span className="hidden sm:inline">{s}</span>
            </div>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div>
          <p className="text-xs text-[#668172]">STEP 1 · 나와 아이</p>
          <h1 className="mt-2 font-display text-2xl font-bold leading-9 text-[#314b3e]">나와 아이에 대해<br/>알려주세요.</h1>
          <p className="mt-2 text-sm leading-6 text-[#737a73]">비슷한 상황의 사람과 연결하기 위해 필요한 정보만 알려주세요.</p>

          <section className="mt-7">
            <h2 className="mb-3 text-sm font-bold text-[#333a35]">현재 만 나이가 어떻게 되나요?</h2>
            <div className="flex items-center gap-3">
              <input type="number" value={myAge} onChange={e=>setMyAge(e.target.value)} placeholder="00"
                className="w-24 rounded-2xl border border-[#e2e1da] bg-white px-4 py-3 text-center text-xl font-bold outline-none focus:border-[#85ad91]" />
              <span className="text-[#737a73]">세</span>
              {myAge && Number(myAge) <= 24 && <span className="rounded-full bg-[#f3eade] px-3 py-1 text-xs text-[#9a755b]">청소년 한부모</span>}
            </div>
            <p className="mt-2 text-xs text-[#a0a39e]">다른 사용자에게 정확한 나이는 공개되지 않아요.</p>
          </section>

          <section className="mt-7">
            <h2 className="mb-3 text-sm font-bold text-[#333a35]">자녀가 몇 명인가요?</h2>
            <div className="flex flex-wrap gap-2">
              {[1,2,3,4].map(cnt => (
                <BtnPill key={cnt} label={cnt === 4 ? "4명 이상" : `${cnt}명`} active={childCountNum === cnt} onClick={()=>handleChildCount(cnt)} />
              ))}
            </div>
          </section>

          <section className="mt-7">
            <h2 className="mb-3 text-sm font-bold text-[#333a35]">자녀의 연령대를 선택해주세요.</h2>
            <div className="space-y-5">
              {Array.from({length:childCountNum},(_,i)=>(
                <div key={i}>
                  <p className="mb-2 text-xs font-bold text-[#668172]">{ordinals[i]}</p>
                  <div className="flex flex-wrap gap-2">
                    {ageOpts.map(opt=>(
                      <BtnPill key={opt} label={opt} active={children[i]===opt} onClick={()=>{const a=[...children];a[i]=opt;setChildren(a);}} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <button onClick={()=>setStep(2)} className="mt-10 w-full rounded-2xl bg-[#547f65] py-4 font-bold text-white shadow-lg shadow-[#547f65]/20">다음</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <button onClick={()=>setStep(1)} className="mb-5 text-sm text-[#668172]">‹ 이전</button>
          <p className="text-xs text-[#668172]">STEP 2 · 나의 생활</p>
          <h1 className="mt-2 font-display text-2xl font-bold leading-9 text-[#314b3e]">지금의 생활은<br/>어떤가요?</h1>

          <section className="mt-7">
            <h2 className="mb-3 text-sm font-bold text-[#333a35]">어디에서 생활하고 있나요?</h2>
            <div className="flex flex-wrap gap-2">
              {["서울","경기","인천","대전","부산","대구","광주","울산","세종","강원","충북","충남","전북","전남","경북","경남","제주","기타"].map(r=>(
                <BtnPill key={r} label={r} active={region===r} onClick={()=>setRegion(r)} />
              ))}
            </div>
            <p className="mt-2 text-xs text-[#a0a39e]">정확한 주소는 받지 않아요. 같은 지역 사람을 우선 연결해드려요.</p>
          </section>

          <section className="mt-7">
            <h2 className="mb-3 text-sm font-bold text-[#333a35]">현재 가장 가까운 생활 상황은 무엇인가요?</h2>
            <div className="flex flex-wrap gap-2">
              {["직장을 다니고 있어요","일을 구하고 있어요","취업을 준비하고 있어요","학업 중이에요","육아에 집중하고 있어요","일을 쉬고 있어요","기타"].map(s=>(
                <BtnPill key={s} label={s} active={lifeStatus===s} onClick={()=>setLifeStatus(s)} />
              ))}
            </div>
          </section>

          <section className="mt-7">
            <h2 className="mb-3 text-sm font-bold text-[#333a35]">현재 주거 상황은 어떤가요?</h2>
            <div className="flex flex-wrap gap-2">
              {["안정적으로 거주하고 있어요","이사 예정이에요","독립을 준비하고 있어요","주거비가 부담돼요","주거가 불안정해요","기타"].map(h=>(
                <BtnPill key={h} label={h} active={housing===h} onClick={()=>setHousing(h)} />
              ))}
            </div>
          </section>

          <button onClick={()=>setStep(3)} className="mt-10 w-full rounded-2xl bg-[#547f65] py-4 font-bold text-white shadow-lg shadow-[#547f65]/20">다음</button>
        </div>
      )}

      {step === 3 && (
        <div>
          <button onClick={()=>setStep(2)} className="mb-5 text-sm text-[#668172]">‹ 이전</button>
          <p className="text-xs text-[#668172]">STEP 3 · 필요한 연결</p>
          <h1 className="mt-2 font-display text-2xl font-bold leading-9 text-[#314b3e]">지금 나에게<br/>필요한 연결을 알려주세요.</h1>
          <p className="mt-2 text-sm leading-6 text-[#737a73]">비슷한 상황의 사람이나 나보다 먼저 경험한 사람과 연결할 수 있도록 알려주세요.</p>

          <section className="mt-7">
            <h2 className="mb-1 text-sm font-bold text-[#333a35]">요즘 가장 어려운 점은 무엇인가요?</h2>
            <p className="mb-3 text-xs text-[#a0a39e]">최대 3개 선택 · {difficulties.length}/3</p>
            <div className="flex flex-wrap gap-2">
              {["양육/돌봄","경제적인 문제","주거","취업","학업","자녀 교육","양육비","법률 문제","가족관계","정서적인 어려움","주변의 시선과 편견","인간관계","여가/취미","기타"].map(d=>(
                <BtnPill key={d} label={d} active={difficulties.includes(d)} onClick={()=>toggle(difficulties,setDifficulties,3,d)} />
              ))}
            </div>
          </section>

          <section className="mt-7">
            <h2 className="mb-1 text-sm font-bold text-[#333a35]">어떤 이야기에 관심이 있나요?</h2>
            <p className="mb-3 text-xs text-[#a0a39e]">최대 3개 선택 · {interests.length}/3</p>
            <div className="flex flex-wrap gap-2">
              {["양육","취업","주거","경제","정서","자녀 교육","학교생활","양육비/법률","인간관계","여가/취미"].map(x=>(
                <BtnPill key={x} label={x} active={interests.includes(x)} onClick={()=>toggle(interests,setInterests,3,x)} />
              ))}
            </div>
          </section>

          <section className="mt-7">
            <h2 className="mb-1 text-sm font-bold text-[#333a35]">어떤 경험을 가진 사람과 이야기하고 싶나요?</h2>
            <p className="mb-3 text-xs text-[#a0a39e]">최대 3개 선택 · {wantedSenior.length}/3</p>
            <div className="flex flex-wrap gap-2">
              {["나와 비슷한 상황의 부모","나보다 자녀가 조금 더 큰 부모","취업 경험이 있는 부모","재취업 경험이 있는 부모","독립/주거 경험이 있는 부모","학업과 육아를 병행한 부모","양육비 문제를 경험한 부모","비슷한 나이의 부모","비슷한 연령의 자녀를 키우는 부모","특정 어려움을 극복한 경험이 있는 부모","그냥 편하게 이야기할 수 있는 사람"].map(w=>(
                <BtnPill key={w} label={w} active={wantedSenior.includes(w)} onClick={()=>toggle(wantedSenior,setWantedSenior,3,w)} />
              ))}
            </div>
          </section>

          <button onClick={done} className="mt-10 w-full rounded-2xl bg-[#547f65] py-4 font-bold text-white shadow-lg shadow-[#547f65]/20">입력 완료</button>
          <p className="mt-4 text-center text-xs text-[#a0a39e]">언제든지 마이페이지에서 수정할 수 있어요.</p>
        </div>
      )}
    </div>
  );
}

// ─── Home ───────────────────────────────────────────────────────────────────
export function Home() {
  const { posts, profile } = useApp();
  const similarCount = useMemo(()=>mockUsers.filter(u=>{ const {score}=scoreSimilar(profile,u); return score>0; }).length,[profile]);
  const seniorCount = useMemo(()=>mockUsers.filter(u=>{ const {score}=scoreSenior(profile,u); return score>0; }).length,[profile]);
  const interestPosts = posts.filter((p:Post)=>profile.interests.some((i:string)=>p.category===i)&&!p.minor).slice(0,2);
  const popularPosts = posts.filter((p:Post)=>!p.minor).slice(0,2);
  const seniorPosts = posts.filter((p:Post)=>p.senior).slice(0,2);

  return (
    <>
      <Header/>
      <div className="px-5">
        {/* Hero */}
        <section className="rounded-[28px] bg-gradient-to-br from-[#d8ead9] to-[#c9e3d0] px-6 py-7">
          <p className="text-sm text-[#52745e]">안녕하세요, {profile.nickname}님</p>
          <h1 className="mt-2 font-display text-2xl font-bold leading-9 text-[#31513f]">오늘은 어떤 이야기가<br/>필요하세요?</h1>
          <p className="mt-2 text-xs leading-5 text-[#5d7d69]">
            {profile.difficulties.length > 0 ? `${profile.difficulties.slice(0,2).join(" · ")} 관련 연결을 준비했어요.` : "나와 연결될 사람들이 기다리고 있어요."}
          </p>
        </section>

        {/* Two core features */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Link to="/match" className="rounded-[22px] bg-[#edf5ef] p-4 hover:shadow-md transition">
            <span className="text-2xl">💬</span>
            <h2 className="mt-2 text-sm font-bold text-[#2d4d3a]">나와 비슷한 사람</h2>
            <p className="mt-1 text-[11px] leading-5 text-[#5e7d6a]">지금 비슷한 상황의 사람을 만나보세요.</p>
            <p className="mt-3 text-xs font-bold text-[#4f8268]">{similarCount}명 만나보기 →</p>
          </Link>
          <Link to="/match" state={{tab:"senior"}} className="rounded-[22px] bg-[#eaf0f5] p-4 hover:shadow-md transition">
            <span className="text-2xl">🌿</span>
            <h2 className="mt-2 text-sm font-bold text-[#2d3f4d]">먼저 경험한 사람</h2>
            <p className="mt-1 text-[11px] leading-5 text-[#4e6878]">내가 고민하는 일을 먼저 경험한 사람.</p>
            <p className="mt-3 text-xs font-bold text-[#4f7a8a]">선배 {seniorCount}명 만나보기 →</p>
          </Link>
        </div>

        {/* Minor board (24세 이하만) */}
        {profile.isMinor && (
          <Link to="/minor" className="mt-3 block rounded-[24px] bg-[#f3eade] p-5 hover:shadow-md transition">
            <p className="text-xs text-[#9a755b]">안전하게 마음을 나누는 공간</p>
            <b className="mt-1 block text-lg text-[#6b4e38]">미성년 부모 이야기 <span className="text-[#b28d6d]">→</span></b>
            <p className="mt-1 text-xs text-[#9a755b]">비슷한 상황의 또래 부모들과 이야기해요.</p>
          </Link>
        )}

        {/* Interest-based posts */}
        {interestPosts.length > 0 && (
          <Section title={`${profile.interests[0]} 이야기`} link="/community">
            {interestPosts.map((p:Post)=><PostCard key={p.id} post={p}/>)}
          </Section>
        )}

        <Section title="지금 많이 이야기되는 글" link="/community">
          {popularPosts.map((p:Post)=><PostCard key={p.id} post={p}/>)}
        </Section>

        <Section title="선배들의 이야기" link="/community">
          {seniorPosts.map((p:Post)=><PostCard key={p.id} post={p}/>)}
        </Section>
      </div>
    </>
  );
}

// ─── Community ──────────────────────────────────────────────────────────────
export function Community() {
  const { posts, profile } = useApp();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("전체");
  const cats = ["전체","양육","취업","주거","경제","정서","학교생활","질문","후기"];
  const filtered = posts.filter((p:Post)=>
    (cat==="전체"||p.category===cat)&&
    (`${p.title}${p.body}${p.author}`).includes(q)&&
    (profile.isMinor||!p.minor)
  );
  return (
    <>
      <Header title="커뮤니티"/>
      <div className="px-5">
        {profile.isMinor && (
          <Link to="/minor" className="mb-4 flex items-center gap-3 rounded-[20px] bg-[#f3eade] px-4 py-3">
            <span className="text-lg">🌱</span>
            <div>
              <b className="text-sm text-[#6b4e38]">미성년 부모 이야기</b>
              <p className="text-[11px] text-[#9a755b]">또래 부모들과 안전하게 이야기해요.</p>
            </div>
            <span className="ml-auto text-[#b28d6d]">→</span>
          </Link>
        )}
        <div className="flex rounded-2xl bg-[#f2f0e9] px-4 py-3">
          <span>⌕</span>
          <input value={q} onChange={e=>setQ(e.target.value)} className="ml-2 w-full bg-transparent text-sm outline-none" placeholder="궁금한 이야기를 찾아보세요"/>
        </div>
        <div className="my-4 flex gap-2 overflow-x-auto pb-1">
          {cats.map(c=><button key={c} onClick={()=>setCat(c)} className={`shrink-0 rounded-full px-3 py-2 text-xs ${cat===c?"bg-[#547f65] text-white":"bg-[#f0eee8] text-[#737a73]"}`}>{c}</button>)}
        </div>
        <div className="space-y-3">{filtered.map((p:Post)=><PostCard key={p.id} post={p}/>)}</div>
      </div>
    </>
  );
}

// ─── Detail ─────────────────────────────────────────────────────────────────
export function Detail(){const{id}=useParams();const{posts,setPosts,liked,setLiked}=useApp();const p=posts.find((x:Post)=>x.id===Number(id))||posts[0];const[comment,setComment]=useState("");const[comments,setComments]=useState(["저도 비슷한 마음이었어요. 글 나눠주셔서 고마워요.","오늘의 이야기가 큰 힘이 됩니다. 응원할게요!"]);const react=(name:string)=>{if(!liked.includes(p.id)){setLiked([...liked,p.id]);setPosts(posts.map((x:Post)=>x.id===p.id?{...x,cheers:x.cheers+1}:x))}};return <><Header back title="이야기"/><article className="px-5"><div className="flex gap-2"><Pill>{p.category}</Pill><span className="text-xs leading-7 text-[#969b95]">{p.region} · 아이 {p.childAge}</span></div><h1 className="mt-4 font-display text-2xl font-bold leading-9">{p.title}</h1><p className="mt-3 text-xs text-[#888f88]">{p.author} · {p.time}</p><p className="my-7 whitespace-pre-line leading-8 text-[#48514b]">{p.body}<br/><br/>서로의 경험과 마음을 나눠주셔서 감사합니다. 오늘도 각자의 자리에서 충분히 잘하고 있어요.</p><div className="grid grid-cols-3 gap-2 border-y border-[#eeeae1] py-4">{["응원해요","공감해요","힘이 되었어요"].map((x,i)=><button onClick={()=>react(x)} className="rounded-xl bg-[#eff5ee] py-3 text-xs text-[#50745d]" key={x}>{i===0?"✿ ":i===1?"♡ ":"☀ "}{x}<br/><b>{p.cheers+i*3}</b></button>)}</div><section className="py-6"><h2 className="font-bold">댓글 {comments.length}</h2><div className="mt-4 space-y-3">{comments.map((c:string,i:number)=><div className="rounded-2xl bg-[#f5f3ed] p-3 text-sm" key={i}><b className="text-xs text-[#557660]">함께걷는이</b><p className="mt-1 text-[#59615a]">{c}</p></div>)}</div><div className="mt-4 flex gap-2"><input value={comment} onChange={e=>setComment(e.target.value)} className="min-w-0 flex-1 rounded-xl bg-[#f1efe9] px-3 text-sm outline-none" placeholder="따뜻한 한마디를 남겨주세요"/><button onClick={()=>{if(comment){setComments([...comments,comment]);setComment("")}}} className="rounded-xl bg-[#547f65] px-4 text-xs text-white">등록</button></div></section></article></>}

// ─── Compose ─────────────────────────────────────────────────────────────────
export function Compose(){const nav=useNavigate();const{posts,setPosts,profile}=useApp();const[category,setCategory]=useState("양육");const[title,setTitle]=useState("");const[body,setBody]=useState("");const submit=()=>{if(!title.trim()||!body.trim())return;setPosts([{id:Date.now(),author:profile.nickname,time:"방금",title,body,category,region:profile.region,childAge:profile.children?.[0]||"0~2세",cheers:0,comments:0},...posts]);nav("/community")};return <><Header back title="글쓰기"/><div className="px-5"><select value={category} onChange={e=>setCategory(e.target.value)} className="w-full rounded-xl bg-[#f1efe9] px-4 py-3 text-sm outline-none">{["양육","취업","주거","경제","정서","학교생활","질문","후기","도움 요청"].map(x=><option key={x}>{x}</option>)}</select><input value={title} onChange={e=>setTitle(e.target.value)} className="mt-4 w-full border-b border-[#dedbd4] py-4 text-lg font-bold outline-none" placeholder="제목을 입력해주세요"/><textarea value={body} onChange={e=>setBody(e.target.value)} className="mt-4 h-60 w-full resize-none outline-none" placeholder="지금의 이야기를 편하게 적어주세요. 서로를 존중하는 마음으로 함께해요."/><button onClick={submit} className="w-full rounded-2xl bg-[#547f65] py-4 font-bold text-white">게시하기</button></div></>}

// ─── Matching ────────────────────────────────────────────────────────────────
export function Matching() {
  const { profile } = useApp();
  const location = useLocation();
  const [tab, setTab] = useState<"similar"|"senior">((location.state as any)?.tab ?? "similar");

  const similarUsers = useMemo(()=>{
    return mockUsers
      .filter(u=>u.difficulties.length>0)
      .map(u=>{ const {score,reasons}=scoreSimilar(profile,u); return {...u,score,reasons}; })
      .filter(u=>u.score>0)
      .sort((a,b)=>b.score-a.score)
      .slice(0,4);
  },[profile]);

  const seniorUsers = useMemo(()=>{
    return mockUsers
      .filter(u=>u.experiences.length>0)
      .map(u=>{
        const {score,expMatch}=scoreSenior(profile,u);
        const reason = expMatch.length>0
          ? `현재 ${expMatch.join(", ")}을 고민하고 있어요. ${u.nickname}님은 비슷한 상황을 먼저 경험했어요.`
          : `${u.nickname}님의 경험이 도움이 될 수 있어요.`;
        return {...u,score,expMatch,reason};
      })
      .filter(u=>u.score>0)
      .sort((a,b)=>b.score-a.score)
      .slice(0,4);
  },[profile]);

  return (
    <>
      <Header title="연결"/>
      <div className="px-5">
        <section className="rounded-[26px] bg-[#e0eee1] p-6">
          <p className="text-xs text-[#5e8069]">{profile.region} · {profile.children?.join(", ")} · {profile.lifeStatus}</p>
          <h1 className="mt-2 font-display text-2xl font-bold leading-8 text-[#31513f]">나와 연결될 수 있는<br/>사람들이에요.</h1>
          {profile.difficulties.length>0&&<p className="mt-2 text-xs text-[#5e8069]">관심 어려움: {profile.difficulties.join(" · ")}</p>}
        </section>

        {/* Tabs */}
        <div className="mt-5 flex rounded-2xl bg-[#f1efe9] p-1">
          <button onClick={()=>setTab("similar")} className={`flex-1 rounded-xl py-3 text-sm font-bold transition ${tab==="similar"?"bg-white text-[#314b3e] shadow":"text-[#8c928b]"}`}>
            💬 나와 비슷한 사람
          </button>
          <button onClick={()=>setTab("senior")} className={`flex-1 rounded-xl py-3 text-sm font-bold transition ${tab==="senior"?"bg-white text-[#314b3e] shadow":"text-[#8c928b]"}`}>
            🌿 먼저 경험한 사람
          </button>
        </div>

        {tab==="similar" && (
          <div className="mt-4">
            <p className="mb-4 text-sm text-[#737a73]">비슷한 상황에서 생활하고 있는 사람을 만나보세요.</p>
            <div className="space-y-3">
              {similarUsers.length>0 ? similarUsers.map(u=>(
                <div key={u.nickname} className="rounded-[22px] border border-[#ebe8df] bg-white p-4">
                  <div className="flex items-start gap-3">
                    <div className="grid size-11 shrink-0 place-items-center rounded-full bg-[#e9f1e7] text-xl">☻</div>
                    <div className="flex-1 min-w-0">
                      <b className="text-sm">{u.nickname}</b>
                      <p className="mt-0.5 text-xs text-[#747c75]">{u.region} · 아이 {u.childAges.join(", ")} · {u.lifeStatus}</p>
                      <p className="mt-2 text-xs leading-5 text-[#59615a]">"{u.quote}"</p>
                    </div>
                  </div>
                  <div className="mt-3 border-t border-[#f0ede6] pt-3">
                    <p className="text-[11px] font-bold text-[#668172]">비슷한 점 {u.reasons.length}개</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {u.reasons.map(r=><span key={r} className="rounded-full bg-[#eaf3eb] px-2.5 py-1 text-[10px] text-[#4f7f66]">✓ {r}</span>)}
                    </div>
                  </div>
                  <button className="mt-3 w-full rounded-xl bg-[#eff5ee] py-2.5 text-xs font-bold text-[#4f7f66]">이야기 나누기</button>
                </div>
              )) : (
                <div className="rounded-2xl bg-[#f4f2ec] p-5 text-center">
                  <p className="text-sm text-[#7c837d]">내 상황 입력에서 어려운 점을 선택하면<br/>비슷한 사람을 찾을 수 있어요.</p>
                  <Link to="/onboarding" className="mt-3 inline-block text-xs font-bold text-[#547f65]">내 상황 입력하기 →</Link>
                </div>
              )}
            </div>
          </div>
        )}

        {tab==="senior" && (
          <div className="mt-4">
            <p className="mb-4 text-sm text-[#737a73]">내가 겪고 있는 일을 먼저 경험한 사람의 이야기를 만나보세요.</p>
            <div className="space-y-3">
              {seniorUsers.length>0 ? seniorUsers.map(u=>(
                <div key={u.nickname} className="rounded-[22px] border border-[#ebe8df] bg-white p-4">
                  <div className="flex items-start gap-3">
                    <div className="grid size-11 shrink-0 place-items-center rounded-full bg-[#e1ede4] text-xl">🌿</div>
                    <div className="flex-1 min-w-0">
                      <b className="text-sm">{u.nickname}</b>
                      <p className="mt-0.5 text-xs text-[#747c75]">{u.region} · 아이 {u.childAges.join(", ")}</p>
                      <p className="mt-2 text-xs leading-5 text-[#59615a]">"{u.quote}"</p>
                    </div>
                  </div>
                  <div className="mt-3 border-t border-[#f0ede6] pt-3">
                    <p className="text-[11px] font-bold text-[#668172]">경험</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {u.experiences.map(e=><span key={e} className="rounded-full bg-[#eaf3eb] px-2.5 py-1 text-[10px] text-[#4f7f66]">{e}</span>)}
                    </div>
                    <p className="mt-2 rounded-xl bg-[#f7faf7] p-2.5 text-[11px] leading-5 text-[#5e7d6a]">💬 {u.reason}</p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 rounded-xl border border-[#c9e0cc] py-2.5 text-xs font-bold text-[#4f7f66]">경험 보기</button>
                    <button className="flex-1 rounded-xl bg-[#eff5ee] py-2.5 text-xs font-bold text-[#4f7f66]">이야기 나누기</button>
                  </div>
                </div>
              )) : (
                <div className="rounded-2xl bg-[#f4f2ec] p-5 text-center">
                  <p className="text-sm text-[#7c837d]">어려운 점을 선택하면<br/>먼저 경험한 분을 찾을 수 있어요.</p>
                  <Link to="/onboarding" className="mt-3 inline-block text-xs font-bold text-[#547f65]">내 상황 입력하기 →</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ─── MinorBoard (24세 이하만 접근 가능) ────────────────────────────────────
export function MinorBoard(){const{posts,profile}=useApp();const[cat,setCat]=useState("전체");const cats=["전체","학교생활","육아","진로","가족","고민","질문"];if(!profile.isMinor)return <><Header back title="미성년 부모"/><div className="px-5 py-10 text-center"><p className="text-[#a0a39e]">접근 권한이 없습니다.</p></div></>;const data=posts.filter((p:Post)=>p.minor&&(cat==="전체"||p.category===cat));return <><Header back title="미성년 부모"/><div className="px-5"><section className="rounded-[25px] bg-[#f4eade] p-6"><p className="text-xs text-[#9a765e]">서로를 존중하는 또래 공간</p><h1 className="mt-2 font-display text-2xl font-bold">미성년 부모 이야기</h1><p className="mt-2 text-sm leading-6 text-[#755f4d]">비슷한 상황에 있는 또래 부모들과 안전하게 이야기해요.</p></section><div className="my-4 flex gap-2 overflow-x-auto">{cats.map(x=><button key={x} onClick={()=>setCat(x)} className={`shrink-0 rounded-full px-3 py-2 text-xs ${cat===x?"bg-[#9b765c] text-white":"bg-[#f1eee8]"}`}>{x}</button>)}</div><div className="space-y-3">{data.map((p:Post)=><PostCard key={p.id} post={p}/>)}</div></div></>}

// ─── MyPage ──────────────────────────────────────────────────────────────────
export function MyPage() {
  const { profile, posts, liked } = useApp();
  const n = useNavigate();
  const mine = posts.filter((p:Post)=>p.author===profile.nickname);

  return (
    <>
      <Header title="마이"/>
      <div className="px-5">
        <section className="flex items-center gap-4 rounded-[25px] bg-[#e4efe5] p-5">
          <div className="grid size-14 place-items-center rounded-full bg-white text-2xl">☺</div>
          <div>
            <h1 className="font-display text-xl font-bold">{profile.nickname}님</h1>
            <p className="mt-0.5 text-xs text-[#60806b]">{profile.region} · 아이 {profile.children?.join(", ")}</p>
            {profile.isMinor && <span className="mt-1 inline-block rounded-full bg-[#f3eade] px-2 py-0.5 text-[10px] text-[#9a755b]">청소년 한부모</span>}
          </div>
        </section>

        {/* Profile card */}
        <section className="mt-4 rounded-[22px] border border-[#e4e2da] bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-sm">내 프로필</h2>
            <button onClick={()=>n("/onboarding")} className="text-xs font-bold text-[#547f65]">내 상황 수정</button>
          </div>
          <div className="space-y-2.5 text-sm">
            {[["지역",profile.region],["자녀",`${profile.childCount}명 · ${profile.children?.join(", ")}`],["현재 상황",profile.lifeStatus],["주거",profile.housing]].map(([k,v])=>(
              <div key={k} className="flex items-baseline gap-2">
                <span className="w-20 shrink-0 text-[11px] text-[#a0a39e]">{k}</span>
                <span className="text-[#333a35]">{v}</span>
              </div>
            ))}
          </div>
          {profile.difficulties?.length>0&&(
            <div className="mt-4 border-t border-[#f0ede6] pt-4">
              <p className="mb-2 text-[11px] text-[#a0a39e]">내가 어려움을 느끼는 것</p>
              <div className="flex flex-wrap gap-1.5">
                {profile.difficulties.map(d=><span key={d} className="rounded-full bg-[#f1efe8] px-2.5 py-1 text-xs text-[#667069]">{d}</span>)}
              </div>
            </div>
          )}
          {profile.interests?.length>0&&(
            <div className="mt-3">
              <p className="mb-2 text-[11px] text-[#a0a39e]">관심 주제</p>
              <div className="flex flex-wrap gap-1.5">
                {profile.interests.map(i=><span key={i} className="rounded-full bg-[#e5f0e7] px-2.5 py-1 text-xs text-[#4f775f]">{i}</span>)}
              </div>
            </div>
          )}
          {profile.wantedSenior?.length>0&&(
            <div className="mt-3">
              <p className="mb-2 text-[11px] text-[#a0a39e]">원하는 선배</p>
              <div className="flex flex-wrap gap-1.5">
                {profile.wantedSenior.map(w=><span key={w} className="rounded-full bg-[#eaf3eb] px-2.5 py-1 text-xs text-[#4f7f66]">{w}</span>)}
              </div>
            </div>
          )}
        </section>

        <Section title="내가 작성한 글" link="/community">
          {mine.length ? mine.map((p:Post)=><PostCard key={p.id} post={p}/>) :
            <p className="rounded-2xl bg-[#f4f2ec] p-4 text-sm text-[#7c837d]">아직 작성한 글이 없어요. 처음 이야기를 나눠보세요.</p>}
        </Section>

        <Section title="내가 공감한 글" link="/community">
          <p className="rounded-2xl bg-[#f4f2ec] p-4 text-sm text-[#7c837d]">공감한 이야기 {liked.length}개</p>
        </Section>

        <p className="pb-6 text-center text-[11px] text-[#9da19c]">발표용 프로토타입 · 실제 개인정보를 사용하지 않습니다.</p>
      </div>
    </>
  );
}
