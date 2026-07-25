import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import test from "node:test";
import { rewriteGitHubPagesPaths } from "../scripts/github-pages-paths.mjs";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("rewrites GitHub Pages paths without corrupting framework root literals", () => {
  const source = [
    'const frameworkRoot = "/";',
    'const route = "/computer/shen";',
    'const asset = "/opening/evidence-table.png";',
    '<a href="/">返回主选单</a>',
  ].join("\n");
  const rewritten = rewriteGitHubPagesPaths(source);

  assert.match(rewritten, /frameworkRoot = "\/";/);
  assert.match(rewritten, /route = "\/ARG_invitation\/computer\/shen";/);
  assert.match(rewritten, /asset = "\/ARG_invitation\/opening\/evidence-table\.png";/);
  assert.match(rewritten, /href="\/ARG_invitation\/"/);
});

test("enters the first computer without applying the Pages base path twice", async () => {
  const home = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

  assert.match(home, /window\.location\.assign\("\/computer\/shen"\)/);
  assert.doesNotMatch(home, /router\.push\("\/computer\/shen"\)/);
});

test("server-renders the game opening screen", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>嫁｜网页调查叙事<\/title>/);
  assert.match(html, /点击播放《嫁》游戏片头/);
  assert.match(html, /CLICK TO BEGIN · 建议使用耳机/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("ships the reversible testimony branch and text-based first ending", async () => {
  const [desktop, ending, audioInfo] = await Promise.all([
    readFile(new URL("../app/computer/DesktopRoute.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/ending/let-go/page.tsx", import.meta.url), "utf8"),
    stat(new URL("../public/audio/bgm/ending-one-sun-earth.ogg", import.meta.url)),
  ]);

  assert.match(desktop, /是否继续要求郝倩出庭作证？/);
  assert.match(desktop, /返回“是否要求出庭”/);
  assert.match(desktop, /savedTestimonyStep>=9/);
  assert.match(desktop, /查看刘涵的消息/);
  assert.match(desktop, /data-testid="hq-testimony-next"/);
  assert.match(desktop, /window\.location\.assign\("\/ending\/let-go"\)/);
  assert.match(desktop, /心脏像被骤然攥紧，沈望无法将那句话说完，视线在短暂的黑暗中失去焦点。/);
  assert.match(ending, /ending-one-sun-earth\.ogg/);
  assert.match(ending, /memories\/art-show-2018\.png/);
  assert.match(ending, /ending\/let-go\/shen-walking\.png/);
  assert.match(ending, /ending\/let-go\/gupan-walking\.png/);
  assert.match(ending, /let-go-reading-article/);
  assert.match(ending, /<small>01\/04<\/small>/);
  assert.match(ending, /进入结局|audio\.currentTime=0/);
  assert.match(ending, /沈望尽量不让自己哭出声/);
  assert.match(ending, /至少，那张照片，替他们记得/);
  assert.doesNotMatch(ending, /ENDING_DURATION|narrativeBeats|let-go-controls/);
  assert.doesNotMatch(ending, /let-go-walker-wrap/);
  assert.match(ending, /返回对话，重新选择/);
  assert.ok(audioInfo.size > 1_000_000);

  await Promise.all([
    access(new URL("../app/ending/let-go/page.tsx", import.meta.url)),
    access(new URL("../public/ending/let-go/shen-walking.png", import.meta.url)),
    access(new URL("../public/ending/let-go/gupan-walking.png", import.meta.url)),
  ]);
});

test("documents every secret archive query and enlarges emotional narration", async () => {
  const [guide, styles] = await Promise.all([
    readFile(new URL("../public/story-guide.html", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(guide, /郝倩秘密档案查询[\s\S]*YF-HQ-0214/);
  assert.match(guide, /顾盼秘密档案查询[\s\S]*SD-8845127[\s\S]*HM-2217/);
  assert.match(guide, /秘密档案网站入口[\s\S]*womandriver/);
  assert.ok(
    guide.indexOf("从H.Q.微博确认真实姓名") < guide.indexOf("查询郝倩康复记录"),
    "H.Q.微博应当排在郝倩康复记录查询之前",
  );
  assert.doesNotMatch(guide, /<li><b>康复账单：<\/b><code>HAO QIAN/);
  assert.match(styles, /\.wx-inner-voice\{[^}]*clamp\(14px,1\.05vw,16px\)\/2/);
  assert.match(styles, /\.wx-inner-voice\.urgent\{[^}]*animation:hq-urgent-text-shake \.18s steps\(2,end\) infinite/);
  assert.match(styles, /\.let-go-text-ending\.is-reading\{[^}]*height:100dvh[^}]*overflow-y:auto/);
  assert.match(styles, /\.let-go-text-ending \.let-go-gate>small,\.let-go-reading-article>small\{font-size:16px/);
});

test("ships the late-flowers ending and Liu Han continuation handoff", async () => {
  const [desktop, ending, audioInfo] = await Promise.all([
    readFile(new URL("../app/computer/DesktopRoute.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/ending/late-flowers/page.tsx", import.meta.url), "utf8"),
    stat(new URL("../public/audio/bgm/second-chance.mp3", import.meta.url)),
  ]);

  assert.match(desktop, /沈望，还在吗？/);
  assert.match(desktop, /我终于知道了过去发生的一切。/);
  assert.match(desktop, /前往临川 - 第二结局/);
  assert.match(desktop, /data-testid="enter-late-flowers-ending"/);
  assert.match(desktop, /window\.location\.assign\("\/ending\/late-flowers"\)/);
  assert.match(desktop, /你现在是刘涵 · 调查目标已更新/);
  assert.match(desktop, /gupanComputerAvailable&&<a href="\/computer\/gupan"/);
  assert.match(desktop, /liuHanComputerAvailable&&<a href="\/computer\/liuhan"/);
  assert.match(desktop, /setLiuHanComputerAvailable\(localStorage\.getItem\("jia-liuhan-flashback-complete"\)==="true"\)/);
  assert.match(desktop, /汽车黑话并非讨论驾驶，而是留学生从事迷奸并上传偷拍视频的非法勾当。/);
  assert.match(desktop, /NIGHTDRIVE 隐藏站记录/);
  assert.match(desktop, /两组记录相关联并互相印证。/);
  assert.match(ending, /const ENDING_DURATION=40/);
  assert.match(ending, /from:38,to:40[\s\S]*刘涵扭过头去。天已经亮了。/);
  assert.match(ending, /XX公寓。路上再说。/);
  assert.doesNotMatch(ending, /晴川公寓/);
  assert.match(ending, /POLICE LINE · 警戒线 · 禁止进入/);
  assert.match(ending, /……顾盼可能已经不在了。/);
  assert.match(ending, /明日黄花/);
  assert.match(ending, /late-flowers-finale-actions/);
  assert.match(ending, /routeRevealed\?"扮演刘涵，继续调查全部真相　→":"？？？"/);
  assert.match(ending, />重播结局<\/button>/);
  assert.match(ending, />回到选择<\/button>/);
  assert.match(ending, /扮演刘涵，继续调查全部真相/);
  assert.match(ending, /window\.location\.assign\("\/computer\/liuhan\?app=wechat"\)/);
  assert.ok(audioInfo.size > 1_000_000);

  await access(new URL("../app/ending/late-flowers/page.tsx", import.meta.url));
});

test("opens Liu Han's Qzone and police archive investigation through browser search", async () => {
  const [desktop, qzone, police, guide, styles] = await Promise.all([
    readFile(new URL("../app/computer/DesktopRoute.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/qzone/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/police/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../public/story-guide.html", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(desktop, /if\(app==="qq"\)return <QQDesktop\/>/);
  assert.match(desktop, /aria-label="QQ功能栏"/);
  assert.doesNotMatch(desktop, /className="qq-space-card"/);
  assert.match(qzone, /\/qzone\/cooking-together\.png/);
  assert.match(qzone, /\/qzone\/lakeside-map-picnic\.png/);
  assert.match(qzone, /\/qzone\/campus-night-walk\.png/);
  assert.match(qzone, /\/qzone\/long-distance-video-call\.png/);
  assert.match(qzone, /qz-photo-lightbox/);
  assert.match(qzone, /一个人负责看菜谱，一个人负责帮倒忙/);
  assert.match(qzone, /地图上已经太阳密布了，天气真好/);
  assert.match(qzone, /我俩天下第一最最好：）/);
  assert.match(qzone, /还是不想只和你视频，你一个人真的辛苦了/);
  assert.match(desktop, /您的好友有新动态/);
  assert.doesNotMatch(desktop, /左望右盼的情侣空间出现了一条新的访客留言。/);
  assert.match(desktop, /href="\/qzone" target="_blank" rel="noopener noreferrer"/);
  assert.doesNotMatch(desktop, /<iframe src="\/qzone"/);
  assert.match(desktop, /查看动态　↗/);
  assert.doesNotMatch(desktop, /沈望与顾盼 · 受保护的共同回忆/);
  assert.doesNotMatch(desktop, /name:"沈望",preview:"先查下顾盼现在住哪里？"/);
  assert.doesNotMatch(desktop, /\{id:"chen",name:"陈放"/);
  assert.doesNotMatch(desktop, /恒慕官网\.url/);
  assert.doesNotMatch(desktop, /\["案件协作","盾","police"\]/);
  assert.doesNotMatch(desktop, /if\(app==="police"\)/);
  assert.match(desktop, /current\.name==="陈放"&&<ChenFangChat\/>/);
  assert.match(desktop, /title:"临川公安｜线索协查与档案查询"/);
  assert.match(desktop, /url:"\/police"/);
  assert.match(desktop, /在浏览器搜索“临川公安 档案查询”/);
  assert.doesNotMatch(desktop, /placeholder="输入完整IP地址"|发送给陈放|IP节点协查回执\.pdf/);
  assert.match(desktop, /临川很大，你要找个人可不容易，知道大概方位吗？/);
  assert.match(desktop, /停停停，你把我当土地公使了。/);
  assert.match(desktop, /关于我们公安可以公开的消息，都可以通过我们的官网搜索到。/);
  assert.match(desktop, /href="\/police" target="_blank" rel="noopener noreferrer"/);
  assert.doesNotMatch(desktop, /2025年12月3日　02:51|节点表里对应的是长宁路117号|现场资料收到了|我已经把你固定的原始页面/);
  assert.match(desktop, /我昨晚在酒吧出了一些事情，身体很不舒服/);
  assert.match(desktop, /我不知道你们的爱到底是什么/);
  assert.match(desktop, /顾盼退出了群聊/);
  assert.match(desktop, /这里面一定有误会，顾盼，你好几天没有来学校上课/);
  assert.doesNotMatch(desktop, /臭B，谁会要你|该记录包含受害者指责/);
  assert.match(desktop, /jia-ip-node-report-downloaded/);
  assert.match(desktop, /青槐区长宁路117号/);
  assert.match(desktop, /normalized\.includes\("晴川公寓"\).*normalized\.includes\("青槐区长宁路117号"\).*normalized\.includes\("长宁路117号"\)/s);
  assert.match(desktop, /补充具体门牌/);
  assert.match(desktop, /几栋/);
  assert.match(desktop, /几单元/);
  assert.match(desktop, /几零几/);
  assert.match(desktop, /\["4","四"\].*\["1","一"\].*\["402","四零二","四〇二"\]/s);
  assert.match(qzone, /……4栋 一单\.\.\.402室/);
  assert.match(desktop, /晴川公寓现场资料\.zip/);
  assert.match(desktop, /jia-liuhan-scene-package-extracted/);
  assert.match(desktop, /晴川公寓_现场证据/);
  assert.doesNotMatch(desktop, /01_现场勘查摘要\.pdf|02_警方协查回执单\.pdf|档案调阅编号|LC-XZ-251203-17/);
  assert.match(desktop, /03_室内全景\.jpg/);
  assert.match(desktop, /04_碎屏旧手机\.jpg/);
  assert.match(desktop, /05_请柬\.jpg/);
  assert.match(desktop, /"05_请柬\.jpg":\{[\s\S]*?imageHotspotHref:"\/hengmu"/);
  assert.doesNotMatch(desktop, /扫描请柬上的二维码|打开恒慕官网 ↗/);
  assert.match(desktop, /06_婚庆合同\.jpg/);
  assert.match(desktop, /"06_婚庆合同\.jpg":\{[\s\S]*?hideCaption:true/);
  assert.doesNotMatch(desktop, /现场恢复件|合同编号位于抬头信息区|纸张底部的窄封边残留一串点划符号/);
  assert.match(desktop, /07_现场物品登记表\.pdf/);
  assert.match(desktop, /旧手机备忘录\.jpg/);
  assert.match(desktop, /08-password-note\.png/);
  assert.match(desktop, /hideCaption:true,hideSourceLink:true/);
  assert.match(desktop, /download="LC-QH-1129-402\.txt"/);
  assert.match(desktop, /jia-police-investigation-id-downloaded/);
  assert.doesNotMatch(desktop, /该密码指向顾盼旧电脑上的微信离线备份|返回顾盼旧电脑，解锁微信备份/);
  assert.doesNotMatch(desktop, /顾盼的手机_本地数据提取|刘涵电脑.*下载/);
  assert.match(qzone, /空间已封存/);
  assert.match(qzone, /请输入封存的日期。/);
  assert.match(qzone, /qz-archive-brand/);
  assert.match(qzone, />Qzone<\/b>/);
  assert.match(qzone, /archiveDate\.replace\(\/\\D\/g,""\)==="20221118"/);
  assert.match(qzone, /jia-qzone-ip-found/);
  assert.match(qzone, /2025年11月29日 02:47 · · 来自手机网页/);
  assert.match(qzone, /临川……17号/);
  assert.match(qzone, /该留言可能因网络异常未完整提交，异常 IP：183\.214\.76\.119/);
  assert.doesNotMatch(qzone, /临川……青槐区长宁路/);
  assert.match(qzone, /aria-label="情侣空间栏目"/);
  assert.match(qzone, />日常<\/button>/);
  assert.match(qzone, />留言板<\/button>/);
  assert.doesNotMatch(qzone, />相册<\/button>|>纪念日<\/button>|>主人管理/);
  assert.doesNotMatch(qzone, /1488|相伴了多少天/);
  assert.match(police, /公共网络节点查询/);
  assert.match(police, /localStorage\.setItem\("jia-ip-node-report-downloaded","true"\)/);
  assert.match(police, /青槐区公共网络节点一览表/);
  assert.match(police, /青槐区长宁路117号/);
  assert.match(police, /晴川公寓公共无线网络/);
  assert.doesNotMatch(police, /networkQuery|networkSearched|networkMatch|lookupNetwork|className=\{row\[1\].*matched|目标IP对应|查询节点一览/);
  assert.match(police, /const ARCHIVE_ID="LC-QH-1129-402"/);
  assert.match(police, /按档案编号检索/);
  assert.doesNotMatch(police, /requiredEvidenceReady|关联材料尚未完成归档|jia-gp-wechat-unlocked-v5|jia-hengmu-unlocked/);
  assert.match(police, /jia-police-call-read/);
  assert.match(police, /jia-police-scene-read/);
  assert.doesNotMatch(police, /archiveUnlocked|jia-police-archive-unlocked|姓名、地址或警情关键词|type="date"/);
  assert.doesNotMatch(police, /CF-1203-LH|协查授权码|一次性协查入口/);
  assert.match(guide, /情侣空间留言板<\/td><td><code>2022\/11\/18<\/code>/);
  assert.match(guide, /浏览器搜索“临川公安 档案查询”/);
  assert.match(guide, /直接展示完整列表，不提供输入框、结果提示或目标行高亮/);
  assert.doesNotMatch(guide, /返回刘涵微信，打开陈放|CF-1203-LH|IP节点协查回执\.pdf/);
  assert.match(guide, /晴川公寓_现场证据/);
  assert.doesNotMatch(guide, /02_警方协查回执单\.pdf|LC-XZ-251203-17|输入回执编号/);
  assert.match(guide, /在“警情档案检索”中直接输入 <code>LC-QH-1129-402<\/code>/);
  assert.match(guide, /不再要求姓名、地址或日期二次查询/);
  assert.match(guide, /旧手机备忘录\.jpg/);
  assert.match(styles, /\.qq-app\{[^}]*grid-template-columns:64px 250px minmax\(0,1fr\)/);
  assert.match(styles, /\.qq-space-panel\{[^}]*grid-column:2\/-1/);
  assert.match(styles, /\.police-network-table\{/);
  assert.match(styles, /\.pc-invitation-qr-hotspot\s*\{[^}]*cursor:pointer/);
  assert.match(styles, /\.police-archive-gate\{/);
  assert.match(styles, /\.pc-file-preview>article\{[^}]*height:100%[^}]*overflow-y:auto[^}]*touch-action:pan-y/);
  assert.match(styles, /\.police-route\{[^}]*height:100dvh[^}]*overflow-y:auto[^}]*touch-action:pan-y/);
  assert.match(styles, /\.qz-route\{[^}]*height:100dvh[^}]*overflow-y:auto[^}]*touch-action:pan-y/);

  await Promise.all([
    access(new URL("../public/characters/qq-class-group.svg", import.meta.url)),
    access(new URL("../public/characters/qq-device.svg", import.meta.url)),
    access(new URL("../public/evidence/liuhan-scene/03-room-overview.png", import.meta.url)),
    access(new URL("../public/evidence/liuhan-scene/04-cracked-phone.png", import.meta.url)),
    access(new URL("../public/evidence/liuhan-scene/05-invitation.png", import.meta.url)),
    access(new URL("../public/evidence/liuhan-scene/06-plan-fragment.png", import.meta.url)),
    access(new URL("../public/qzone/cooking-together.png", import.meta.url)),
    access(new URL("../public/qzone/lakeside-map-picnic.png", import.meta.url)),
    access(new URL("../public/qzone/campus-night-walk.png", import.meta.url)),
    access(new URL("../public/qzone/long-distance-video-call.png", import.meta.url)),
  ]);
});

test("keeps the November incident, ending routes, and three-day rewind on one timeline", async () => {
  const [desktop, nightdrive, hengmu, ending, xiEnding, hiddenEnding, prototype, guide] = await Promise.all([
    readFile(new URL("../app/computer/DesktopRoute.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/nightdrive/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/hengmu/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/ending/late-flowers/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/ending/xi/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/ending/hidden/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/FullInvestigation.tsx", import.meta.url), "utf8"),
    readFile(new URL("../public/story-guide.html", import.meta.url), "utf8"),
  ]);

  assert.match(nightdrive, /2022-11-08 23:48—2022-11-09 04:11/);
  assert.match(nightdrive, /2022-11-13 · USD 20,000 · VOID/);
  assert.doesNotMatch(nightdrive, /2022-10-27|2022-10-28|2022-11-02|10月27日|10月30日|11月2日/);
  assert.match(desktop, /2022年11月8日。/);
  assert.match(hengmu, /最近更新：2025-11-29 12:26/);
  assert.match(hengmu, /replaceAll\("-",""\)/);
  assert.match(hengmu, /normalizedCode==="YQ730419"/);
  assert.match(hengmu, /恒慕特别委托组 · 官方企业服务账号/);
  assert.doesNotMatch(hengmu, /HengMu-FamilyPlan|企业微信：/);
  assert.doesNotMatch(hengmu, /韩铎 \/ HD-047|HengMu-HD047/);
  assert.match(hengmu, /jia-hengmu-contact/);
  assert.match(desktop, /current\.name==="恒慕特别委托组"&&<HengmuCaseConfrontation\/>/);
  assert.match(desktop, /jia-gp-final-letter-read/);
  assert.match(desktop, /希望_未寄出\.txt/);
  assert.match(desktop, /<h1>希望<\/h1>/);
  assert.match(desktop, /我其实无限需要你/);
  assert.doesNotMatch(desktop, /给望_未寄出\.txt/);
  assert.match(hiddenEnding, /如果时间肯在那一晚，向相爱的人偏一点/);
  assert.match(hiddenEnding, /“别说话，抱紧我。”/);
  assert.match(hiddenEnding, /2022—2025 · 未走完的地图/);
  assert.match(hiddenEnding, /她成为了沈望的新娘/);
  assert.match(hiddenEnding, /左望，右盼/);
  assert.doesNotMatch(hiddenEnding, /const fade=next>98/);
  assert.doesNotMatch(hiddenEnding, /if\(next>=ENDING_DURATION\)\{\s*audio\.pause\(\)/);
  assert.doesNotMatch(hiddenEnding, /const finish=\(\)=>\{\s*audioRef\.current\?\.pause\(\)/);
  assert.match(hiddenEnding, /if\(status!==\"complete\"\)return;[\s\S]*audio&&!audio\.ended&&audio\.paused/);
  assert.match(desktop, /不管你们在做什么，都立即终止！把顾盼现在的准确位置发给我，停止仪式，否则你们会知道/);
  assert.match(desktop, /永安礼仪园[\s\S]*东区静安厅 · 转运登记处/);
  assert.match(desktop, /闯入永安礼仪园 → 第三结局 · 嫁/);
  assert.match(desktop, /jia-hengmu-confrontation-complete/);
  assert.match(desktop, /jia-ending-xi-source","hengmu-confrontation/);
  assert.match(desktop, /window\.location\.assign\("\/ending\/xi"\)/);
  assert.match(desktop, /进入隐藏结局 · 镜花水月/);
  assert.match(desktop, /window\.location\.assign\("\/ending\/hidden"\)/);
  assert.match(xiEnding, /葛东琪《囍》· 从头播放/);
  assert.match(xiEnding, /父母收走了她的护照和手机/);
  assert.match(xiEnding, /警方控制现场并封存证据/);
  assert.doesNotMatch(xiEnding, /if\(audio&&next>84\)/);
  assert.doesNotMatch(xiEnding, /if\(next>=ENDING_DURATION\)\{\s*audio\?\.pause\(\)/);
  assert.doesNotMatch(xiEnding, /const finish=\(\)=>\{\s*audioRef\.current\?\.pause\(\)/);
  assert.doesNotMatch(desktop, /HengMu-FamilyPlan|企业微信：/);
  assert.match(guide, /恒慕特别委托组[\s\S]*不对应韩铎或其他具体员工/);
  assert.match(guide, /不需要搜索或输入账号/);
  assert.match(guide, /与恒慕机构完成最终对质/);
  assert.match(guide, /第三结局：嫁/);
  assert.match(guide, /隐藏结局只能从这封信的底部进入/);
  assert.match(guide, /YQ-730419<\/code> 或 <code>YQ730419/);
  assert.match(hengmu, /11:42完成现场处置|现场处置结束后/);
  assert.match(hengmu, /<time>11:48<\/time>[\s\S]*?<time>12:06<\/time>[\s\S]*?<time>12:26<\/time>/);
  assert.match(desktop, /date:"2025年12月2日 星期二"/);
  assert.match(ending, /<i>12\.02<\/i><i>12\.01<\/i><i>11\.30<\/i><i>11\.29<\/i>/);
  assert.doesNotMatch(ending, /<i>12\.03<\/i>/);
  assert.match(prototype, /页面直接展示18条同期节点记录，不提供输入框、结果提示或目标行高亮/);
  assert.match(prototype, /输入该编号后，系统直接返回两份关联警情档案/);
  assert.match(guide, /2022年11月8日|11月8日聚会侵害/);
  assert.match(guide, /2025年12月2日/);
  await access(new URL("../public/characters/hengmu-case-manager.svg", import.meta.url));
  await access(new URL("../public/audio/bgm/ending-xi.mp3", import.meta.url));
  await access(new URL("../public/ending/xi/01-forced-marriage.png", import.meta.url));
  await access(new URL("../public/ending/xi/02-ghost-marriage.png", import.meta.url));
  await access(new URL("../public/ending/xi/03-intervention.png", import.meta.url));
  await access(new URL("../public/ending/xi/04-police-dawn.png", import.meta.url));
});
