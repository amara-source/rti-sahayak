"use client";

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

type FlowState = "complete" | "current" | "available" | "locked";

type FlowStates = Record<FlowId, FlowState>;

interface FlowNode {
  id: FlowId;
  label: string[];
  x: number;
  y: number;
  href?: string;
}

const FIRST_APPEAL_DECISION_DAYS = 45;

/**
 * Every state here is read from the engine's rendered nodes. The diagram
 * decides nothing: it draws whatever the deterministic journey already says.
 */
function flowStates(plan: Plan, nodes: RenderedNode[]): FlowStates {
  const find = (id: string) => nodes.find((node) => node.id === id);
  const status = (id: string) => plan.statuses[id] ?? "none";
  const done = (id: string) => status(id) === "done";
  const applied = (id: string) => status(id) === "applied";
  const unlocked = (id: string) => Boolean(find(id) && !find(id)!.locked);

  const deemedFired = Boolean(find("deemed_refusal")?.fired);
  const replyLapsed = Boolean(find("await_reply")?.lapsed);
  const transferLapsed = Boolean(find("transfer_window")?.lapsed);
  const appealStarted = plan.startedAtHours?.first_appeal;
  const appealElapsedDays =
    appealStarted === undefined
      ? 0
      : Math.max(0, Math.floor(((plan.elapsedHours ?? 0) - appealStarted) / 24));
  const appealRanOut = appealElapsedDays > FIRST_APPEAL_DECISION_DAYS;

  const ladder = (id: string): FlowState =>
    done(id)
      ? "complete"
      : applied(id)
        ? "current"
        : unlocked(id)
          ? "available"
          : "locked";

  const firstState = ladder("first_appeal");
  const decided = done("first_appeal");

  return {
    request: done("submit") ? "complete" : "current",
    transfer: done("transfer_window")
      ? "complete"
      : applied("transfer_window")
        ? "current"
        : transferLapsed
          ? "locked"
          : "available",
    // Reply and no reply are the two branches out of the waiting period.
    // Only one of them is ever travelled.
    reply: done("await_reply") && !deemedFired ? "complete" : "locked",
    no_reply: deemedFired
      ? firstState === "locked" || firstState === "available"
        ? "current"
        : "complete"
      : replyLapsed
        ? "current"
        : "locked",
    first: firstState,
    decision: decided && !appealRanOut ? "complete" : "locked",
    no_decision: decided && appealRanOut ? "complete" : "locked",
    second: ladder("second_appeal"),
    complaint: ladder("section_18_complaint"),
  };
}

const reached = (state: FlowState) =>
  state === "complete" || state === "current";

