import { Component, AfterViewInit } from '@angular/core';

type ModelScore = {
  reasoning: number;
  coding: number;
  office: number;
  math: number;
  vision: number;
  creative_media: number;
  fast_tasks: number;
  marketing: number;
  writing: number;
  pricing: number;
};

type Model = {
  n: string;
  p: string;
  t: string[];
  pr: string;
  par: string;
  ctx: string;
  pt: string;
  d: string;
  s: ModelScore;
  bf: string[];
};

@Component({
  selector: 'app-knowledge-base',
  templateUrl: './knowledge-base.component.html',
  styleUrls: ['./knowledge-base.component.css']
})
export class KnowledgeBaseComponent implements AfterViewInit {
  private initialized = false;

  ngAfterViewInit(): void {
    if (this.initialized) return;
    this.initialized = true;
    setTimeout(() => this.initKnowledgeBase());
  }

  private initKnowledgeBase(): void {
    const M: Model[] = [
      {n:"Claude Opus 4.6",p:"Anthropic",t:["proprietary","frontier","reasoning","new"],pr:"$5 / $25 per 1M tok",par:"Undisclosed",ctx:"200K (1M beta)",pt:"premium",d:"Anthropic's most intelligent model (Feb 5 2026). #1 Finance Agent benchmark. Excels at agentic coding, planning, long-document research, financial analysis. Agent team support. The deepest thinker.",s:{reasoning:10,coding:10,office:9,math:9,vision:8,creative_media:3,fast_tasks:5,marketing:9,writing:10,pricing:4},bf:["Deep Analysis","Agentic Coding","Insightful Writing"]},
      {n:"Claude Sonnet 4.6",p:"Anthropic",t:["proprietary","frontier","new"],pr:"$3 / $15 per 1M tok",par:"Undisclosed",ctx:"200K (1M beta)",pt:"mid",d:"Released Feb 17 2026. Opus-level at Sonnet pricing. 79.6% SWE-Bench, 72.5% OSWorld. Preferred over Opus 4.5 by 59%. Default claude.ai. 1M context beta.",s:{reasoning:9,coding:10,office:9,math:8,vision:8,creative_media:3,fast_tasks:7,marketing:9,writing:9,pricing:6},bf:["Coding","Daily Workhorse","Agentic Tasks"]},
      {n:"Claude Haiku 4.5",p:"Anthropic",t:["proprietary","efficient"],pr:"$0.80 / $4 per 1M tok",par:"Undisclosed",ctx:"200K",pt:"budget",d:"Ultra-fast, cost-efficient. Ideal for email triage, classification, support bots, lightweight agents. Surprising depth at this price.",s:{reasoning:6,coding:7,office:7,math:6,vision:6,creative_media:2,fast_tasks:9,marketing:7,writing:7,pricing:8},bf:["High Volume","Cost-Efficient","Fast Automation"]},
      {n:"GPT-5.2 Thinking",p:"OpenAI",t:["proprietary","frontier","reasoning","new"],pr:"$1.75 / $14 per 1M tok",par:"Undisclosed",ctx:"400K (128K out)",pt:"mid",d:"OpenAI flagship (Dec 11 2025). SOTA GDPval — beats experts 70.9%. 93.2% GPQA Diamond, 100% AIME 2025 (Pro). Excels at spreadsheets, presentations, multi-step projects.",s:{reasoning:10,coding:9,office:10,math:10,vision:9,creative_media:8,fast_tasks:6,marketing:8,writing:8,pricing:5},bf:["Knowledge Work","Mathematics","Professional"]},
      {n:"GPT-5.2 Instant",p:"OpenAI",t:["proprietary","frontier","new"],pr:"$1.75 / $7 per 1M tok",par:"Undisclosed",ctx:"400K (128K out)",pt:"mid",d:"Fast everyday GPT-5.2. No reasoning overhead. Default ChatGPT replacing deprecated GPT-4o. Strong all-rounder for daily productivity.",s:{reasoning:7,coding:8,office:8,math:7,vision:8,creative_media:8,fast_tasks:8,marketing:8,writing:7,pricing:6},bf:["Quick Answers","Daily ChatGPT","General Purpose"]},
      {n:"GPT-5.2-Codex",p:"OpenAI",t:["proprietary","specialist","new"],pr:"~$2 / $14 per 1M tok",par:"Undisclosed",ctx:"400K",pt:"mid",d:"Jan 14 2026. Agentic coding with context compaction. 56.4% SWE-Bench Pro, 64% Terminal-Bench 2.0. Long-horizon autonomous SWE.",s:{reasoning:8,coding:10,office:5,math:7,vision:4,creative_media:1,fast_tasks:5,marketing:3,writing:4,pricing:5},bf:["Agentic Coding","SWE Automation","Long Tasks"]},
      {n:"Gemini 3 Pro",p:"Google",t:["proprietary","frontier","reasoning"],pr:"~$2 / $8 per 1M tok",par:"Undisclosed",ctx:"1M",pt:"mid",d:"Google's most intelligent (Nov 2025). Led benchmarks until GPT-5.2. Native multimodal. 78% SWE-Bench. 37.5% Humanity's Last Exam. Veo 3 video. Dominant vision.",s:{reasoning:9,coding:9,office:9,math:9,vision:10,creative_media:8,fast_tasks:6,marketing:8,writing:8,pricing:6},bf:["Vision","Multimodal","Advanced Reasoning"]},
      {n:"Gemini 3 Flash",p:"Google",t:["proprietary","efficient","new"],pr:"$0.50 / $3 per 1M tok",par:"Undisclosed",ctx:"1M",pt:"budget",d:"Dec 17 2025. Outperforms 2.5 Pro at 3x speed. 78% SWE-Bench, 81.2% MMMU-Pro. Default Gemini app. 1T+ tokens/day. PhD-level reasoning at flash speed.",s:{reasoning:8,coding:8,office:8,math:8,vision:9,creative_media:6,fast_tasks:10,marketing:7,writing:7,pricing:8},bf:["Speed+Intelligence","Volume","Best Value Flash"]},
      {n:"Grok 4.1",p:"xAI",t:["proprietary","frontier","reasoning"],pr:"$3 / $9 per 1M tok",par:"Undisclosed",ctx:"2M",pt:"mid",d:"xAI flagship (Nov 17 2025). #1 LMArena Elo (1483), #1 EQ-Bench. Hallucination ↓65%. Exceptional emotional intelligence, creative writing. Real-time X data.",s:{reasoning:9,coding:9,office:8,math:9,vision:7,creative_media:7,fast_tasks:7,marketing:8,writing:9,pricing:6},bf:["Real-Time Data","EQ + Creativity","Reasoning"]},
      {n:"Grok 4.1 Fast",p:"xAI",t:["proprietary","efficient"],pr:"$0.20 / $0.50 per 1M tok",par:"Undisclosed",ctx:"2M",pt:"budget",d:"Speed-optimized. 93.0 finance, 86 code understanding. Exceptional cost-performance for enterprise automation and rapid agentic workflows.",s:{reasoning:7,coding:8,office:7,math:7,vision:5,creative_media:3,fast_tasks:9,marketing:6,writing:6,pricing:9},bf:["Fast Agentic","Finance","Budget Enterprise"]},
      {n:"DeepSeek R1",p:"DeepSeek",t:["open","frontier","reasoning"],pr:"$0.55 / $2.19 per 1M tok",par:"671B/37B active (MoE)",ctx:"128K",pt:"budget",d:"Open-source reasoning powerhouse via RL. 79.8% AIME 2024. Exceptional math proofs, algorithmic logic. MIT licensed. Academic & financial AI staple.",s:{reasoning:9,coding:8,office:7,math:10,vision:5,creative_media:2,fast_tasks:5,marketing:6,writing:7,pricing:8},bf:["Math Reasoning","Open-Source","Academic AI"]},
      {n:"DeepSeek V3.2",p:"DeepSeek",t:["open","frontier"],pr:"$0.27 / $1.10 per 1M tok",par:"671B/37B active (MoE)",ctx:"128K",pt:"budget",d:"Latest generalist (Nov 2025). Sparse attention + R1 reasoning. 50% efficiency improvement. Strong coding, tool use. Input as low as $0.07/M cached.",s:{reasoning:8,coding:8,office:8,math:8,vision:5,creative_media:2,fast_tasks:7,marketing:7,writing:7,pricing:9},bf:["Cheapest Frontier","General Open-Source","Tool Use"]},
      {n:"Qwen 3 235B-A22B",p:"Alibaba",t:["open","frontier","reasoning"],pr:"Open-weight / ~$0.50–$1.50",par:"235B/22B active (MoE)",ctx:"128K (1M ext)",pt:"free",d:"Alibaba's open-weight flagship. Hybrid think/non-think. 119-language support. CodeForces Elo leader. Apache 2.0. Thinking-2507 = SOTA open-source thinking.",s:{reasoning:9,coding:9,office:8,math:9,vision:7,creative_media:2,fast_tasks:6,marketing:7,writing:8,pricing:8},bf:["Open-Source Frontier","Multilingual","Competition"]},
      {n:"Qwen 3 30B-A3B",p:"Alibaba",t:["open","efficient"],pr:"Open-weight / ~$0.05–$0.15",par:"30B/3B active (MoE)",ctx:"128K",pt:"free",d:"Only 3B active params. Outperforms QwQ-32B (10x larger). 91.0 ArenaHard, 80.4 AIME'24. Local deployment. Apache 2.0.",s:{reasoning:7,coding:7,office:7,math:7,vision:4,creative_media:2,fast_tasks:8,marketing:6,writing:6,pricing:10},bf:["Cheapest MoE","Edge Deploy","Local AI"]},
      {n:"Qwen 3 32B",p:"Alibaba",t:["open"],pr:"Open-weight / ~$0.10–$0.30",par:"32B (Dense)",ctx:"128K",pt:"free",d:"Largest dense Qwen 3. Matches Qwen 2.5-72B at half size. Strong reasoning, coding, multilingual. Dense arch for simple deployment. Apache 2.0.",s:{reasoning:7,coding:8,office:7,math:8,vision:5,creative_media:2,fast_tasks:7,marketing:6,writing:7,pricing:9},bf:["Self-Hosted","Dense Open","Balanced"]},
      {n:"Llama 4 Maverick",p:"Meta",t:["open","frontier"],pr:"Open-weight / ~$0.19–$0.49",par:"400B/17B active (128 exp)",ctx:"1M",pt:"free",d:"Meta's flagship multimodal. Native image+text. Beats GPT-4o, Gemini 2.0 Flash. 128-expert MoE. 40T tokens, 200 languages. Co-distilled from Behemoth.",s:{reasoning:8,coding:8,office:8,math:7,vision:8,creative_media:3,fast_tasks:7,marketing:7,writing:7,pricing:9},bf:["Multimodal Open","Enterprise","Image Understanding"]},
      {n:"Llama 4 Scout",p:"Meta",t:["open","efficient"],pr:"Open-weight / very low",par:"109B/17B active (16 exp)",ctx:"10M",pt:"free",d:"Industry's largest context: 10M tokens. Single H100 GPU. iRoPE architecture. Massive document analysis, codebase comprehension.",s:{reasoning:7,coding:7,office:7,math:6,vision:7,creative_media:2,fast_tasks:8,marketing:6,writing:6,pricing:10},bf:["10M Context","Document Analysis","Single GPU"]},
      {n:"Llama 3.3 70B",p:"Meta",t:["open"],pr:"Open-weight / ~$0.10–$0.25",par:"70B (Dense)",ctx:"128K",pt:"free",d:"Proven open-source workhorse. 100K+ HuggingFace derivatives. Massive ecosystem for fine-tuning and well-understood deployment.",s:{reasoning:7,coding:7,office:7,math:7,vision:4,creative_media:2,fast_tasks:6,marketing:7,writing:7,pricing:9},bf:["Community","Fine-Tuning","Proven Reliable"]},
      {n:"Mistral Large 3",p:"Mistral",t:["open","frontier"],pr:"Open-weight (Apache 2.0)",par:"675B/41B active (MoE)",ctx:"128K",pt:"free",d:"Dec 2 2025. SOTA open-weight multimodal. Sparse MoE. EU-focused GDPR design. Strong enterprise reasoning and code. Apache 2.0.",s:{reasoning:8,coding:8,office:8,math:8,vision:7,creative_media:3,fast_tasks:6,marketing:7,writing:7,pricing:8},bf:["EU Compliance","Enterprise Open","Multimodal"]},
      {n:"Mistral Medium 3.1",p:"Mistral",t:["proprietary"],pr:"$0.40 / $2 per 1M tok",par:"Undisclosed",ctx:"128K",pt:"budget",d:"Frontier-class at 8x cheaper than competitors (Aug 2025). Excellent STEM, coding, instruction-following. The enterprise cost-performance sweet spot.",s:{reasoning:8,coding:8,office:8,math:7,vision:7,creative_media:3,fast_tasks:7,marketing:8,writing:7,pricing:8},bf:["Cost-Performance","Enterprise","Balanced"]},
      {n:"Mistral Small 3.2",p:"Mistral",t:["open","efficient"],pr:"$0.10 / $0.30 per 1M tok",par:"24B (Dense)",ctx:"128K",pt:"budget",d:"Efficient 24B with vision. Single GPU. Best-in-class for its size. Edge deployment, fine-tuning, cost-sensitive workloads.",s:{reasoning:6,coding:7,office:7,math:6,vision:6,creative_media:2,fast_tasks:8,marketing:6,writing:6,pricing:9},bf:["Edge Deploy","Vision Budget","Fine-Tuning"]},
      {n:"Devstral 2",p:"Mistral",t:["open","specialist"],pr:"$0.05 / $0.22 per 1M tok",par:"123B (Dense)",ctx:"256K",pt:"free",d:"Dec 10 2025. SOTA agentic coding. Multi-file changes, dependency tracking, auto-retry. Outperforms Qwen 3 Coder Flash. Modified MIT. Dirt cheap.",s:{reasoning:7,coding:10,office:5,math:6,vision:2,creative_media:1,fast_tasks:6,marketing:3,writing:4,pricing:10},bf:["Agentic Coding","Multi-File SWE","Cheapest Code"]},
      {n:"Codestral",p:"Mistral",t:["open","specialist"],pr:"$0.30 / $0.90 per 1M tok",par:"22B",ctx:"256K",pt:"budget",d:"Purpose-built code completion. 80+ languages. FIM specialization. 86.6% HumanEval. Largest context for code. IDE-optimized, low-latency.",s:{reasoning:5,coding:9,office:4,math:6,vision:2,creative_media:1,fast_tasks:8,marketing:3,writing:3,pricing:9},bf:["Code Completion","IDE Integration","Low-Latency"]},
      {n:"Command R+",p:"Cohere",t:["proprietary","specialist"],pr:"$2.50 / $10 per 1M tok",par:"104B",ctx:"128K",pt:"mid",d:"Purpose-built for enterprise RAG and tool use. Citation-heavy, grounded answers from large document collections. Strong multilingual. Enterprise search.",s:{reasoning:7,coding:6,office:8,math:5,vision:3,creative_media:2,fast_tasks:7,marketing:7,writing:7,pricing:5},bf:["RAG / Retrieval","Enterprise Search","Grounded"]},
      {n:"Phi-4",p:"Microsoft",t:["open","efficient"],pr:"Open-weight / extremely low",par:"14B (Dense)",ctx:"16K",pt:"free",d:"Microsoft's small-but-mighty. High-quality synthetic training yields strong STEM for 14B params. Mobile, IoT, resource-constrained environments.",s:{reasoning:6,coding:6,office:5,math:7,vision:4,creative_media:1,fast_tasks:8,marketing:5,writing:5,pricing:10},bf:["Tiny Footprint","STEM for Small","Mobile/IoT"]},
    ];

    const C: Record<string, string> = {
      reasoning: 'Reasoning',
      coding: 'Coding',
      office: 'Office',
      math: 'Math',
      vision: 'Vision',
      creative_media: 'Img/Video',
      fast_tasks: 'Fast Tasks',
      marketing: 'Marketing',
      writing: 'Writing',
      pricing: '💰 Pricing'
    };

    const avg = (s: ModelScore) => {
      const v = Object.values(s);
      return +(v.reduce((a, b) => a + b, 0) / v.length).toFixed(1);
    };

    const renderCards = (ms: Model[]) => {
      const g = document.getElementById('cv');
      if (!g) return;
      g.innerHTML = '';
      ms.forEach((m, i) => {
        const o = avg(m.s);
        const oc = Math.round(o);
        const c = document.createElement('div');
        c.className = 'card';
        c.style.animationDelay = `${i * .015}s`;
        c.dataset['p'] = m.p;
        c.dataset['t'] = m.t.join(',');
        c.dataset['x'] = m.pt;
        c.dataset['q'] = `${m.n} ${m.p} ${m.t.join(' ')} ${m.bf.join(' ')}`.toLowerCase();
        c.innerHTML = `<div class="os sc-${oc}">${o}</div>
          <div class="mp">${m.p}</div><div class="mn">${m.n}</div>
          <div class="badges">${m.t.map(t => `<span class="bg bg-${t}">${t === 'open' ? 'open-weight' : t === 'new' ? '🆕 NEW' : t}</span>`).join('')}</div>
          <div class="cd">${m.d}</div>
          <div class="cs"><div class="sp"><b>Params:</b> ${m.par}</div><div class="sp"><b>Context:</b> ${m.ctx}</div></div>
          <div class="cs" style="margin-bottom:10px"><div class="sp"><b>Price:</b> ${m.pr}</div></div>
          <div class="sg">${Object.entries(m.s).map(([k, v]) => `<div class="srow"><div class="sl">${C[k]}</div><div class="sbt"><div class="sbf b${v}" style="width:${v * 10}%"></div></div><div class="sv sc-${v}">${v}</div></div>`).join('')}</div>
          <div class="bf">${m.bf.map((b, idx) => `<span class="bt ${idx === 0 ? 'hi' : ''}">${b}</span>`).join('')}</div>`;
        g.appendChild(c);
      });
    };

    const renderTable = (ms: Model[]) => {
      const tb = document.getElementById('tb');
      if (!tb) return;
      tb.innerHTML = '';
      ms.forEach(m => {
        const o = avg(m.s);
        const oc = Math.round(o);
        const tr = document.createElement('tr');
        tr.dataset['p'] = m.p;
        tr.dataset['t'] = m.t.join(',');
        tr.dataset['x'] = m.pt;
        tr.dataset['q'] = `${m.n} ${m.p}`.toLowerCase();
        tr.innerHTML = `<td style="background:var(--bg-1)"><div class="tmn">${m.n}</div><div class="tmp">${m.p}</div></td>
          ${Object.values(m.s).map(v => `<td><span class="ts sc-${v}">${v}</span></td>`).join('')}
          <td><span class="ts sc-${oc}" style="font-size:12px;width:32px;height:32px">${o}</span></td>`;
        tb.appendChild(tr);
      });
    };

    let cP = 'all', cT = 'all', cX = 'all', cS = 'overall';
    const sorted = () => [...M].sort((a, b) => cS === 'overall' ? avg(b.s) - avg(a.s) : cS === 'pricing' ? (b.s.pricing - a.s.pricing) || (avg(b.s) - avg(a.s)) : (b.s as any)[cS] - (a.s as any)[cS]);

    const filt = () => {
      const qEl = document.getElementById('q') as HTMLInputElement | null;
      const q = (qEl?.value || '').toLowerCase();
      let n = 0;
      document.querySelectorAll('.card,#tb tr').forEach(e => {
        const el = e as HTMLElement;
        const ok = (!q || (el.dataset['q'] || '').includes(q)) && (cP === 'all' || el.dataset['p'] === cP) && (cT === 'all' || (el.dataset['t'] || '').includes(cT)) && (cX === 'all' || el.dataset['x'] === cX);
        el.classList.toggle('hide', !ok);
        if (ok) n++;
      });
      const rc = document.getElementById('rcnt');
      if (rc) rc.textContent = `Showing ${Math.round(n / 2)} models`;
    };

    const rebuild = () => {
      const s = sorted();
      renderCards(s);
      renderTable(s);
      filt();
    };

    const qInput = document.getElementById('q');
    if (qInput) qInput.addEventListener('input', filt);

    ['pf', 'tf', 'xf'].forEach((id, i) => {
      const group = document.getElementById(id);
      if (!group) return;
      group.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (!target.classList.contains('fb')) return;
        group.querySelectorAll('.fb').forEach(b => b.classList.remove('on'));
        target.classList.add('on');
        if (i === 0) cP = target.dataset['v'] || 'all';
        else if (i === 1) cT = target.dataset['v'] || 'all';
        else cX = target.dataset['v'] || 'all';
        filt();
      });
    });

    const sortGroup = document.getElementById('srt');
    if (sortGroup) {
      sortGroup.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (!target.classList.contains('sb')) return;
        document.querySelectorAll('.sb').forEach(b => b.classList.remove('on'));
        target.classList.add('on');
        cS = target.dataset['s'] || 'overall';
        rebuild();
      });
    }

    const viewToggle = document.querySelector('.vt');
    if (viewToggle) {
      viewToggle.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (!target.classList.contains('vb')) return;
        document.querySelectorAll('.vb').forEach(b => b.classList.remove('on'));
        target.classList.add('on');
        const w = target.dataset['w'];
        document.getElementById('cv')?.classList.toggle('act', w === 'cards');
        document.getElementById('tv')?.classList.toggle('act', w === 'table');
      });
    }

    rebuild();
  }
}
