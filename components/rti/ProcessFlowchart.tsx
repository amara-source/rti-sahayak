import Link from "next/link";
import type { Plan, RenderedNode } from "@/lib/engine/types";
import { FilledIcon } from "./FilledIcon";
import { rtiCopy } from "@/content/rti-copy";

type FlowId =
  | "request"
  | "transfer"
  | "reply"
  | "no_reply"
  | "first"
  | "decision"
  | "no_decision"
  | "second"
  | "complaint";

interface FlowNode {
  id: FlowId;
  label: string[];
  x: number;
  y: number;
  href?: string;
}

function stateFor(plan: Plan, nodes: RenderedNode[]) {
  const done = (id: string) => plan.statuses[id] === "done";
  const applied = (id: string) => plan.statuses[id] === "applied";
  const fired = nodes.some((node) => node.id === "deemed_refusal" && node.fired);
  const firstUnlocked = nodes.some((node) => node.id === "first_appeal" && !node.locked);
  const secondUnlocked = nodes.some((node) => node.id === "second_appeal" && !node.locked);
  const completed = new Set<FlowId>(["request"]);

  if (done("transfer_window")) completed.add("transfer");
  if (done("await_reply") && !fired) completed.add("reply");
  if (fired) completed.add("no_reply");
  if (done("first_appeal")) {
    completed.add("first");
    completed.add("decision");
  }
  if (done("second_appeal")) completed.add("second");
  if (done("section_18_complaint")) completed.add("complaint");

  let current: FlowId = "request";
  if (applied("section_18_complaint")) current = "complaint";
  else if (applied("second_appeal") || secondUnlocked) current = "second";
  else if (applied("first_appeal")) current = "first";
  else if (firstUnlocked) current = "first";
  else if (applied("transfer_window")) current = "transfer";
  else if (done("await_reply")) current = "reply";

  return { completed, current, firstUnlocked, secondUnlocked };
}