function NodeBox({
  node,
  state,
}: {
  node: FlowNode;
  state: FlowState;
}) {
  const content = (
    <g
      className={`rti-process-node is-${state}`}
      transform={`translate(${node.x} ${node.y})`}
    >
      <rect height="76" rx="18" width="200" x="-100" y="-38" />
      <text textAnchor="middle">
        {node.label.map((line, index) => (
          <tspan
            dy={index === 0 ? (node.label.length === 1 ? 6 : -3) : 20}
            key={line}
            x="0"
          >
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );

  return node.href && state !== "locked" ? (
    <Link href={node.href}>{content}</Link>
  ) : (
    content
  );
}

/**
 * Each edge is drawn twice: a faint base line that is always present, and an
 * overlay that draws itself in when the path becomes travelled. pathLength=1
 * lets a single transition work for paths of very different lengths.
 */
function Edge({ d, active }: { d: string; active: boolean }) {
  return (
    <>
      <path className="rti-process-edge" d={d} />
      <path
        className={active ? "rti-process-edge__draw is-active" : "rti-process-edge__draw"}
        d={d}
        pathLength={1}
      />
    </>
  );
}

function DesktopMap({ plan, nodes }: { plan: Plan; nodes: RenderedNode[] }) {
  const copy = rtiCopy.tracker.flow;
  const states = flowStates(plan, nodes);
  const code = plan.code;
  const wait = plan.answers.lifeLiberty === "yes" ? "48 hours" : "30 days";

  const items: FlowNode[] = [
    { id: "request", label: [copy.request], x: 190, y: 92 },
    { id: "transfer", label: [copy.transfer], x: 190, y: 254 },
    { id: "reply", label: [copy.reply], x: 495, y: 254 },
    { id: "no_reply", label: [copy.noReply], x: 785, y: 254 },
    { id: "first", label: [copy.first], x: 645, y: 426, href: "/appeal/first" },
    { id: "decision", label: [copy.decision], x: 495, y: 586 },
    { id: "no_decision", label: [copy.noDecision], x: 785, y: 586 },
    { id: "second", label: [copy.second], x: 645, y: 746, href: "/appeal/second" },
    { id: "complaint", label: [...copy.complaint], x: 1010, y: 92, href: "/complaint" },
  ];

  const edges = [
    { d: "M290 92H495V216", active: reached(states.reply) },
    { d: "M290 92H785V216", active: reached(states.no_reply) },
    { d: "M190 130V216", active: reached(states.transfer) },
    { d: "M290 254H395", active: reached(states.transfer) && reached(states.reply) },
    { d: "M495 292V360H645V388", active: reached(states.first) && reached(states.reply) },
    { d: "M785 292V360H645V388", active: reached(states.no_reply) && reached(states.first) },
    { d: "M645 464V510H495V548", active: reached(states.decision) },
    { d: "M645 464V510H785V548", active: reached(states.no_decision) },
    { d: "M495 624V680H645V708", active: reached(states.second) },
    { d: "M785 624V680H645V708", active: reached(states.second) },
    { d: "M290 72H910", active: reached(states.complaint) },
  ];

  return (
    <svg
      aria-labelledby={`flow-title-${code} flow-desc-${code}`}
      className="rti-process-map__desktop"
      role="img"
      viewBox="0 0 1180 820"
    >
      <title id={`flow-title-${code}`}>{copy.title}</title>
      <desc id={`flow-desc-${code}`}>{copy.description}</desc>
      <defs>
        <marker id={`arrow-${code}`} markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
          <path d="M0 0L8 4L0 8Z" />
        </marker>
      </defs>
      <g markerEnd={`url(#arrow-${code})`}>
        {edges.map((item) => (
          <Edge active={item.active} d={item.d} key={item.d} />
        ))}
      </g>
      <g className="rti-process-labels">
        <text x="470" y="78">{wait}</text>
        <text x="700" y="115">{wait}</text>
        <text x="200" y="180">{copy.withinFive}</text>
        <text x="326" y="242">{copy.again(wait)}</text>
        <text x="505" y="344">{copy.unsatisfactory}</text>
        <text x="737" y="344">{copy.fileFirst}</text>
        <text x="500" y="500">{copy.withinFortyFive}</text>
        <text x="722" y="500">{copy.afterFortyFive}</text>
        <text x="515" y="668">{copy.withinNinety}</text>
        <text x="806" y="668">{copy.withinNinety}</text>
        <text x="660" y="60">{copy.noLimit}</text>
      </g>
      {items.map((node) => (
        <NodeBox key={node.id} node={node} state={states[node.id]} />
      ))}
    </svg>
  );
}

interface Step {
  id: FlowId;
  label: string;
  meta: string;
  href?: string;
  tag?: string;
}

/**
 * Narrow screens get a real vertical stepper rather than a shrunken diagram,
 * because the government's own version is an image nobody can read on a phone.
 */
function MobileStepper({ plan, nodes }: { plan: Plan; nodes: RenderedNode[] }) {
  const copy = rtiCopy.tracker.flow;
  const states = flowStates(plan, nodes);
  const wait = plan.answers.lifeLiberty === "yes" ? "48 hours" : "30 days";

  const steps: Step[] = [
    { id: "request", label: copy.request, meta: wait },
    { id: "transfer", label: copy.transfer, meta: copy.withinFive },
    { id: "reply", label: copy.reply, meta: wait, tag: copy.outcome },
    { id: "no_reply", label: copy.noReply, meta: wait, tag: copy.outcome },
    { id: "first", label: copy.first, meta: copy.fileFirst, href: "/appeal/first" },
    { id: "decision", label: copy.decision, meta: copy.withinFortyFive, tag: copy.outcome },
    { id: "no_decision", label: copy.noDecision, meta: copy.afterFortyFive, tag: copy.outcome },
    { id: "second", label: copy.second, meta: copy.withinNinety, href: "/appeal/second" },
    { id: "complaint", label: copy.complaint.join(" "), meta: copy.noLimit, href: "/complaint", tag: copy.parallel },
  ];

  return (
    <ol aria-label={copy.title} className="rti-process-stepper">
      {steps.map((step) => {
        const state = states[step.id];
        return (
          <li className={`rti-process-step is-${state}`} key={step.id}>
            <span aria-hidden="true" className="rti-process-step__marker" />
            <div className="rti-process-step__body">
              <p className="rti-process-step__label">
                {step.label}
                {step.tag ? <em>{step.tag}</em> : null}
              </p>
              <p className="rti-process-step__meta">
                <span>{copy.states[state]}</span>
                {step.meta}
              </p>
              {step.href && state !== "locked" ? (
                <Link href={step.href}>{copy.open}</Link>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function ProcessFlowchart({
  plan,
  nodes,
}: {
  plan: Plan;
  nodes: RenderedNode[];
}) {
  return (
    <section className="rti-process-card" aria-labelledby="rti-process-heading">
      <div className="rti-process-card__heading">
        <FilledIcon seed="case:process-flowchart" />
        <p>{rtiCopy.tracker.flow.eyebrow}</p>
        <h2 id="rti-process-heading">{rtiCopy.tracker.flow.heading}</h2>
      </div>
      <div className="rti-process-map">
        <DesktopMap nodes={nodes} plan={plan} />
        <MobileStepper nodes={nodes} plan={plan} />
      </div>
      <p className="rti-process-caption">{rtiCopy.tracker.flow.caption}</p>
    </section>
  );
}