function NodeBox({ node, state }: { node: FlowNode; state: "complete" | "current" | "future" }) {
  const content = (
    <g className={`rti-process-node is-${state}`} transform={`translate(${node.x} ${node.y})`}>
      <rect height="72" rx="16" width="176" x="-88" y="-36" />
      <text textAnchor="middle">
        {node.label.map((line, index) => (
          <tspan dy={index === 0 ? (node.label.length === 1 ? 5 : -3) : 19} key={line} x="0">
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
  return node.href && state !== "future" ? <Link href={node.href}>{content}</Link> : content;
}

function DesktopMap({ plan, nodes }: { plan: Plan; nodes: RenderedNode[] }) {
  const copy = rtiCopy.tracker.flow;
  const flow = stateFor(plan, nodes);
  const code = plan.code;
  const wait = plan.answers.lifeLiberty === "yes" ? "48 hours" : "30 days";
  const items: FlowNode[] = [
    { id: "request", label: [copy.request], x: 190, y: 92 },
    { id: "transfer", label: [copy.transfer], x: 190, y: 254 },
    { id: "reply", label: [copy.reply], x: 495, y: 254 },
    { id: "no_reply", label: [copy.noReply], x: 785, y: 254 },
    { id: "first", label: [copy.first], x: 645, y: 426, href: flow.firstUnlocked ? "/appeal/first" : undefined },
    { id: "decision", label: [copy.decision], x: 495, y: 586 },
    { id: "no_decision", label: [copy.noDecision], x: 785, y: 586 },
    { id: "second", label: [copy.second], x: 645, y: 746, href: flow.secondUnlocked ? "/appeal/second" : undefined },
    { id: "complaint", label: [...copy.complaint], x: 1010, y: 92, href: "/complaint" },
  ];
  const nodeState = (id: FlowId) => flow.current === id ? "current" : flow.completed.has(id) ? "complete" : "future";
  const edge = (active: boolean) => `rti-process-edge${active ? " is-active" : ""}`;

  return (
    <svg aria-labelledby={`flow-title-${code} flow-desc-${code}`} className="rti-process-map__desktop" role="img" viewBox="0 0 1180 820">
      <title id={`flow-title-${code}`}>{copy.title}</title>
      <desc id={`flow-desc-${code}`}>{copy.description}</desc>
      <defs><marker id={`arrow-${code}`} markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4"><path d="M0 0L8 4L0 8Z" /></marker></defs>
      <g markerEnd={`url(#arrow-${code})`}>
        <path className={edge(flow.completed.has("reply"))} d="M278 92H495V218" />
        <path className={edge(flow.completed.has("no_reply"))} d="M278 92H785V218" />
        <path className={edge(flow.completed.has("transfer"))} d="M190 128V218" />
        <path className={edge(flow.completed.has("transfer") && flow.completed.has("reply"))} d="M278 254H407" />
        <path className={edge(flow.completed.has("first"))} d="M495 290V360H645V390" />
        <path className={edge(flow.completed.has("no_reply") || flow.current === "first")} d="M785 290V360H645V390" />
        <path className={edge(flow.completed.has("decision"))} d="M645 462V510H495V550" />
        <path className={edge(flow.completed.has("no_decision"))} d="M645 462V510H785V550" />
        <path className={edge(flow.completed.has("second") || flow.current === "second")} d="M495 622V680H645V710" />
        <path className={edge(flow.completed.has("second") || flow.current === "second")} d="M785 622V680H645V710" />
        <path className={edge(flow.completed.has("complaint") || flow.current === "complaint")} d="M278 72H922" />
      </g>
      <g className="rti-process-labels">
        <text x="460" y="78">{wait}</text><text x="690" y="115">{wait}</text>
        <text x="200" y="178">{copy.withinFive}</text><text x="338" y="242">{copy.again(wait)}</text>
        <text x="505" y="344">{copy.unsatisfactory}</text><text x="737" y="344">{copy.fileFirst}</text>
        <text x="500" y="500">{copy.withinFortyFive}</text><text x="722" y="500">{copy.afterFortyFive}</text>
        <text x="515" y="668">{copy.withinNinety}</text><text x="806" y="668">{copy.withinNinety}</text>
        <text x="660" y="60">{copy.noLimit}</text>
      </g>
      {items.map((node) => <NodeBox key={node.id} node={node} state={nodeState(node.id)} />)}
    </svg>
  );
}

function MobileMap({ plan, nodes }: { plan: Plan; nodes: RenderedNode[] }) {
  const copy = rtiCopy.tracker.flow;
  const flow = stateFor(plan, nodes);
  const wait = plan.answers.lifeLiberty === "yes" ? "48 hours" : "30 days";
  const steps: FlowNode[] = [
    { id: "request", label: [copy.request], x: 210, y: 70 },
    { id: "transfer", label: [copy.transfer], x: 210, y: 215 },
    { id: "reply", label: [copy.reply], x: 105, y: 370 },
    { id: "no_reply", label: [copy.noReply], x: 315, y: 370 },
    { id: "first", label: [copy.first], x: 210, y: 540, href: flow.firstUnlocked ? "/appeal/first" : undefined },
    { id: "decision", label: [copy.decision], x: 105, y: 700 },
    { id: "no_decision", label: [copy.noDecision], x: 315, y: 700 },
    { id: "second", label: [copy.second], x: 210, y: 860, href: flow.secondUnlocked ? "/appeal/second" : undefined },
    { id: "complaint", label: [...copy.complaint], x: 210, y: 1030, href: "/complaint" },
  ];
  const nodeState = (id: FlowId) => flow.current === id ? "current" : flow.completed.has(id) ? "complete" : "future";
  const edge = (active: boolean) => `rti-process-edge${active ? " is-active" : ""}`;
  return (
    <svg aria-label={copy.title} className="rti-process-map__mobile" role="img" viewBox="0 0 420 1110">
      <defs><marker id={`mobile-arrow-${plan.code}`} markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4"><path d="M0 0L8 4L0 8Z" /></marker></defs>
      <g markerEnd={`url(#mobile-arrow-${plan.code})`}>
        <path className={edge(flow.completed.has("transfer"))} d="M210 106V179" />
        <path className={edge(flow.completed.has("reply"))} d="M190 251L105 334" />
        <path className={edge(flow.completed.has("no_reply"))} d="M230 251L315 334" />
        <path className={edge(flow.completed.has("first") || flow.current === "first")} d="M105 406V470H210V504" />
        <path className={edge(flow.completed.has("no_reply") || flow.current === "first")} d="M315 406V470H210V504" />
        <path className={edge(flow.completed.has("decision"))} d="M190 576L105 664" />
        <path className={edge(flow.completed.has("no_decision"))} d="M230 576L315 664" />
        <path className={edge(flow.completed.has("second") || flow.current === "second")} d="M105 736V790H210V824" />
        <path className={edge(flow.completed.has("second") || flow.current === "second")} d="M315 736V790H210V824" />
        <path className={edge(flow.completed.has("complaint") || flow.current === "complaint")} d="M210 896V994" />
      </g>
      <g className="rti-process-labels">
        <text x="222" y="150">{copy.withinFive}</text><text x="60" y="300">{wait}</text><text x="260" y="300">{wait}</text>
        <text x="36" y="452">{copy.unsatisfactory.replace("if ", "")}</text><text x="255" y="452">{copy.fileFirst}</text>
        <text x="30" y="630">{copy.withinFortyFive}</text><text x="260" y="630">{copy.afterFortyFive}</text>
        <text x="235" y="780">{copy.withinNinety}</text><text x="225" y="958">{copy.noLimit}</text>
      </g>
      {steps.map((node) => <NodeBox key={node.id} node={node} state={nodeState(node.id)} />)}
    </svg>
  );
}

export function ProcessFlowchart({ plan, nodes }: { plan: Plan; nodes: RenderedNode[] }) {
  return (
    <section className="rti-process-card" aria-labelledby="rti-process-heading">
      <div className="rti-process-card__heading">
        <FilledIcon seed="case:process-flowchart" />
        <p>{rtiCopy.tracker.flow.eyebrow}</p>
        <h2 id="rti-process-heading">{rtiCopy.tracker.flow.heading}</h2>
      </div>
      <div className="rti-process-map">
        <DesktopMap nodes={nodes} plan={plan} />
        <MobileMap nodes={nodes} plan={plan} />
      </div>
      <p className="rti-process-caption">{rtiCopy.tracker.flow.caption}</p>
    </section>
  );
}
